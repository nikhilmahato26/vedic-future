"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-cream-100">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 text-2xl font-bold">!</div>
      <h2 className="text-3xl font-display font-bold text-navy-900 mb-6">Cosmic Interference</h2>
      <p className="text-navy-900/70 mb-8 max-w-md">
        Something went wrong while trying to access this celestial knowledge. Our pandits have been notified.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium tracking-wide transition-all duration-300 px-7 py-3.5 text-sm bg-coral-gradient text-white shadow-glow hover:shadow-glow-lg"
        >
          Try Again
        </button>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium tracking-wide transition-all duration-300 px-7 py-3.5 text-sm glass-coral text-navy-900 hover:bg-white hover:border-coral-500/60"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
