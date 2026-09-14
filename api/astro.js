/**
 * VedIntel AstroAPI proxy — Vercel serverless function.
 *
 * The upstream API authenticates with an `api_key` QUERY PARAMETER, so the key can
 * never touch browser JavaScript. The browser calls /api/astro/<category>/<endpoint>,
 * vercel.json rewrites that to /api/astro?path=<category>/<endpoint>, and this
 * function re-issues the request upstream with VEDINTEL_API_KEY attached.
 *
 * Set VEDINTEL_API_KEY in Vercel → Project → Settings → Environment Variables.
 */

const UPSTREAM = 'https://vedintelastroapi.com/api/v1';

// Only these endpoints are reachable. Without an allowlist the proxy would be an
// open gateway and anyone could drain the monthly quota. Endpoints that need a
// higher plan than Developer (KP significators/ruling planets, Jaimini karakamsa,
// combustion) are intentionally absent.
const ALLOWED = new Set([
  // Birth chart
  'horoscope/planet-details', 'horoscope/chart-image', 'horoscope/divisional-charts',
  'horoscope/planets-in-houses', 'horoscope/planetary-aspects', 'horoscope/ascendant-report',
  'horoscope/personal-characteristics', 'horoscope/ashtakvarga', 'horoscope/ashtakvarga-chart-image',
  'horoscope/binnashtakvarga', 'horoscope/western-planets',
  // Extended horoscope
  'extended-horoscope/find-ascendant', 'extended-horoscope/find-moon-sign', 'extended-horoscope/find-sun-sign',
  'extended-horoscope/extended-kundli-details', 'extended-horoscope/yoga-list', 'extended-horoscope/numero-table',
  'extended-horoscope/current-sade-sati', 'extended-horoscope/sade-sati-table', 'extended-horoscope/shad-bala',
  'extended-horoscope/gem-suggestion', 'extended-horoscope/rudraksh-suggestion', 'extended-horoscope/varshapal-details',
  'extended-horoscope/kp-planets', 'extended-horoscope/kp-houses', 'extended-horoscope/jaimini-karakas',
  'extended-horoscope/arutha-padas', 'extended-horoscope/friendship-table',
  // Dashas
  'dashas/mahadasha', 'dashas/current-mahadasha-full', 'dashas/antardasha', 'dashas/mahadasha-predictions',
  'dashas/yogini-dasha-main', 'dashas/yogini-dasha-sub', 'dashas/char-dasha-main', 'dashas/char-dasha-current',
  // Dosha
  'dosha/manglik-dosh', 'dosha/mangal-dosh', 'dosha/kaalsarp-dosh', 'dosha/pitra-dosh', 'dosha/papasamaya',
  // Matching
  'matching/north-match', 'matching/south-match', 'matching/aggregate-match', 'matching/north-match-astro-details',
  'matching/rajju-vedha-match', 'matching/papasamaya-match', 'matching/nakshatra-match',
  // Panchang
  'panchang/panchang', 'panchang/choghadiya-muhurta', 'panchang/hora-muhurta', 'panchang/monthly-panchang',
  'panchang/moon-phase', 'panchang/festivals', 'panchang/retrogrades', 'panchang/transit',
  'panchang/ekadashi', 'panchang/amavasya-dates', 'panchang/purnima-dates', 'panchang/auspicious-yogas',
  // Muhurta
  'muhurta/marriage', 'muhurta/travel', 'muhurta/griha-pravesh', 'muhurta/vehicle', 'muhurta/business',
  // Predictions
  'predictions/daily-sun', 'predictions/daily-moon', 'predictions/daily-nakshatra', 'predictions/weekly-sun',
  'predictions/weekly-moon', 'predictions/yearly', 'predictions/biorhythm', 'predictions/day-number',
  'predictions/numerology',
  'horoscope-by-sign/daily', 'horoscope-by-sign/weekly', 'horoscope-by-sign/monthly',
  // Utilities & others
  'utilities/geo-search', 'utilities/gem-details', 'utilities/radical-number-details',
  'utilities/nakshatra-vastu-details', 'astrology/baby-names', 'prasna/query',
  'chinese/natal-chart', 'japanese/nine-star-ki',
  // AI narratives (need an AI provider connected in the VedIntel dashboard)
  'ai/interpret/chart', 'ai/dasha/narrative', 'ai/transit/forecast', 'ai/compatibility',
  // PDF reports (spend report credits)
  'reports/generate', 'reports/status', 'reports/download',
]);

// Params the browser may forward. Anything else — notably `api_key` — is dropped,
// so a caller can't override our credentials.
const ALLOWED_PARAMS = new Set([
  'dob', 'tob', 'lat', 'lon', 'tz', 'lang', 'ayanamsa', 'node_type', 'house_system',
  'm_dob', 'm_tob', 'm_lat', 'm_lon', 'm_tz', 'f_dob', 'f_tob', 'f_lat', 'f_lon', 'f_tz',
  'div', 'style', 'format', 'theme', 'size', 'chart_id', 'planet_id', 'yoga_id',
  'date', 'month', 'year', 'window_days', 'city', 'country', 'sign',
  'gem', 'number', 'nakshatra', 'gender', 'name', 'question_type',
  'report_type', 'birth2', 'job_id',
]);

