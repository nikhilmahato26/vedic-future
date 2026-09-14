import { useState } from 'react';
import useAstro from '../../../hooks/useAstro';
import {
  birthParams, formatDate, formatDegree, isCurrentPeriod, DIVISIONAL_CHARTS, GRAHAS, GRAHA_HINDI,
} from '../../../lib/astro';
import ChartImage from '../ChartImage';
import { Async, Badge, DataTable, Panel, PanelTitle, Prose, Stat } from '../ui';
import { selectCls } from '../fields';
import { Grid3x3, Orbit, Hourglass, Stars, Sun, Moon, Sparkles } from '../../../utils/icons';

const planetList = (details) => Object.values(details || {});
const byCode = (details, code) => planetList(details).find((p) => p.name === code);

/* Overview ----------------------------------------------------------- */

export function OverviewTab({ birth }) {
  const params = birthParams(birth);
  const details = useAstro('horoscope/planet-details', params);
  const kundli = useAstro('extended-horoscope/extended-kundli-details', params);
  const dasha = useAstro('dashas/current-mahadasha-full', params, { localized: false });
  const traits = useAstro('horoscope/personal-characteristics', params);

  const moon = byCode(details.data, 'Mo');
  const lagna = byCode(details.data, 'As');
  const order = dasha.data?.order_of_dashas;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat accent label="Lagna (Ascendant)" value={kundli.data?.ascendant} hint={lagna ? `${formatDegree(lagna.local_degree)} · ${lagna.nakshatra}` : undefined} />
        <Stat accent label="Rashi (Moon sign)" value={kundli.data?.moon_sign} hint={moon ? `${formatDegree(moon.local_degree)}` : undefined} />
        <Stat accent label="Nakshatra" value={moon?.nakshatra} hint={moon ? `Pada ${moon.nakshatra_pada} · Lord ${moon.nakshatra_lord}` : undefined} />
        <Stat accent label="Sun sign" value={kundli.data?.sun_sign} hint={kundli.data ? `Lagna lord ${kundli.data.ascendant_lord}` : undefined} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelTitle icon={Grid3x3} title="Lagna Kundali" subtitle="D1 Rasi chart · North Indian" />
          <ChartImage birth={birth} div="D1" />
        </Panel>
        <Panel>
          <PanelTitle icon={Grid3x3} title="Navamsa Kundali" subtitle="D9 · marriage, dharma & inner strength" />
          <ChartImage birth={birth} div="D9" />
        </Panel>
      </div>

      <Panel>
        <PanelTitle icon={Hourglass} title="Running planetary period" subtitle="Vimshottari dasha active today" />
        <Async state={dasha}>
          {() => (
            <div className="grid gap-3 sm:grid-cols-3">
              {[['Mahadasha', order?.major], ['Antardasha', order?.minor], ['Pratyantar', order?.sub_minor]].map(([label, p]) => (
                <Stat key={label} label={label} value={p?.name} hint={p ? `${formatDate(p.start)} → ${formatDate(p.end)}` : undefined} />
              ))}
            </div>
          )}
        </Async>
      </Panel>

      <Async state={traits}>
        {(t) => (
          <Panel>
            <PanelTitle icon={Sparkles} title="Personal characteristics" subtitle={`${t.ascendant} ascendant · ${t.moon_sign} moon · ${t.sun_sign} sun`} />
            <div className="grid gap-5 md:grid-cols-2">
              <Trait label="Personality" text={t.personality} />
              <Trait label="Physical appearance" text={t.physical_appearance} />
              <Trait label="Career aptitude" text={t.career_aptitude} />
              <Trait label="Health watch-points" text={t.health_vulnerabilities} />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              <Stat label="Lucky numbers" value={t.lucky_numbers?.join(', ')} />
              <Stat label="Lucky colours" value={t.lucky_colors?.join(', ')} />
              <Stat label="Lucky days" value={t.lucky_days?.join(', ')} />
              <Stat label="Compatible signs" value={t.compatible_signs?.join(', ')} />
            </div>
          </Panel>
        )}
      </Async>
    </div>
  );
}

function Trait({ label, text }) {
  if (!text) return null;
  return (
    <div>
      <p className="mb-1 text-xs uppercase tracking-[0.16em] text-coral/80">{label}</p>
      <Prose className="text-sm">{text}</Prose>
    </div>
  );
}

/* Planets ------------------------------------------------------------ */

