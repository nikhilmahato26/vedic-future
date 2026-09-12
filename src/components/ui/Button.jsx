import { motion } from 'framer-motion';

/**
 * Premium button. Renders as <a> when `href` is provided, else <button>.
 * Variants: gold (primary), glass, ghost, outline.
 */
const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-900 disabled:opacity-60';

const sizes = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-7 py-3.5 text-sm sm:text-base',
  lg: 'px-9 py-4 text-base',
};

const variants = {
  gold:
    'bg-gold-gradient text-cosmic-950 shadow-glow hover:shadow-glow-lg hover:brightness-110',
  glass:
    'glass-gold text-ivory hover:bg-white/[0.08] hover:border-gold/50',
  outline:
    'border border-gold/50 text-gold hover:bg-gold/10 hover:border-gold',
  ghost: 'text-ivory/80 hover:text-gold',
};

export default function Button({
  children,
  href,
  variant = 'gold',
  size = 'md',
  className = '',
  icon: IconCmp,
  iconRight = true,
  target,
  rel,
  type = 'button',
  onClick,
  ...props
}) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  const inner = (
    <>
      {IconCmp && !iconRight && <IconCmp className="h-[1.1em] w-[1.1em]" />}
      <span>{children}</span>
      {IconCmp && iconRight && (
        <IconCmp className="h-[1.1em] w-[1.1em] transition-transform duration-300 group-hover:translate-x-0.5" />
      )}
    </>
  );

  const MotionTag = motion[href ? 'a' : 'button'];

  return (
    <MotionTag
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={cls}
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      {...(href ? {} : { type })}
      {...props}
    >
      {inner}
    </MotionTag>
  );
}
