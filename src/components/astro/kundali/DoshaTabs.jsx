import Link from 'next/link';
import { useAstroHref } from '../../../context/AstroBase';
import useAstro from '../../../hooks/useAstro';
import { birthParams, birthToSearch, formatDate } from '../../../lib/astro';
import { Async, Badge, Bar, ConsultCTA, DataTable, List, Panel, PanelTitle, Prose, Stat } from '../ui';
import { Flame, ShieldCheck, Gem, Leaf, Crown, Activity, Grid3x3, AlertTriangle, Coins, ArrowRight } from '../../../utils/icons';

/* Dosha -------------------------------------------------------------- */

function DoshaCard({ title, subtitle, state, present, score, children }) {
  return (
    <Panel>
      <PanelTitle
        icon={Flame}
        title={title}
        subtitle={subtitle}
        action={state.data && (present(state.data)
          ? <Badge tone="bad"><AlertTriangle className="h-3 w-3" /> Present{score ? ` · ${score(state.data)}` : ''}</Badge>
          : <Badge tone="good"><ShieldCheck className="h-3 w-3" /> Not present</Badge>)}
      />
      <Async state={state}>{children}</Async>
    </Panel>
  );
}

export function DoshaTab({ birth }) {
  const params = birthParams(birth);
  const mangal = useAstro('dosha/mangal-dosh', params);
  const kaalsarp = useAstro('dosha/kaalsarp-dosh', params);
  const pitra = useAstro('dosha/pitra-dosh', params);
  const sadeSati = useAstro('extended-horoscope/current-sade-sati', params);
  const sadeTable = useAstro('extended-horoscope/sade-sati-table', params);
  const papa = useAstro('dosha/papasamaya', params, { localized: false });

  const summary = [mangal, kaalsarp, pitra].filter((q) => q.data?.is_dosha_present).length + (sadeSati.data?.is_sade_sati ? 1 : 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat accent label="Mangal Dosha" value={mangal.data ? (mangal.data.is_dosha_present ? `${mangal.data.score}%` : 'No') : '…'} />
        <Stat accent label="Kaal Sarp" value={kaalsarp.data ? (kaalsarp.data.is_dosha_present ? 'Yes' : 'No') : '…'} />
        <Stat accent label="Pitra Dosha" value={pitra.data ? (pitra.data.is_dosha_present ? 'Yes' : 'No') : '…'} />
        <Stat accent label="Sade Sati" value={sadeSati.data ? (sadeSati.data.is_sade_sati ? sadeSati.data.phase : 'No') : '…'} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DoshaCard title="Mangal (Manglik) Dosha" subtitle="Mars in 1, 2, 4, 7, 8 or 12 from Lagna / Moon" state={mangal} present={(d) => d.is_dosha_present} score={(d) => `${d.score}%`}>
          {(d) => (
            <div className="space-y-4">
              <Prose className="text-sm">{d.bot_response}</Prose>
              {d.is_dosha_present && <p className="text-xs text-navy-900/50">Formed from: {d.mangal_dosh_from}</p>}
              <List items={d.factors} tone={d.is_dosha_present ? 'bad' : 'good'} />
              {d.cancellation?.cancellationReason?.length > 0 && (
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.16em] text-emerald-300/80">Cancellation factors</p>
                  <List items={d.cancellation.cancellationReason} tone="good" />
                </div>
              )}
            </div>
          )}
        </DoshaCard>

        <DoshaCard title="Kaal Sarp Dosha" subtitle="All planets hemmed between Rahu and Ketu" state={kaalsarp} present={(d) => d.is_dosha_present}>
          {(d) => <Prose className="text-sm">{d.bot_response}</Prose>}
        </DoshaCard>

        <DoshaCard title="Pitra Dosha" subtitle="Ancestral karmic afflictions" state={pitra} present={(d) => d.is_dosha_present}>
          {(d) => (
            <div className="space-y-4">
              <Prose className="text-sm">{d.bot_response}</Prose>
              <List items={d.factors} tone="bad" />
            </div>
          )}
        </DoshaCard>

        <DoshaCard title="Shani Sade Sati" subtitle="Saturn's 7½-year transit over the Moon" state={sadeSati} present={(d) => d.is_sade_sati || d.is_panoti}>
          {(d) => (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Moon sign" value={d.moon_sign} />
                <Stat label="Saturn now in" value={d.saturn_current_sign} />
              </div>
              <Prose className="text-sm">{d.description}</Prose>
              {d.remedies?.length > 0 && (
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.16em] text-coral/80">Remedies</p>
                  <List items={d.remedies} />
                </div>
              )}
            </div>
          )}
        </DoshaCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel>
          <PanelTitle title="Sade Sati timeline" subtitle="Every Saturn transit over your Moon, past and future" />
          <Async state={sadeTable}>
            {(t) => (
              <div className="max-h-[420px] overflow-y-auto">
                <DataTable
                  rows={t.periods}
                  highlight={(p) => new Date(p.start_date) <= new Date() && new Date() < new Date(p.end_date)}
                  columns={[
                    { key: 'phase', label: 'Phase', render: (p) => <Badge tone={p.phase === 'Peak' ? 'bad' : 'muted'}>{p.phase}</Badge> },
                    { key: 'saturn_sign', label: 'Saturn in' },
                    { key: 'start_date', label: 'From', render: (p) => formatDate(p.start_date) },
                    { key: 'end_date', label: 'Until', render: (p) => formatDate(p.end_date) },
                    { key: 'years', label: 'Years', className: 'tabular-nums' },
                  ]}
                />
              </div>
            )}
          </Async>
        </Panel>
        <Panel>
          <PanelTitle title="Papasamaya" subtitle="Malefic weight used in South Indian matching" />
          <Async state={papa}>
            {(p) => (
              <div className="space-y-3">
                {Object.entries(p).map(([k, v]) => (
                  <Bar key={k} label={k.replace('_papa', '').replace(/^\w/, (c) => c.toUpperCase())} value={v} max={40} tone="bad" />
                ))}
                <p className="pt-2 text-sm text-navy-900/60">
                  Total: <span className="font-semibold text-navy-900">{Object.values(p).reduce((a, b) => a + b, 0)}</span>
                </p>
              </div>
            )}
          </Async>
        </Panel>
      </div>

      {summary > 0 && (
        <ConsultCTA
          title={`${summary} dosha${summary > 1 ? 's' : ''} found in this chart`}
          text="Most doshas are softened by other placements. Our Acharya can confirm cancellations and recommend the right pooja or remedy."
          message={`Namaste 🙏 My kundali (${birth.name || 'DOB ' + birth.date}) shows doshas. I'd like guidance on remedies and pooja.`}
        />
      )}
    </div>
  );
}