// Every report type the API offers. complete_life and deep_forecast cost 5 credits each,
// so they lean on the per-IP throttle below rather than being blocked outright.
const PUBLIC_REPORT_TYPES = new Set([
  'snapshot', 'full_analysis', 'complete_life', 'career', 'marriage', 'health', 'finance',
  'annual_forecast', 'deep_forecast', 'compatibility',
]);

// Best-effort abuse brake for the endpoints that cost real money. It is per warm
// instance, not global — enough to stop a stuck retry loop or a casual script.
const THROTTLES = { 'reports/generate': { max: 3, windowMs: 60 * 60 * 1000 }, ai: { max: 20, windowMs: 60 * 60 * 1000 } };
const hits = new Map();

function throttled(bucket, ip) {
  const rule = THROTTLES[bucket];
  if (!rule) return false;
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < rule.windowMs);
  if (recent.length >= rule.max) return true;
  recent.push(now);
  hits.set(key, recent);
  return false;
}

// Year-long calendars are slow to compute upstream (15–45s) and never change.
const YEARLY = new Set(['panchang/festivals', 'panchang/ekadashi', 'panchang/amavasya-dates', 'panchang/purnima-dates']);

function cacheControl(endpoint) {
  if (endpoint.startsWith('reports/')) return 'no-store';
  if (YEARLY.has(endpoint)) return 'public, s-maxage=2592000, stale-while-revalidate=86400'; // 30 days
  if (endpoint.startsWith('panchang/') || endpoint.startsWith('horoscope-by-sign/')
    || endpoint.startsWith('predictions/') || endpoint.startsWith('muhurta/') || endpoint === 'prasna/query') {
    return 'public, s-maxage=21600, stale-while-revalidate=3600'; // 6h: date-dependent
  }
  // Birth-chart maths never changes for a given birth moment.
  return 'public, s-maxage=31536000, stale-while-revalidate=86400';
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.VEDINTEL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Astrology service is not configured (VEDINTEL_API_KEY missing).' });
  }

  const rawPath = Array.isArray(req.query.path) ? req.query.path.join('/') : String(req.query.path || '');
  const endpoint = rawPath.replace(/^\/+|\/+$/g, '');

  if (!ALLOWED.has(endpoint)) {
    return res.status(404).json({ error: `Unknown endpoint: ${endpoint}` });
  }

  if (endpoint === 'reports/generate' && req.query.report_type && !PUBLIC_REPORT_TYPES.has(req.query.report_type)) {
    return res.status(400).json({ error: 'This report type is not available online.' });
  }

  const ip = String(req.headers?.['x-forwarded-for'] || '').split(',')[0].trim() || 'local';
  const bucket = endpoint.startsWith('ai/') ? 'ai' : endpoint;
  if (throttled(bucket, ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again in a little while.' });
  }

  const upstreamParams = new URLSearchParams({ api_key: apiKey });
  for (const [key, value] of Object.entries(req.query)) {
    if (!ALLOWED_PARAMS.has(key) || value === undefined || value === '') continue;
    upstreamParams.set(key, Array.isArray(value) ? value[0] : value);
  }

  try {
    const upstream = await fetch(`${UPSTREAM}/${endpoint}?${upstreamParams}`, {
      signal: AbortSignal.timeout(endpoint.startsWith('ai/') || YEARLY.has(endpoint) ? 55_000 : 30_000),
    });

    const contentType = upstream.headers.get('content-type') || 'application/json; charset=utf-8';
    res.setHeader('Cache-Control', upstream.ok ? cacheControl(endpoint) : 'no-store');
    res.setHeader('Content-Type', contentType);

    // PDF downloads are binary; everything else is JSON text.
    if (!contentType.includes('json') && !contentType.startsWith('text/')) {
      const disposition = upstream.headers.get('content-disposition');
      if (disposition) res.setHeader('Content-Disposition', disposition);
      return res.status(upstream.status).send(Buffer.from(await upstream.arrayBuffer()));
    }

    const body = await upstream.text();
    // Upstream 404s for unknown routes are HTML pages; normalise to JSON for the client.
    if (!contentType.includes('json')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.status(upstream.status).json({ error: `Astrology service returned ${upstream.status}` });
    }
    return res.status(upstream.status).send(body);
  } catch (error) {
    const timedOut = error.name === 'TimeoutError' || error.name === 'AbortError';
    return res.status(timedOut ? 504 : 502).json({
      error: timedOut ? 'The astrology service took too long to respond. Please try again.' : 'Could not reach the astrology service.',
    });
  }
}
