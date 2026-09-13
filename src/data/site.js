// Central source of truth for business identity & contact details.
// Update these once and the whole site reflects the change.

export const site = {
  brandLine: 'Divine Wisdom & Guidance',
  name: 'Vedic Future',
  shortName: 'Vedic Future',
  tagline: 'Ancient Wisdom. Divine Guidance. Modern Solutions.',
  location: {
    name: 'Vedic Future',
    address: '51 East Laxmi Market, Gali No. 2',
    city: 'Delhi',
    pincode: '110092',
    state: 'Delhi, India',
    full: '51 East Laxmi Market, Gali No. 2, Delhi - 110092, India',
  },
  phones: ['+91 99906 16610'],
  emails: ['vedicfuture@gmail.com'],
  youtubeHandle: '@VedicFuture',
  youtubeUrl: '#',
  serviceLanguages: ['Hindi', 'English'],
  heroVideoUrl: '', // Placeholder by default; can provide video link anytime
};

// Primary phone digits (no spaces) for tel: and wa.me links
export const primaryPhoneDigits = '919990616610';
export const secondaryPhoneDigits = '919990616610';

export const telLink = (digits = primaryPhoneDigits) => `tel:+${digits}`;

export const whatsappLink = (
  message = "Namaste, I'd like to book a consultation with Vedic Future.",
  digits = primaryPhoneDigits
) => `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

export const mailLink = (email = site.emails[0]) => `mailto:${email}`;

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Kundali', href: '#kundali' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Poojas', href: '#poojas' },
  { label: 'Yantras', href: '#yantras' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Awards', href: '#awards' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export const socials = [
  { label: 'WhatsApp', href: whatsappLink(), icon: 'FaWhatsapp' },
  { label: 'Instagram', href: '#', icon: 'FaInstagram' },
  { label: 'Facebook', href: '#', icon: 'FaFacebookF' },
  { label: 'YouTube', href: site.youtubeUrl, icon: 'FaYoutube' },
];
