import { AnimatePresence, motion } from 'framer-motion';
import { X, Phone, FaWhatsapp } from '../../utils/icons';
import { navLinks, site, telLink, whatsappLink, primaryPhoneDigits } from '../../data/site';
import Button from '../ui/Button';
import Mandala from '../ui/Mandala';
import logoImg from '../../assets/images/logo.png';

export default function MobileMenu({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-cosmic-950/70 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-50 flex h-full w-[82%] max-w-sm flex-col overflow-hidden border-l border-gold/20 bg-cosmic-900 px-7 py-7 lg:hidden"
          >
            <Mandala className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 animate-spin-slower opacity-10" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-cosmic-950/70 p-1.5">
                  <img src={logoImg} alt={`${site.name} logo`} className="h-full w-full object-contain" />
                </span>
                <div className="leading-tight">
                  <p className="font-sanskrit text-xs uppercase tracking-[0.25em] text-gold/80">
                    {site.brandLine}
                  </p>
                  <p className="font-display text-lg font-semibold text-ivory">
                    {site.shortName}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-ivory/80 transition hover:border-gold/50 hover:text-gold"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-10 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="border-b border-white/5 py-3.5 font-display text-xl text-ivory/85 transition hover:text-gold"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 pt-8">
              <Button
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                variant="gold"
                icon={FaWhatsapp}
                iconRight={false}
                className="w-full"
              >
                WhatsApp Consultation
              </Button>
              <Button
                href={telLink(primaryPhoneDigits)}
                variant="glass"
                icon={Phone}
                iconRight={false}
                className="w-full"
              >
                Call Now
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
