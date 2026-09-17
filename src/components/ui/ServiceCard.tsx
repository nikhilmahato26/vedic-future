"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import Icon from './Icon';
import { fadeUp } from '../../utils/motion';
import CheckoutModal from './CheckoutModal';

export default function ServiceCard(props: any) {
  const { title, desc, icon, price, quoteOnly } = props;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <GlassCard variants={fadeUp} className="h-full p-7 flex flex-col justify-between">
        <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-coral-500/0 blur-2xl transition-all duration-500 group-hover:bg-coral-500/10" />

        <div className="group flex h-full flex-col cursor-pointer" onClick={() => setModalOpen(true)}>
          <div className="mb-5 flex items-center justify-between">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl border border-coral-500/25 bg-coral-500/[0.08] text-coral-500 transition-all duration-500 group-hover:scale-110 group-hover:bg-coral-500/15 group-hover:shadow-glow">
              {icon ? <Icon name={icon} className="h-7 w-7" /> : <div className="h-7 w-7 bg-coral-500/20 rounded-full" />}
            </div>
            
            <div className="text-right">
              {quoteOnly ? (
                <span className="text-xs uppercase tracking-widest font-semibold text-coral-500 bg-coral-500/10 px-3 py-1 rounded-full border border-coral-500/20">Quote Only</span>
              ) : (
                <span className="font-display font-semibold text-2xl text-navy-900">₹{price}</span>
              )}
            </div>
          </div>

          <h3 className="mb-2.5 font-display text-xl font-semibold text-navy-900">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-navy-900/60 flex-1">{desc}</p>

          <motion.button
            onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-navy-900/30 transition-colors duration-300 group-hover:text-coral-500"
          >
            {quoteOnly ? 'Request Quote' : 'Book Now'}
            <Icon name="ArrowRight" className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </GlassCard>

      <CheckoutModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        service={props}
      />
    </>
  );
}
