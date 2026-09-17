import VastuPage from '@/pages-old/VastuPage';
import { getServiceBySlug } from '@/lib/content';
import { Suspense } from 'react';

export const metadata = { title: 'Vastu - Vedic Future' };

export default async function Page() {
  const service = await getServiceBySlug('vastu');
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VastuPage service={service} />
    </Suspense>
  );
}
