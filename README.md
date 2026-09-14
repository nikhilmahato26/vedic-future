# Vedic Future

> Ancient Wisdom. Divine Guidance. Modern Solutions.

A premium, luxury single-page website for Vedic Future — built with React, Vite and Tailwind CSS. Deep cosmic blue + sacred gold theme, glassmorphism, soft glow effects and elegant Framer Motion animations throughout.

---

## Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** (utility classes only — no SCSS / CSS Modules / Styled Components)
- **React Router DOM** — routing shell
- **Framer Motion** — scroll reveals, micro-interactions, animated counters
- **Swiper JS** — yantra & testimonial carousels
- **React Hook Form** — validated contact / booking form
- **React Icons** + **Lucide React** — iconography (via a centralized, tree-shakeable registry)

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Build for production
npm run build

# 4. Preview the production build
npm run preview
```

The dev server runs at `http://localhost:5173` by default.

---

## Project Structure

```
src/
├── assets/
│   ├── images/        # drop the Acharya's portrait here (acharya.jpg)
│   └── icons/
├── components/
│   ├── ui/            # Button, GlassCard, SectionTitle, ServiceCard,
│   │                  # TestimonialCard, PricingCard, FAQAccordion,
│   │                  # Icon, Mandala, SacredBackdrop, FloatingActions
│   ├── layout/        # Navbar, Footer, MobileMenu
│   └── sections/      # Hero, AboutGuru, Services, PoojaSection,
│                      # YantraSection, Expertise, Awards, WhyChooseUs,
│                      # OnlineConsultation, Testimonials, FAQ, Contact, CTA
├── pages/
│   └── Home.jsx       # composes all sections
├── hooks/
│   └── useCountUp.js  # scroll-triggered animated counter
├── data/              # ALL editable content lives here
│   ├── site.js        # business name, phones, emails, nav, WhatsApp links
│   ├── services.js
│   ├── poojas.js
│   ├── yantras.js
│   ├── packages.js
│   ├── content.js     # expertise, awards, why-us, modes, stats, trust badges
│   └── testimonials.js# testimonials + FAQ
├── utils/
│   ├── icons.js       # centralized icon registry (import icons ONLY from here)
│   └── motion.js      # shared Framer Motion variants
├── App.jsx
└── main.jsx
```

---

## Editing Content

Everything text-based lives in `src/data/`. Update those files and the whole site reflects the change — no component edits required.

- **Business name / contacts / WhatsApp number** → `src/data/site.js`
  (update `primaryPhoneDigits` / `secondaryPhoneDigits` for `tel:` and `wa.me` links)
- **Services** → `src/data/services.js`
- **Poojas & Homas** → `src/data/poojas.js` (just append new objects)
- **Yantras** → `src/data/yantras.js`
- **Consultation packages** → `src/data/packages.js`
- **Expertise / Awards / Why-Us / Stats** → `src/data/content.js`
- **Testimonials & FAQ** → `src/data/testimonials.js`

### Adding the founder's photo
Drop a portrait at `src/assets/images/acharya.jpg`, then in
`src/components/sections/AboutGuru.jsx` import it and swap the placeholder block
for an `<img>` (the exact lines to replace are commented in that file).

### Icons
Import icons **only** from `src/utils/icons.js`. To add a new one, add a single
named import there and re-export it. Never use wildcard imports like
`import * as FaIcons from 'react-icons/fa'` — they bloat the bundle.

---

## Theme

Defined in `tailwind.config.js`:

| Token   | Hex       | Use                |
|---------|-----------|--------------------|
| cosmic  | `#0F172A` | Deep cosmic blue   |
| gold    | `#D4AF37` | Sacred gold accent |
| ivory   | `#F8F4EC` | Warm text/ivory    |

Fonts (loaded in `index.html`): **Cormorant Garamond** (display/serif),
**Jost** (sans/body), **Marcellus** (sanskrit-style accents).

---

## Contact Form Behaviour

The booking form (`src/components/sections/Contact.jsx`) has **no backend** by
default. On submit it composes a pre-filled WhatsApp message with the seeker's
details and opens `wa.me`. To use email instead, swap the `onSubmit` handler for
an EmailJS / Formspree call.

---

## SEO

`index.html` ships with optimized title, meta description, keywords, Open Graph,
Twitter cards and `ProfessionalService` JSON-LD structured data targeting:
*Best Astrologer in Delhi, Vedic Astrology Consultation Delhi, Numerology Consultation,
Vastu Expert Delhi, Online Astrology Consultation, Pooja Services,
Spiritual Healing.*

---

Built for **Vedic Future**, 51 East Laxmi Market, Gali No. 2, Delhi 92 (+91 99906 16610).

## Online Astrology Services (VedIntel AstroAPI)

All astrology calculations come from [VedIntel AstroAPI](https://vedintelastroapi.com/docs) (Swiss Ephemeris).

| Page | Route | What it does |
| --- | --- | --- |
| Astrology hub | `/astrology` | Directory of every service |
| Janam Kundali | `/kundali` | 13-tab report: charts (D1–D60), planets, dashas, doshas, gems & rudraksha, yogas, Ashtakvarga/Shadbala, predictions, numerology, KP/Jaimini/Western/Chinese/Nine Star Ki, AI reading, PDF report |
| Kundli Milan | `/kundli-milan` | North (36 guna) / South matching, Mangal Dosha, Rajju-Vedha, Papasamaya, AI narrative |
| Panchang | `/panchang` | Daily panchang, Choghadiya & Hora, monthly calendar, auspicious days, festivals/Ekadashi/Purnima/Amavasya, transits |
| Rashifal | `/horoscope` | Daily / weekly / monthly by sign |
| Shubh Muhurat | `/muhurat` | Scans 7–30 days for marriage, griha pravesh, business, vehicle, travel |
| Astro Tools | `/astro-tools` | Prashna (yes/no), baby names, gemstone guide, Moolank, Nakshatra Vastu |

Every tool supports English and Hindi (`lang=hi`).

### How the API key is protected

The API authenticates with an `api_key` **query parameter**, so it must never reach the browser.
The browser calls `/api/astro/<endpoint>`; [`api/astro.js`](api/astro.js) (a Vercel serverless function)
adds the key server-side. The proxy also:

- allows only an explicit list of endpoints and parameters (callers can't override `api_key`);
- blocks the 5-credit PDF report types and throttles PDF/AI requests per IP;
- sets CDN caching (birth charts 1 year, daily data 6 hours, yearly calendars 30 days) so repeat views cost no API calls.

### Setup

```bash
cp .env.example .env.local      # then put your key in VEDINTEL_API_KEY
npm install
npm run dev                     # the proxy runs inside the Vite dev server
```

### Deploy (Vercel)

1. Import the repo in Vercel (framework preset: Vite).
2. Settings → Environment Variables → add `VEDINTEL_API_KEY` for Production (and Preview).
3. Deploy. `vercel.json` handles the `/api/astro/*` rewrite and SPA routing.

### Enabling optional features

- **AI readings** (Kundali → AI Reading, Kundli Milan → AI narrative): connect an AI provider at
  https://vedintelastroapi.com/dashboard/ai-providers. Until then the site shows a friendly "consult on WhatsApp" note.
- **PDF reports** spend VedIntel report credits (1–2 per report). Top up credits in the VedIntel dashboard.
- **KP significators / ruling planets, Jaimini Karakamsa, Combustion** need the Starter plan; add them to the
  allowlist in `api/astro.js` after upgrading.
