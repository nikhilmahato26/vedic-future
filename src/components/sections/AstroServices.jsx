"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import SacredBackdrop from '../ui/SacredBackdrop';
import Icon from '../ui/Icon';
import useAstro from '../../hooks/useAstro';
import { astroServices } from '../../data/astroServices';
import { useAstroHref } from '../../context/AstroBase';
import { DEFAULT_PLACE, formatDate, formatRange, formatUnixTime, locationParams, todayIso, toApiDate } from '../../lib/astro';
import { ArrowRight, Sunrise, Sunset, AlertTriangle, ShieldCheck } from '../../utils/icons';
import { fadeUp, stagger, viewport } from '../../utils/motion';

/** Today's Panchang strip — one cached API call shared by every visitor via the CDN. */
function TodayStrip() {
  const place = DEFAULT_PLACE;
  const href = useAstroHref();
  const q = useAstro('panchang/panchang', { ...locationParams(place), date: toApiDate(todayIso()) }, { localized: false });
  const p = q.data;
  const items = p && [
    ['Tithi', `${p.tithi?.name} · ${p.tithi?.type}`],
    ['Nakshatra', p.nakshatra?.name],
    ['Yoga', p.yoga?.name],
    [<><Sunrise className="inline h-3 w-3" /> Sunrise</>, formatUnixTime(p.sunrise?.unix, place.tz)],
    [<><Sunset className="inline h-3 w-3" /> Sunset</>, formatUnixTime(p.sunset?.unix, place.tz)],
    [<><AlertTriangle className="inline h-3 w-3" /> Rahu Kaal</>, formatRange(p.inauspicious_timings?.rahu_kaal, place.tz)],
    [<><ShieldCheck className="inline h-3 w-3" /> Abhijit</>, formatRange(p.auspicious_timings?.abhijit_muhurta, place.tz)],
  ];

  return (
    <Link href={href('/panchang')} className="glass group mt-12 block rounded-2xl p-5 transition hover:border-coral/40 hover:shadow-glow">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="font-display text-lg text-navy-900">
          <span className="text-coral">Aaj ka Panchang</span> · {formatDate(todayIso())} · {p?.vara || ''} · New Delhi
        </p>
        <span className="flex items-center gap-1 text-sm text-coral/80 group-hover:text-coral">Full Panchang <ArrowRight className="h-4 w-4" /></span>
      </div>
      {items ? (
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 lg:grid-cols-7">
          {items.map(([k, v], i) => (
            <div key={i}>
              <dt className="text-[11px] uppercase tracking-wider text-navy-900/45">{k}</dt>
              <dd className="text-sm text-navy-900">{v}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-navy-900/45">{q.error ? 'Panchang is unavailable right now.' : 'Loading today’s Panchang…'}</p>
      )}
    </Link>
  );
}

export default function AstroServices({ showToday = true, limit }) {
  const list = limit ? astroServices.slice(0, limit) : astroServices;
  const href = useAstroHref();
  return (
    <section id="astrology" className="section-pad relative overflow-hidden">
      <SacredBackdrop variant="minimal" stars={28} />
      <div className="container-luxe relative z-10">
        <SectionTitle
          eyebrow="Free Online Jyotish"
          title={<>Instant <span className="text-coral-gradient">Vedic Astrology</span> Services</>}
          subtitle="Calculated with Swiss Ephemeris — the same astronomical engine professional astrologers trust. Free, instant, and in Hindi or English."
        />

        {showToday && <TodayStrip />}

        <motion.div variants={stagger(0.06)} initial="hidden" whileInView="show" viewport={viewport} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <motion.div key={s.title} variants={fadeUp}>
              <Link href={href(s.to)} className="glass group relative flex h-full flex-col rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-coral/45 hover:shadow-glow">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-coral/30 bg-coral/10 text-coral">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  {s.badge && <span className="rounded-full border border-coral/40 bg-coral/10 px-2.5 py-0.5 text-[11px] text-coral">{s.badge}</span>}
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold text-navy-900">{s.title}</h3>
                <p className="font-sanskrit text-sm text-coral/70">{s.hindi}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-900/60">{s.desc}</p>
                <span className="mt-4 flex items-center gap-1.5 text-sm font-medium text-coral">
                  {s.needsBirth ? 'Check now' : 'Open'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {limit && (
          <div className="mt-10 text-center">
            <Link href={href('/astrology')} className="inline-flex items-center gap-2 rounded-full border border-coral/50 px-7 py-3 text-sm font-medium text-coral transition hover:bg-coral/10">
              View all {astroServices.length} astrology services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
