import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Phone, FaWhatsapp } from '../../utils/icons';
import { navLinks, site, telLink, whatsappLink, primaryPhoneDigits } from '../../data/site';
import Button from '../ui/Button';
import MobileMenu from './MobileMenu';
import logoImg from '../../assets/images/logo.png';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'border-b border-white/10 bg-cosmic-900/80 py-3 backdrop-blur-xl shadow-glass'
            : 'border-b border-transparent py-5'
        }`}
      >
        <div className="container-luxe flex items-center justify-between">
          {/* Brand */}
          <a href="#home" className="group flex items-center gap-3">
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-cosmic-950/70 p-2 transition-all duration-500 group-hover:border-gold/60">
              <img src={logoImg} alt={`${site.name} logo`} className="h-full w-full object-contain" />
              <span className="absolute inset-0 rounded-full animate-spin-slower" />
            </span>
            <span className="leading-tight">
              <span className="block font-sanskrit text-[10px] uppercase tracking-[0.28em] text-gold/80">
                {site.brandLine}
              </span>
              <span className="block font-display text-xl sm:text-2xl font-bold tracking-tight text-ivory">
                {site.name}
              </span>
              <span className="block font-sanskrit text-[11px] tracking-widest text-gold font-medium">
                Astrology &amp; Vastu
              </span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-sm font-medium text-ivory/75 transition-colors duration-300 hover:text-gold"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 lg:flex">
            <Button
              href={telLink(primaryPhoneDigits)}
              variant="ghost"
              size="sm"
              icon={Phone}
              iconRight={false}
            >
              Call
            </Button>
            <Button
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              variant="gold"
              size="sm"
              icon={FaWhatsapp}
              iconRight={false}
            >
              Book Consultation
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-ivory transition hover:border-gold/50 hover:text-gold lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
