import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/astro/PageHeader';
import { BirthFields, birthIsComplete, emptyBirth } from '../components/astro/BirthForm';
import useAstro from '../hooks/useAstro';
import { astro, birthFromSearch, birthParams, birthToSearch, formatDate } from '../lib/astro';
import { useAstroLang } from '../context/AstroLang';
import {
  Async, Badge, Bar, ConsultCTA, ErrorNote, LangToggle, List, Loading, Panel, PanelTitle, Prose, ScoreRing, Stat,
} from '../components/astro/ui';
import { HeartHandshake, Heart, ShieldCheck, AlertTriangle, RotateCcw, Sparkles, Wand2, Loader2, Users } from '../utils/icons';

const verdictTone = (pct) => (pct >= 70 ? 'good' : pct >= 50 ? 'coral' : 'bad');

export default function MatchingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const boy = useMemo(() => birthFromSearch(searchParams, 'm'), [searchParams]);
  const girl = useMemo(() => birthFromSearch(searchParams, 'f'), [searchParams]);
  const system = searchParams.get('sys') === 'south' ? 'south' : 'north';
  const ready = boy && girl;

  useEffect(() => {
    document.title = 'Kundli Milan · Horoscope Matching · Vedic Future';
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Kundli Milan"
        title={<>Kundli <span className="text-coral-gradient">Milan</span> — Horoscope Matching</>}
        subtitle={ready
          ? `${boy.name || 'Boy'} & ${girl.name || 'Girl'} · ${system === 'north' ? 'North Indian Ashta Koota' : 'South Indian Porutham'}`
          : 'Classical 36-guna Ashta Koota matching with Mangal Dosha, Rajju-Vedha and Papasamaya checks — the complete compatibility picture before marriage.'}
      />
      <section className="container-luxe relative z-10 pb-24">
        {ready
          ? <MatchResult boy={boy} girl={girl} system={system} onReset={() => setSearchParams({})} />
          : <MatchForm onSubmit={(b, g, sys) => { setSearchParams({ ...birthToSearch(b, 'm'), ...birthToSearch(g, 'f'), sys }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />}
      </section>
    </>
  );
}

function MatchForm({ onSubmit }) {
  const [boy, setBoy] = useState(emptyBirth);
  const [girl, setGirl] = useState({ ...emptyBirth, gender: 'female' });
  const [system, setSystem] = useState('north');
  const [touched, setTouched] = useState(false);
  const complete = birthIsComplete(boy) && birthIsComplete(girl);

  return (
    <form onSubmit={(e) => { e.preventDefault(); setTouched(true); if (complete) onSubmit(boy, girl, system); }} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel coral>
          <PanelTitle icon={Users} title="Boy’s birth details" />
          <BirthFields value={boy} onChange={setBoy} showGender={false} compact />
        </Panel>
        <Panel coral>
          <PanelTitle icon={Heart} title="Girl’s birth details" />
          <BirthFields value={girl} onChange={setGirl} showGender={false} compact />
        </Panel>
      </div>

      <Panel className="flex flex-col items-center gap-5 text-center">
        <div className="grid w-full max-w-md grid-cols-2 gap-2 rounded-full border border-coral/20 bg-navy-950/60 p-1 text-sm">
          {[['north', 'North Indian (Guna Milan)'], ['south', 'South Indian (Porutham)']].map(([v, l]) => (
            <button type="button" key={v} onClick={() => setSystem(v)} aria-pressed={system === v}
              className={`rounded-full px-3 py-2 font-medium transition ${system === v ? 'bg-coral text-navy-950' : 'text-cream-100/75 hover:text-coral'}`}>{l}</button>
          ))}
        </div>
        {touched && !complete && <p role="alert" className="text-sm text-amber-200/90">Please complete both birth details and pick each city from the suggestions.</p>}
        <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-coral-gradient px-10 py-4 font-medium text-navy-950 shadow-glow transition hover:brightness-110">
          <HeartHandshake className="h-5 w-5" /> Match Kundalis
        </button>
      </Panel>
    </form>
  );
}

function MatchResult({ boy, girl, system, onReset }) {
  const params = { ...birthParams(boy, 'm_'), ...birthParams(girl, 'f_') };
  const match = useAstro(system === 'south' ? 'matching/south-match' : 'matching/north-match', params);
  const aggregate = useAstro('matching/aggregate-match', params);
  const astroDetails = useAstro('matching/north-match-astro-details', params);
  const rajju = useAstro('matching/rajju-vedha-match', params);
  const papa = useAstro('matching/papasamaya-match', params);

  const boyName = boy.name || 'Boy';
  const girlName = girl.name || 'Girl';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <LangToggle />
        <button onClick={onReset} className="inline-flex items-center gap-2 rounded-full border border-navy-900/15 px-4 py-2 text-sm text-navy-900/75 transition hover:border-coral/50 hover:text-coral">
          <RotateCcw className="h-4 w-4" /> New match
        </button>
      </div>

      <Async state={match} loadingLabel="Matching the stars…">
        {(m) => (
          <Panel coral>
            <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
              <div className="flex justify-center"><ScoreRing value={m.total_points} max={m.max_points} label="Gunas" size={190} /></div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={verdictTone(m.percentage)}>{m.compatibility} match · {m.percentage}%</Badge>
                  {aggregate.data && <Badge tone={/not/i.test(aggregate.data.overall_compatibility) ? 'bad' : 'good'}>Overall: {aggregate.data.overall_compatibility}</Badge>}
                </div>
                <h2 className="mt-3 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">{boyName} <span className="text-coral">&amp;</span> {girlName}</h2>
                <p className="mt-2 text-navy-900/60">{m.male_nakshatra} ({m.male_moon_sign}) · {m.female_nakshatra} ({m.female_moon_sign})</p>
                {aggregate.data?.recommendation && <Prose className="mt-4">{aggregate.data.recommendation}</Prose>}
                <p className="mt-3 text-xs text-navy-900/45">18+ gunas is traditionally acceptable, 24+ good, 32+ excellent.</p>
              </div>
            </div>
          </Panel>
        )}
      </Async>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <Panel>
          <PanelTitle icon={Sparkles} title="Ashta Koota — the 8 gunas" subtitle="Points scored in each area of compatibility" />
          <Async state={match}>
            {(m) => (
              <div className="space-y-4">
                {m.koots.map((k) => (
                  <div key={k.name}>
                    <Bar label={`${k.name} — ${k.description}`} value={k.points} max={k.max} suffix={` / ${k.max}`} tone={k.points === 0 ? 'bad' : k.points === k.max ? 'good' : 'coral'} />
                  </div>
                ))}
              </div>
            )}
          </Async>
        </Panel>

        <div className="space-y-6">
          <Panel>
            <PanelTitle icon={AlertTriangle} title="Mangal Dosha check" />
            <Async state={aggregate}>
              {(a) => (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Stat label={boyName} value={a.mangal_dosha.male ? 'Manglik' : 'Non-manglik'} accent={a.mangal_dosha.male} />
                    <Stat label={girlName} value={a.mangal_dosha.female ? 'Manglik' : 'Non-manglik'} accent={a.mangal_dosha.female} />
                  </div>
                  <Badge tone={a.mangal_dosha.compatible ? 'good' : 'warn'}>{a.mangal_dosha.compatible ? 'Compatible' : 'Needs remedy'}</Badge>
                  <Prose className="text-sm">{a.mangal_dosha.note}</Prose>
                </div>
              )}
            </Async>
          </Panel>

          {system === 'south' && (
            <Panel>
              <PanelTitle title="South Indian checks" />
              <Async state={match}>
                {(m) => m.south_indian_checks && (
                  <ul className="space-y-3">
                    {Object.entries(m.south_indian_checks).filter(([, v]) => typeof v === 'object').map(([k, v]) => (
                      <li key={k} className="flex items-start justify-between gap-3">
                        <span><span className="block capitalize text-navy-900">{k.replace(/_/g, ' ')}</span><span className="text-xs text-navy-900/50">{v.description}</span></span>
                        <Badge tone={v.passed ? 'good' : 'bad'}>{v.passed ? 'Pass' : 'Fail'}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </Async>
            </Panel>
          )}

          <Panel>
            <PanelTitle icon={ShieldCheck} title="Rajju & Vedha" subtitle="Longevity and obstruction doshas" />
            <Async state={rajju}>
              {(r) => (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Stat label="Rajju" value={r.rajju_dosha ? 'Dosha' : 'Clear'} hint={`${r.male_rajju} · ${r.female_rajju}`} />
                    <Stat label="Vedha" value={r.vedha_dosha ? 'Dosha' : 'Clear'} hint={r.vedha_effect} />
                  </div>
                  <Prose className="text-sm">{r.overall}</Prose>
                </div>
              )}
            </Async>
          </Panel>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelTitle title="Birth chart comparison" />
          <Async state={astroDetails}>
            {(d) => (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-sm">
                  <thead><tr className="border-b border-coral/20 text-left text-[11px] uppercase tracking-[0.14em] text-coral/80"><th className="py-2" /><th className="py-2">{boyName}</th><th className="py-2">{girlName}</th></tr></thead>
                  <tbody>
                    {[['Ascendant', 'ascendant'], ['Lagna lord', 'ascendant_lord'], ['Moon sign', 'moon_sign'], ['Nakshatra', 'nakshatra'], ['Pada', 'nakshatra_pada'], ['Sun sign', 'sun_sign']].map(([label, key]) => (
                      <tr key={key} className="border-b border-navy-900/5"><td className="py-2.5 text-navy-900/50">{label}</td><td className="py-2.5 text-navy-900">{d.male[key]}</td><td className="py-2.5 text-navy-900">{d.female[key]}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Async>
        </Panel>
        <Panel>
          <PanelTitle title="Papasamaya balance" subtitle="Malefic influence should be similar for both" />
          <Async state={papa}>
            {(p) => (
              <div className="space-y-4">
                <Bar label={boyName} value={p.male_papasamaya.total} max={Math.max(p.male_papasamaya.total, p.female_papasamaya.total, 1) * 1.2} />
                <Bar label={girlName} value={p.female_papasamaya.total} max={Math.max(p.male_papasamaya.total, p.female_papasamaya.total, 1) * 1.2} />
                <Badge tone={p.is_papasamaya_compatible ? 'good' : 'warn'}>{p.is_papasamaya_compatible ? 'Balanced' : `Difference ${p.papa_score_difference}`}</Badge>
                <Prose className="text-sm">{p.note}</Prose>
              </div>
            )}
          </Async>
        </Panel>
      </div>

      <AiCompatibility params={params} />

      <ConsultCTA
        title="Planning a marriage? Get a detailed matching consultation"
        text="Guna score is only the start. Our Acharya checks Navamsa, dasha timing and dosha cancellations before advising."
        message={`Namaste Acharya ji 🙏 Please do a detailed Kundli Milan.\n\nBoy: ${boyName}, ${formatDate(boy.date)} ${boy.time}, ${boy.place.label}\nGirl: ${girlName}, ${formatDate(girl.date)} ${girl.time}, ${girl.place.label}\n\nWebsite result: ${match.data ? `${match.data.total_points}/36 gunas` : ''}`}
      />
    </div>
  );
}

function AiCompatibility({ params }) {
  const { lang } = useAstroLang();
  const [state, setState] = useState(null);

  const run = async () => {
    setState({ loading: true });
    try {
      const data = await astro('ai/compatibility', { ...params, ...(lang !== 'en' && { lang }) });
      setState({ data });
    } catch (error) {
      setState({ error });
    }
  };

  const text = state?.data && (typeof state.data === 'string' ? state.data : state.data.narrative || state.data.interpretation || state.data.reading || state.data.analysis || state.data.summary);

  return (
    <Panel>
      <PanelTitle
        icon={Wand2}
        title="AI compatibility narrative"
        subtitle="A readable explanation of this match"
        action={!state?.data && (
          <button onClick={run} disabled={state?.loading} className="inline-flex items-center gap-2 rounded-full border border-coral/50 px-5 py-2 text-sm font-medium text-coral hover:bg-coral/10 disabled:opacity-60">
            {state?.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate
          </button>
        )}
      />
      {!state && <p className="text-sm text-navy-900/50">Generate a narrative reading of this couple’s compatibility.</p>}
      {state?.loading && <Loading label="Writing the compatibility reading…" />}
      {state?.error && <ErrorNote error={state.error} onRetry={run} />}
      {state?.data && (text ? <Prose>{text}</Prose> : <List items={Object.values(state.data).filter((v) => typeof v === 'string')} />)}
    </Panel>
  );
}
