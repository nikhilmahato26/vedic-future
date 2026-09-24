import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import KundaliPage from '@/pages-old/KundaliPage';
import MatchingPage from '@/pages-old/MatchingPage';
import VastuPage from '@/pages-old/VastuPage';
import DhanYogaPage from '@/pages-old/DhanYogaPage';
import PanchangPage from '@/pages-old/PanchangPage';
import HoroscopePage from '@/pages-old/HoroscopePage';
import MuhurtaPage from '@/pages-old/MuhurtaPage';
import ToolsPage from '@/pages-old/ToolsPage';

// Same slugs as the public routes. `service={null}` is what makes each page
// generate directly instead of opening the checkout modal.
const TOOLS: Record<string, React.ComponentType<{ service: null }>> = {
  kundali: KundaliPage,
  'kundli-milan': MatchingPage,
  vastu: VastuPage,
  'dhan-yoga': DhanYogaPage,
  panchang: PanchangPage,
  horoscope: HoroscopePage,
  muhurat: MuhurtaPage,
  'astro-tools': ToolsPage,
};

export default async function GenerateToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const Tool = TOOLS[tool];
  if (!Tool) notFound();

  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <Tool service={null} />
    </Suspense>
  );
}
