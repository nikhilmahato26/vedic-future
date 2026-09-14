import { motion } from 'framer-motion';

/**
 * Glassmorphism card surface. `glow` enables a coral hover lift + glow.
 * Pass `as={motion.div}`-style props via `...props` (it IS a motion.div).
 */
export default function GlassCard({
  children,
  className = '',
  coral = false,
  glow = true,
  ...props
}) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl ${
        coral ? 'glass-coral' : 'glass'
      } ${
        glow
          ? 'transition-all duration-500 hover:-translate-y-1 hover:border-coral/45 hover:shadow-glow'
          : ''
      } ${className}`}
      {...props}
    >
      {/* top hairline sheen */}
      <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-coral/40 to-transparent" />
      {children}
    </motion.div>
  );
}
