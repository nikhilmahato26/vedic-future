import PanchangPage from '@/pages-old/PanchangPage';
import { getServiceBySlug } from '@/lib/content';
import { Suspense } from 'react';

export const metadata = { title: 'Panchang - Vedic Future' };

export default async function Page() {
  const service = await getServiceBySlug('panchang');
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PanchangPage service={service} />
    </Suspense>
  );
}
