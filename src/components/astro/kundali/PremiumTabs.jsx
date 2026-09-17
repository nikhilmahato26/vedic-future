"use client";
import { useState } from 'react';
import { astro, birthParams } from '../../../lib/astro';
import { useAstroLang } from '../../../context/AstroLang';
import usePdfReport from '../../../hooks/usePdfReport';
import { ElapsedTime, ErrorNote, Loading, Panel, PanelTitle, Prose } from '../ui';
import { Wand2, FileText, Download, Loader2, CheckCircle2, Sparkles } from '../../../utils/icons';

/* AI readings -------------------------------------------------------- */

const AI_READINGS = [
  { endpoint: 'ai/interpret/chart', title: 'Complete chart reading', desc: 'Ascendant, key placements, yogas and current dasha woven into one narrative.' },
  { endpoint: 'ai/dasha/narrative', title: 'Dasha period story', desc: 'What your running Mahadasha and Antardasha mean for the years ahead.' },
  { endpoint: 'ai/transit/forecast', title: 'Transit forecast', desc: 'How today’s planetary transits are activating your natal chart.' },
];

/**
 * AI responses aren't documented with a fixed schema, so render whatever text we get:
 * a string, a known narrative field, or each string/array field as its own section.
 */
function Narrative({ data }) {
  if (typeof data === 'string') return <Prose>{data}</Prose>;
  const main = data?.narrative || data?.interpretation || data?.reading || data?.forecast || data?.text || data?.content;
  if (typeof main === 'string') return <Prose>{main}</Prose>;

  const sections = Object.entries(data || {}).filter(([, v]) => typeof v === 'string' ? v.length > 40 : Array.isArray(v) && v.every((x) => typeof x === 'string'));
  if (!sections.length) return <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-navy-900/60">{JSON.stringify(data, null, 2)}</pre>;
  return (
    <div className="space-y-5">
      {sections.map(([k, v]) => (
        <div key={k}>
          <p className="mb-1 text-xs uppercase tracking-[0.16em] text-coral/80">{k.replace(/_/g, ' ')}</p>
          {Array.isArray(v) ? <ul className="list-disc space-y-1 pl-5 text-sm text-navy-900/75">{v.map((x, i) => <li key={i}>{x}</li>)}</ul> : <Prose>{v}</Prose>}
        </div>
      ))}
    </div>
  );
}

