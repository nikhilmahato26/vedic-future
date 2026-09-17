"use client";
import CheckoutModal from '../components/ui/CheckoutModal';
import { useEffect, useState } from 'react';
import PageHeader from '../components/astro/PageHeader';
import { Field, PlaceSearch, inputCls } from '../components/astro/fields';
import { astro, DEFAULT_PLACE, formatDate, formatUnixTime, locationParams, todayIso, toApiDate } from '../lib/astro';
import { useAstroLang } from '../context/AstroLang';
import { Badge, ConsultCTA, ErrorNote, List, Loading, Panel, PanelTitle, Prose, Stat } from '../components/astro/ui';
import { Heart, Plane, Home, Car, Store, CalendarCheck, Search, CheckCircle2 } from '../utils/icons';

const EVENTS = [
  { id: 'marriage', label: 'Marriage', hindi: 'Vivah', icon: Heart },
  { id: 'griha-pravesh', label: 'Griha Pravesh', hindi: 'House warming', icon: Home },
  { id: 'business', label: 'Business start', hindi: 'Vyapar', icon: Store },
  { id: 'vehicle', label: 'Vehicle purchase', hindi: 'Vahan', icon: Car },
  { id: 'travel', label: 'Travel', hindi: 'Yatra', icon: Plane },
];

const SCAN_OPTIONS = [7, 15, 30];

