import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import Icon from './Icon';
import { fadeUp } from '../../utils/motion';

export default function ServiceCard({ title, desc, icon }) {
  return (
    <GlassCard variants={fadeUp} className="h-full p-7">
      {/* soft glow that appears on hover */}
      <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/0 blur-2xl transition-all duration-500 group-hover:bg-gold/10" />

      <div className="group flex h-full flex-col">
        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-gold/25 bg-gold/[0.08] text-gold transition-all duration-500 group-hover:scale-110 group-hover:bg-gold/15 group-hover:shadow-glow">
          <Icon name={icon} className="h-7 w-7" />
        </div>

        <h3 className="mb-2.5 font-display text-xl font-semibold text-ivory">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-ivory/60">{desc}</p>

        <motion.span
          className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-gold/0 transition-colors duration-300 group-hover:text-gold"
        >
          Learn More
          <Icon name="ArrowRight" className="h-3.5 w-3.5" />
        </motion.span>
      </div>
    </GlassCard>
  );
}
