/**
 * Browser client for the astrology proxy (api/astro.js).
 *
 * Never talks to vedintelastroapi.com directly — the API key lives server-side.
 * Responses are memoised per URL for the session: birth-chart maths is deterministic,
 * so re-opening a tab or re-rendering never spends a second API call.
 */

const memory = new Map();
const SESSION_PREFIX = 'astro:v1:';

export class AstroError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }

  /** Endpoint exists but the VedIntel plan doesn't include it. */
  get isPlanGated() {
    return this.status === 403;
  }

  /** AI narrative endpoints need an AI provider connected in the VedIntel dashboard. */
  get needsAiProvider() {
    return this.status === 400 && /AI provider/i.test(this.message);
  }
}

function buildUrl(endpoint, params) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, value);
  }
  return `/api/astro/${endpoint}?${search}`;
}

function readSession(url) {
  try {
    const raw = sessionStorage.getItem(SESSION_PREFIX + url);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function writeSession(url, data) {
  try {
    sessionStorage.setItem(SESSION_PREFIX + url, JSON.stringify(data));
  } catch {
    // Quota exceeded (e.g. large monthly panchang) — the in-memory cache still works.
  }
}

/**
 * Call an endpoint and return its `response` payload.
 * @param {string} endpoint e.g. 'horoscope/planet-details'
 * @param {object} params query params (dob, tob, lat, lon, tz, ...)
 * @param {{ cache?: boolean }} options
 */
export function astro(endpoint, params = {}, { cache = true } = {}) {
  const url = buildUrl(endpoint, params);

  if (cache) {
    if (memory.has(url)) return memory.get(url);
    const stored = readSession(url);
    if (stored !== undefined) {
      const resolved = Promise.resolve(stored);
      memory.set(url, resolved);
      return resolved;
    }
  }

  const request = fetch(url)
    .then(async (res) => {
      let body;
      try {
        body = await res.json();
      } catch {
        throw new AstroError('The astrology service returned an unexpected response.', res.status);
      }
      if (!res.ok || body.error) {
        throw new AstroError(body.message || body.error || `Request failed (${res.status})`, res.status);
      }
      if (cache) writeSession(url, body.response);
      return body.response;
    })
    .catch((error) => {
      memory.delete(url); // never cache failures
      throw error instanceof AstroError ? error : new AstroError('Network error — please check your connection.', 0);
    });

  if (cache) memory.set(url, request);
  return request;
}

/* ------------------------------------------------------------------ */
/* Birth data                                                          */
/* ------------------------------------------------------------------ */

/** 'YYYY-MM-DD' (input[type=date]) → 'DD/MM/YYYY' (API) */
export function toApiDate(isoDate, separator = '/') {
  const [y, m, d] = isoDate.split('-');
  return [d, m, y].join(separator);
}

/** Today in 'YYYY-MM-DD' using the visitor's local calendar. */
export function todayIso() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().slice(0, 10);
}

/**
 * A birth record as used throughout the UI:
 * { name, gender, date: 'YYYY-MM-DD', time: 'HH:MM', place: { label, lat, lon, tz } }
 */
export function birthParams(birth, prefix = '') {
  return {
    [`${prefix}dob`]: toApiDate(birth.date),
    [`${prefix}tob`]: birth.time,
    [`${prefix}lat`]: birth.place.lat,
    [`${prefix}lon`]: birth.place.lon,
    [`${prefix}tz`]: birth.place.tz,
  };
}

export function locationParams(place) {
  return { lat: place.lat, lon: place.lon, tz: place.tz };
}

/** Serialise a birth record into URL search params so reports are shareable. */
export function birthToSearch(birth, prefix = '') {
  return {
    [`${prefix}n`]: birth.name,
    [`${prefix}g`]: birth.gender,
    [`${prefix}d`]: birth.date,
    [`${prefix}t`]: birth.time,
    [`${prefix}p`]: birth.place.label,
    [`${prefix}lat`]: birth.place.lat,
    [`${prefix}lon`]: birth.place.lon,
    [`${prefix}tz`]: birth.place.tz,
  };
}

export function birthFromSearch(searchParams, prefix = '') {
  const get = (k) => searchParams.get(prefix + k);
  const lat = parseFloat(get('lat'));
  const lon = parseFloat(get('lon'));
  const tz = parseFloat(get('tz'));
  if (!get('d') || !get('t') || Number.isNaN(lat) || Number.isNaN(lon) || Number.isNaN(tz)) return null;
  return {
    name: get('n') || '',
    gender: get('g') || 'male',
    date: get('d'),
    time: get('t'),
    place: { label: get('p') || `${lat}, ${lon}`, lat, lon, tz },
  };
}

export const DEFAULT_PLACE = { label: 'New Delhi, Delhi, India', lat: 28.6139, lon: 77.209, tz: 5.5 };

/** City autocomplete via the geo-search endpoint. */
export async function searchPlaces(query) {
  const res = await astro('utilities/geo-search', { city: query.trim() });
  return (res?.results || []).map((r) => ({
    label: [r.city, r.state, r.country].filter(Boolean).join(', '),
    lat: r.lat,
    lon: r.lon,
    tz: r.tz,
  }));
}

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

const pad = (n) => String(n).padStart(2, '0');

/** Unix seconds → 'hh:mm AM' in the location's timezone (API times are UTC). */
export function formatUnixTime(unix, tz) {
  if (!unix && unix !== 0) return '—';
  const shifted = new Date((unix + tz * 3600) * 1000);
  let h = shifted.getUTCHours();
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${pad(shifted.getUTCMinutes())} ${suffix}`;
}

/** { start_unix, end_unix } → 'hh:mm AM – hh:mm PM' */
export function formatRange(slot, tz) {
  if (!slot?.start_unix || !slot?.end_unix) return '—';
  return `${formatUnixTime(slot.start_unix, tz)} – ${formatUnixTime(slot.end_unix, tz)}`;
}

/** Is `now` inside this slot? */
export function isNow(slot) {
  const now = Date.now() / 1000;
  return slot?.start_unix <= now && now < slot?.end_unix;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Accepts 'Wed, 25 Jan 2012 13:08:59 GMT', 'YYYY-MM-DD' or 'DD/MM/YYYY' → '25 Jan 2012' */
export function formatDate(value) {
  if (!value) return '—';
  const dmy = /^(\d{2})[/-](\d{2})[/-](\d{4})$/.exec(value);
  if (dmy) return `${Number(dmy[1])} ${MONTHS[Number(dmy[2]) - 1]} ${dmy[3]}`;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function isCurrentPeriod(start, end) {
  const now = Date.now();
  return new Date(start).getTime() <= now && now < new Date(end).getTime();
}

export const round = (n, digits = 2) => (typeof n === 'number' ? Number(n.toFixed(digits)) : n);

/** 12.76 → 12°45′ */
export function formatDegree(deg) {
  if (typeof deg !== 'number') return '—';
  const whole = Math.floor(deg);
  const minutes = Math.round((deg - whole) * 60);
  return `${whole}°${pad(minutes === 60 ? 59 : minutes)}′`;
}

/* ------------------------------------------------------------------ */
/* Reference data                                                      */
/* ------------------------------------------------------------------ */

/** The classical nine grahas plus Lagna, in the API's short codes. */
export const GRAHAS = ['As', 'Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke'];

export const GRAHA_HINDI = {
  Ascendant: 'Lagna', Sun: 'Surya', Moon: 'Chandra', Mars: 'Mangal', Mercury: 'Budh',
  Jupiter: 'Guru', Venus: 'Shukra', Saturn: 'Shani', Rahu: 'Rahu', Ketu: 'Ketu',
};

export const ZODIAC_SIGNS = [
  { key: 'aries', name: 'Aries', hindi: 'Mesha', symbol: '♈', dates: 'Mar 21 – Apr 19' },
  { key: 'taurus', name: 'Taurus', hindi: 'Vrishabha', symbol: '♉', dates: 'Apr 20 – May 20' },
  { key: 'gemini', name: 'Gemini', hindi: 'Mithuna', symbol: '♊', dates: 'May 21 – Jun 20' },
  { key: 'cancer', name: 'Cancer', hindi: 'Karka', symbol: '♋', dates: 'Jun 21 – Jul 22' },
  { key: 'leo', name: 'Leo', hindi: 'Simha', symbol: '♌', dates: 'Jul 23 – Aug 22' },
  { key: 'virgo', name: 'Virgo', hindi: 'Kanya', symbol: '♍', dates: 'Aug 23 – Sep 22' },
  { key: 'libra', name: 'Libra', hindi: 'Tula', symbol: '♎', dates: 'Sep 23 – Oct 22' },
  { key: 'scorpio', name: 'Scorpio', hindi: 'Vrishchika', symbol: '♏', dates: 'Oct 23 – Nov 21' },
  { key: 'sagittarius', name: 'Sagittarius', hindi: 'Dhanu', symbol: '♐', dates: 'Nov 22 – Dec 21' },
  { key: 'capricorn', name: 'Capricorn', hindi: 'Makara', symbol: '♑', dates: 'Dec 22 – Jan 19' },
  { key: 'aquarius', name: 'Aquarius', hindi: 'Kumbha', symbol: '♒', dates: 'Jan 20 – Feb 18' },
  { key: 'pisces', name: 'Pisces', hindi: 'Meena', symbol: '♓', dates: 'Feb 19 – Mar 20' },
];

export const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha',
  'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

export const DIVISIONAL_CHARTS = [
  { div: 'D1', name: 'Rasi', topic: 'Overall life & body' },
  { div: 'D2', name: 'Hora', topic: 'Wealth' },
  { div: 'D3', name: 'Drekkana', topic: 'Siblings & courage' },
  { div: 'D4', name: 'Chaturthamsa', topic: 'Property & fortune' },
  { div: 'D7', name: 'Saptamsa', topic: 'Children' },
  { div: 'D9', name: 'Navamsa', topic: 'Marriage & dharma' },
  { div: 'D10', name: 'Dasamsa', topic: 'Career' },
  { div: 'D12', name: 'Dwadasamsa', topic: 'Parents' },
  { div: 'D16', name: 'Shodasamsa', topic: 'Vehicles & comforts' },
  { div: 'D20', name: 'Vimsamsa', topic: 'Spiritual progress' },
  { div: 'D24', name: 'Chaturvimsamsa', topic: 'Education' },
  { div: 'D27', name: 'Bhamsa', topic: 'Strengths & weaknesses' },
  { div: 'D30', name: 'Trimsamsa', topic: 'Misfortunes' },
  { div: 'D40', name: 'Khavedamsa', topic: 'Maternal legacy' },
  { div: 'D45', name: 'Akshavedamsa', topic: 'Paternal legacy' },
  { div: 'D60', name: 'Shashtiamsa', topic: 'Past karma' },
];
