"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import PricingCard from '../ui/PricingCard';
import Icon from '../ui/Icon';
import SacredBackdrop from '../ui/SacredBackdrop';
import KundaliGenerator from './KundaliGenerator';
import { fadeUp, stagger, viewport } from '../../utils/motion';
import { consultationModes } from '../../data/content';
import { consultationPackages } from '../../data/packages';
import { Sparkles, CalendarDays, ArrowRight } from '../../utils/icons';

export default function OnlineConsultation() {
  const [activeView, setActiveView] = useState('kundali');

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#kundali') {
        setActiveView('kundali');
      } else if (hash === '#consultation') {
        setActiveView('packages');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <section id="consultation" className="section-pad relative overflow-hidden">
      {/* Anchor for direct navbar clicks */}
      <div id="kundali" className="absolute -top-24" />

      <SacredBackdrop variant="minimal" stars={32} />

      <div className="container-luxe relative z-10">
        <SectionTitle
          eyebrow={activeView === 'kundali' ? 'Vedic Astrology Tool' : 'Online Consultation'}
          title={
            activeView === 'kundali'
              ? 'Generate Free Janam Kundali'
              : 'Connect From Anywhere in the World'
          }
          subtitle={
            activeView === 'kundali'
              ? 'Your complete birth chart with Swiss Ephemeris precision — Lagna & Navamsa charts, dashas, doshas, yogas, remedies and a PDF report.'
              : 'Distance is no barrier to divine guidance. Choose the mode that suits you and receive the same depth of care as an in-person sitting.'
          }
        />

        {/* View Switcher Toggle */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-full border border-coral/30 bg-navy-950/80 p-1.5 backdrop-blur-md shadow-glow">
            <button
              type="button"
              onClick={() => setActiveView('kundali')}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeView === 'kundali'
                  ? 'bg-coral-gradient text-navy-950 shadow-md font-semibold'
                  : 'text-cream-100/75 hover:text-coral'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Free Janam Kundali</span>
              <span className="hidden sm:inline-block rounded-full bg-navy-950/15 px-2 py-0.5 text-[10px] font-bold text-navy-950 ml-1">
                Instant
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('packages')}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeView === 'packages'
                  ? 'bg-coral-gradient text-navy-950 shadow-md font-semibold'
                  : 'text-cream-100/75 hover:text-coral'
              }`}
            >
              <CalendarDays className="h-4 w-4" />
              <span>Consultation Packages</span>
            </button>
          </div>
        </div>

        {/* View 1: Kundali Generator */}
        {activeView === 'kundali' && (
          <motion.div
            key="kundali-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <KundaliGenerator isEmbedded={true} />
          </motion.div>
        )}

        {/* View 2: Consultation Packages */}
        {activeView === 'packages' && (
          <motion.div
            key="packages-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Modes */}
            <motion.div
              variants={stagger(0.07)}
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              className="mt-12 flex flex-wrap items-center justify-center gap-3"
            >
              {consultationModes.map((m) => (
                <motion.div
                  key={m.label}
                  variants={fadeUp}
                  className="flex items-center gap-2.5 rounded-full border border-coral/25 bg-white/[0.04] px-5 py-3 text-sm text-navy-900/80 transition hover:border-coral/50 hover:text-coral"
                >
                  <Icon name={m.icon} className="h-4 w-4 text-coral" />
                  {m.label}
                </motion.div>
              ))}
            </motion.div>

            {/* Packages */}
            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              className="mt-14 grid gap-6 lg:grid-cols-3"
            >
              {consultationPackages.map((p) => (
                <motion.div key={p.name} variants={fadeUp} className="h-full">
                  <PricingCard {...p} />
                </motion.div>
              ))}
            </motion.div>

            {/* Kundali Callout Banner */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              className="mt-12 rounded-2xl border border-coral/30 bg-coral/[0.05] p-6 sm:p-8 backdrop-blur-md"
            >
              <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-coral">
                    <Sparkles className="h-3.5 w-3.5" /> First Step in Vedic Guidance
                  </span>
                  <h4 className="mt-1 font-display text-xl font-semibold text-navy-900 sm:text-2xl">
                    Don't have your Janam Kundali chart yet?
                  </h4>
                  <p className="mt-1.5 max-w-xl text-xs sm:text-sm text-navy-900/65">
                    Generate your authentic North Indian Lagna chart, planetary degrees, and Manglik Dosha analysis for free right now.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveView('kundali')}
                  className="inline-flex items-center gap-2 rounded-full border border-coral bg-coral-gradient px-6 py-3 text-sm font-semibold text-navy-950 transition hover:shadow-glow shrink-0"
                >
                  Generate Free Kundali
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>

            <p className="mt-8 text-center text-xs text-navy-900/45">
              Consultations are tailored to each seeker — share your details and we'll guide
              you to the right offering.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
