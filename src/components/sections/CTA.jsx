import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Mandala from '../ui/Mandala';
import { fadeUp, viewport } from '../../utils/motion';
import { CalendarDays, FaWhatsapp, Phone } from '../../utils/icons';
import { whatsappLink, telLink, primaryPhoneDigits } from '../../data/site';
import logoImg from '../../assets/images/logo.png';

export default function CTA() {
  return (
    <section className="relative px-5 py-20 sm:px-8">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="container-luxe relative overflow-hidden rounded-[2.5rem] border border-gold/25 bg-gradient-to-br from-cosmic-700 via-cosmic-900 to-cosmic-950 px-6 py-16 text-center sm:px-12 sm:py-20"
      >
        <Mandala className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 animate-spin-slower opacity-15" />
        <Mandala className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 animate-spin-slow opacity-10" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[120px]" />

        <div className="relative mx-auto max-w-2xl">
          <img
            src={logoImg}
            alt=""
            aria-hidden="true"
            className="mx-auto h-20 w-20 object-contain drop-shadow-[0_0_22px_rgba(218,178,92,0.25)]"
          />
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-ivory sm:text-5xl text-balance">
            Your Destiny Awaits Its Awakening
          </h2>
          <p className="mt-5 text-base text-ivory/70 sm:text-lg">
            Take the first step toward clarity, prosperity and peace. Begin your
            journey with a personalised Vedic consultation today.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Button href="#contact" variant="gold" size="lg" icon={CalendarDays} iconRight={false}>
              Book Consultation
            </Button>
            <Button
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              variant="glass"
              size="lg"
              icon={FaWhatsapp}
              iconRight={false}
            >
              WhatsApp Now
            </Button>
            <Button
              href={telLink(primaryPhoneDigits)}
              variant="ghost"
              size="lg"
              icon={Phone}
              iconRight={false}
            >
              Call Now
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
