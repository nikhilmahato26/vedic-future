import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import GlassCard from '../ui/GlassCard';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import SacredBackdrop from '../ui/SacredBackdrop';
import { fadeUp, stagger, viewport } from '../../utils/motion';
import { poojas, poojaNote } from '../../data/poojas';
import { whatsappLink } from '../../data/site';
import { FaWhatsapp } from '../../utils/icons';

export default function PoojaSection() {
  return (
    <section id="poojas" className="section-pad relative overflow-hidden">
      <SacredBackdrop variant="minimal" stars={30} />

      <div className="container-luxe relative">
        <SectionTitle
          eyebrow="Poojas & Homas"
          title="Authentic Vedic Poojas & Homas"
          subtitle="Performed by authentic Vedic Pandits and Poojaris, following sacred rituals passed down through generations — on your behalf, or with your remote participation."
        />

        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {poojas.map((p) => (
            <GlassCard key={p.name} variants={fadeUp} gold className="group p-7">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/[0.08] text-gold transition-all duration-500 group-hover:shadow-glow">
                  <Icon name={p.icon} className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-ivory">
                    {p.name}
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-gold/70">
                    {p.deity}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ivory/60">{p.benefit}</p>
            </GlassCard>
          ))}

          {/* Extensible placeholder card for future poojas */}
          <motion.div variants={fadeUp}>
            <a
              href={whatsappLink('Namaste, I would like to know about more Poojas & Homas you offer.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full min-h-[180px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gold/30 bg-white/[0.02] p-7 text-center transition-all duration-500 hover:border-gold/60 hover:bg-white/[0.04]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 text-gold">
                <Icon name="Sparkles" className="h-6 w-6" />
              </span>
              <p className="font-display text-lg font-semibold text-ivory">
                {poojaNote}
              </p>
              <p className="text-xs text-ivory/50">Tap to enquire about a specific ritual</p>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-12 flex justify-center"
        >
          <Button
            href={whatsappLink('Namaste, I would like to arrange a pooja / homam.')}
            target="_blank"
            rel="noopener noreferrer"
            variant="gold"
            icon={FaWhatsapp}
            iconRight={false}
          >
            Arrange a Pooja
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
