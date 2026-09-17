import Hero from '@/components/sections/Hero';
import AboutGuru from '@/components/sections/AboutGuru';
import Services from '@/components/sections/Services';
import AstroServices from '@/components/sections/AstroServices';
import PoojaSection from '@/components/sections/PoojaSection';
import YantraSection from '@/components/sections/YantraSection';
import Expertise from '@/components/sections/Expertise';
import Awards from '@/components/sections/Awards';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import OnlineConsultation from '@/components/sections/OnlineConsultation';
import Testimonials from '@/components/sections/Testimonials';
import Gallery from '@/components/sections/Gallery';
import FAQ from '@/components/sections/FAQ';
import Contact from '@/components/sections/Contact';
import CTA from '@/components/sections/CTA';

import { getSiteSettings, getServices } from '@/lib/content';

export const metadata = {
  title: 'Vedic Future - Astrology & Consultation',
  description: 'Unlock Your Destiny Through Vedic Wisdom',
};

export default async function HomePage() {
  const settings = await getSiteSettings();
  const dbServices = await getServices();
  
  return (
    <main>
      <Hero />
      <AboutGuru />
      <AstroServices limit={6} />
      <Services dbServices={dbServices} />
      <PoojaSection />
      <YantraSection />
      <Expertise />
      <Awards />
      <WhyChooseUs />
      <OnlineConsultation />
      <Testimonials />
      <Gallery />
      <FAQ />
      <Contact />
      <CTA />
    </main>
  );
}
