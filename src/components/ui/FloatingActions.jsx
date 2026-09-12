import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaWhatsapp, ChevronDown } from '../../utils/icons';
import { whatsappLink } from '../../data/site';

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3">
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-cosmic-900/90 text-gold backdrop-blur-md transition hover:border-gold/60 hover:shadow-glow"
          >
            <ChevronDown className="h-5 w-5 rotate-180" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40" />
        <FaWhatsapp className="relative h-7 w-7" />
      </motion.a>
    </div>
  );
}
