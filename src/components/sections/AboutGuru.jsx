"use client";
import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import Icon from '../ui/Icon';
import Mandala from '../ui/Mandala';
import { fadeUp, viewport, stagger } from '../../utils/motion';
import { useCountUp } from '../../hooks/useCountUp';
import { stats } from '../../data/content';
import { site } from '../../data/site';
const vedicAstrologyImg = "/images/vedic-astrology.jpg";

const expertiseTags = [
  'Vedic Astrology',
  'Numerology',
  'Vastu Shastra',
  'Spiritual Healing',
];

const clientele = ['Politicians', 'Celebrities', 'Business Leaders', 'Global Clients'];

function Stat({ value, suffix, label }) {
  const { ref, value: v } = useCountUp(value);
  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-3xl font-semibold text-coral-gradient sm:text-4xl">
        {v.toLocaleString('en-IN')}
        {suffix}
      </p>
      <p className="mt-1 text-xs uppercase tracking-widest text-navy-900/55">{label}</p>
    </div>
  );
}

export default function AboutGuru() {
  return (
    <section id="about" className="section-pad relative overflow-hidden">
      <div className="container-luxe relative">
        <SectionTitle
          eyebrow="About Vedic Future"
          title="Guidance Rooted in Sacred Devotion"
          subtitle="Over 11 years devoted to the sacred sciences — translating ancient Vedic wisdom into clear, modern guidance for seekers across Delhi and the world."
        />

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Astrology Artwork frame */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="relative mx-auto w-full max-w-md"
          >
            <Mandala className="pointer-events-none absolute -inset-6 -z-10 animate-spin-slower opacity-20" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-coral/30 bg-gradient-to-b from-navy-700 to-navy-950 shadow-glow-lg">
              <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-coral/20 via-navy-800/50 to-transparent" />
              <img
                src={vedicAstrologyImg}
                alt={`${site.name} Sacred Vedic Astrology Chart`}
                className="relative z-10 h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
          >
            <motion.h3
              variants={fadeUp}
              className="font-display text-3xl font-semibold text-navy-900 sm:text-4xl"
            >
              Vedic Future Acharya
            </motion.h3>
            <motion.p variants={fadeUp} className="mt-2 text-coral/90">
              Senior Vedic Astrologer &amp; Vastu Expert · 11+ Years Experience · Delhi &amp; Global Consultations
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-base leading-relaxed text-navy-900/70"
            >
              For over 11 years, our revered Acharyas at Vedic Future have illuminated
              the paths of thousands of seekers through the timeless sciences of Jyotisha. Blending
              classical Vedic tradition with an evolutionary, modern approach, each
              reading brings clarity, direction and lasting peace.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-7">
              <p className="text-sm font-semibold uppercase tracking-widest text-coral/80">
                Expert In
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {expertiseTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-coral/25 bg-white/[0.04] px-4 py-1.5 text-sm text-navy-900/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-7">
              <p className="text-sm font-semibold uppercase tracking-widest text-coral/80">
                Trusted By
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {clientele.map((c) => (
                  <div
                    key={c}
                    className="flex items-center gap-2 text-sm text-navy-900/75"
                  >
                    <Icon name="Sparkles" className="h-3.5 w-3.5 text-coral" />
                    {c}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats band */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="glass mt-16 grid grid-cols-1 gap-8 rounded-3xl px-8 py-10 sm:grid-cols-3"
        >
          {stats.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
