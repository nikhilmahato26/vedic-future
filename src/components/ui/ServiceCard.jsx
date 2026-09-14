import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import Icon from './Icon';
import { fadeUp } from '../../utils/motion';

export default function ServiceCard({ title, desc, icon }) {
  return (
    <GlassCard variants={fadeUp} className="h-full p-7">
      {/* soft glow that appears on hover */}
      <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-coral/0 blur-2xl transition-all duration-500 group-hover:bg-coral/10" />

      <div className="group flex h-full flex-col">
        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-coral/25 bg-coral/[0.08] text-coral transition-all duration-500 group-hover:scale-110 group-hover:bg-coral/15 group-hover:shadow-glow">
          <Icon name={icon} className="h-7 w-7" />
        </div>

        <h3 className="mb-2.5 font-display text-xl font-semibold text-navy-900">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-navy-900/60">{desc}</p>

        <motion.span
          className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-coral/0 transition-colors duration-300 group-hover:text-coral"
        >
          Learn More
          <Icon name="ArrowRight" className="h-3.5 w-3.5" />
        </motion.span>
      </div>
    </GlassCard>
  );
}
