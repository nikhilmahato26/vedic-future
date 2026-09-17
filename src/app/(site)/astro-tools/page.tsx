import { Suspense } from 'react';
import ToolsPage from '@/pages-old/ToolsPage';
export const metadata = { title: 'Astrology Tools - Vedic Future' };
export default function Page() { return <Suspense fallback={<div>Loading...</div>}><ToolsPage /></Suspense>; }
