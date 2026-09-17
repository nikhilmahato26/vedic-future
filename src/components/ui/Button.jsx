"use client";
import { motion } from 'framer-motion';

/**
 * Premium button. Renders as <a> when `href` is provided, else <button>.
 * Variants: coral (primary), glass, ghost, outline.
 */
const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100 disabled:opacity-60';

const sizes = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-7 py-3.5 text-sm sm:text-base',
  lg: 'px-9 py-4 text-base',
};

const variants = {
  coral:
    'bg-coral-gradient text-navy-950 shadow-glow hover:shadow-glow-lg hover:brightness-105',
  glass:
    'glass-coral text-navy-900 hover:bg-white hover:border-coral/60',
  outline:
    'border border-coral/50 text-coral hover:bg-coral/10 hover:border-coral',
  ghost: 'text-navy-900/80 hover:text-coral',
};

export default function Button({
  children,
  href,
  variant = 'coral',
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
