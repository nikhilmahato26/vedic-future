import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { astroNavLinks } from '../../data/astroServices';
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
            className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-50 flex h-full w-[82%] max-w-sm flex-col overflow-hidden border-l border-coral/20 bg-navy-900 px-7 py-7 lg:hidden"
          >
            <Mandala className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 animate-spin-slower opacity-10" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-coral/40 bg-navy-950/70 p-1.5">
                  <img src={logoImg} alt={`${site.name} logo`} className="h-full w-full object-contain" />
                </span>
                <div className="leading-tight">
                  <p className="font-display text-lg font-semibold text-white">
                    {site.shortName}
                  </p>
                  <p className="font-sanskrit text-[11px] tracking-widest text-coral">
                    Astrology &amp; Vastu
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-cream-100/80 transition hover:border-coral/50 hover:text-coral"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-8 flex flex-1 flex-col gap-1 overflow-y-auto pr-1">
              <p className="mb-1 text-[11px] uppercase tracking-[0.25em] text-coral/70">Astrology</p>
              <div className="mb-4 grid grid-cols-2 gap-1.5">
                {astroNavLinks.slice(1).map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className="rounded-lg border border-coral/25 bg-coral/[0.08] px-3 py-2.5 text-sm text-cream-100/90 transition hover:border-coral/50 hover:text-coral"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              {navLinks.map((link, i) => (
                <motion.div key={link.href} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                  <Link
                    to={link.href}
                    onClick={onClose}
                    className="block border-b border-white/10 py-3 font-display text-xl text-cream-100/90 transition hover:text-coral"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="flex flex-col gap-3 pt-6">
              <Button
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                variant="coral"
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