/* Remedies ----------------------------------------------------------- */

function GemCard({ label, gem, tone }) {
  if (!gem) return null;
  return (
    <div className={`rounded-xl border p-5 ${tone === 'primary' ? 'border-coral/40 bg-coral/[0.07]' : 'border-navy-900/10 bg-navy-900/[0.03]'}`}>
      <p className="text-xs uppercase tracking-[0.16em] text-coral/80">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-navy-900">{gem.gem}</p>
      <p className="text-sm text-navy-900/55">for {gem.planet} · substitute: {gem.substitute}</p>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {[['Weight', gem.weight], ['Finger', gem.finger], ['Day', gem.day], ['Metal', gem.metal]].map(([k, v]) => v && (
          <div key={k}><dt className="text-[11px] uppercase tracking-wider text-navy-900/40">{k}</dt><dd className="text-navy-900/85">{v}</dd></div>
        ))}
      </dl>
      {gem.benefit && <Prose className="mt-4 text-sm">{gem.benefit}</Prose>}
      {gem.purpose && <p className="mt-2 text-xs italic text-navy-900/50">{gem.purpose}</p>}
    </div>
  );
}

function RudrakshaCard({ label, bead, tone }) {
  if (!bead) return null;
  return (
    <div className={`rounded-xl border p-5 ${tone === 'primary' ? 'border-coral/40 bg-coral/[0.07]' : 'border-navy-900/10 bg-navy-900/[0.03]'}`}>
      <p className="text-xs uppercase tracking-[0.16em] text-coral/80">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-navy-900">{bead.mukhi} Mukhi</p>
      <p className="text-sm text-navy-900/55">Ruled by {bead.ruling_planet}</p>
      <Prose className="mt-3 text-sm">{bead.benefits}</Prose>
      {bead.mantra && <p className="mt-3 font-sanskrit text-coral">“{bead.mantra}”</p>}
      {bead.purpose && <p className="mt-2 text-xs italic text-navy-900/50">{bead.purpose}</p>}
    </div>
  );
}

