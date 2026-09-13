/**
 * Vedic Kundali (Birth Chart) Astronomical & Astrological Calculation Engine
 * Calculates: Lagna, Rashi, Nakshatra, Pada, Graha Bhavas (Houses 1-12),
 * Manglik Dosha, Vimshottari Mahadasha, Lucky Traits, and Life Predictions.
 */

export const RASHIS = [
  { id: 1, name: 'Mesha', english: 'Aries', lord: 'Mars (Mangal)', element: 'Fire', symbol: '♈' },
  { id: 2, name: 'Vrishabha', english: 'Taurus', lord: 'Venus (Shukra)', element: 'Earth', symbol: '♉' },
  { id: 3, name: 'Mithuna', english: 'Gemini', lord: 'Mercury (Budh)', element: 'Air', symbol: '♊' },
  { id: 4, name: 'Karka', english: 'Cancer', lord: 'Moon (Chandra)', element: 'Water', symbol: '♋' },
  { id: 5, name: 'Simha', english: 'Leo', lord: 'Sun (Surya)', element: 'Fire', symbol: '♌' },
  { id: 6, name: 'Kanya', english: 'Virgo', lord: 'Mercury (Budh)', element: 'Earth', symbol: '♍' },
  { id: 7, name: 'Tula', english: 'Libra', lord: 'Venus (Shukra)', element: 'Air', symbol: '♎' },
  { id: 8, name: 'Vrishchika', english: 'Scorpio', lord: 'Mars (Mangal)', element: 'Water', symbol: '♏' },
  { id: 9, name: 'Dhanu', english: 'Sagittarius', lord: 'Jupiter (Guru)', element: 'Fire', symbol: '♐' },
  { id: 10, name: 'Makara', english: 'Capricorn', lord: 'Saturn (Shani)', element: 'Earth', symbol: '♑' },
  { id: 11, name: 'Kumbha', english: 'Aquarius', lord: 'Saturn (Shani)', element: 'Air', symbol: '♒' },
  { id: 12, name: 'Meena', english: 'Pisces', lord: 'Jupiter (Guru)', element: 'Water', symbol: '♓' },
];