export function PlanetsTab({ birth }) {
  const params = birthParams(birth);
  const details = useAstro('horoscope/planet-details', params);
  const kundli = useAstro('extended-horoscope/extended-kundli-details', params);
  const aspects = useAstro('horoscope/planetary-aspects', params);
  const [showOuter, setShowOuter] = useState(false);

  const dignity = (name) => kundli.data?.planet_dignities?.find((d) => d.planet === name)?.dignity;

  return (
    <div className="space-y-6">
      <Panel>
        <PanelTitle
          icon={Orbit}
          title="Graha positions"
          subtitle="Sidereal longitudes · Lahiri ayanamsa"
          action={
            <label className="flex items-center gap-2 text-xs text-navy-900/60">
              <input type="checkbox" checked={showOuter} onChange={(e) => setShowOuter(e.target.checked)} className="accent-[#E67A5B]" />
              Show outer planets & points
            </label>
          }
        />
        <Async state={details}>
          {(data) => (
            <DataTable
              rowKey={(r) => r.name}
              rows={planetList(data).filter((p) => showOuter || GRAHAS.includes(p.name))}
              columns={[
                { key: 'full_name', label: 'Planet', render: (p) => (
                  <span className="font-medium text-navy-900">
                    {p.full_name}
                    {GRAHA_HINDI[p.full_name] && p.full_name !== GRAHA_HINDI[p.full_name] && <span className="ml-1.5 text-xs text-navy-900/40">{GRAHA_HINDI[p.full_name]}</span>}
                  </span>
                ) },
                { key: 'zodiac', label: 'Sign' },
                { key: 'deg', label: 'Degree', className: 'tabular-nums', render: (p) => formatDegree(p.local_degree) },
                { key: 'house', label: 'House', className: 'tabular-nums' },
                { key: 'nakshatra', label: 'Nakshatra', render: (p) => `${p.nakshatra} (${p.nakshatra_pada})` },
                { key: 'nakshatra_lord', label: 'Nak. lord' },
                { key: 'status', label: 'Status', render: (p) => (
                  <span className="flex flex-wrap gap-1">
                    {p.retro && <Badge tone="warn">Retro</Badge>}
                    {dignity(p.full_name) && dignity(p.full_name) !== 'Normal' && (
                      <Badge tone={/exalt|own|moola/i.test(dignity(p.full_name)) ? 'good' : 'bad'}>{dignity(p.full_name)}</Badge>
                    )}
                  </span>
                ) },
              ]}
            />
          )}
        </Async>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelTitle icon={Stars} title="House lords" subtitle="Who rules each of the 12 bhavas" />
          <Async state={kundli}>
            {(k) => (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {k.house_lords?.map((h) => (
                  <div key={h.house} className="rounded-lg border border-navy-900/10 bg-navy-900/[0.03] px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wider text-navy-900/45">House {h.house}</p>
                    <p className="text-sm text-navy-900">{h.sign} · <span className="text-coral">{h.lord}</span></p>
                  </div>
                ))}
              </div>
            )}
          </Async>
        </Panel>

        <Panel>
          <PanelTitle icon={Sun} title="Planetary aspects" subtitle="Drishti cast on houses & planets" />
          <Async state={aspects}>
            {(list) => (
              <ul className="max-h-[420px] space-y-1.5 overflow-y-auto pr-1 text-sm">
                {list.map((a, i) => (
                  <li key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-lg px-3 py-2 odd:bg-navy-900/[0.03]">
                    <span className="text-navy-900/85">
                      <span className="text-coral">{a.aspecting_planet}</span> → House {a.aspected_house}
                      {a.aspected_planets?.length > 0 && <span className="text-navy-900/55"> ({a.aspected_planets.join(', ')})</span>}
                    </span>
                    <span className="text-xs text-navy-900/45">{a.aspect_type}</span>
                  </li>
                ))}
              </ul>
            )}
          </Async>
        </Panel>
      </div>
    </div>
  );
}

/* Divisional charts -------------------------------------------------- */

