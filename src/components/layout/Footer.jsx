import {
  Phone,
  Mail,
  MapPin,
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
} from '../../utils/icons';
import {
  site,
  navLinks,
  telLink,
  mailLink,
  whatsappLink,
  primaryPhoneDigits,
  secondaryPhoneDigits,
  socials,
} from '../../data/site';
import Mandala from '../ui/Mandala';
import logoImg from '../../assets/images/logo.png';

const socialIcons = {
  WhatsApp: FaWhatsapp,
  Instagram: FaInstagram,
  Facebook: FaFacebookF,
  YouTube: FaYoutube,
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-gold/15 bg-cosmic-950">
      <Mandala className="pointer-events-none absolute -bottom-32 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 animate-spin-slower opacity-[0.06]" />
      <div className="absolute inset-x-0 top-0 gold-rule" />

      <div className="container-luxe relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="flex h-16 w-16 items-center justify-center rounded-full  p-1.5">
              <img src={logoImg} alt={`${site.name} logo`} className="h-full w-full object-contain" />
            </span>
            <div className="leading-tight">
              <p className="font-sanskrit text-[10px] uppercase tracking-[0.25em] text-gold/80">
                {site.brandLine}
              </p>
              <p className="font-display text-lg font-semibold text-amber-100">
                {site.shortName}
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-amber-100/55">
            {site.tagline}
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map(({ label, href }) => {
              const IconCmp = socialIcons[label];
              return (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-amber-100/70 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:text-gold hover:shadow-glow"
              >
                <IconCmp className="h-4 w-4" />
              </a>
              );
            })}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-display text-lg font-semibold text-amber-100">Explore</h4>
          <span className="mt-3 block h-px w-10 bg-gold/50" />
          <ul className="mt-5 space-y-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-amber-100/60 transition hover:text-gold"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display text-lg font-semibold text-amber-100">Contact</h4>
          <span className="mt-3 block h-px w-10 bg-gold/50" />
          <ul className="mt-5 space-y-4 text-sm text-amber-100/60">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>
                {site.location.address}
                <br />
                {site.location.city} - {site.location.pincode}, India
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span className="flex flex-col">
                {site.phones.map((p) => (
                  <a key={p} href={telLink(primaryPhoneDigits)} className="transition hover:text-gold text-amber-100/60">
                    {p}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span className="flex flex-col">
                {site.emails.map((e) => (
                  <a key={e} href={mailLink(e)} className="transition hover:text-gold text-amber-100/60">
                    {e}
                  </a>
                ))}
              </span>
            </li>
          </ul>
        </div>

        {/* Consultation hours / note */}
        <div>
          <h4 className="font-display text-lg font-semibold text-amber-100">Consultations</h4>
          <span className="mt-3 block h-px w-10 bg-gold/50" />
          <p className="mt-5 text-sm leading-relaxed text-amber-100/55">
            Available in-person at Delhi and online worldwide via WhatsApp, Video,
            Zoom and Google Meet.
          </p>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-sm font-medium text-gold transition hover:bg-gold/10"
          >
            <FaWhatsapp className="h-4 w-4" />
            Message on WhatsApp
          </a>
        </div>
      </div>

      <div className="container-luxe relative border-t border-white/10 py-6">
        <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-amber-100/45">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="text-xs text-amber-100/35">
            Ancient Wisdom · Divine Guidance · Modern Solutions
          </p>
        </div>
      </div>
    </footer>
  );
}
