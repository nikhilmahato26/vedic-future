import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/astro/PageHeader';
import BirthForm from '../components/astro/BirthForm';
import useAstro from '../hooks/useAstro';
import { birthFromSearch, birthParams, birthToSearch, formatDate } from '../lib/astro';
import {
  Async, Badge, ConsultCTA, LangToggle, Panel, PanelTitle, Prose, Stat,
} from '../components/astro/ui';
import {
  Coins, TrendingUp, Landmark, Crown, RotateCcw, ArrowRight, FileText, Sparkles,
} from '../utils/icons';

// Keyword match on name + description — robust across any chart, not tied to one
// fixed list of yoga names (classical wealth yogas go well beyond "Dhana Yoga" itself:
// Vasumati, Lakshmi, Kubera, Parvata and several Raja yogas are explicitly wealth-linked
// in their description text too).
const WEALTH_PATTERN = /dhan|wealth|lakshmi|kubera|vasumati|parvata|artha\b|prosper|riches|affluen|income|money/i;

function isWealthYoga(y) {
  return WEALTH_PATTERN.test(`${y.name} ${y.description}`);
}

const strengthTone = (s = '') => (/very/i.test(s) ? 'coral' : /in-?auspicious|malefic|negative/i.test(s) ? 'bad' : 'good');

export default function DhanYogaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const birth = useMemo(() => birthFromSearch(searchParams), [searchParams]);

  useEffect(() => {
    document.title = birth ? `${birth.name || 'Your'} Dhan Yoga Report · Vedic Future` : 'Dhan Yoga Checker · Vedic Future';
  }, [birth]);

  const submit = (b) => {
    setSearchParams(birthToSearch(b));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <PageHeader
        eyebrow="Dhan Yoga"
        title={<>Dhan <span className="text-coral-gradient">Yoga</span> Checker</>}
        subtitle="Wealth-giving planetary combinations in your birth chart — Dhana, Lakshmi, Vasumati and every other classical yoga linked to prosperity, computed from your exact chart."
      />
      <section className="container-luxe relative z-10 pb-24">
        {!birth ? (
          <div className="mx-auto max-w-3xl">
            <Panel coral className="sm:p-10">
              <h2 className="mb-6 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">Enter birth details</h2>
              <BirthForm onSubmit={submit} submitLabel="Check my Dhan Yoga" requireName />
            </Panel>
          </div>
        ) : (
          <DhanYogaResult birth={birth} onReset={() => setSearchParams({})} />
        )}
      </section>
    </>
  );
}