export function ChartsTab({ birth }) {
  const [div, setDiv] = useState('D1');
  const [style, setStyle] = useState('north');
  const chart = DIVISIONAL_CHARTS.find((c) => c.div === div);

  return (
    <Panel>
      <PanelTitle icon={Grid3x3} title="Divisional charts (Varga)" subtitle="16 Shodashvarga charts, each zooming into one area of life" />
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-full border border-coral/20 bg-navy-950/60 p-1 text-sm">
            {['north', 'south'].map((s) => (
              <button key={s} onClick={() => setStyle(s)} aria-pressed={style === s}
                className={`rounded-full py-2 font-medium capitalize transition ${style === s ? 'bg-coral text-navy-950' : 'text-cream-100/75 hover:text-coral'}`}>
                {s} Indian
              </button>
            ))}
          </div>
          <select aria-label="Divisional chart" value={div} onChange={(e) => setDiv(e.target.value)} className={`${selectCls} lg:hidden`}>
            {DIVISIONAL_CHARTS.map((c) => <option key={c.div} value={c.div}>{c.div} {c.name} — {c.topic}</option>)}
          </select>
          <ul className="hidden max-h-[460px] space-y-1 overflow-y-auto pr-1 lg:block">
            {DIVISIONAL_CHARTS.map((c) => (
              <li key={c.div}>
                <button onClick={() => setDiv(c.div)} aria-pressed={div === c.div}
                  className={`flex w-full items-baseline justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${div === c.div ? 'bg-coral/15 text-coral' : 'text-navy-900/70 hover:bg-navy-900/5'}`}>
                  <span><span className="font-semibold">{c.div}</span> {c.name}</span>
                  <span className="text-[11px] text-navy-900/45">{c.topic}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <ChartImage birth={birth} div={div} style={style} title={`${chart.div} ${chart.name} — ${chart.topic}`} />
      </div>
    </Panel>
  );
}

/* Dasha -------------------------------------------------------------- */

export function DashaTab({ birth }) {
  const params = birthParams(birth);
  const full = useAstro('dashas/current-mahadasha-full', params, { localized: false });
  const predictions = useAstro('dashas/mahadasha-predictions', params);
  const yogini = useAstro('dashas/yogini-dasha-sub', params, { localized: false });
  const yoginiMain = useAstro('dashas/yogini-dasha-main', params, { localized: false });
  const chara = useAstro('dashas/char-dasha-current', params, { localized: false });

  const periodColumns = [
    { key: 'name', label: 'Planet', render: (p) => <span className="font-medium text-navy-900">{p.name}</span> },
    { key: 'start', label: 'From', render: (p) => formatDate(p.start) },
    { key: 'end', label: 'Until', render: (p) => formatDate(p.end) },
    { key: 'now', label: '', render: (p) => isCurrentPeriod(p.start, p.end) && <Badge tone="coral">Running</Badge> },
  ];

  return (
    <div className="space-y-6">
      <Async state={predictions}>
        {(p) => (
          <Panel coral>
            <PanelTitle icon={Hourglass} title={`${p.mahadasha} Mahadasha`} subtitle={`${formatDate(p.mahadasha_start)} → ${formatDate(p.mahadasha_end)}`} />
            <Prose>{p.prediction}</Prose>
          </Panel>
        )}
      </Async>

      <Async state={full}>
        {(d) => (
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel>
              <PanelTitle title="Vimshottari Mahadasha" subtitle="120-year cycle of the nine planets" />
              <DataTable rows={d.mahadasha} columns={periodColumns} highlight={(p) => isCurrentPeriod(p.start, p.end)} />
            </Panel>
            <Panel>
              <PanelTitle title={`Antardashas in ${d.order_of_dashas?.major?.name}`} subtitle="Sub-periods of the running Mahadasha" />
              <DataTable rows={d.antardasha} columns={periodColumns} highlight={(p) => isCurrentPeriod(p.start, p.end)} />
            </Panel>
            <Panel className="lg:col-span-2">
              <PanelTitle title={`Pratyantar dashas in ${d.order_of_dashas?.minor?.name}`} subtitle="Finer timing within the running Antardasha" />
              <DataTable rows={d.paryantardasha} columns={periodColumns} highlight={(p) => isCurrentPeriod(p.start, p.end)} />
            </Panel>
          </div>
        )}
      </Async>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelTitle icon={Moon} title="Yogini Dasha" subtitle="36-year cycle of eight Yoginis" />
          <Async state={yoginiMain}>
            {(m) => <Stat accent label="Running Yogini" value={m.main_dasha} hint={`${formatDate(m.main_dasha_start)} → ${formatDate(m.main_dasha_end)}`} />}
          </Async>
          <div className="mt-4">
            <Async state={yogini}>
              {(y) => <DataTable rows={y.sub_dasha} columns={periodColumns.map((c) => (c.key === 'name' ? { ...c, label: 'Yogini' } : c))} highlight={(p) => isCurrentPeriod(p.start, p.end)} />}
            </Async>
          </div>
        </Panel>
        <Panel>
          <PanelTitle icon={Stars} title="Chara Dasha (Jaimini)" subtitle="Sign-based dasha system" />
          <Async state={chara}>
            {(c) => (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Stat accent label="Running sign" value={c.main_dasha} />
                  <Stat label="Sign lord" value={c.main_dasha_lord} />
                </div>
                <p className="mb-2 mt-5 text-xs uppercase tracking-[0.16em] text-navy-900/50">Upcoming sub-periods</p>
                <div className="flex flex-wrap gap-2">
                  {c.sub_dasha_list?.map((s, i) => <Badge key={i} tone={i === 0 ? 'coral' : 'muted'}>{s}</Badge>)}
                </div>
              </>
            )}
          </Async>
        </Panel>
      </div>
    </div>
  );
}
