"use client";
import { motion } from 'framer-motion';
import { fadeUp, viewport } from '../../utils/motion';

/**
 * Standardised section heading: small coral eyebrow, serif heading,
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
        <span className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-coral/90">
          <span className="h-px w-6 bg-coral/60" />
          {eyebrow}
          <span className="h-px w-6 bg-coral/60" />
        </span>
      )}
      <h2 className="font-display text-3xl font-semibold leading-tight text-navy-900 sm:text-4xl lg:text-5xl text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-900/65 sm:text-lg text-pretty">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
