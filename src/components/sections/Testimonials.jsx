import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import SectionTitle from '../ui/SectionTitle';
import TestimonialCard from '../ui/TestimonialCard';
import { fadeUp, viewport } from '../../utils/motion';
import { testimonials } from '../../data/testimonials';

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-pad relative">
      <div className="container-luxe">
        <SectionTitle
          eyebrow="Testimonials"
          title="Voices of Those We've Guided"
          subtitle="From business owners to global families, the trust of our seekers is our greatest blessing."
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
            slidesPerView={1}
            grabCursor
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1280: { slidesPerView: 3 },
            }}
            className="!pb-14"
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i} className="h-auto">
                <TestimonialCard {...t} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