const addDays = (iso, n) => {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const scoreValue = (score = '0/1') => {
  const [a, b] = String(score).split('/').map(Number);
  return b ? a / b : 0;
};

export default function MuhurtaPage({ service }) {
  const [pendingAuth, setPendingAuth] = useState(null);
  const { lang } = useAstroLang();
  const [event, setEvent] = useState('marriage');
  const [place, setPlace] = useState(DEFAULT_PLACE);
  const [from, setFrom] = useState(todayIso());
  const [days, setDays] = useState(15);
  const [scan, setScan] = useState(null); // { loading, results, error }

  useEffect(() => {
    document.title = 'Shubh Muhurat Finder · Vedic Future';
  }, []);

  const run = async () => {
    setScan({ loading: true, results: [] });
    const dates = Array.from({ length: days }, (_, i) => addDays(from, i));
    try {
      // Each date is one cached call; batches of 5 keep us far below the rate limit.
      const results = [];
      for (let i = 0; i < dates.length; i += 5) {
        const batch = await Promise.all(dates.slice(i, i + 5).map((d) =>
          astro(`muhurta/${event}`, { ...locationParams(place), date: toApiDate(d, '-'), ...(lang !== 'en' && { lang }) })
            .then((r) => ({ iso: d, ...r }))
            .catch((error) => ({ iso: d, error })),
        ));
        results.push(...batch);
        setScan({ loading: i + 5 < dates.length, results: [...results] });
      }
    } catch (error) {
      setScan({ loading: false, results: [], error });
    }
  };

  const active = EVENTS.find((e) => e.id === event);
  const results = scan?.results || [];
  const suitable = results.filter((r) => r.suitable);
  const firstError = results.find((r) => r.error)?.error;
  const best = results.filter((r) => !r.error).sort((a, b) => scoreValue(b.score) - scoreValue(a.score))[0];

  return (
    <>
      <PageHeader
        eyebrow="Muhurta"
        title={<>Shubh <span className="text-coral-gradient">Muhurat</span> Finder</>}
        subtitle="Scan the coming days for auspicious dates to marry, move home, start a business, buy a vehicle or travel — checked against Tithi, Nakshatra, Yoga and Vara."
      />
      <section className="container-luxe relative z-10 pb-24">
        <Panel coral className="mb-6">
          <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {EVENTS.map((e) => (
              <button key={e.id} onClick={() => setEvent(e.id)} aria-pressed={event === e.id}
                className={`rounded-xl border px-3 py-4 text-center transition ${event === e.id ? 'border-coral/60 bg-coral/15' : 'border-navy-900/10 hover:border-coral/40'}`}>
                <e.icon className={`mx-auto h-6 w-6 ${event === e.id ? 'text-coral' : 'text-navy-900/60'}`} />
                <span className="mt-2 block text-sm font-medium text-navy-900">{e.label}</span>
                <span className="block text-xs text-navy-900/45">{e.hindi}</span>
              </button>
            ))}
          </div>
          <div className="grid items-end gap-4 md:grid-cols-[1.4fr_1fr_1fr_auto]">
            <Field label="Location"><PlaceSearch value={place} onChange={(p) => p && setPlace(p)} /></Field>
            <Field label="Starting from"><input type="date" min={todayIso()} className={inputCls} value={from} onChange={(e) => e.target.value && setFrom(e.target.value)} /></Field>
            <Field label="Scan">
              <div className="grid grid-cols-3 gap-1 rounded-xl border border-navy-900/20 p-1">
                {SCAN_OPTIONS.map((n) => (
                  <button key={n} onClick={() => setDays(n)} aria-pressed={days === n} className={`rounded-lg py-2 text-sm ${days === n ? 'bg-coral text-navy-950' : 'text-navy-900/65 hover:text-coral'}`}>{n} days</button>
                ))}
              </div>
            </Field>
            <button onClick={run} disabled={scan?.loading} className="inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-coral-gradient px-7 font-medium text-navy-950 shadow-glow hover:brightness-110 disabled:opacity-60 md:mb-0">
              <Search className="h-4 w-4" /> Find dates
            </button>
          </div>
        </Panel>

        {scan && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat accent label="Days checked" value={`${results.length} / ${days}`} />
              <Stat accent label={`Suitable for ${active.label.toLowerCase()}`} value={suitable.length} />
              <Stat label="Best-scoring date" value={best ? formatDate(best.date) : '—'} hint={best?.score} />
            </div>

            {scan.loading && <Loading label={`Checking ${days} days…`} />}
            {(scan.error || (firstError && !results.some((r) => !r.error))) && <ErrorNote error={scan.error || firstError} />}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {results.filter((r) => !r.error).map((r) => (
                <Panel key={r.iso} className={r.suitable ? '!border-emerald-400/40' : ''}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display text-2xl font-semibold text-navy-900">{formatDate(r.date)}</p>
                      <p className="text-sm text-navy-900/55">{r.vara} · {r.paksha}</p>
                    </div>
                    <Badge tone={r.suitable ? 'good' : scoreValue(r.score) >= 0.5 ? 'warn' : 'bad'}>
                      {r.suitable && <CheckCircle2 className="h-3 w-3" />} {r.suitable ? 'Shubh' : 'Avoid'} · {r.score}
                    </Badge>
                  </div>
                  <p className="mt-3 text-xs text-navy-900/55">{r.tithi} · {r.nakshatra} · {r.yoga}</p>
                  <p className="mt-1 text-xs text-navy-900/45">Sunrise {formatUnixTime(r.sunrise?.unix, place.tz)} · Sunset {formatUnixTime(r.sunset?.unix, place.tz)}</p>
                  <div className="mt-4"><List items={r.factors} tone={r.suitable ? 'good' : 'coral'} /></div>
                  {r.recommendation && <Prose className="mt-3 text-xs text-navy-900/55">{r.recommendation}</Prose>}
                </Panel>
              ))}
            </div>

            {!scan.loading && (
              <ConsultCTA
                title={`Fix the exact ${active.label.toLowerCase()} muhurat with our Acharya`}
                text="Date suitability is the first filter. The final muhurat also matches your and your family's Kundalis to an exact auspicious time window."
                message={`Namaste Acharya ji 🙏 I need a ${active.label} muhurat around ${formatDate(from)} in ${place.label}. ${suitable.length ? `The website suggested: ${suitable.slice(0, 3).map((s) => formatDate(s.date)).join(', ')}.` : ''}`}
              />
            )}
          </div>
        )}

        {!scan && (
          <Panel className="text-center">
            <CalendarCheck className="mx-auto h-10 w-10 text-coral/60" />
            <p className="mt-3 text-navy-900/60">Choose an occasion and press <span className="text-coral">Find dates</span> to scan the calendar.</p>
          </Panel>
        )}
      
        {service && (
          <CheckoutModal
            isOpen={!!pendingAuth}
            onClose={() => setPendingAuth(null)}
            service={service}
            isUnlockMode={true}
            onSuccess={() => {
              setPendingAuth(null);
              // Handle specific success logic if needed
            }}
          />
        )}
      </section>
    </>
  );
}
