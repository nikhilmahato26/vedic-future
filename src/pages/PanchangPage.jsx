import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/astro/PageHeader';
import { Field, PlaceSearch, inputCls } from '../components/astro/fields';
import useAstro from '../hooks/useAstro';
import {
  DEFAULT_PLACE, formatDate, formatRange, formatUnixTime, isNow, locationParams, todayIso, toApiDate,
} from '../lib/astro';
import { Async, Badge, DataTable, LangToggle, Panel, PanelTitle, Prose, Stat, Tabs } from '../components/astro/ui';
import {
  Sun, Moon, Sunrise, Sunset, MoonStar, Clock, CalendarDays, CalendarCheck, Sparkles, Orbit, ShieldCheck, AlertTriangle, ChevronLeft, ChevronRight,
} from '../utils/icons';

const TABS = [
  { id: 'today', label: 'Daily Panchang', icon: Sun },
  { id: 'muhurat', label: 'Choghadiya & Hora', icon: Clock },
  { id: 'calendar', label: 'Monthly Calendar', icon: CalendarDays },
  { id: 'auspicious', label: 'Auspicious Days', icon: CalendarCheck },
  { id: 'festivals', label: 'Festivals & Vrat', icon: Sparkles },
  { id: 'sky', label: 'Planets Today', icon: Orbit },
];

const label = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export default function PanchangPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [place, setPlace] = useState(DEFAULT_PLACE);
  const date = searchParams.get('date') || todayIso();
  const tab = TABS.some((t) => t.id === searchParams.get('tab')) ? searchParams.get('tab') : 'today';

  useEffect(() => {
    document.title = `Panchang ${formatDate(date)} · Vedic Future`;
  }, [date]);

  const update = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([k, v]) => next.set(k, v));
    setSearchParams(next, { replace: true });
  };

  const shiftDay = (days) => {
    const d = new Date(`${date}T12:00:00`);
    d.setDate(d.getDate() + days);
    update({ date: d.toISOString().slice(0, 10) });
  };

  return (
    <>
      <PageHeader
        eyebrow="Panchang"
        title={<>Today’s <span className="text-coral-gradient">Panchang</span></>}
        subtitle="Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, Abhijit Muhurat, Choghadiya and Hora — calculated for your exact city."
      />

      <section className="container-luxe relative z-10 pb-24">
        <Panel className="mb-6">
          <div className="grid items-end gap-4 md:grid-cols-[1.4fr_1fr_auto]">
            <Field label="Location">
              <PlaceSearch value={place} onChange={(p) => p && setPlace(p)} placeholder="Search your city…" />
            </Field>
            <Field label="Date">
              <div className="flex gap-2">
                <button onClick={() => shiftDay(-1)} aria-label="Previous day" className="rounded-xl border border-navy-900/20 px-3 text-navy-900/70 hover:border-coral/50 hover:text-coral"><ChevronLeft className="h-4 w-4" /></button>
                <input type="date" className={inputCls} value={date} onChange={(e) => e.target.value && update({ date: e.target.value })} />
                <button onClick={() => shiftDay(1)} aria-label="Next day" className="rounded-xl border border-navy-900/20 px-3 text-navy-900/70 hover:border-coral/50 hover:text-coral"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </Field>
            <div className="flex flex-wrap gap-2 md:mb-5">
              <button onClick={() => update({ date: todayIso() })} className="rounded-full border border-coral/40 px-4 py-2 text-sm text-coral hover:bg-coral/10">Today</button>
              <LangToggle />
            </div>
          </div>
        </Panel>

        <Tabs tabs={TABS} active={tab} onChange={(t) => update({ tab: t })} className="sticky top-[76px] z-20 mb-8" />

        {tab === 'today' && <DailyPanchang place={place} date={date} />}
        {tab === 'muhurat' && <Muhurat place={place} date={date} />}
        {tab === 'calendar' && <MonthCalendar place={place} date={date} onPick={(d) => update({ date: d, tab: 'today' })} />}
        {tab === 'auspicious' && <AuspiciousDays place={place} date={date} onPick={(d) => update({ date: d, tab: 'today' })} />}
        {tab === 'festivals' && <Festivals place={place} date={date} />}
        {tab === 'sky' && <SkyToday place={place} date={date} />}
      </section>
    </>
  );
}

