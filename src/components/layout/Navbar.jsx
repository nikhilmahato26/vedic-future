"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Phone, FaWhatsapp, ChevronDown, Sparkles } from '../../utils/icons';
import { astroNavLinks } from '../../data/astroServices';
import { navLinks, site, telLink, whatsappLink, primaryPhoneDigits } from '../../data/site';
import Button from '../ui/Button';
import MobileMenu from './MobileMenu';
import { useSiteSettings } from '../../context/SiteSettings';
const logoImg = "/images/logo.png";

export default function Navbar() {
  const settings = useSiteSettings();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [astroOpen, setAstroOpen] = useState(false);
  const closeTimer = useRef(null);
  const pathname = usePathname();
  const onAstroPage = astroNavLinks.some((l) => l.to === pathname);

  useEffect(() => setAstroOpen(false), [pathname]);

  const openAstro = () => {
    clearTimeout(closeTimer.current);
    setAstroOpen(true);
  };
  const closeAstro = () => {
    closeTimer.current = setTimeout(() => setAstroOpen(false), 150);
  };

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
            ? 'border-b border-navy-900/8 bg-cream-100/90 py-3 backdrop-blur-xl shadow-glass'
            : 'border-b border-transparent py-5'
        }`}
      >
        <div className="container-luxe flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-3">
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-coral/30 bg-navy-950/70 p-2 transition-all duration-500 group-hover:border-coral/60">
              <img src={logoImg} alt={`${site.name} logo`} className="h-full w-full object-contain" />
              <span className="absolute inset-0 rounded-full animate-spin-slower" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-xl sm:text-2xl font-bold tracking-tight text-navy-900">
                {site.name}
              </span>
              <span className="block font-sanskrit text-[11px] tracking-widest text-coral font-medium">
                Astrology &amp; Vastu
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
    
      <AnimatePresence>
        {settings?.announcementActive && settings?.announcement && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-coral-500 text-white text-sm font-medium py-2 px-4 text-center"
          >
            {settings.announcement}
          </motion.div>
        )}
      </AnimatePresence>
      <nav className="hidden items-center gap-6 lg:flex xl:gap-7">
            {navLinks.slice(0, 1).map((link) => (
              <NavItem key={link.href} link={link} />
            ))}

            <div className="relative" onMouseEnter={openAstro} onMouseLeave={closeAstro}>
              <button
                type="button"
                aria-expanded={astroOpen}
                aria-haspopup="true"
                onClick={() => setAstroOpen((o) => !o)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors duration-300 hover:text-coral ${onAstroPage ? 'text-coral' : 'text-navy-900/75'}`}
              >
                Astrology
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${astroOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {astroOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-4"
                  >
                    <div className="overflow-hidden rounded-2xl border border-navy-900/10 bg-white p-2 shadow-glass backdrop-blur-xl">
                      {astroNavLinks.map((link, i) => (
                        <Link
                          key={link.to}
                          href={link.to}
                          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition ${
                            pathname === link.to ? 'bg-coral/15 text-coral' : 'text-navy-900/80 hover:bg-navy-900/5 hover:text-coral'
                          } ${i === 0 ? 'mb-1 border-b border-coral/15 font-medium' : ''}`}
                        >
                          {i === 0 && <Sparkles className="h-3.5 w-3.5 text-coral" />}
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.slice(1).map((link) => (
              <NavItem key={link.href} link={link} />
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 lg:flex">
            <Button
              href={settings.phoneNumber ? `tel:${settings.phoneNumber.replace(/[^0-9+]/g, '')}` : telLink(primaryPhoneDigits)}
              variant="ghost"
              size="sm"
              icon={Phone}
              iconRight={false}
            >
              Call
            </Button>
            <Button
              href={settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9+]/g, '')}` : whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              variant="coral"
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
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-navy-900 transition hover:border-coral/50 hover:text-coral lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function NavItem({ link }) {
  return (
    <Link
      href={link.href}
      className="group relative text-sm font-medium text-navy-900/75 transition-colors duration-300 hover:text-coral"
    >
      {link.label}
      <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-coral transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
