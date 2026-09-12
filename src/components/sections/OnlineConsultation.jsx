import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import PricingCard from '../ui/PricingCard';
import Icon from '../ui/Icon';
import SacredBackdrop from '../ui/SacredBackdrop';
import { fadeUp, stagger, viewport } from '../../utils/motion';
import { consultationModes } from '../../data/content';
import { consultationPackages } from '../../data/packages';

export default function OnlineConsultation() {
  return (
    <section id="consultation" className="section-pad relative overflow-hidden">
      <SacredBackdrop variant="minimal" stars={26} />

      <div className="container-luxe relative">
        <SectionTitle
          eyebrow="Online Consultation"
          title="Connect From Anywhere in the World"
          subtitle="Distance is no barrier to divine guidance. Choose the mode that suits you and receive the same depth of care as an in-person sitting."
        />

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
              className="flex items-center gap-2.5 rounded-full border border-gold/25 bg-white/[0.04] px-5 py-3 text-sm text-ivory/80 transition hover:border-gold/50 hover:text-gold"
            >
              <Icon name={m.icon} className="h-4 w-4 text-gold" />
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

        <p className="mt-8 text-center text-xs text-ivory/45">
          Consultations are tailored to each seeker — share your details and we'll guide
          you to the right offering.
        </p>
      </div>
    </section>
  );
}