/* Daily ------------------------------------------------------------- */

function Element({ title, item, extra }) {
  if (!item) return null;
  return (
    <div className="rounded-xl border border-navy-900/10 bg-navy-900/[0.03] p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-coral/80">{title}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-navy-900">{item.name}</p>
      {extra && <p className="text-sm text-navy-900/55">{extra}</p>}
      {item.next_name && <p className="mt-2 text-xs text-navy-900/45">then {item.next_name}</p>}
      {(item.meaning || item.special || item.summary) && <Prose className="mt-3 text-sm">{item.meaning || item.summary || item.special}</Prose>}
    </div>
  );
}

export function DailyPanchang({ place, date }) {
  const tz = place.tz;
  const q = useAstro('panchang/panchang', { ...locationParams(place), date: toApiDate(date) });

  return (
    <Async state={q} loadingLabel="Calculating Panchang…">
      {(p) => {
        const ends = (x) => (x?.ends_at ? `until ${formatUnixTime(x.ends_at.unix, tz)}` : '');
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Stat accent label="Vara" value={p.vara} hint={p.tithi?.paksha} />
              <Stat accent label="Vikram Samvat" value={p.vikram_samvat} hint={`${p.ritu} · ${p.ayana}`} />
              <Stat label="Sun sign" value={p.sun_sign} hint={`${p.sun_nakshatra} (${p.sun_nakshatra_pada})`} />
              <Stat label="Moon sign" value={p.moon_sign} hint={`Ayanamsha ${p.lahiri_ayanamsha?.toFixed?.(2)}°`} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Element title="Tithi" item={{ ...p.tithi, next_name: p.tithi?.next_tithi }} extra={`${p.tithi?.paksha} · ${ends(p.tithi)}`} />
              <Element title="Nakshatra" item={{ ...p.nakshatra, next_name: p.nakshatra?.next_nakshatra }} extra={`Lord ${p.nakshatra?.lord} · Pada ${p.nakshatra?.pada} · ${ends(p.nakshatra)}`} />
              <Element title="Yoga" item={{ ...p.yoga, next_name: p.yoga?.next_yoga }} extra={ends(p.yoga)} />
              <Element title="Karana" item={{ ...p.karana, next_name: p.karana?.next_karana }} extra={`${p.karana?.type} · ${ends(p.karana)}`} />
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Stat label={<span className="flex items-center gap-1"><Sunrise className="h-3 w-3" /> Sunrise</span>} value={formatUnixTime(p.sunrise?.unix, tz)} hint={`Day length ${p.dinamana?.replace(/ \d+ Sec.*/, '')}`} />
              <Stat label={<span className="flex items-center gap-1"><Sunset className="h-3 w-3" /> Sunset</span>} value={formatUnixTime(p.sunset?.unix, tz)} hint={`Madhyahna ${formatUnixTime(p.madhyahna?.unix, tz)}`} />
              <Stat label={<span className="flex items-center gap-1"><MoonStar className="h-3 w-3" /> Moonrise</span>} value={formatUnixTime(p.moonrise?.unix, tz)} />
              <Stat label={<span className="flex items-center gap-1"><Moon className="h-3 w-3" /> Moonset</span>} value={formatUnixTime(p.moonset?.unix, tz)} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <TimingList icon={ShieldCheck} title="Auspicious timings" tone="good" timings={p.auspicious_timings} tz={tz} />
              <TimingList icon={AlertTriangle} title="Inauspicious timings" tone="bad" timings={p.inauspicious_timings} tz={tz} />
            </div>

            {(p.special_yogas?.is_ganda_moola || p.special_yogas?.is_panchaka) && (
              <Panel>
                <div className="flex flex-wrap gap-2">
                  {p.special_yogas.is_ganda_moola && <Badge tone="warn">Ganda Moola Nakshatra today</Badge>}
                  {p.special_yogas.is_panchaka && <Badge tone="warn">Panchaka period</Badge>}
                </div>
              </Panel>
            )}
          </div>
        );
      }}
    </Async>
  );
}

