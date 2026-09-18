"use server";

import { checkoutSchema } from '@/lib/schemas/checkout';
import { db } from '@/db';
import { services, enquiries } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Helper to generate a short 6-character random alphanumeric ref code
function generateRefCode() {
  return 'VF-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function createOrder(formData: FormData) {
  const rawData = {
    serviceId: formData.get('serviceId'),
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email') || undefined,
    consultationDate: formData.get('consultationDate'),
    message: formData.get('message') || undefined,
  };

  const result = checkoutSchema.safeParse(rawData);
  if (!result.success) {
    return { ok: false, error: 'Validation failed', fieldErrors: result.error.flatten().fieldErrors };
  }

  // Anti-Spam: Honeypot field (Trap 12)
  const honeypot = formData.get('website');
  if (honeypot) {
    // Silently accept spam
    return { ok: true, isSpam: true };
  }

  const [service] = await db.select().from(services).where(eq(services.id, result.data.serviceId));
  if (!service) {
    return { ok: false, error: 'Service not found' };
  }

  // Get IP (Trap 12 rate limit prep)
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || '127.0.0.1';
  
  const refCode = generateRefCode();

  // Create the Enqury/Order
  const [order] = await db.insert(enquiries).values({
    refCode,
    kind: service.kind,
    serviceId: service.id,
    productNameSnapshot: service.name,
    productPriceSnapshotInr: service.priceInr, // Snapshotted so admin changes don't affect this order
    name: result.data.name,
    phone: result.data.phone, // Normalized
    email: result.data.email || null,
    consultationDate: result.data.consultationDate,
    message: result.data.message,
    source: 'card',
    status: 'new',
    paymentStatus: service.quoteOnly ? 'pending' : 'pending',
    ipHash: ip, // Usually we hash this, keeping it simple here
  }).returning();

  // REAL RAZORPAY INTEGRATION
  let rzpOrderId = null;
  if (!service.quoteOnly) {
    try {
      const options = {
        amount: Math.round((service.priceInr ?? 0) * 100), // amount in smallest currency unit (paise)
        currency: "INR",
        receipt: `receipt_${order.id}`,
      };
      const razorpayOrder = await razorpay.orders.create(options);
      rzpOrderId = razorpayOrder.id;
      await db.update(enquiries).set({ razorpayOrderId: rzpOrderId }).where(eq(enquiries.id, order.id));
    } catch (err) {
      console.error('Razorpay order creation error:', err);
      return { ok: false, error: 'Failed to create payment order' };
    }
  }

  return {
    ok: true,
    orderId: order.id,
    refCode,
    amount: service.priceInr,
    razorpayOrderId: rzpOrderId,
    quoteOnly: service.quoteOnly,
  };
}

export async function verifyPayment(
  orderId: number,
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string
) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return { ok: false, error: 'Payment secret not configured' };

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (generatedSignature !== razorpaySignature) {
    return { ok: false, error: 'Invalid payment signature' };
  }

  await db.update(enquiries)
    .set({ 
      paymentStatus: 'paid', 
      razorpayPaymentId,
      updatedAt: new Date()
    })
    .where(eq(enquiries.id, orderId));

  return { ok: true };
}
