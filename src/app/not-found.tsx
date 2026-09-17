import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-cream-100">
      <h1 className="text-8xl font-display font-bold text-coral-500 mb-4">404</h1>
      <h2 className="text-3xl font-display font-bold text-navy-900 mb-6">Page Not Found</h2>
      <p className="text-navy-900/70 mb-8 max-w-md">
        The sacred path you are looking for does not exist or has been moved. Let us guide you back to safety.
      </p>
      <Link 
        href="/" 
        className="inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium tracking-wide transition-all duration-300 px-9 py-4 text-base bg-coral-gradient text-white shadow-glow hover:shadow-glow-lg hover:brightness-105"
      >
        Return Home
      </Link>
    </div>
  );
}
