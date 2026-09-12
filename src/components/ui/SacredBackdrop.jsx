import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Mandala from './Mandala';

/**
 * Atmospheric background: cosmic gradient, twinkling starfield, soft gold
 * glows and slowly drifting sacred symbols. Sits behind section content.
 * `variant` lets sections opt into lighter/heavier treatments.
 */
const symbols = ['ॐ', '✶', '☽', '✧', '卐', '☉', '✦'];

export default function SacredBackdrop({ variant = 'default', stars = 40 }) {
  const starField = useMemo(
    () =>
      Array.from({ length: stars }).map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 4,
        dur: Math.random() * 3 + 3,
      })),
    [stars]
  );

  const floats = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        symbol: symbols[i % symbols.length],
        top: Math.random() * 90 + 5,
        left: Math.random() * 90 + 5,
        size: Math.random() * 1.4 + 1.1,
        delay: Math.random() * 5,
        dur: Math.random() * 6 + 8,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* base gradient */}
      <div className="absolute inset-0 bg-cosmic-radial" />

      {/* gold glows */}
      <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-gold/10 blur-[120px]" />
      <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-gold/[0.07] blur-[110px]" />

      {/* rotating mandalas */}
      {variant !== 'minimal' && (
        <>
          <Mandala
            className="absolute -right-24 -top-24 h-[28rem] w-[28rem] animate-spin-slower opacity-[0.18]"
            strokeOpacity={0.6}
          />
          <Mandala
            className="absolute -left-32 bottom-[-8rem] h-[24rem] w-[24rem] animate-spin-slow opacity-[0.12]"
            strokeOpacity={0.5}
          />
        </>
      )}

      {/* starfield */}
      {starField.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-gold animate-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}

      {/* floating sacred symbols */}
      {variant === 'default' &&
        floats.map((f, i) => (
          <motion.span
            key={i}
            className="absolute select-none font-display text-gold/15"
            style={{ top: `${f.top}%`, left: `${f.left}%`, fontSize: `${f.size}rem` }}
            animate={{ y: [0, -24, 0], rotate: [0, 8, 0] }}
            transition={{
              duration: f.dur,
              delay: f.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {f.symbol}
          </motion.span>
        ))}
    </div>
  );
}
