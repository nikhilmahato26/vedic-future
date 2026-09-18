"use client";

import { useState, useEffect } from 'react';
import Modal from './Modal';
import { createOrder, verifyPayment } from '@/app/actions/checkout';
import Button from './Button';
import { CheckCircle2, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: any; // Using any to pass the Drizzle row easily
  onSuccess?: () => void;
  isUnlockMode?: boolean;
}

export default function CheckoutModal({ isOpen, onClose, service, onSuccess, isUnlockMode = false }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successState, setSuccessState] = useState<{refCode: string, quoteOnly: boolean} | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    formData.append('serviceId', service.id.toString());
    
    try {
      const result = await createOrder(formData);
      
      if (!result.ok) {
        if (result.isSpam) {
          // Fake success for bots
          setSuccessState({ refCode: 'VF-SPAM', quoteOnly: true });
        } else {
          setError(result.error || 'Failed to create order');
        }
        setLoading(false);
        return;
      }

      if (result.quoteOnly) {
        // Just an enquiry, no payment
        setSuccessState({ refCode: result.refCode as string, quoteOnly: true });
        setLoading(false);
        return;
      }

      // -- REAL RAZORPAY CHECKOUT FLOW --
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        setError('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: Math.round((result.amount || 0) * 100), // convert to paise
        currency: 'INR',
        name: 'Vedic Future',
        description: `Payment for ${service.name}`,
        order_id: result.razorpayOrderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await verifyPayment(
              result.orderId as number,
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );

            if (verifyRes.ok) {
              setSuccessState({ refCode: result.refCode as string, quoteOnly: false });
            } else {
              setError(verifyRes.error || 'Payment verification failed');
            }
          } catch (err) {
            setError('Payment verification error');
          }
        },
        prefill: {
          name: formData.get('name')?.toString() || '',
          contact: formData.get('phone')?.toString() || '',
        },
        theme: {
          color: '#E06A4F', // coral
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      // Don't set loading to false here, let the handler/ondismiss manage it
      // setLoading(false);

    } catch (err) {
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  }

  // Reset state on close
  const handleClose = () => {
    setTimeout(() => {
      setSuccessState(null);
      setError(null);
    }, 300);
    onClose();
  };

  if (!service) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isUnlockMode ? `Unlock ${service.name}` : `Book ${service.name}`}>
      {successState ? (
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-display text-2xl font-bold text-navy-900 mb-2">
            successState.quoteOnly ? 'Enquiry Submitted!' : (isUnlockMode ? 'Payment Successful! Generating...' : 'Payment Successful!')
          </h3>
          <p className="text-navy-900/70 mb-4">
            Your reference code is <strong className="text-coral">{successState.refCode}</strong>
          </p>
          {isUnlockMode ? (
            <p className="text-sm text-navy-900/60 mb-6">
              Your payment has been securely verified. Redirecting to your detailed {service.name}...
            </p>
          ) : (
            <p className="text-sm text-navy-900/60 mb-6">
              We have received your details. Acharya Ji will connect with you on WhatsApp shortly.
            </p>
          )}
          <Button 
            onClick={() => {
              handleClose();
              if (onSuccess) onSuccess();
            }} 
            variant="coral" 
            className="w-full"
            href={undefined} icon={undefined} target={undefined} rel={undefined}
          >
            Done & Continue
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot */}
          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="bg-cream-100 p-4 rounded-xl mb-4 border border-cream-200">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-navy-900">{service.name}</span>
              <span className="font-bold text-coral">
                {service.quoteOnly ? 'Quote' : `₹${service.priceInr}`}
              </span>
            </div>
            {service.summary && <p className="text-xs text-navy-900/60">{service.summary}</p>}
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1" htmlFor="name">Full Name</label>
            <input id="name" name="name" required className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-white focus:ring-2 focus:ring-coral/50 outline-none" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1" htmlFor="phone">Phone (10 digits)</label>
              <input id="phone" name="phone" required pattern="[0-9]{10}" inputMode="numeric" className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-white focus:ring-2 focus:ring-coral/50 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-1" htmlFor="consultationDate">Date</label>
              <input id="consultationDate" name="consultationDate" type="date" required className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-white focus:ring-2 focus:ring-coral/50 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1" htmlFor="message">Message (Optional)</label>
            <textarea id="message" name="message" rows={2} className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-white focus:ring-2 focus:ring-coral/50 outline-none resize-none" />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={loading} variant="coral" className="w-full relative" href={undefined} icon={undefined} target={undefined} rel={undefined} onClick={undefined}>
              {loading ? (
                <><Loader2 className="animate-spin w-5 h-5 mr-2 inline" /> Processing...</>
              ) : (
                service.quoteOnly ? 'Request Quote' : (isUnlockMode ? `Pay ₹${service.priceInr} to Generate` : `Pay ₹${service.priceInr}`)
              )}
            </Button>
            {!service.quoteOnly && (
              <p className="text-center text-[10px] text-navy-900/40 mt-3 uppercase tracking-wider">
                Secured by Razorpay
              </p>
            )}
          </div>
        </form>
      )}
    </Modal>
  );
}
