import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/astro/PageHeader';
import useAstro from '../hooks/useAstro';
import { ZODIAC_SIGNS, formatDate, todayIso } from '../lib/astro';
import { Async, Badge, ConsultCTA, LangToggle, Panel, PanelTitle, Prose, Stat } from '../components/astro/ui';
import { Sun, CalendarDays, CalendarCheck } from '../utils/icons';

export default function HoroscopePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const signKey = ZODIAC_SIGNS.some((s) => s.key === searchParams.get('sign')) ? searchParams.get('sign') : 'aries';
  const sign = ZODIAC_SIGNS.find((s) => s.key === signKey);

  useEffect(() => {
    document.title = `${sign.name} (${sign.hindi}) Rashifal · Vedic Future`;
  }, [sign]);

  const daily = useAstro('horoscope-by-sign/daily', { sign: signKey });
  const weekly = useAstro('horoscope-by-sign/weekly', { sign: signKey });
  const monthly = useAstro('horoscope-by-sign/monthly', { sign: signKey });

  return (
    <>
      <PageHeader
        eyebrow="Rashifal"
        title={<>Daily <span className="text-coral-gradient">Rashifal</span></>}
        subtitle="Daily, weekly and monthly horoscope for all 12 rashis — in English and Hindi."
      />
      <section className="container-luxe relative z-10 pb-24">
        <div className="mb-6 flex justify-end"><LangToggle /></div>

        <div className="mb-8 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {ZODIAC_SIGNS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSearchParams({ sign: s.key }, { replace: true })}
              aria-pressed={s.key === signKey}
              className={`rounded-2xl border px-2 py-4 text-center transition ${s.key === signKey ? 'border-coral/60 bg-coral/15 shadow-glow' : 'border-navy-900/10 bg-navy-900/[0.03] hover:border-coral/40'}`}
            >
              <span className={`block text-3xl ${s.key === signKey ? 'text-coral' : 'text-navy-900/70'}`} aria-hidden="true">{s.symbol}</span>
              <span className="mt-1 block font-display text-lg font-semibold text-navy-900">{s.name}</span>
              <span className="block text-xs text-navy-900/50">{s.hindi}</span>
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <Panel coral>
            <PanelTitle icon={Sun} title={`${sign.name} today`} subtitle={`${formatDate(todayIso())} · ${sign.dates}`} />
            <Async state={daily}>
              {(d) => (
                <>
                  <Prose className="text-lg">{d.prediction}</Prose>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Stat accent label="Lucky colour" value={d.lucky_color} />
                    <Stat accent label="Lucky number" value={d.lucky_number} />
                    <Stat label="Element" value={d.element} />
                    <Stat label="Ruling planet" value={d.ruling_planet} />
                  </div>
                </>
              )}
            </Async>
          </Panel>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel>
              <PanelTitle icon={CalendarDays} title="This week" subtitle={weekly.data && `${formatDate(weekly.data.week_start)} – ${formatDate(weekly.data.week_end)}`} />
              <Async state={weekly}>
                {(w) => (
                  <>
                    <Prose>{w.prediction}</Prose>
                    {w.focus_areas?.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{w.focus_areas.map((f) => <Badge key={f} tone="coral">{f}</Badge>)}</div>}
                  </>
                )}
              </Async>
            </Panel>
            <Panel>
              <PanelTitle icon={CalendarCheck} title="This month" subtitle={monthly.data && `${monthly.data.month} ${monthly.data.year} · Theme: ${monthly.data.theme}`} />
              <Async state={monthly}>
                {(m) => (
                  <>
                    <Prose>{m.prediction}</Prose>
                    {m.best_dates?.length > 0 && (
                      <p className="mt-4 text-sm text-navy-900/60">Best dates: <span className="text-coral">{m.best_dates.join(', ')}</span></p>
                    )}
                  </>
                )}
              </Async>
            </Panel>
          </div>

          <ConsultCTA
            title="Sign horoscopes are general — your Kundali is personal"
            text="Get predictions based on your exact birth chart, running dasha and transits."
            message={`Namaste 🙏 I read the ${sign.name} rashifal on your website and would like a personal reading.`}
          />
        </div>
      </section>
    </>
  );
}
