import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import ServiceCard from '../ui/ServiceCard';
import { stagger, viewport } from '../../utils/motion';
import { services } from '../../data/services';

export default function Services() {
  return (
    <section id="services" className="section-pad relative">
      <div className="container-luxe">
        <SectionTitle
          eyebrow="Our Services"
          title="Sacred Sciences for Every Sphere of Life"
          subtitle="From the cosmos of your birth chart to the harmony of your home, explore a complete spectrum of Vedic guidance — each consultation tailored to your unique journey."
        />

        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
