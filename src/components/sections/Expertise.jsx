import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import Icon from '../ui/Icon';
import { fadeUp, stagger, viewport } from '../../utils/motion';
import { expertise } from '../../data/content';

export default function Expertise() {
  return (
    <section id="expertise" className="section-pad relative">
      <div className="container-luxe">
        <SectionTitle
          eyebrow="Areas of Expertise"
          title="Clarity for Life's Most Important Questions"
          subtitle="Whatever weighs on your mind, there is a path forward written in the stars. Explore the dimensions where seekers most often find guidance."
        />

        <motion.div
          variants={stagger(0.05)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {expertise.map((e) => (
            <motion.div
              key={e.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center transition-colors duration-500 hover:border-gold/40"
            >
              <span className="pointer-events-none absolute inset-x-0 -top-16 mx-auto h-32 w-32 rounded-full bg-gold/0 blur-2xl transition-all duration-500 group-hover:bg-gold/15" />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/25 bg-gold/[0.06] text-gold transition-all duration-500 group-hover:scale-110 group-hover:bg-gold/15">
                <Icon name={e.icon} className="h-6 w-6" />
              </span>
              <p className="relative font-display text-base font-medium text-ivory">
                {e.title}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
