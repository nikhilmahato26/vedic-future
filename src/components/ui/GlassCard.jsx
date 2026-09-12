import { motion } from 'framer-motion';

/**
 * Glassmorphism card surface. `glow` enables a gold hover lift + glow.
 * Pass `as={motion.div}`-style props via `...props` (it IS a motion.div).
 */
export default function GlassCard({
  children,
  className = '',
  gold = false,
  glow = true,
  ...props
}) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl ${
        gold ? 'glass-gold' : 'glass'
      } ${
        glow
          ? 'transition-all duration-500 hover:-translate-y-1 hover:border-gold/45 hover:shadow-glow'
          : ''
      } ${className}`}
      {...props}
    >
      {/* top hairline sheen */}
      <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      {children}
    </motion.div>
  );
}
