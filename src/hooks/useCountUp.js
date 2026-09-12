import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Animates a counter from 0 to `end` once the element enters the viewport.
 * Returns { ref, value } — attach ref to the element you want to observe.
 */
export function useCountUp(end, duration = 2000) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo for a premium settle
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(eased * end));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, duration]);

  return { ref, value };
}
