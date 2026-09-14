import useAstro from '../../hooks/useAstro';
import { birthParams } from '../../lib/astro';
import { Loading, ErrorNote } from './ui';

/**
 * Kundali chart rendered by the API as SVG. Loaded as a data: URI inside <img>, so the
 * third-party markup can never execute script in our page.
 */
export default function ChartImage({ birth, div = 'D1', style = 'north', title, className = '' }) {
  const q = useAstro('horoscope/chart-image', { ...birthParams(birth), div, style, theme: 'classic', size: 500, format: 'base64' });

  return (
    <figure className={className}>
      <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-navy-900/10 bg-white">
        {q.loading && !q.data && <Loading className="absolute inset-0" label="Drawing chart…" />}
        {q.error && <div className="p-4"><ErrorNote error={q.error} /></div>}
        {q.data?.chart_image && (
          <img
            src={`data:image/svg+xml;base64,${q.data.chart_image}`}
            alt={`${title || div} chart, ${style === 'north' ? 'North' : 'South'} Indian style`}
            className={`h-full w-full transition-opacity ${q.loading ? 'opacity-40' : 'opacity-100'}`}
          />
        )}
      </div>
      {title && <figcaption className="mt-3 text-center font-display text-lg text-navy-900/80">{title}</figcaption>}
    </figure>
  );
}
