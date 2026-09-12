import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import SectionTitle from '../ui/SectionTitle';
import GlassCard from '../ui/GlassCard';
import Icon from '../ui/Icon';
import Mandala from '../ui/Mandala';
import Button from '../ui/Button';
import { fadeUp, viewport } from '../../utils/motion';
import { yantras, yantraNote } from '../../data/yantras';
import { whatsappLink } from '../../data/site';
import { FaWhatsapp } from '../../utils/icons';

export default function YantraSection() {
  return (
    <section id="yantras" className="section-pad relative overflow-hidden">
      <div className="container-luxe relative">
        <SectionTitle
          eyebrow="Sacred Yantras"
          title="Handmade Energized Yantras"
          subtitle="Traditional hand-drawn energized yantras, amulets and talismans — each ritually charged with mantra and intention. Never machine-made."
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-14"
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1.1}
            centeredSlides={false}
            grabCursor
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="!pb-14"
          >
            {yantras.map((y) => (
              <SwiperSlide key={y.title} className="h-auto">
                <GlassCard gold glow={false} className="group h-full p-8">
                  <div className="relative mb-6 flex items-center justify-center">
                    <Mandala className="h-28 w-28 animate-spin-slower opacity-40 drop-glow transition-opacity duration-500 group-hover:opacity-70" />
                    <span className="absolute flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-cosmic-900 text-gold">
                      <Icon name={y.icon} className="h-6 w-6" />
                    </span>
                  </div>
                  <h3 className="text-center font-display text-xl font-semibold text-ivory">
                    {y.title}
                  </h3>
                  <p className="mt-3 text-center text-sm leading-relaxed text-ivory/60">
                    {y.desc}
                  </p>
                </GlassCard>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-4 flex flex-col items-center gap-6 text-center"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-white/[0.03] px-5 py-2 text-sm text-gold/90">
            <Icon name="Hand" className="h-4 w-4" />
            {yantraNote}
          </p>
          <Button
            href={whatsappLink('Namaste, I would like to enquire about energized yantras.')}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            icon={FaWhatsapp}
            iconRight={false}
          >
            Enquire About Yantras
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
