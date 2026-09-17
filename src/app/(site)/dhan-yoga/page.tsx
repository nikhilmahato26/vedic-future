import DhanYogaPage from '@/pages-old/DhanYogaPage';
import { getServiceBySlug } from '@/lib/content';
import { Suspense } from 'react';

export const metadata = { title: 'DhanYoga - Vedic Future' };

export default async function Page() {
  const service = await getServiceBySlug('dhan-yoga');
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DhanYogaPage service={service} />
    </Suspense>
  );
}
