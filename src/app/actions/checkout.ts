"use server";

import { checkoutSchema } from '@/lib/schemas/checkout';
import { db } from '@/db';
import { services, enquiries } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

// Helper to generate a short 6-character random alphanumeric ref code
function generateRefCode() {
  return 'VF-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function createOrder(formData: FormData) {
  const rawData = {
    serviceId: formData.get('serviceId'),
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    consultationDate: formData.get('consultationDate'),
    message: formData.get('message'),
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

  // MOCK RAZORPAY INTEGRATION
  // In a real scenario, you'd call Razorpay SDK here to create an order
  // e.g. razorpay.orders.create({ amount: service.priceInr * 100, currency: 'INR' })
  const mockRazorpayOrderId = `order_${Math.random().toString(36).substring(2, 12)}`;

  await db.update(enquiries).set({ razorpayOrderId: mockRazorpayOrderId }).where(eq(enquiries.id, order.id));

  return {
    ok: true,
    orderId: order.id,
    refCode,
    amount: service.priceInr,
    razorpayOrderId: mockRazorpayOrderId,
    quoteOnly: service.quoteOnly,
  };
}

export async function verifyMockPayment(orderId: number, razorpayPaymentId: string) {
  // In a real app, you would verify the Razorpay signature here using crypto
  await db.update(enquiries)
    .set({ 
      paymentStatus: 'paid', 
      razorpayPaymentId,
      updatedAt: new Date()
    })
    .where(eq(enquiries.id, orderId));

  return { ok: true };
}
