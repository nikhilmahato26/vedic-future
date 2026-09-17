import MuhurtaPage from '@/pages-old/MuhurtaPage';
import { getServiceBySlug } from '@/lib/content';
import { Suspense } from 'react';

export const metadata = { title: 'Muhurta - Vedic Future' };

export default async function Page() {
  const service = await getServiceBySlug('muhurat');
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MuhurtaPage service={service} />
    </Suspense>
  );
}
