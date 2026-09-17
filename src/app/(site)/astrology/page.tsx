import { Suspense } from 'react';
import AstrologyHub from '@/pages-old/AstrologyHub';
export const metadata = { title: 'Astrology Hub - Vedic Future' };
export default function Page() { return <Suspense fallback={<div>Loading...</div>}><AstrologyHub /></Suspense>; }
