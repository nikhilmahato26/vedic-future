import { NextRequest, NextResponse } from 'next/server';

const UPSTREAM = 'https://vedintelastroapi.com/api/v1';

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

const ALLOWED_PARAMS = new Set([
  'dob', 'tob', 'lat', 'lon', 'tz', 'lang', 'ayanamsa', 'node_type', 'house_system',
  'm_dob', 'm_tob', 'm_lat', 'm_lon', 'm_tz', 'f_dob', 'f_tob', 'f_lat', 'f_lon', 'f_tz',
  'div', 'style', 'format', 'theme', 'size', 'chart_id', 'planet_id', 'yoga_id',
  'date', 'month', 'year', 'window_days', 'city', 'country', 'sign',
  'gem', 'number', 'nakshatra', 'gender', 'name', 'question_type',
  'report_type', 'birth2', 'job_id',
]);

const PUBLIC_REPORT_TYPES = new Set([
  'snapshot', 'full_analysis', 'complete_life', 'career', 'marriage', 'health', 'finance',
  'annual_forecast', 'deep_forecast', 'compatibility',
]);

const THROTTLES = { 'reports/generate': { max: 3, windowMs: 60 * 60 * 1000 }, ai: { max: 20, windowMs: 60 * 60 * 1000 } };
const hits = new Map();

function throttled(bucket: string, ip: string) {
  const rule = THROTTLES[bucket as keyof typeof THROTTLES];
  if (!rule) return false;
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t: number) => now - t < rule.windowMs);
  if (recent.length >= rule.max) return true;
  recent.push(now);
  hits.set(key, recent);
  return false;
}

const YEARLY = new Set(['panchang/festivals', 'panchang/ekadashi', 'panchang/amavasya-dates', 'panchang/purnima-dates']);

function cacheControl(endpoint: string) {
  if (endpoint.startsWith('reports/')) return 'no-store';
  if (YEARLY.has(endpoint)) return 'public, s-maxage=2592000, stale-while-revalidate=86400';
  if (endpoint.startsWith('panchang/') || endpoint.startsWith('horoscope-by-sign/')
    || endpoint.startsWith('predictions/') || endpoint.startsWith('muhurta/') || endpoint === 'prasna/query') {
    return 'public, s-maxage=21600, stale-while-revalidate=3600';
  }
  return 'public, s-maxage=31536000, stale-while-revalidate=86400';
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const apiKey = process.env.VEDINTEL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Astrology service is not configured (VEDINTEL_API_KEY missing).' }, { status: 500 });
  }

  const endpoint = (await params).path.join('/');

  if (!ALLOWED.has(endpoint)) {
    return NextResponse.json({ error: `Unknown endpoint: ${endpoint}` }, { status: 404 });
  }

  const searchParams = request.nextUrl.searchParams;

  if (endpoint === 'reports/generate') {
    const reportType = searchParams.get('report_type');
    if (reportType && !PUBLIC_REPORT_TYPES.has(reportType)) {
      return NextResponse.json({ error: 'This report type is not available online.' }, { status: 400 });
    }
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  const bucket = endpoint.startsWith('ai/') ? 'ai' : endpoint;
  if (throttled(bucket, ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again in a little while.' }, { status: 429 });
  }

  const upstreamParams = new URLSearchParams({ api_key: apiKey });
  for (const [key, value] of searchParams.entries()) {
    if (!ALLOWED_PARAMS.has(key) || value === undefined || value === '') continue;
    upstreamParams.set(key, value);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), endpoint.startsWith('ai/') || YEARLY.has(endpoint) ? 55_000 : 30_000);

    const upstreamUrl = `${UPSTREAM}/${endpoint}?${upstreamParams.toString()}`;
    
    const upstream = await fetch(upstreamUrl, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const contentType = upstream.headers.get('content-type') || 'application/json; charset=utf-8';
    
    if (!contentType.includes('json') && !contentType.startsWith('text/')) {
      const disposition = upstream.headers.get('content-disposition');
      const arrayBuffer = await upstream.arrayBuffer();
      const headers = new Headers({
        'Cache-Control': upstream.ok ? cacheControl(endpoint) : 'no-store',
        'Content-Type': contentType,
      });
      if (disposition) headers.set('Content-Disposition', disposition);
      
      return new NextResponse(arrayBuffer, {
        status: upstream.status,
        headers,
      });
    }

    const body = await upstream.text();
    if (!contentType.includes('json')) {
      return NextResponse.json({ error: `Astrology service returned ${upstream.status}` }, { 
        status: upstream.status,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        'Cache-Control': upstream.ok ? cacheControl(endpoint) : 'no-store',
        'Content-Type': contentType
      }
    });

  } catch (error: any) {
    const timedOut = error.name === 'TimeoutError' || error.name === 'AbortError';
    return NextResponse.json(
      { error: timedOut ? 'The astrology service took too long to respond. Please try again.' : 'Could not reach the astrology service.' },
      { status: timedOut ? 504 : 502 }
    );
  }
}
