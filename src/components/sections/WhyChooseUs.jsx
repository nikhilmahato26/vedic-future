import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import Icon from '../ui/Icon';
import { fadeUp, stagger, viewport } from '../../utils/motion';
import { whyChooseUs } from '../../data/content';

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="section-pad relative">
      <div className="container-luxe">
        <SectionTitle
          eyebrow="Why Choose Us"
          title="A Sanctuary of Trust & Tradition"
          subtitle="Every seeker who walks this path is met with authenticity, discretion and a genuine commitment to their wellbeing."
        />

        <motion.div
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {whyChooseUs.map((point) => (
            <motion.div
              key={point}
              variants={fadeUp}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-500 hover:border-gold/40 hover:bg-white/[0.05]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.08] text-gold transition-transform duration-500 group-hover:scale-110">
                <Icon name="CheckCircle2" className="h-5 w-5" />
              </span>
              <p className="font-medium text-ivory/85">{point}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