function TimingList({ icon, title, timings, tz, tone }) {
  return (
    <Panel>
      <PanelTitle icon={icon} title={title} />
      <ul className="space-y-2">
        {Object.entries(timings || {}).map(([key, slot]) => (
          <li key={key} className={`flex flex-wrap items-center justify-between gap-2 rounded-lg px-3 py-2.5 ${isNow(slot) ? (tone === 'good' ? 'bg-emerald-400/10' : 'bg-rose-400/10') : 'odd:bg-navy-900/[0.03]'}`}>
            <span className="text-navy-900/85">{label(key)}{isNow(slot) && <Badge tone={tone} className="ml-2">Now</Badge>}</span>
            <span className="tabular-nums text-sm text-navy-900/65">{formatRange(slot, tz)}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* Choghadiya & Hora -------------------------------------------------- */

const chogTone = (type = '') => (/very|good|auspicious/i.test(type) && !/in/i.test(type) ? 'good' : /inauspicious|bad/i.test(type) ? 'bad' : 'muted');

function Muhurat({ place, date }) {
  const tz = place.tz;
  const params = { ...locationParams(place), date: toApiDate(date) };
  const chog = useAstro('panchang/choghadiya-muhurta', params);
  const hora = useAstro('panchang/hora-muhurta', params);

  const slotColumns = (nameKey) => [
    { key: nameKey, label: nameKey === 'hora' ? 'Hora lord' : 'Choghadiya', render: (s) => <span className="font-medium text-navy-900">{s[nameKey]}{isNow({ start_unix: s.start_unix, end_unix: s.end_unix }) && <Badge tone="coral" className="ml-2">Now</Badge>}</span> },
    { key: 'time', label: 'Time', className: 'tabular-nums', render: (s) => formatRange(s, tz) },
    { key: 'type', label: '', render: (s) => s.type ? <Badge tone={chogTone(s.type)}>{s.type}</Badge> : s.inauspicious ? <Badge tone="bad">Avoid</Badge> : null },
  ];
  const nowRow = (s) => isNow(s);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelTitle icon={Sun} title="Day Choghadiya" subtitle="Sunrise to sunset in 8 parts" />
          <Async state={chog}>{(c) => <DataTable rows={c.day_choghadiya} columns={slotColumns('name')} highlight={nowRow} />}</Async>
        </Panel>
        <Panel>
          <PanelTitle icon={Moon} title="Night Choghadiya" subtitle="Sunset to next sunrise" />
          <Async state={chog}>{(c) => <DataTable rows={c.night_choghadiya} columns={slotColumns('name')} highlight={nowRow} />}</Async>
        </Panel>
      </div>
      <Async state={hora}>
        {(h) => (
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel>
              <PanelTitle icon={Clock} title="Day Hora" subtitle={`Planetary hours · current hora: ${h.current_hora}`} />
              <DataTable rows={h.day_horas} columns={slotColumns('hora')} highlight={nowRow} />
            </Panel>
            <Panel>
              <PanelTitle icon={MoonStar} title="Night Hora" />
              <DataTable rows={h.night_horas} columns={slotColumns('hora')} highlight={nowRow} />
            </Panel>
          </div>
        )}
      </Async>
    </div>
  );
}

/* Monthly calendar -------------------------------------------------- */

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function MonthCalendar({ place, date, onPick }) {
  const [y, m] = date.split('-').map(Number);
  const [cursor, setCursor] = useState({ y, m });
  useEffect(() => setCursor({ y, m }), [y, m]);

  const q = useAstro('panchang/monthly-panchang', { ...locationParams(place), month: cursor.m, year: cursor.y });
  const firstWeekday = new Date(cursor.y, cursor.m - 1, 1).getDay();
  const monthName = new Date(cursor.y, cursor.m - 1, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  const move = (delta) => setCursor(({ y: yy, m: mm }) => {
    const d = new Date(yy, mm - 1 + delta, 1);
    return { y: d.getFullYear(), m: d.getMonth() + 1 };
  });
  const today = todayIso();

  return (
    <Panel>
      <PanelTitle
        icon={CalendarDays}
        title={monthName}
        subtitle="Tithi and Nakshatra at sunrise for each day"
        action={
          <div className="flex gap-2">
            <button onClick={() => move(-1)} aria-label="Previous month" className="rounded-full border border-navy-900/15 p-2 text-navy-900/70 hover:border-coral/50 hover:text-coral"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => move(1)} aria-label="Next month" className="rounded-full border border-navy-900/15 p-2 text-navy-900/70 hover:border-coral/50 hover:text-coral"><ChevronRight className="h-4 w-4" /></button>
          </div>
        }
      />
      <Async state={q} loadingLabel="Building the month…">
        {(month) => (
          <div className="overflow-x-auto">
            <div className="grid min-w-[700px] grid-cols-7 gap-1.5">
              {WEEKDAYS.map((d) => <p key={d} className="pb-1 text-center text-[11px] uppercase tracking-[0.16em] text-coral/70">{d}</p>)}
              {Array.from({ length: firstWeekday }).map((_, i) => <span key={`pad-${i}`} />)}
              {month.data.map((day) => {
                const [dd, mm, yyyy] = day.date.split('/');
                const iso = `${yyyy}-${mm}-${dd}`;
                const special = /purnima|amavasya|ekadashi/i.test(day.tithi?.name || '');
                return (
                  <button
                    key={day.date}
                    onClick={() => onPick(iso)}
                    className={`min-h-[96px] rounded-lg border p-2 text-left transition hover:border-coral/60 ${iso === today ? 'border-coral/60 bg-coral/10' : special ? 'border-coral/25 bg-coral/[0.04]' : 'border-navy-900/10 bg-navy-900/[0.03]'}`}
                  >
                    <span className={`block font-display text-xl font-bold ${iso === today ? 'text-coral' : 'text-navy-900'}`}>{Number(dd)}</span>
                    <span className={`block truncate text-[11px] ${special ? 'text-coral' : 'text-navy-900/70'}`}>{day.tithi?.name}</span>
                    <span className="block truncate text-[10px] text-navy-900/45">{day.tithi?.type === 'Shukla' ? 'Shukla' : 'Krishna'} · {day.nakshatra?.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Async>
    </Panel>
  );
}

/* Auspicious days --------------------------------------------------- */

function AuspiciousDays({ place, date, onPick }) {
  const [y, m] = date.split('-').map(Number);
  const q = useAstro('panchang/auspicious-yogas', { ...locationParams(place), month: m, year: y });

  return (
    <Panel>
      <PanelTitle icon={CalendarCheck} title={`Auspicious days · ${new Date(y, m - 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' })}`} subtitle="Sarvartha Siddhi, Amrit Siddhi, Ravi Pushya, Guru Pushya and other special yogas" />
      <Async state={q}>
        {(a) => (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {a.auspicious_days.map((d) => {
              const [dd, mm, yyyy] = d.date.split('/');
              return (
                <button key={d.date} onClick={() => onPick(`${yyyy}-${mm}-${dd}`)} className="rounded-xl border border-navy-900/10 bg-navy-900/[0.03] p-4 text-left transition hover:border-coral/50">
                  <p className="font-display text-xl font-semibold text-navy-900">{formatDate(d.date)} <span className="text-sm font-normal text-navy-900/50">{d.vara}</span></p>
                  <p className="mt-0.5 text-xs text-navy-900/50">{d.tithi} · {d.nakshatra} · {d.yoga}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">{d.yogas_present.map((y2) => <Badge key={y2} tone="coral">{y2}</Badge>)}</div>
                </button>
              );
            })}
          </div>
        )}
      </Async>
    </Panel>
  );
}

/* Festivals & vrat --------------------------------------------------- */

function DateList({ title, subtitle, state, listKey, renderMeta }) {
  const today = new Date(new Date().toDateString());
  const parse = (dmy) => { const [d, mo, yr] = dmy.split('/'); return new Date(`${yr}-${mo}-${d}T00:00:00`); };
  return (
    <Panel>
      <PanelTitle title={title} subtitle={subtitle} />
      <Async state={state} loadingLabel="Computing the year’s calendar — this one takes a little while…">
        {(data) => {
          const list = data[listKey] || [];
          const nextIndex = list.findIndex((x) => parse(x.date) >= today);
          return (
            <ul className="max-h-[520px] space-y-1.5 overflow-y-auto pr-1">
              {list.map((x, i) => (
                <li key={`${x.date}-${x.name}`} className={`rounded-lg px-3 py-2.5 ${i === nextIndex ? 'border border-coral/40 bg-coral/10' : parse(x.date) < today ? 'opacity-50' : 'odd:bg-navy-900/[0.03]'}`}>
                  <p className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-navy-900">{x.name}{i === nextIndex && <Badge tone="coral" className="ml-2">Next</Badge>}</span>
                    <span className="tabular-nums text-sm text-coral/90">{formatDate(x.date)}</span>
                  </p>
                  {renderMeta?.(x)}
                </li>
              ))}
            </ul>
          );
        }}
      </Async>
    </Panel>
  );
}

function Festivals({ place, date }) {
  const year = Number(date.slice(0, 4));
  const params = { ...locationParams(place), year };
  const festivals = useAstro('panchang/festivals', params);
  const ekadashi = useAstro('panchang/ekadashi', params);
  const amavasya = useAstro('panchang/amavasya-dates', params);
  const purnima = useAstro('panchang/purnima-dates', params);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DateList title={`Hindu festivals ${year}`} state={festivals} listKey="festivals" renderMeta={(x) => x.description && <p className="text-xs text-navy-900/50">{x.description}</p>} />
      <DateList title={`Ekadashi vrat ${year}`} subtitle="Dates for fasting" state={ekadashi} listKey="ekadashis" renderMeta={(x) => <p className="text-xs text-navy-900/50">{x.paksha} Paksha</p>} />
      <DateList title={`Purnima ${year}`} subtitle="Full moon days" state={purnima} listKey="purnimas" />
      <DateList title={`Amavasya ${year}`} subtitle="New moon days" state={amavasya} listKey="amavasyas" />
    </div>
  );
}

/* Sky today ---------------------------------------------------------- */

function SkyToday({ place, date }) {
  const params = { ...locationParams(place), date: toApiDate(date) };
  const transit = useAstro('panchang/transit', params);
  const retro = useAstro('panchang/retrogrades', params);
  const phase = useAstro('panchang/moon-phase', params);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelTitle icon={MoonStar} title="Moon phase" />
          <Async state={phase}>
            {(p) => (
              <div className="grid grid-cols-2 gap-3">
                <Stat accent label="Phase" value={p.moon_phase} />
                <Stat accent label="Tithi" value={p.tithi?.name} hint={p.tithi?.paksha} />
                <Stat label="Nakshatra" value={p.nakshatra?.name} hint={`Lord ${p.nakshatra?.lord}`} />
                <Stat label="Deity" value={p.tithi?.diety} />
              </div>
            )}
          </Async>
        </Panel>
        <Panel>
          <PanelTitle icon={Orbit} title="Retrograde planets" />
          <Async state={retro}>
            {(r) => (
              <>
                <div className="flex flex-wrap gap-2">
                  {r.retrograde_planets.length ? r.retrograde_planets.map((p) => <Badge key={p} tone="warn">{p} ℞</Badge>) : <Badge tone="good">No planets retrograde</Badge>}
                </div>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {r.planets.map((p) => (
                    <li key={p.planet} className="flex justify-between gap-2 border-b border-navy-900/5 pb-1.5">
                      <span className="text-navy-900/85">{p.planet}</span>
                      <span className={p.is_retrograde ? 'text-amber-200' : 'text-navy-900/55'}>{p.zodiac} · {p.is_retrograde ? 'Retrograde' : 'Direct'}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Async>
        </Panel>
      </div>
      <Panel>
        <PanelTitle icon={Sparkles} title="Planetary transits (Gochar)" subtitle={`Positions for ${formatDate(date)} with houses from the rising sign at this location`} />
        <Async state={transit}>
          {(t) => (
            <DataTable
              rowKey={(r) => r.planet}
              rows={t.transit.slice(0, 10)}
              columns={[
                { key: 'planet', label: 'Planet', render: (r) => <span className="font-medium text-navy-900">{r.planet}</span> },
                { key: 'zodiac', label: 'Sign' },
                { key: 'nakshatra', label: 'Nakshatra' },
                { key: 'house', label: 'House', className: 'tabular-nums' },
                { key: 'retro', label: '', render: (r) => r.retro && <Badge tone="warn">Retro</Badge> },
              ]}
            />
          )}
        </Async>
      </Panel>
    </div>
  );
}
