import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import Icon from '../ui/Icon';
import SacredBackdrop from '../ui/SacredBackdrop';
import { fadeUp, viewport } from '../../utils/motion';
import { awards } from '../../data/content';

export default function Awards() {
  return (
    <section id="awards" className="section-pad relative overflow-hidden">
      <SacredBackdrop variant="minimal" stars={28} />

      <div className="container-luxe relative">
        <SectionTitle
          eyebrow="Recognition"
          title="Awards & Honours"
          subtitle="A journey of devotion and service, honoured at state and national levels."
        />

        <div className="relative mx-auto mt-16 max-w-3xl">
          {/* vertical line */}
          <span className="absolute left-5 top-2 h-full w-px bg-gradient-to-b from-gold/60 via-gold/30 to-transparent sm:left-1/2" />

          <div className="flex flex-col gap-10">
            {awards.map((a, i) => {
              const left = i % 2 === 0;
              return (
                <motion.div
                  key={a.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={viewport}
                  className={`relative pl-14 sm:w-1/2 sm:pl-0 ${
                    left ? 'sm:self-start sm:pr-12 sm:text-right' : 'sm:self-end sm:pl-12'
                  }`}
                >
                  {/* node */}
                  <span
                    className={`absolute left-5 top-1.5 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-gold/40 bg-cosmic-900 text-gold shadow-glow sm:left-auto ${
                      left ? 'sm:-right-5 sm:left-auto' : 'sm:-left-5'
                    }`}
                  >
                    <Icon name="Award" className="h-5 w-5" />
                  </span>

                  <div className="glass-gold rounded-2xl p-6">
                    <h3 className="font-display text-lg font-semibold text-ivory">
                      {a.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ivory/60">
                      {a.detail}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
