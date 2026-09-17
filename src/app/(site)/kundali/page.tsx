import KundaliPage from '@/pages-old/KundaliPage';
import { getServiceBySlug } from '@/lib/content';
import { Suspense } from 'react';

export const metadata = { title: 'Janam Kundali - Vedic Future' };

export default async function Page() {
  const service = await getServiceBySlug('kundali');
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KundaliPage service={service} />
    </Suspense>
  );
}
