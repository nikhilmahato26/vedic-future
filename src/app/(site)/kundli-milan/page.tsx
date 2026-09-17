import MatchingPage from '@/pages-old/MatchingPage';
import { getServiceBySlug } from '@/lib/content';
import { Suspense } from 'react';

export const metadata = { title: 'Kundli Milan - Vedic Future' };

export default async function Page() {
  const service = await getServiceBySlug('kundli-milan');
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MatchingPage service={service} />
    </Suspense>
  );
}
