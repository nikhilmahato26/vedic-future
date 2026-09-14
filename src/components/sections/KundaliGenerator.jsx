import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import SectionTitle from '../ui/SectionTitle';
import SacredBackdrop from '../ui/SacredBackdrop';
import BirthForm from '../astro/BirthForm';
import { birthToSearch } from '../../lib/astro';
import { Sparkles, CheckCircle2 } from '../../utils/icons';
import { fadeUp, viewport } from '../../utils/motion';

const INCLUDES = [
  'Lagna & Navamsa charts',
  '16 divisional charts',
  'Vimshottari, Yogini & Chara dasha',
  'Manglik, Kaal Sarp, Pitra & Sade Sati',
  'Gemstone & Rudraksha remedies',
  'Yogas, Ashtakvarga & Shadbala',
  'Daily, weekly & yearly predictions',
  'Downloadable PDF report',
];

/**
 * Birth-details form that opens the full Kundali report at /kundali.
 * Calculations come from the VedIntel AstroAPI (Swiss Ephemeris) via our proxy.
 */
export default function KundaliGenerator({ isEmbedded = false }) {
  const navigate = useNavigate();

  const open = (birth) => {
    navigate(`/kundali?${new URLSearchParams({ ...birthToSearch(birth), tab: 'overview' })}`);
    window.scrollTo({ top: 0 });
  };

  return (
    <section className={`relative overflow-hidden ${isEmbedded ? 'pb-12 pt-8' : 'section-pad'}`}>
      {!isEmbedded && <SacredBackdrop variant="default" stars={35} />}

      <div className="container-luxe relative z-10">
        {!isEmbedded && (
          <SectionTitle
            eyebrow="Vedic Jyotish Tool"
            title="Free Janam Kundali Generator"
            subtitle="Your complete birth chart with Swiss Ephemeris precision — charts, dashas, doshas, yogas and remedies."
          />
        )}

        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[1.4fr_1fr]">
          <GlassCard coral glow={false} className="p-7 sm:p-10">
            <div className="mb-8 flex items-center justify-between border-b border-coral/20 pb-5">
              <div>
                <h3 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">Enter Birth Details</h3>
                <p className="mt-1 text-xs text-navy-900/60 sm:text-sm">Exact time and place give an accurate Lagna.</p>
              </div>
              <span className="hidden items-center gap-1.5 rounded-full border border-coral/40 bg-coral/10 px-3.5 py-1 text-xs font-medium text-coral sm:inline-flex">
                <Sparkles className="h-3.5 w-3.5" /> 100% Free
              </span>
            </div>
            <BirthForm onSubmit={open} submitLabel="Generate my Kundali" />
          </GlassCard>

          <GlassCard glow={false} className="p-7 sm:p-8">
            <h3 className="font-display text-2xl font-semibold text-navy-900">Your report includes</h3>
            <ul className="mt-5 space-y-3">
              {INCLUDES.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-navy-900/75">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-coral" /> {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-coral/15 pt-5 text-xs leading-relaxed text-navy-900/50">
              Calculated with Swiss Ephemeris, verified against Jagannatha Hora. Available in English and हिन्दी.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