export function AiReadingTab({ birth }) {
  const { lang } = useAstroLang();
  const [results, setResults] = useState({});

  const run = async (endpoint) => {
    const regenerating = Boolean(results[endpoint]?.data);
    setResults((r) => ({ ...r, [endpoint]: { loading: true } }));
    try {
      const data = await astro(endpoint, { ...birthParams(birth), ...(lang !== 'en' && { lang }) }, { cache: !regenerating });
      setResults((r) => ({ ...r, [endpoint]: { data } }));
    } catch (error) {
      setResults((r) => ({ ...r, [endpoint]: { error } }));
    }
  };

  return (
    <div className="space-y-6">
      <Panel coral>
        <PanelTitle icon={Wand2} title="AI Jyotish readings" subtitle="Human-style narratives generated from your exact chart calculations" />
        <div className="grid gap-4 md:grid-cols-3">
          {AI_READINGS.map((r) => {
            const state = results[r.endpoint];
            return (
              <div key={r.endpoint} className="flex flex-col rounded-xl border border-navy-900/10 bg-navy-900/[0.03] p-5">
                <p className="font-display text-xl font-semibold text-navy-900">{r.title}</p>
                <p className="mt-1 flex-1 text-sm text-navy-900/55">{r.desc}</p>
                <button
                  onClick={() => run(r.endpoint)}
                  disabled={state?.loading}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-coral/50 px-5 py-2.5 text-sm font-medium text-coral transition hover:bg-coral/10 disabled:opacity-60"
                >
                  {state?.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {state?.data ? 'Regenerate' : 'Generate reading'}
                </button>
              </div>
            );
          })}
        </div>
      </Panel>

      {AI_READINGS.map((r) => {
        const state = results[r.endpoint];
        if (!state) return null;
        return (
          <Panel key={r.endpoint}>
            <PanelTitle icon={Wand2} title={r.title} />
            {state.loading && <Loading label="Writing your reading — this can take up to a minute…" />}
            {state.error && <ErrorNote error={state.error} onRetry={() => run(r.endpoint)} />}
            {state.data && <Narrative data={state.data} />}
          </Panel>
        );
      })}
    </div>
  );
}

/* PDF reports -------------------------------------------------------- */

// Credit cost noted for transparency — shown as a small badge, not charged separately
// (it comes out of the account's monthly PDF report credits).
export const REPORT_TYPES = [
  { value: 'snapshot', label: 'Kundali Snapshot', desc: 'Concise birth chart summary', credits: 1 },
  { value: 'full_analysis', label: 'Full Kundali Analysis', desc: 'Charts, planets, dashas, doshas, yogas & remedies', credits: 2 },
  { value: 'complete_life', label: 'Complete Life Report', desc: 'The deepest reading — every life area in one report', credits: 5 },
  { value: 'career', label: 'Career Report', desc: 'Profession, growth periods and suitable fields', credits: 2 },
  { value: 'marriage', label: 'Marriage Report', desc: 'Relationship prospects, timing and doshas', credits: 2 },
  { value: 'finance', label: 'Dhan Yoga & Wealth Report', desc: 'Dhana yogas, income periods and investment timing', credits: 2 },
  { value: 'health', label: 'Health Report', desc: 'Vulnerable areas and supportive periods', credits: 2 },
  { value: 'annual_forecast', label: 'Annual Forecast', desc: 'Month-by-month outlook for the year', credits: 2 },
  { value: 'deep_forecast', label: 'Deep Annual Forecast', desc: 'The long version — week-by-week timing for the year', credits: 5 },
];

/** Filename-safe label + credits badge, shared by the report-picker UI below. */
function ReportOption({ type, selected, onSelect, disabled }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition ${selected ? 'border-coral/50 bg-coral/10' : 'border-navy-900/10 hover:border-coral/25'}`}>
      <input type="radio" name="report-type" checked={selected} onChange={onSelect} disabled={disabled} className="mt-1 accent-[#E67A5B]" />
      <span>
        <span className="block font-medium text-navy-900">
          {type.label} <span className="ml-1 text-xs text-navy-900/40">{type.credits} credit{type.credits > 1 ? 's' : ''}</span>
        </span>
        <span className="block text-sm text-navy-900/55">{type.desc}</span>
      </span>
    </label>
  );
}

/** Generate → progress → download panel, shared by the single-chart and compatibility PDF UIs. */
export function ReportStatusPanel({ pdf, subjectLabel, subjectNote, filename, onReset, onGenerate }) {
  const { job, error, downloading, download } = pdf;
  const working = job && job.status !== 'done';

  return (
    <div className="flex flex-col justify-center rounded-2xl border border-navy-900/10 bg-navy-900/[0.03] p-6 text-center">
      {!job && (
        <>
          <FileText className="mx-auto h-12 w-12 text-coral/70" />
          <p className="mt-4 font-display text-2xl text-navy-900">{subjectLabel}</p>
          {subjectNote && <p className="mt-1 text-sm text-navy-900/55">{subjectNote}</p>}
          <button onClick={onGenerate} className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-coral-gradient px-8 py-3.5 font-medium text-navy-950 shadow-glow transition hover:brightness-110">
            <Sparkles className="h-4 w-4" /> Generate PDF
          </button>
          <p className="mt-3 text-xs text-navy-900/45">Generation takes about 2–5 minutes. Keep this page open.</p>
        </>
      )}
      {working && (
        <>
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-coral" />
          <p className="mt-4 font-display text-2xl text-navy-900">Preparing your report…</p>
          <p className="mt-1 text-sm capitalize text-navy-900/55">Status: {job.status}</p>
          <ElapsedTime since={job.startedAt} className="mt-2 text-xs text-navy-900/45" />
        </>
      )}
      {job?.status === 'done' && (
        <>
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-300" />
          <p className="mt-4 font-display text-2xl text-navy-900">Your report is ready</p>
          <button onClick={() => download(filename)} disabled={downloading} className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-coral-gradient px-8 py-3.5 font-medium text-navy-950 shadow-glow transition hover:brightness-110 disabled:opacity-60">
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download PDF
          </button>
          <button onClick={onReset} className="mx-auto mt-3 text-xs text-navy-900/50 hover:text-coral">Generate another report</button>
        </>
      )}
      {error && <div className="mt-5 text-left"><ErrorNote error={error} /></div>}
    </div>
  );
}

export function PdfReportTab({ birth }) {
  const { lang } = useAstroLang();
  const [type, setType] = useState('full_analysis');
  const pdf = usePdfReport();
  const working = pdf.job && pdf.job.status !== 'done';
  const selected = REPORT_TYPES.find((r) => r.value === type);

  const generate = () => pdf.generate({
    ...birthParams(birth),
    report_type: type,
    name: birth.name || undefined,
    ...(lang !== 'en' && { lang }),
  });

  return (
    <Panel coral>
      <PanelTitle icon={FileText} title="Download your PDF report" subtitle="A beautifully typeset, printable report generated from your chart" />

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-2">
          {REPORT_TYPES.map((r) => (
            <ReportOption key={r.value} type={r} selected={type === r.value} onSelect={() => setType(r.value)} disabled={Boolean(working)} />
          ))}
        </div>

        <ReportStatusPanel
          pdf={pdf}
          subjectLabel={selected.label}
          subjectNote={`for ${birth.name || 'your chart'}`}
          filename={`${birth.name || 'Kundali'} - ${selected.label}.pdf`.replace(/[^\w\s.-]/g, '')}
          onGenerate={generate}
          onReset={pdf.reset}
        />
      </div>
    </Panel>
  );
}