export function RemediesTab({ birth }) {
  const params = birthParams(birth);
  const gems = useAstro('extended-horoscope/gem-suggestion', params);
  const rudraksha = useAstro('extended-horoscope/rudraksh-suggestion', params);

  return (
    <div className="space-y-6">
      <Panel>
        <PanelTitle icon={Gem} title="Gemstone (Ratna) recommendation" subtitle="Based on Lagna lord, 9th lord and running dasha" />
        <Async state={gems}>
          {(g) => (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <GemCard label="Primary gemstone" gem={g.primary_gem} tone="primary" />
                <GemCard label="Secondary gemstone" gem={g.secondary_gem} />
              </div>
              {g.caution && <p className="mt-4 flex gap-2 text-xs text-amber-200/80"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />{g.caution}</p>}
            </>
          )}
        </Async>
      </Panel>

      <Panel>
        <PanelTitle icon={Leaf} title="Rudraksha recommendation" subtitle="Based on ascendant and Moon sign" />
        <Async state={rudraksha}>
          {(r) => (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <RudrakshaCard label="Primary" bead={r.primary_rudraksha} tone="primary" />
                <RudrakshaCard label="Secondary" bead={r.secondary_rudraksha} />
                <RudrakshaCard label="Universal base" bead={r.base_rudraksha} />
              </div>
              {r.wearing_instructions && <Prose className="mt-4 text-sm">{r.wearing_instructions}</Prose>}
            </>
          )}
        </Async>
      </Panel>

      <ConsultCTA
        title="Get energised, certified gemstones & rudraksha"
        text="Wearing the wrong stone can do harm. Confirm your recommendation with our Acharya before you buy."
        message={`Namaste 🙏 I checked my gemstone & rudraksha recommendation on your website (DOB ${birth.date}). Please guide me on purchase and energisation.`}
      />
    </div>
  );
}

/* Yogas -------------------------------------------------------------- */

export function YogasTab({ birth }) {
  const href = useAstroHref();
  const yogas = useAstro('extended-horoscope/yoga-list', birthParams(birth));
  const tone = (s = '') => (/in-?auspicious|malefic|negative/i.test(s) ? 'bad' : /very/i.test(s) ? 'coral' : 'good');

  return (
    <Panel>
      <PanelTitle
        icon={Crown}
        title="Yogas in your chart"
        subtitle="Raja, Dhana, Pancha Mahapurusha and other classical combinations"
        action={
          <Link href={href(`/dhan-yoga?${new URLSearchParams(birthToSearch(birth))}`)} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-coral/40 px-3.5 py-1.5 text-xs font-medium text-coral transition hover:bg-coral/10">
            <Coins className="h-3.5 w-3.5" /> Just wealth yogas <ArrowRight className="h-3 w-3" />
          </Link>
        }
      />
      <Async state={yogas}>
        {(list) => list.length === 0 ? (
          <p className="text-sm text-navy-900/60">No major classical yogas detected.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {list.map((y) => (
              <div key={`${y.name}-${y.formed_by}`} className="rounded-xl border border-navy-900/10 bg-navy-900/[0.03] p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-display text-xl font-semibold text-navy-900">{y.name}</p>
                  <Badge tone={tone(y.strength)}>{y.strength}</Badge>
                </div>
                <Prose className="mt-2 text-sm">{y.description}</Prose>
                <p className="mt-3 text-xs text-coral/70">Formed by: {y.formed_by}</p>
              </div>
            ))}
          </div>
        )}
      </Async>
    </Panel>
  );
}