export const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras' },
  { name: 'Bharani', lord: 'Venus', deity: 'Yama' },
  { name: 'Krittika', lord: 'Sun', deity: 'Agni' },
  { name: 'Rohini', lord: 'Moon', deity: 'Brahma' },
  { name: 'Mrigashira', lord: 'Mars', deity: 'Soma' },
  { name: 'Ardra', lord: 'Rahu', deity: 'Rudra' },
  { name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi' },
  { name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati' },
  { name: 'Ashlesha', lord: 'Mercury', deity: 'Nagas' },
  { name: 'Magha', lord: 'Ketu', deity: 'Pitris' },
  { name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga' },
  { name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman' },
  { name: 'Hasta', lord: 'Moon', deity: 'Savitr' },
  { name: 'Chitra', lord: 'Mars', deity: 'Vishwakarma' },
  { name: 'Swati', lord: 'Rahu', deity: 'Vayu' },
  { name: 'Vishakha', lord: 'Jupiter', deity: 'Indragni' },
  { name: 'Anuradha', lord: 'Saturn', deity: 'Mitra' },
  { name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra' },
  { name: 'Mula', lord: 'Ketu', deity: 'Nirriti' },
  { name: 'Purva Ashadha', lord: 'Venus', deity: 'Apas' },
  { name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishvadevas' },
  { name: 'Shravana', lord: 'Moon', deity: 'Vishnu' },
  { name: 'Dhanishta', lord: 'Mars', deity: 'Vasus' },
  { name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahirbudhnya' },
  { name: 'Revati', lord: 'Mercury', deity: 'Pushan' },
];

const DASHA_ORDER = [
  { lord: 'Ketu', years: 7 },
  { lord: 'Venus', years: 20 },
  { lord: 'Sun', years: 6 },
  { lord: 'Moon', years: 10 },
  { lord: 'Mars', years: 7 },
  { lord: 'Rahu', years: 18 },
  { lord: 'Jupiter', years: 16 },
  { lord: 'Saturn', years: 19 },
  { lord: 'Mercury', years: 17 },
];

// Helper to convert date & time to Julian Day
function getJulianDay(year, month, day, hour, minute) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFrac = day + (hour + minute / 60) / 24;
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + dayFrac + B - 1524.5;
}

// Calculate Sidereal Sun longitude (Ayanamsha adjusted)
function getSunLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  let L0 = 280.46646 + 36000.76983 * T;
  const M = (357.52911 + 35999.05029 * T) * (Math.PI / 180);
  const C = (1.914602 - 0.004817 * T) * Math.sin(M) + (0.019993 - 0.000101 * T) * Math.sin(2 * M);
  let sunTrue = (L0 + C) % 360;
  if (sunTrue < 0) sunTrue += 360;
  // Lahiri Ayanamsha approx
  const ayanamsha = 23.85 + (T * 50.29) / 3600;
  let siderealSun = (sunTrue - ayanamsha) % 360;
  if (siderealSun < 0) siderealSun += 360;
  return siderealSun;
}

// Calculate Sidereal Moon longitude
function getMoonLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const Lprime = 218.3164477 + 481267.88123421 * T;
  const D = (297.8501921 + 445267.1114034 * T) * (Math.PI / 180);
  const M = (357.5291092 + 35999.0502909 * T) * (Math.PI / 180);
  const Mprime = (134.9633964 + 477198.8675055 * T) * (Math.PI / 180);
  const F = (93.272095 + 483202.0175233 * T) * (Math.PI / 180);

  let moonTrue =
    Lprime +
    6.288774 * Math.sin(Mprime) +
    1.274027 * Math.sin(2 * D - Mprime) +
    0.658314 * Math.sin(2 * D) +
    0.213618 * Math.sin(2 * Mprime) -
    0.185116 * Math.sin(M) -
    0.114332 * Math.sin(2 * F);
  moonTrue = moonTrue % 360;
  if (moonTrue < 0) moonTrue += 360;

  const ayanamsha = 23.85 + (T * 50.29) / 3600;
  let siderealMoon = (moonTrue - ayanamsha) % 360;
  if (siderealMoon < 0) siderealMoon += 360;
  return siderealMoon;
}

export function generateKundali({ name, gender, dob, time, place = 'Delhi' }) {
  const [yearStr, monthStr, dayStr] = dob.split('-');
  const year = parseInt(yearStr, 10) || 1995;
  const month = parseInt(monthStr, 10) || 1;
  const day = parseInt(dayStr, 10) || 1;

  let [hourStr, minStr] = (time || '12:00').split(':');
  const hour = parseInt(hourStr, 10) || 12;
  const minute = parseInt(minStr, 10) || 0;

  const jd = getJulianDay(year, month, day, hour, minute);

  // Sun & Moon calculations
  const sunLong = getSunLongitude(jd);
  const moonLong = getMoonLongitude(jd);

  // Solar sign index (0 to 11)
  const sunSignIdx = Math.floor(sunLong / 30);
  const sunRashi = RASHIS[sunSignIdx];

  // Ascendant (Lagna) calculation:
  // Sun rises at ~06:00 in the solar sign. Every 2 hours, Lagna shifts by 1 sign.
  const hoursFromSunrise = ((hour + minute / 60) - 6 + 24) % 24;
  const lagnaShift = Math.floor(hoursFromSunrise / 2);
  const lagnaIdx = (sunSignIdx + lagnaShift) % 12;
  const lagnaRashi = RASHIS[lagnaIdx];

  // Moon sign (Janma Rashi)
  const moonSignIdx = Math.floor(moonLong / 30);
  const moonRashi = RASHIS[moonSignIdx];

  // Nakshatra calculation (360 / 27 = 13.3333 degrees per nakshatra)
  const nakshatraDegree = 360 / 27;
  const nakshatraIdx = Math.floor(moonLong / nakshatraDegree) % 27;
  const nakshatra = NAKSHATRAS[nakshatraIdx];
  const pada = Math.floor((moonLong % nakshatraDegree) / (nakshatraDegree / 4)) + 1;

  // Approximate planetary longitudes using sidereal cyclic offsets
  const T = (jd - 2451545.0) / 36525;
  const ayanamsha = 23.85 + (T * 50.29) / 3600;

  const marsLong = (Math.abs(jd * 0.52403 + 120) % 360 - ayanamsha + 360) % 360;
  const mercuryLong = (sunLong + (Math.sin(jd * 0.04) * 22) + 360) % 360;
  const jupiterLong = (Math.abs(jd * 0.08308 + 45) % 360 - ayanamsha + 360) % 360;
  const venusLong = (sunLong + (Math.cos(jd * 0.02) * 38) + 360) % 360;
  const saturnLong = (Math.abs(jd * 0.0334 + 180) % 360 - ayanamsha + 360) % 360;
  const rahuLong = (360 - ((jd - 2451545.0) * 0.05295) % 360 + 360) % 360;
  const ketuLong = (rahuLong + 180) % 360;

  // Helper to map longitude to house (Bhava 1 to 12) based on Lagna
  const getHouseForSign = (signIdx) => ((signIdx - lagnaIdx + 12) % 12) + 1;

  const planetsList = [
    { name: 'Sun (Surya)', code: 'Su', deg: sunLong, signIdx: sunSignIdx },
    { name: 'Moon (Chandra)', code: 'Mo', deg: moonLong, signIdx: moonSignIdx },
    { name: 'Mars (Mangal)', code: 'Ma', deg: marsLong, signIdx: Math.floor(marsLong / 30) },
    { name: 'Mercury (Budh)', code: 'Me', deg: mercuryLong, signIdx: Math.floor(mercuryLong / 30) },
    { name: 'Jupiter (Guru)', code: 'Ju', deg: jupiterLong, signIdx: Math.floor(jupiterLong / 30) },
    { name: 'Venus (Shukra)', code: 'Ve', deg: venusLong, signIdx: Math.floor(venusLong / 30) },
    { name: 'Saturn (Shani)', code: 'Sa', deg: saturnLong, signIdx: Math.floor(saturnLong / 30) },
    { name: 'Rahu', code: 'Ra', deg: rahuLong, signIdx: Math.floor(rahuLong / 30) },
    { name: 'Ketu', code: 'Ke', deg: ketuLong, signIdx: Math.floor(ketuLong / 30) },
  ];

  // Assign planets to 12 Bhavas
  const houses = {};
  for (let h = 1; h <= 12; h++) {
    const houseSignIdx = (lagnaIdx + (h - 1)) % 12;
    houses[h] = {
      houseNum: h,
      rashi: RASHIS[houseSignIdx],
      planets: [],
    };
  }

  // Add Ascendant to House 1
  houses[1].planets.push({ code: 'Asc', name: 'Ascendant (Lagna)' });

  planetsList.forEach((p) => {
    const h = getHouseForSign(p.signIdx);
    houses[h].planets.push(p);
  });

  // Calculate detailed planetary positions for table
  const planetaryPositions = planetsList.map((p) => {
    const rashi = RASHIS[p.signIdx];
    const houseNum = getHouseForSign(p.signIdx);
    const signDeg = Math.floor(p.deg % 30);
    const signMin = Math.floor(((p.deg % 30) - signDeg) * 60);
    return {
      name: p.name,
      code: p.code,
      rashiName: `${rashi.name} (${rashi.english})`,
      house: `House ${houseNum}`,
      degree: `${signDeg}° ${signMin}'`,
      lord: rashi.lord,
      element: rashi.element,
    };
  });

  // Manglik Dosha Analysis
  const marsHouse = getHouseForSign(Math.floor(marsLong / 30));
  const isManglik = [1, 4, 7, 8, 12].includes(marsHouse);
  const manglikStatus = isManglik
    ? {
        hasDosha: true,
        title: 'Manglik Dosha Present',
        description: `Mars is placed in House ${marsHouse} of your Janam Kundali, indicating Kuja / Manglik influence. This brings intense drive and ambition, but advises conscious communication in marital partnerships.`,
        remedy: 'Recite Hanuman Chalisa on Tuesdays and consider Kumbh Vivah or Mars balancing remedies before marriage.',
      }
    : {
        hasDosha: false,
        title: 'Non-Manglik',
        description: `Mars is auspiciously posited in House ${marsHouse}, indicating harmonious planetary alignment for matrimonial alliance and partnership.`,
        remedy: 'Regular devotion and positive deeds reinforce this auspicious harmony.',
      };

  // Vimshottari Mahadasha
  const dashaLord = nakshatra.lord;
  const dashaIdx = DASHA_ORDER.findIndex((d) => d.lord === dashaLord);
  const currentAge = Math.max(0, new Date().getFullYear() - year);
  let accumulatedYears = 0;
  let activeDasha = DASHA_ORDER[dashaIdx];

  for (let i = 0; i < DASHA_ORDER.length * 2; i++) {
    const item = DASHA_ORDER[(dashaIdx + i) % DASHA_ORDER.length];
    if (accumulatedYears + item.years >= currentAge) {
      activeDasha = item;
      break;
    }
    accumulatedYears += item.years;
  }

  // Lucky attributes
  const luckyData = {
    gemstone:
      lagnaRashi.id === 1 || lagnaRashi.id === 8
        ? 'Red Coral (Moonga)'
        : lagnaRashi.id === 2 || lagnaRashi.id === 7
        ? 'Opal / Diamond (Heera)'
        : lagnaRashi.id === 3 || lagnaRashi.id === 6
        ? 'Emerald (Panna)'
        : lagnaRashi.id === 4
        ? 'Natural Pearl (Moti)'
        : lagnaRashi.id === 5
        ? 'Ruby (Manik)'
        : lagnaRashi.id === 9 || lagnaRashi.id === 12
        ? 'Yellow Sapphire (Pukhraj)'
        : 'Blue Sapphire (Neelam)',
    number: ((lagnaRashi.id * 3) % 9) + 1,
    color:
      lagnaRashi.element === 'Fire'
        ? 'Crimson & Saffron Gold'
        : lagnaRashi.element === 'Earth'
        ? 'Emerald Green & Earth Tones'
        : lagnaRashi.element === 'Air'
        ? 'Royal Blue & Silver'
        : 'Pearl White & Ocean Blue',
    day:
      lagnaRashi.id === 5
        ? 'Sunday'
        : lagnaRashi.id === 4
        ? 'Monday'
        : lagnaRashi.id === 1 || lagnaRashi.id === 8
        ? 'Tuesday'
        : lagnaRashi.id === 3 || lagnaRashi.id === 6
        ? 'Wednesday'
        : lagnaRashi.id === 9 || lagnaRashi.id === 12
        ? 'Thursday'
        : lagnaRashi.id === 2 || lagnaRashi.id === 7
        ? 'Friday'
        : 'Saturday',
    direction:
      lagnaRashi.element === 'Fire'
        ? 'East'
        : lagnaRashi.element === 'Earth'
        ? 'South'
        : lagnaRashi.element === 'Air'
        ? 'West'
        : 'North',
  };

  // Personalized Life Predictions
  const predictions = {
    personality: `As a ${lagnaRashi.name} (${lagnaRashi.english}) Ascendant with Moon in ${moonRashi.name} (${moonRashi.english}), you possess a naturally intuitive and dignified presence. Ruled by ${lagnaRashi.lord}, you combine visionary thinking with strong inner resolve.`,
    career: `Your 10th house is influenced by the ${houses[10].rashi.name} sign. Career paths in strategic leadership, advisory, consulting, public service, creative commerce, and technology align exceptionally well with your planetary vibrations.`,
    marriage: `Your 7th house of partnerships resides in ${houses[7].rashi.name} (${houses[7].rashi.english}). You seek intellectual depth and mutual respect in relationships. Dedicated horoscope matching ensures lasting marital harmony.`,
    health: `Your vital energy is governed by ${lagnaRashi.element} element dynamics. Regular hydration, daily pranayama, and mindful stress management will protect your vitality throughout planetary transitions.`,
    remedy: `Performing ${isManglik ? 'Hanuman Chalisa and Navagraha Shanti' : 'Shree Suktam and Gayatri Mantra chanting'} and energizing your home entrance will amplify prosperity and peace.`,
  };

  return {
    meta: {
      name,
      gender,
      dob,
      time: time || '12:00',
      place,
      generatedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    },
    astronomy: {
      lagna: lagnaRashi,
      rashi: moonRashi,
      sunSign: sunRashi,
      nakshatra: nakshatra.name,
      pada,
      nakshatraLord: nakshatra.lord,
      dasha: activeDasha.lord,
      dashaDuration: `${activeDasha.years} Years Cycle`,
    },
    houses,
    planetaryPositions,
    manglikStatus,
    luckyData,
    predictions,
  };
}
