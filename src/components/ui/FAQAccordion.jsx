import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';

function Item({ q, a, isOpen, onToggle }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
        isOpen ? 'border-gold/40 bg-white/[0.05]' : 'border-white/10 bg-white/[0.02]'
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-display text-lg font-medium text-ivory">{q}</span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            isOpen
              ? 'rotate-180 border-gold/50 bg-gold/15 text-gold'
              : 'border-white/15 text-ivory/60'
          }`}
        >
          <Icon name="ChevronDown" className="h-4 w-4" />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="px-6 pb-6 text-sm leading-relaxed text-ivory/65">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQAccordion({ items = [] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <Item
          key={item.q}
          q={item.q}
          a={item.a}
          isOpen={open === i}
          onToggle={() => setOpen(open === i ? -1 : i)}
        />
      ))}
    </div>
  );
}
