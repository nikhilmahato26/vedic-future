import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import FAQAccordion from '../ui/FAQAccordion';
import { fadeUp, viewport } from '../../utils/motion';
import { faqs } from '../../data/testimonials';

export default function FAQ() {
  return (
    <section id="faq" className="section-pad relative">
      <div className="container-luxe">
        <SectionTitle
          eyebrow="Questions"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know before beginning your consultation journey."
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mx-auto mt-12 max-w-3xl"
        >
          <FAQAccordion items={faqs} />
        </motion.div>
      </div>
    </section>
  );
}
