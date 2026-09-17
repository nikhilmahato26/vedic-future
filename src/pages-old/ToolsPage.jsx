"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '../components/astro/PageHeader';
import { Field, PlaceSearch, selectCls } from '../components/astro/fields';
import { KeyValues } from '../components/astro/kundali/PredictTabs';
import useAstro from '../hooks/useAstro';
import { DEFAULT_PLACE, locationParams, NAKSHATRA_NAMES } from '../lib/astro';
import { Async, Badge, ConsultCTA, LangToggle, List, Panel, PanelTitle, Stat, Tabs } from '../components/astro/ui';
import { HelpCircle, Baby, Gem, Hash, Compass, CheckCircle2, AlertTriangle, ArrowRight } from '../utils/icons';

const TABS = [
  { id: 'prasna', label: 'Prashna (Yes/No)', icon: HelpCircle },
  { id: 'baby-names', label: 'Baby Names', icon: Baby },
  { id: 'gemstones', label: 'Gemstone Guide', icon: Gem },
  { id: 'moolank', label: 'Moolank Numbers', icon: Hash },
];

export default function ToolsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const setSearchParams = (newParams, options = {}) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (Object.keys(newParams).length === 0) {
      router.push(pathname);
      return;
    }
    for (const [k, v] of Object.entries(newParams)) {
      current.set(k, v);
    }
    const target = `${pathname}?${current.toString()}`;
    if (options.replace) {
      router.replace(target);
    } else {
      router.push(target);
    }
  };
  const tab = TABS.some((t) => t.id === searchParams.get('tool')) ? searchParams.get('tool') : 'prasna';

  useEffect(() => {
    document.title = `${TABS.find((t) => t.id === tab).label} · Astro Tools · Vedic Future`;
  }, [tab]);

  return (
    <>
      <PageHeader
        eyebrow="Astro Tools"
        title={<>Jyotish <span className="text-coral-gradient">Tools</span></>}
        subtitle="Ask the stars a question, find an auspicious baby name, learn about your gemstone and lucky number."
      />
      <section className="container-luxe relative z-10 pb-24">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Tabs tabs={TABS} active={tab} onChange={(t) => setSearchParams({ tool: t }, { replace: true })} />
          <LangToggle />
        </div>
        {tab === 'prasna' && <Prasna />}
        {tab === 'baby-names' && <BabyNames />}
        {tab === 'gemstones' && <Gemstones />}
        {tab === 'moolank' && <Moolank />}

        <Link
          to="/vastu"
          className="glass mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5 transition hover:border-coral/40 hover:shadow-glow"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-coral/30 bg-coral/10 text-coral">
              <Compass className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display text-lg font-semibold text-navy-900">Looking for Vastu?</span>
              <span className="block text-sm text-navy-900/55">Find your personal direction and the full zone-by-zone Vastu guide.</span>
            </span>
          </span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-coral">Open Vastu guide <ArrowRight className="h-4 w-4" /></span>
        </Link>
      </section>
    </>
  );
}

/* Prasna ------------------------------------------------------------ */

const QUESTION_TYPES = [
  ['general', 'General question'], ['career', 'Career & job'], ['finance', 'Money & finance'], ['relationship', 'Love & relationship'],
  ['health', 'Health'], ['travel', 'Travel'], ['property', 'Property & home'], ['legal', 'Court case & legal'],
];

