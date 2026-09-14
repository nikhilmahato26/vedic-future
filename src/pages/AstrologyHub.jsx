import { useEffect } from 'react';
import AstroServices from '../components/sections/AstroServices';
import CTA from '../components/sections/CTA';

export default function AstrologyHub() {
  useEffect(() => {
    document.title = 'Free Vedic Astrology Services · Vedic Future';
  }, []);

  return (
    <div className="pt-20">
      <AstroServices />
      <CTA />
    </div>
  );
}
