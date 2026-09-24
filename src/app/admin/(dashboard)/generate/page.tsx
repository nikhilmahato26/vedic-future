import AstroServices from '@/components/sections/AstroServices';

export const metadata = { title: 'Generate Reports - Vedic Future Admin' };

export default function GeneratePage() {
  return (
    <div>
      <div className="px-4 md:px-8">
        <h1 className="text-2xl font-bold">Generate Reports</h1>
        <p className="text-sm text-ink-500 mt-1">Every astrology service from the website, free for admins — no checkout.</p>
      </div>
      <AstroServices limit={undefined} />
    </div>
  );
}