function DhanYogaResult({ birth, onReset }) {
  const params = birthParams(birth);
  const yogas = useAstro('extended-horoscope/yoga-list', params);
  const kundli = useAstro('extended-horoscope/extended-kundli-details', params, { localized: false });

  const wealthYogas = yogas.data?.filter(isWealthYoga) || [];
  const otherYogas = yogas.data?.filter((y) => !isWealthYoga(y)) || [];
  const houseLord = (house) => kundli.data?.house_lords?.find((h) => h.house === house);

  const verdict = wealthYogas.length >= 3
    ? { label: 'Strong wealth potential', tone: 'good' }
    : wealthYogas.length >= 1
      ? { label: 'Supportive wealth yogas present', tone: 'coral' }
      : { label: 'No major Dhana yoga detected', tone: 'warn' };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <LangToggle />
        <button onClick={onReset} className="inline-flex items-center gap-2 rounded-full border border-navy-900/15 px-4 py-2 text-sm text-navy-900/75 transition hover:border-coral/50 hover:text-coral">
          <RotateCcw className="h-4 w-4" /> Check another chart
        </button>
      </div>

      <Panel coral>
        <div className="flex flex-wrap items-center gap-4 border-b border-coral/15 pb-5">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-coral/30 bg-coral/10 text-coral">
            <Coins className="h-6 w-6" />
          </span>
          <div>
            <p className="font-display text-2xl font-semibold text-navy-900">{birth.name ? `${birth.name}'s` : 'Your'} Dhan Yoga Reading</p>
            <p className="text-sm text-navy-900/55">{formatDate(birth.date)} · {birth.time} · {birth.place.label}</p>
          </div>
        </div>
        <Async state={yogas} loadingLabel="Scanning your chart for wealth yogas…">
          {() => (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat accent label="Wealth yogas found" value={wealthYogas.length} />
              <Stat accent label="Total yogas in chart" value={yogas.data.length} />
              <Stat label="Verdict" value={verdict.label} />
              <Stat label="2nd & 11th lords" value={[houseLord(2)?.lord, houseLord(11)?.lord].filter(Boolean).join(' · ') || '—'} hint="Wealth house rulers" />
            </div>
          )}
        </Async>
      </Panel>

      <Panel>
        <PanelTitle icon={Landmark} title="Your wealth houses" subtitle="The 2nd house rules accumulated wealth, the 11th rules income & gains — classical Jyotish reads their lords' placement as the first check for prosperity" />
        <Async state={kundli}>
          {() => (
            <div className="grid gap-4 sm:grid-cols-2">
              {[2, 11].map((house) => {
                const h = houseLord(house);
                return (
                  <div key={house} className="rounded-xl border border-navy-900/10 bg-navy-900/[0.03] p-5">
                    <p className="text-[11px] uppercase tracking-wider text-navy-900/45">House {house} · {house === 2 ? 'Dhana Bhava (wealth)' : 'Labha Bhava (gains)'}</p>
                    <p className="mt-1 font-display text-xl font-semibold text-navy-900">{h?.sign} <span className="text-sm font-normal text-navy-900/50">ruled by</span> <span className="text-coral">{h?.lord}</span></p>
                  </div>
                );
              })}
            </div>
          )}
        </Async>
      </Panel>

      <Panel>
        <PanelTitle icon={TrendingUp} title="Wealth yogas in your chart" subtitle="Every combination classical Jyotish links to prosperity, income or self-made wealth" />
        <Async state={yogas}>
          {() => wealthYogas.length === 0 ? (
            <div className="rounded-xl border border-navy-900/10 bg-navy-900/[0.03] p-6 text-center">
              <p className="text-navy-900/70">No explicit Dhana-class yoga was detected in this chart.</p>
              <p className="mt-1 text-sm text-navy-900/50">This doesn't mean an absence of wealth — dasha timing, house strength and remedies matter just as much. A personal reading covers what a yoga scan alone can't.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {wealthYogas.map((y) => (
                <div key={`${y.name}-${y.formed_by}`} className="rounded-xl border border-coral/25 bg-coral/[0.06] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="flex items-center gap-1.5 font-display text-xl font-semibold text-navy-900"><Crown className="h-4 w-4 text-coral" /> {y.name}</p>
                    <Badge tone={strengthTone(y.strength)}>{y.strength}</Badge>
                  </div>
                  <Prose className="mt-2 text-sm">{y.description}</Prose>
                  <p className="mt-3 text-xs text-coral/70">Formed by: {y.formed_by}</p>
                </div>
              ))}
            </div>
          )}
        </Async>
      </Panel>

      {otherYogas.length > 0 && (
        <Panel>
          <PanelTitle title="Other yogas in your chart" subtitle="Not wealth-specific, but part of your full yogic profile" />
          <div className="flex flex-wrap gap-2">
            {otherYogas.map((y) => <Badge key={`${y.name}-${y.formed_by}`} tone="muted">{y.name}</Badge>)}
          </div>
          <Link to={`/kundali?${new URLSearchParams({ ...birthToSearch(birth), tab: 'yogas' })}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-coral hover:underline">
            See full yoga descriptions in your Kundali <ArrowRight className="h-4 w-4" />
          </Link>
        </Panel>
      )}

      <Panel className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <FileText className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
          <div>
            <p className="font-display text-lg font-semibold text-navy-900">Want this as a printable report?</p>
            <p className="text-sm text-navy-900/60">Download the Dhan Yoga & Wealth PDF report — dasha timing, gemstone remedies and investment windows included.</p>
          </div>
        </div>
        <Link
          to={`/kundali?${new URLSearchParams({ ...birthToSearch(birth), tab: 'pdf' })}`}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-coral-gradient px-6 py-3 text-sm font-medium text-navy-950 shadow-glow transition hover:brightness-110"
        >
          <Sparkles className="h-4 w-4" /> Get the PDF report
        </Link>
      </Panel>

      <ConsultCTA
        title="Turn a wealth yoga into a wealth plan"
        text="A yoga in your chart is a potential, not a guarantee — timing, remedies and dasha periods decide when it activates. Our Acharya reads all three together."
        message={`Namaste Acharya ji 🙏 I checked my Dhan Yoga on your website.\n\nName: ${birth.name || '-'}\nDOB: ${formatDate(birth.date)}\nTime: ${birth.time}\nPlace: ${birth.place.label}\n\nWealth yogas found: ${wealthYogas.length ? wealthYogas.map((y) => y.name).join(', ') : 'none major'}\n\nI'd like guidance on timing and remedies.`}
      />
    </div>
  );
}
