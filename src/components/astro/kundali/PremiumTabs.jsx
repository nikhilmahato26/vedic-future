import { useEffect, useRef, useState } from 'react';
import { astro, AstroError, birthParams } from '../../../lib/astro';
import { useAstroLang } from '../../../context/AstroLang';
import { ErrorNote, Loading, Panel, PanelTitle, Prose } from '../ui';
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

const REPORT_TYPES = [
  { value: 'snapshot', label: 'Kundali Snapshot', desc: 'Concise birth chart summary', pages: 'Quick' },
  { value: 'full_analysis', label: 'Full Kundali Analysis', desc: 'Charts, planets, dashas, doshas, yogas & remedies', pages: 'Detailed' },
  { value: 'career', label: 'Career Report', desc: 'Profession, growth periods and suitable fields', pages: 'Focused' },
  { value: 'marriage', label: 'Marriage Report', desc: 'Relationship prospects, timing and doshas', pages: 'Focused' },
  { value: 'finance', label: 'Wealth & Finance Report', desc: 'Dhana yogas, income periods and investments', pages: 'Focused' },
  { value: 'health', label: 'Health Report', desc: 'Vulnerable areas and supportive periods', pages: 'Focused' },
  { value: 'annual_forecast', label: 'Annual Forecast', desc: 'Month-by-month outlook for the year', pages: 'Detailed' },
];

const POLL_MS = 8000;
const MAX_WAIT_MS = 8 * 60 * 1000;

async function downloadReport(jobId, filename) {
  const res = await fetch(`/api/astro/reports/download?job_id=${encodeURIComponent(jobId)}`);
  const type = res.headers.get('content-type') || '';

  if (type.includes('json')) {
    const body = await res.json();
    if (!res.ok || body.error) throw new AstroError(body.error || 'Download failed', res.status);
    const payload = body.response ?? body;
    const url = payload.url || payload.download_url || payload.pdf_url || payload.signed_url;
    if (url) {
      window.open(url, '_blank', 'noopener');
      return;
    }
    const b64 = payload.pdf_base64 || payload.pdf || payload.base64 || payload.file;
    if (!b64) throw new AstroError('The report file was not included in the response.', 500);
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    saveBlob(new Blob([bytes], { type: 'application/pdf' }), filename);
    return;
  }

  if (!res.ok) throw new AstroError(`Download failed (${res.status})`, res.status);
  saveBlob(await res.blob(), filename);
}

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function PdfReportTab({ birth }) {
  const { lang } = useAstroLang();
  const [type, setType] = useState('full_analysis');
  const [job, setJob] = useState(null); // { id, status, startedAt }
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const poll = (id, startedAt) => {
    timer.current = setTimeout(async () => {
      try {
        const res = await astro('reports/status', { job_id: id }, { cache: false });
        const status = String(res?.status || res?.state || '').toLowerCase();
        if (status === 'done' || status === 'completed') {
          setJob({ id, status: 'done', startedAt });
        } else if (status === 'failed' || status === 'error') {
          setJob(null);
          setError(new AstroError(res?.error || 'Report generation failed. Please try again.', 500));
        } else if (Date.now() - startedAt > MAX_WAIT_MS) {
          setJob(null);
          setError(new AstroError('The report is taking unusually long. Please try again later.', 504));
        } else {
          setJob({ id, status: status || 'processing', startedAt });
          poll(id, startedAt);
        }
      } catch (e) {
        setJob(null);
        setError(e);
      }
    }, POLL_MS);
  };

  const generate = async () => {
    setError(null);
    setJob({ id: null, status: 'queuing', startedAt: Date.now() });
    try {
      const res = await astro('reports/generate', {
        ...birthParams(birth),
        report_type: type,
        name: birth.name || undefined,
        ...(lang !== 'en' && { lang }),
      }, { cache: false });
      const id = res?.job_id;
      if (!id) throw new AstroError('Could not start the report. Please try again.', 500);
      const startedAt = Date.now();
      setJob({ id, status: 'pending', startedAt });
      poll(id, startedAt);
    } catch (e) {
      setJob(null);
      setError(e);
    }
  };

  const download = async () => {
    setDownloading(true);
    setError(null);
    try {
      const label = REPORT_TYPES.find((r) => r.value === type)?.label || 'Kundali Report';
      await downloadReport(job.id, `${birth.name || 'Kundali'} - ${label}.pdf`.replace(/[^\w\s.-]/g, ''));
    } catch (e) {
      setError(e);
    } finally {
      setDownloading(false);
    }
  };

  const working = job && job.status !== 'done';
  const selected = REPORT_TYPES.find((r) => r.value === type);

  return (
    <Panel coral>
      <PanelTitle icon={FileText} title="Download your PDF report" subtitle="A beautifully typeset, printable report generated from your chart" />

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-2">
          {REPORT_TYPES.map((r) => (
            <label key={r.value} className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition ${type === r.value ? 'border-coral/50 bg-coral/10' : 'border-navy-900/10 hover:border-coral/25'}`}>
              <input type="radio" name="report-type" value={r.value} checked={type === r.value} onChange={() => setType(r.value)} disabled={Boolean(working)} className="mt-1 accent-[#E67A5B]" />
              <span>
                <span className="block font-medium text-navy-900">{r.label} <span className="ml-1 text-xs text-navy-900/40">{r.pages}</span></span>
                <span className="block text-sm text-navy-900/55">{r.desc}</span>
              </span>
            </label>
          ))}
        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-navy-900/10 bg-navy-900/[0.03] p-6 text-center">
          {!job && (
            <>
              <FileText className="mx-auto h-12 w-12 text-coral/70" />
              <p className="mt-4 font-display text-2xl text-navy-900">{selected.label}</p>
              <p className="mt-1 text-sm text-navy-900/55">for {birth.name || 'your chart'}</p>
              <button onClick={generate} className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-coral-gradient px-8 py-3.5 font-medium text-navy-950 shadow-glow transition hover:brightness-110">
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
              <ElapsedTime since={job.startedAt} />
            </>
          )}
          {job?.status === 'done' && (
            <>
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-300" />
              <p className="mt-4 font-display text-2xl text-navy-900">Your report is ready</p>
              <button onClick={download} disabled={downloading} className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-coral-gradient px-8 py-3.5 font-medium text-navy-950 shadow-glow transition hover:brightness-110 disabled:opacity-60">
                {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download PDF
              </button>
              <button onClick={() => setJob(null)} className="mx-auto mt-3 text-xs text-navy-900/50 hover:text-coral">Generate another report</button>
            </>
          )}
          {error && <div className="mt-5 text-left"><ErrorNote error={error} /></div>}
        </div>
      </div>
    </Panel>
  );
}

function ElapsedTime({ since }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const s = Math.floor((now - since) / 1000);
  return <p className="mt-2 text-xs tabular-nums text-navy-900/45">{Math.floor(s / 60)}:{String(s % 60).padStart(2, '0')} elapsed</p>;
}