/* Strength: Ashtakvarga + Shadbala ----------------------------------- */

const SHADBALA_PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

export function StrengthTab({ birth }) {
  const params = birthParams(birth);
  const chart = useAstro('horoscope/ashtakvarga-chart-image', { ...params, format: 'utf8', theme: 'classic' }, { localized: false });
  const ashtak = useAstro('horoscope/ashtakvarga', params, { localized: false });
  const bala = useAstro('extended-horoscope/shad-bala', params, { localized: false });
  const binna = useAstro('horoscope/binnashtakvarga', params, { localized: false });

  return (
    <div className="space-y-6">
      <Panel>
        <PanelTitle icon={Grid3x3} title="Sarvashtakvarga" subtitle="Bindus per sign — above 28 is strong, below 25 needs care" />
        <Async state={ashtak}>
          {(a) => (
            <>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                {a.sarvashtakvarga.map((s) => (
                  <div key={s.sign} className={`rounded-xl border px-3 py-3 text-center ${s.bindus >= 28 ? 'border-emerald-400/30 bg-emerald-400/[0.06]' : s.bindus < 25 ? 'border-rose-400/30 bg-rose-400/[0.06]' : 'border-navy-900/10 bg-navy-900/[0.03]'}`}>
                    <p className="text-xs text-navy-900/55">{s.sign}</p>
                    <p className="font-display text-2xl font-bold text-navy-900">{s.bindus}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-navy-900/60">Total bindus: <span className="font-semibold text-coral">{a.total_bindus}</span> / 337</p>
            </>
          )}
        </Async>
        <Async state={chart} loadingLabel="Drawing Ashtakvarga chart…">
          {(c) => c.chart_image && (
            <div className="mt-6 overflow-hidden rounded-xl border border-coral/15">
              <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(c.chart_image)}`} alt="Sarvashtakvarga bindus bar chart" className="w-full" />
            </div>
          )}
        </Async>
      </Panel>

      <Panel>
        <PanelTitle title="Bhinnashtakvarga" subtitle="Each planet's own bindus across the 12 signs" />
        <Async state={binna}>
          {(rows) => (
            <DataTable
              rowKey={(r) => r.planet}
              rows={rows}
              columns={[
                { key: 'planet', label: 'Planet', render: (r) => <span className="font-medium text-navy-900">{r.planet}</span> },
                ...rows[0].table.map((cell, i) => ({
                  key: cell.sign, label: cell.sign.slice(0, 3), className: 'text-center tabular-nums',
                  render: (r) => <span className={r.table[i].bindu >= 5 ? 'text-emerald-300' : r.table[i].bindu <= 2 ? 'text-rose-300' : ''}>{r.table[i].bindu}</span>,
                })),
                { key: 'total_bindus', label: 'Total', className: 'text-center font-semibold text-coral tabular-nums' },
              ]}
            />
          )}
        </Async>
      </Panel>

      <Panel>
        <PanelTitle icon={Activity} title="Shadbala — six-fold planetary strength" subtitle="Ratio above 1.0 means the planet meets its required strength" />
        <Async state={bala}>
          {(b) => (
            <div className="grid gap-x-10 gap-y-4 md:grid-cols-2">
              {SHADBALA_PLANETS.map((p) => (
                <Bar key={p} label={`${p} · ${b.total_balas?.[p]} virupas`} value={b.ratio?.[p]} max={1.6} suffix="×" tone={b.ratio?.[p] >= 1 ? 'good' : 'bad'} />
              ))}
            </div>
          )}
        </Async>
      </Panel>
    </div>
  );
}
