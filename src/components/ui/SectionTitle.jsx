import { motion } from 'framer-motion';
import { fadeUp, viewport } from '../../utils/motion';

/**
 * Standardised section heading: small gold eyebrow, serif heading,
 * optional subtitle, with an ornamental divider.
 */
export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}) {
  const alignment =
    align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left';

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className={`flex max-w-3xl flex-col ${alignment} ${className}`}
    >
      {eyebrow && (
        <span className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-gold/90">
          <span className="h-px w-6 bg-gold/60" />
          {eyebrow}
          <span className="h-px w-6 bg-gold/60" />
        </span>
      )}
      <h2 className="font-display text-3xl font-semibold leading-tight text-ivory sm:text-4xl lg:text-5xl text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory/65 sm:text-lg text-pretty">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
