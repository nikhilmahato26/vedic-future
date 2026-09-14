import useAstro from '../../../hooks/useAstro';
import { birthParams, formatDate, formatDegree, todayIso, toApiDate } from '../../../lib/astro';
import { Async, Badge, Bar, DataTable, Panel, PanelTitle, Prose, Stat } from '../ui';
import { Sun, Moon, Stars, CalendarDays, Activity, Calculator, Hash, Orbit, Globe, Compass, ScrollText } from '../../../utils/icons';

/* Predictions -------------------------------------------------------- */

function PredictionCard({ icon, title, state, meta }) {
  return (
    <Panel>
      <PanelTitle icon={icon} title={title} subtitle={state.data && meta?.(state.data)} />
      <Async state={state}>{(d) => <Prose>{d.prediction}</Prose>}</Async>
    </Panel>
  );
}

export function PredictionsTab({ birth }) {
  const params = birthParams(birth);
  const year = new Date().getFullYear();
  const dated = { ...params, date: toApiDate(todayIso()) };

  const ascendant = useAstro('horoscope/ascendant-report', params);
  const moonSign = useAstro('extended-horoscope/find-moon-sign', params);
  const dailyMoon = useAstro('predictions/daily-moon', dated);
  const dailySun = useAstro('predictions/daily-sun', dated);
  const dailyNak = useAstro('predictions/daily-nakshatra', dated);
  const weeklyMoon = useAstro('predictions/weekly-moon', dated);
  const weeklySun = useAstro('predictions/weekly-sun', dated);
  const yearly = useAstro('predictions/yearly', { ...params, year });
  const varsha = useAstro('extended-horoscope/varshapal-details', { ...params, year }, { localized: false });
  const bio = useAstro('predictions/biorhythm', dated, { localized: false });

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <PredictionCard icon={Moon} title="Today · Moon sign" state={dailyMoon} meta={(d) => `${d.moon_sign} · Moon transiting your ${d.transit_house}th house`} />
        <PredictionCard icon={Sun} title="Today · Sun sign" state={dailySun} meta={(d) => `${d.sun_sign} · transit house ${d.transit_house}`} />
        <PredictionCard icon={Stars} title="Today · Nakshatra" state={dailyNak} meta={(d) => `${d.nakshatra} · Moon in ${d.transit_moon_nakshatra}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PredictionCard icon={CalendarDays} title="This week · Moon sign" state={weeklyMoon} meta={(d) => d.moon_sign} />
        <PredictionCard icon={CalendarDays} title="This week · Sun sign" state={weeklySun} meta={(d) => d.sun_sign} />
      </div>

      <Async state={yearly}>
        {(y) => (
          <Panel coral>
            <PanelTitle icon={ScrollText} title={`${y.year} yearly forecast`} subtitle={`${y.moon_sign} Moon · ${y.sun_sign} Sun`} />
            <Prose>{y.prediction}</Prose>
          </Panel>
        )}
      </Async>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelTitle icon={Compass} title="Ascendant report" subtitle={ascendant.data && `${ascendant.data.ascendant} · ${ascendant.data.element} · ${ascendant.data.modality}`} />
          <Async state={ascendant}>
            {(a) => (
              <>
                <Prose>{a.general_prediction}</Prose>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Stat label="Lagna lord" value={a.ascendant_lord} hint={`in ${a.ascendant_lord_location}, house ${a.ascendant_lord_house_location}`} />
                  <Stat label="Lagna nakshatra" value={a.nakshatra} hint={`Pada ${a.nakshatra_pada}`} />
                </div>
              </>
            )}
          </Async>
        </Panel>
        <Panel>
          <PanelTitle icon={Moon} title="Your Moon sign nature" subtitle={moonSign.data?.moon_sign} />
          <Async state={moonSign}>{(m) => <Prose>{m.prediction}</Prose>}</Async>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Panel>
          <PanelTitle icon={ScrollText} title={`Varshaphal ${year}`} subtitle="Tajik annual chart from your solar return" />
          <Async state={varsha}>
            {(v) => (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Stat accent label="Solar return" value={formatDate(v.solar_return_date)} />
                  <Stat accent label="Varshesh" value={v.varshesh} hint="Year lord" />
                  <Stat label="Muntha" value={v.muntha_sign} hint={`Lord ${v.muntha_lord}`} />
                  <Stat label="Year ascendant" value={v.solar_return_ascendant} />
                </div>
                <div className="mt-5 max-h-72 overflow-y-auto">
                  <DataTable
                    rowKey={(p) => p.planet}
                    rows={v.planets.slice(0, 10)}
                    columns={[
                      { key: 'planet', label: 'Planet', render: (p) => <span className="text-navy-900">{p.planet}</span> },
                      { key: 'zodiac', label: 'Sign' },
                      { key: 'house', label: 'House', className: 'tabular-nums' },
                      { key: 'degree', label: 'Degree', className: 'tabular-nums', render: (p) => formatDegree(p.degree) },
                    ]}
                  />
                </div>
              </>
            )}
          </Async>
        </Panel>
        <Panel>
          <PanelTitle icon={Activity} title="Today's biorhythm" subtitle={bio.data && `${bio.data.days_alive.toLocaleString()} days alive`} />
          <Async state={bio}>
            {(b) => (
              <div className="space-y-5">
                {['physical', 'emotional', 'intellectual'].map((k) => (
                  <div key={k}>
                    <Bar label={`${k[0].toUpperCase()}${k.slice(1)} · ${b[`${k}_status`]}`} value={Math.round(((b[k] + 1) / 2) * 100)} max={100} suffix="%" tone={b[k] > 0.2 ? 'good' : b[k] < -0.2 ? 'bad' : 'coral'} />
                  </div>
                ))}
                <p className="text-xs text-navy-900/45">50% is neutral. Cycles: physical 23 days, emotional 28, intellectual 33.</p>
              </div>
            )}
          </Async>
        </Panel>
      </div>
    </div>
  );
}

/* Numerology --------------------------------------------------------- */

export function NumerologyTab({ birth }) {
  const params = birthParams(birth);
  const table = useAstro('extended-horoscope/numero-table', params);
  const named = useAstro('predictions/numerology', birth.name ? { ...params, name: birth.name } : params);
  const day = useAstro('predictions/day-number', { ...params, date: toApiDate(todayIso()) });
  const radical = useAstro('utilities/radical-number-details', table.data ? { number: table.data.psychic_number } : null);

  return (
    <div className="space-y-6">
      <Async state={table}>
        {(t) => (
          <div className="grid grid-cols-3 gap-3">
            <NumberTile label="Moolank" sub="Psychic number" n={t.psychic_number} planet={t.psychic_ruling_planet} />
            <NumberTile label="Bhagyank" sub="Destiny number" n={t.destiny_number} planet={t.destiny_ruling_planet} />
            <NumberTile label="Karmic" sub="Karmic number" n={t.karmic_number} />
          </div>
        )}
      </Async>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelTitle icon={Hash} title="Vedic numerology" subtitle="From your date of birth" />
          <Async state={table}>
            {(t) => (
              <div className="space-y-4">
                <div><p className="text-xs uppercase tracking-[0.16em] text-coral/80">Moolank traits</p><Prose className="text-sm">{t.psychic_traits}</Prose></div>
                <div><p className="text-xs uppercase tracking-[0.16em] text-coral/80">Bhagyank traits</p><Prose className="text-sm">{t.destiny_traits}</Prose></div>
                <div className="grid grid-cols-2 gap-3">
                  <Stat label="Lucky numbers" value={t.lucky_numbers?.join(', ')} />
                  <Stat label="Compatible numbers" value={t.compatible_numbers?.join(', ')} />
                  <Stat label="Lucky colours" value={t.lucky_colors?.join(', ')} />
                  <Stat label="Lucky days" value={t.lucky_days?.join(', ')} />
                </div>
              </div>
            )}
          </Async>
        </Panel>

        <Panel>
          <PanelTitle icon={Calculator} title="Life path & name destiny" subtitle={birth.name ? `Name: ${birth.name}` : 'Add your name to include name numerology'} />
          <Async state={named}>
            {(n) => (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Stat accent label="Life path" value={n.life_path_number} />
                  <Stat accent label="Destiny" value={n.destiny_number} />
                </div>
                <Prose className="text-sm">{n.life_path_meaning}</Prose>
                <Prose className="text-sm">{n.destiny_meaning}</Prose>
                <div className="grid grid-cols-3 gap-3">
                  <Stat label="Lucky no." value={n.lucky_number} />
                  <Stat label="Colour" value={n.lucky_color} />
                  <Stat label="Day" value={n.lucky_day} />
                </div>
              </div>
            )}
          </Async>
        </Panel>

        <Panel>
          <PanelTitle icon={CalendarDays} title="Today's personal day number" />
          <Async state={day}>
            {(d) => (
              <div className="flex items-start gap-5">
                <span className="font-display text-6xl font-bold text-coral-gradient">{d.day_number}</span>
                <Prose className="text-sm">{d.meaning}</Prose>
              </div>
            )}
          </Async>
        </Panel>

        <Panel>
          <PanelTitle icon={Hash} title="Your Moolank in detail" subtitle={radical.data && `Number ${radical.data.number} · ${radical.data.planet}`} />
          <Async state={radical}>{(r) => <KeyValues data={r} omit={['number']} />}</Async>
        </Panel>
      </div>
    </div>
  );
}

function NumberTile({ label, sub, n, planet }) {
  return (
    <div className="rounded-2xl border border-coral/30 bg-coral/[0.06] p-4 text-center sm:p-6">
      <p className="font-display text-5xl font-bold text-coral-gradient sm:text-6xl">{n}</p>
      <p className="mt-1 font-display text-lg text-navy-900">{label}</p>
      <p className="text-xs text-navy-900/50">{sub}{planet ? ` · ${planet}` : ''}</p>
    </div>
  );
}

/** Generic renderer for flat reference objects whose fields vary. */
export function KeyValues({ data, omit = [] }) {
  const entries = Object.entries(data).filter(
    ([k, v]) => !omit.includes(k) && v !== null && v !== '' && (typeof v !== 'object' || Array.isArray(v)),
  );
  const label = (k) => k.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {entries.map(([k, v]) => (
        <div key={k} className={String(v).length > 60 ? 'sm:col-span-2' : ''}>
          <dt className="text-[11px] uppercase tracking-wider text-navy-900/45">{label(k)}</dt>
          <dd className="text-sm leading-relaxed text-navy-900/85">{Array.isArray(v) ? v.join(', ') : String(v)}</dd>
        </div>
      ))}
    </dl>
  );
}

/* Advanced: KP, Jaimini, Western, Chinese, Japanese ------------------ */

export function AdvancedTab({ birth }) {
  const params = birthParams(birth);
  const kpPlanets = useAstro('extended-horoscope/kp-planets', params, { localized: false });
  const kpHouses = useAstro('extended-horoscope/kp-houses', params, { localized: false });
  const karakas = useAstro('extended-horoscope/jaimini-karakas', params);
  const arudha = useAstro('extended-horoscope/arutha-padas', params);
  const friends = useAstro('extended-horoscope/friendship-table', params, { localized: false });
  const western = useAstro('horoscope/western-planets', params, { localized: false });
  const chinese = useAstro('chinese/natal-chart', { ...params, gender: birth.gender === 'female' ? 'female' : 'male' }, { localized: false });
  const nineStar = useAstro('japanese/nine-star-ki', params, { localized: false });

  return (
    <div className="space-y-6">
      <Panel>
        <PanelTitle icon={Orbit} title="KP (Krishnamurti Paddhati) planets" subtitle="Star lord and sub lord — the core of KP predictions" />
        <Async state={kpPlanets}>
          {(rows) => (
            <DataTable rowKey={(r) => r.planet} rows={rows} columns={[
              { key: 'planet', label: 'Planet', render: (r) => <span className="font-medium text-navy-900">{r.planet}{r.retro && <Badge tone="warn" className="ml-2">R</Badge>}</span> },
              { key: 'sign', label: 'Sign' },
              { key: 'local_degree', label: 'Degree', className: 'tabular-nums', render: (r) => formatDegree(r.local_degree) },
              { key: 'house', label: 'House', className: 'tabular-nums' },
              { key: 'sign_lord', label: 'Sign lord' },
              { key: 'nakshatra_lord', label: 'Star lord' },
              { key: 'sub_lord', label: 'Sub lord', render: (r) => <span className="text-coral">{r.sub_lord}</span> },
            ]} />
          )}
        </Async>
      </Panel>

      <Panel>
        <PanelTitle title="KP house cusps" subtitle="Placidus cusps with sign, star and sub lords" />
        <Async state={kpHouses}>
          {(rows) => (
            <DataTable rowKey={(r) => r.house} rows={rows} columns={[
              { key: 'house', label: 'Cusp', className: 'tabular-nums' },
              { key: 'sign', label: 'Sign' },
              { key: 'local_degree', label: 'Degree', className: 'tabular-nums', render: (r) => formatDegree(r.local_degree) },
              { key: 'sign_lord', label: 'Sign lord' },
              { key: 'nakshatra', label: 'Nakshatra' },
              { key: 'nakshatra_lord', label: 'Star lord' },
              { key: 'sub_lord', label: 'Sub lord', render: (r) => <span className="text-coral">{r.sub_lord}</span> },
            ]} />
          )}
        </Async>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelTitle icon={Stars} title="Jaimini Chara Karakas" subtitle="Significators ranked by degree" />
          <Async state={karakas}>
            {(k) => (
              <ul className="space-y-3">
                {k.karakas.map((c) => (
                  <li key={c.karaka} className="rounded-lg border border-navy-900/10 bg-navy-900/[0.03] px-4 py-3">
                    <p className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-display text-lg text-navy-900">{c.karaka}</span>
                      <span className="text-sm text-coral">{c.planet} · {c.zodiac} · H{c.house}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-navy-900/55">{c.meaning}</p>
                  </li>
                ))}
              </ul>
            )}
          </Async>
        </Panel>
        <Panel>
          <PanelTitle icon={Compass} title="Arudha Padas" subtitle="How the world perceives each area of life" />
          <Async state={arudha}>
            {(rows) => (
              <ul className="space-y-2">
                {rows.map((a) => (
                  <li key={a.pada} className="rounded-lg px-3 py-2 odd:bg-navy-900/[0.03]">
                    <p className="flex flex-wrap justify-between gap-2 text-sm">
                      <span className="text-navy-900">{a.pada}</span>
                      <span className="text-coral">{a.arudha_sign} <span className="text-navy-900/45">({a.arudha_lord})</span></span>
                    </p>
                    <p className="text-xs text-navy-900/50">{a.meaning}</p>
                  </li>
                ))}
              </ul>
            )}
          </Async>
        </Panel>
      </div>

      <Panel>
        <PanelTitle title="Planetary friendship (Panchadha Maitri)" subtitle="Compound relationship = natural + temporary" />
        <Async state={friends}>
          {(rows) => {
            const planets = rows.map((r) => r.planet);
            const tone = (rel = '') => (/great friend|adhi ?mitra/i.test(rel) ? 'text-emerald-300' : /friend|mitra/i.test(rel) ? 'text-emerald-200/80' : /great enemy|adhi ?shatru/i.test(rel) ? 'text-rose-300' : /enemy|shatru/i.test(rel) ? 'text-rose-200/80' : 'text-navy-900/60');
            return (
              <DataTable rowKey={(r) => r.planet} rows={rows} columns={[
                { key: 'planet', label: 'Planet', render: (r) => <span className="font-medium text-navy-900">{r.planet}</span> },
                ...planets.map((p) => ({
                  key: p, label: p.slice(0, 3), className: 'text-xs',
                  render: (r) => {
                    const rel = r.relationships.find((x) => x.planet === p);
                    return rel ? <span className={tone(rel.compound_relationship)}>{rel.compound_relationship.replace(/\s*\(.*\)/, '')}</span> : <span className="text-navy-900/20">—</span>;
                  },
                })),
              ]} />
            );
          }}
        </Async>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel>
          <PanelTitle icon={Globe} title="Western (tropical)" subtitle={western.data && `Ascendant ${western.data.ascendant}`} />
          <Async state={western}>
            {(w) => (
              <ul className="space-y-1.5 text-sm">
                {w.planets.slice(0, 10).map((p) => (
                  <li key={p.name} className="flex justify-between gap-2 border-b border-navy-900/5 pb-1.5">
                    <span className="text-navy-900/85">{p.name}{p.retro ? ' ℞' : ''}</span>
                    <span className="text-navy-900/60">{p.zodiac} {formatDegree(p.local_degree)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Async>
        </Panel>
        <Panel>
          <PanelTitle title="Chinese astrology" subtitle="Zi Wei Dou Shu natal chart" />
          <Async state={chinese}>
            {(c) => (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Stat accent label="Zodiac animal" value={cap(c.zodiac)} />
                  <Stat label="Five elements" value={cap(c.five_elements_class)} />
                  <Stat label="Soul star" value={cap(c.soul_star)} />
                  <Stat label="Body star" value={cap(c.body_star)} />
                </div>
                <p className="text-xs text-navy-900/50">Lunar date: {c.lunar_date}</p>
              </div>
            )}
          </Async>
        </Panel>
        <Panel>
          <PanelTitle title="Japanese Nine Star Ki" subtitle="Kyusei energy stars" />
          <Async state={nineStar}>
            {(n) => (
              <div className="space-y-3">
                {[['Principal star', n.principal_star], ['Monthly star', n.monthly_star], ['Tendency star', n.tendency_star]].map(([label, s]) => s && (
                  <div key={label} className="flex items-center justify-between gap-3 rounded-lg border border-navy-900/10 bg-navy-900/[0.03] px-4 py-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-navy-900/45">{label}</p>
                      <p className="text-navy-900">{cap(s.slug?.replace(/-/g, ' '))}</p>
                    </div>
                    <span className="font-sanskrit text-lg text-coral">{s.cjk}</span>
                  </div>
                ))}
              </div>
            )}
          </Async>
        </Panel>
      </div>
    </div>
  );
}

const cap = (s) => (s ? String(s).replace(/\b\w/g, (c) => c.toUpperCase()) : '—');