function Prasna() {
  const [place, setPlace] = useState(DEFAULT_PLACE);
  const [type, setType] = useState('career');
  const [question, setQuestion] = useState('');
  const [asked, setAsked] = useState(null);
  const q = useAstro('prasna/query', asked);

  const positive = q.data && /^yes/i.test(q.data.answer);
  const negative = q.data && /^no/i.test(q.data.answer);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <Panel coral>
        <PanelTitle icon={HelpCircle} title="Ask your question" subtitle="Prashna Jyotish answers from the Panchang of the moment you ask" />
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setAsked({ ...locationParams(place), question_type: type, _t: Date.now() }); }}>
          <Field label="Your question (for your own focus)">
            <textarea rows={3} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. Will I get the new job I applied for?"
              className="w-full rounded-xl border border-navy-900/25 bg-navy-900/[0.06] px-4 py-3 text-navy-900 placeholder:text-navy-900/40 outline-none focus:border-coral/60" />
          </Field>
          <Field label="Area of life">
            <select className={selectCls} value={type} onChange={(e) => setType(e.target.value)}>
              {QUESTION_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </Field>
          <Field label="Where are you now?"><PlaceSearch value={place} onChange={(p) => p && setPlace(p)} /></Field>
          <button type="submit" className="w-full rounded-full bg-coral-gradient py-3.5 font-medium text-navy-950 shadow-glow hover:brightness-110">Ask the stars</button>
          <p className="text-center text-xs text-navy-900/45">Hold your question clearly in mind before you press the button.</p>
        </form>
      </Panel>

      <Panel>
        {!asked && <p className="py-16 text-center text-navy-900/50">Your answer will appear here.</p>}
        {asked && (
          <Async state={q} loadingLabel="Reading the moment…">
            {(r) => (
              <div className="space-y-5">
                {question && <p className="font-display text-xl italic text-navy-900/70">“{question}”</p>}
                <div className={`rounded-2xl border p-6 text-center ${positive ? 'border-emerald-400/40 bg-emerald-400/10' : negative ? 'border-rose-400/40 bg-rose-400/10' : 'border-coral/40 bg-coral/10'}`}>
                  {positive ? <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-300" /> : <AlertTriangle className={`mx-auto h-10 w-10 ${negative ? 'text-rose-300' : 'text-coral'}`} />}
                  <p className="mt-3 font-display text-2xl font-semibold text-navy-900">{r.answer}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Stat label="Tithi" value={r.prasna_chart?.tithi} />
                  <Stat label="Nakshatra" value={r.prasna_chart?.nakshatra} />
                  <Stat label="Yoga" value={r.prasna_chart?.yoga} />
                  <Stat label="Vara" value={r.prasna_chart?.vara} />
                </div>
                {r.positive_factors?.length > 0 && <div><p className="mb-2 text-xs uppercase tracking-[0.16em] text-emerald-300/80">In favour</p><List items={r.positive_factors} tone="good" /></div>}
                {r.negative_factors?.length > 0 && <div><p className="mb-2 text-xs uppercase tracking-[0.16em] text-rose-300/80">Against</p><List items={r.negative_factors} tone="bad" /></div>}
                <p className="text-xs text-navy-900/45">{r.note}</p>
              </div>
            )}
          </Async>
        )}
      </Panel>
    </div>
  );
}

/* Baby names --------------------------------------------------------- */

function BabyNames() {
  const [nakshatra, setNakshatra] = useState('Rohini');
  const [gender, setGender] = useState('both');
  const q = useAstro('astrology/baby-names', { nakshatra, gender }, { localized: false });

  return (
    <div className="space-y-6">
      <Panel coral>
        <PanelTitle icon={Baby} title="Vedic baby names by Nakshatra" subtitle="Traditional naming: the first syllable follows the birth nakshatra pada" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Baby’s birth nakshatra">
            <select className={selectCls} value={nakshatra} onChange={(e) => setNakshatra(e.target.value)}>
              {NAKSHATRA_NAMES.map((n) => <option key={n}>{n}</option>)}
            </select>
          </Field>
          <Field label="Names for">
            <select className={selectCls} value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="both">Boy & girl</option><option value="male">Boy</option><option value="female">Girl</option>
            </select>
          </Field>
        </div>
        <p className="mt-4 text-sm text-navy-900/55">Don’t know the nakshatra? Generate the baby’s Kundali — it’s shown on the Overview tab.</p>
      </Panel>

      <Async state={q}>
        {(r) => (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat accent label="Nakshatra" value={r.nakshatra} />
              <Stat accent label="Starting syllables" value={r.aksharas?.join(', ')} />
              <Stat label="Deity" value={r.deity} />
              <Stat label="Ruling planet" value={r.ruling_planet} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {r.names.map((group) => (
                <Panel key={group.syllable}>
                  <p className="font-sanskrit text-3xl text-coral">{group.syllable}</p>
                  {gender !== 'female' && group.male?.length > 0 && <NameGroup label="Boy" names={group.male} />}
                  {gender !== 'male' && group.female?.length > 0 && <NameGroup label="Girl" names={group.female} />}
                  {!group.male?.length && !group.female?.length && <p className="mt-2 text-sm text-navy-900/45">No names listed</p>}
                </Panel>
              ))}
            </div>
            <p className="text-xs text-navy-900/45">{r.note}</p>
          </>
        )}
      </Async>
    </div>
  );
}

