import HoroscopePage from '@/pages-old/HoroscopePage';
import { getServiceBySlug } from '@/lib/content';
import { Suspense } from 'react';

export const metadata = { title: 'Horoscope - Vedic Future' };

export default async function Page() {
  const service = await getServiceBySlug('horoscope');
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HoroscopePage service={service} />
    </Suspense>
  );
}