function NameGroup({ label, names }) {
  return (
    <div className="mt-3">
      <p className="mb-1.5 text-[11px] uppercase tracking-wider text-navy-900/45">{label}</p>
      <div className="flex flex-wrap gap-1.5">{names.map((n) => <Badge key={n} tone="muted">{n}</Badge>)}</div>
    </div>
  );
}

/* Gemstones ---------------------------------------------------------- */

const GEMS = [
  ['Ruby', 'Manik', 'Sun'], ['Pearl', 'Moti', 'Moon'], ['Coral', 'Moonga', 'Mars'], ['Emerald', 'Panna', 'Mercury'],
  ['Yellow Sapphire', 'Pukhraj', 'Jupiter'], ['Diamond', 'Heera', 'Venus'], ['Blue Sapphire', 'Neelam', 'Saturn'],
  ['Hessonite', 'Gomed', 'Rahu'], ["Cat's Eye", 'Lehsunia', 'Ketu'],
];

function Gemstones() {
  const [gem, setGem] = useState('Yellow Sapphire');
  const q = useAstro('utilities/gem-details', { gem });

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <Panel>
        <PanelTitle icon={Gem} title="Navaratna" subtitle="The nine planetary gems" />
        <ul className="space-y-1">
          {GEMS.map(([name, hindi, planet]) => (
            <li key={name}>
              <button onClick={() => setGem(name)} aria-pressed={gem === name}
                className={`flex w-full items-baseline justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${gem === name ? 'bg-coral/15 text-coral' : 'text-navy-900/75 hover:bg-navy-900/5'}`}>
                <span>{name} <span className="text-xs text-navy-900/40">{hindi}</span></span>
                <span className="text-xs text-navy-900/45">{planet}</span>
              </button>
            </li>
          ))}
        </ul>
      </Panel>
      <div className="space-y-6">
        <Panel coral>
          <Async state={q}>
            {(g) => (
              <>
                <PanelTitle icon={Gem} title={`${g.gem}${g.hindi_name ? ` · ${g.hindi_name}` : ''}`} subtitle={`Gemstone of ${g.planet}`} />
                <KeyValues data={g} omit={['gem', 'hindi_name']} />
              </>
            )}
          </Async>
        </Panel>
        <ConsultCTA
          title="Find out which gemstone suits YOUR chart"
          text="Your Kundali's Gems & Rudraksha tab gives a personal recommendation. Our Acharya can confirm it and source certified stones."
          message={`Namaste 🙏 I'm interested in ${gem}. Please advise whether it suits my kundali.`}
        />
      </div>
    </div>
  );
}

/* Moolank ------------------------------------------------------------ */

function Moolank() {
  const [n, setN] = useState(1);
  const [dob, setDob] = useState('');
  const q = useAstro('utilities/radical-number-details', { number: n });

  const fromDob = (value) => {
    setDob(value);
    const day = Number(value.split('-')[2]);
    if (!day) return;
    let sum = day;
    while (sum > 9) sum = String(sum).split('').reduce((a, b) => a + Number(b), 0);
    setN(sum);
  };

  return (
    <div className="space-y-6">
      <Panel coral>
        <PanelTitle icon={Hash} title="Moolank (root number) guide" subtitle="Your Moolank is the sum of your birth day, reduced to a single digit" />
        <div className="grid items-end gap-5 md:grid-cols-[240px_1fr]">
          <Field label="Find mine from birth date">
            <input type="date" value={dob} onChange={(e) => fromDob(e.target.value)} className="w-full rounded-xl border border-navy-900/25 bg-navy-900/[0.06] px-4 py-3 text-navy-900 outline-none [color-scheme:light] focus:border-coral/60" />
          </Field>
          <div className="grid grid-cols-9 gap-1.5">
            {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
              <button key={num} onClick={() => setN(num)} aria-pressed={n === num}
                className={`aspect-square rounded-xl border font-display text-2xl font-bold transition ${n === num ? 'border-coral bg-coral text-navy-950' : 'border-navy-900/15 text-navy-900/70 hover:border-coral/50'}`}>{num}</button>
            ))}
          </div>
        </div>
      </Panel>
      <Panel>
        <Async state={q}>
          {(r) => (
            <div className="grid gap-8 md:grid-cols-[auto_1fr]">
              <div className="text-center">
                <p className="font-display text-8xl font-bold leading-none text-coral-gradient">{r.number}</p>
                <p className="mt-2 text-navy-900/70">{r.planet}</p>
              </div>
              <KeyValues data={r} omit={['number']} />
            </div>
          )}
        </Async>
      </Panel>
    </div>
  );
}
