import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle, Lock, Wand2, FaWhatsapp, Languages } from '../../utils/icons';
import { whatsappLink } from '../../data/site';
import { ASTRO_LANGUAGES, useAstroLang } from '../../context/AstroLang';

/* Surfaces ----------------------------------------------------------- */

export function Panel({ children, className = '', coral = false }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${coral ? 'glass-coral' : 'glass'} p-5 sm:p-7 ${className}`}>
      <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-coral/40 to-transparent" />
      {children}
    </div>
  );
}

export function PanelTitle({ icon: IconCmp, title, subtitle, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-coral/15 pb-4">
      <div className="flex items-start gap-3">
        {IconCmp && (
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-coral/30 bg-coral/10 text-coral">
            <IconCmp className="h-4 w-4" />
          </span>
        )}
        <div>
          <h3 className="font-display text-xl font-semibold text-navy-900 sm:text-2xl">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-navy-900/55">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function Stat({ label, value, hint, accent = false }) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${accent ? 'border-coral/40 bg-coral/10' : 'border-navy-900/10 bg-navy-900/[0.03]'}`}>
      <p className="text-[11px] uppercase tracking-[0.18em] text-navy-900/50">{label}</p>
      <p className={`mt-1 font-display text-lg font-semibold leading-snug sm:text-xl ${accent ? 'text-coral' : 'text-navy-900'}`}>
        {value ?? '—'}
      </p>
      {hint && <p className="mt-0.5 text-xs text-navy-900/50">{hint}</p>}
    </div>
  );
}

const BADGE_TONES = {
  good: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
  bad: 'border-rose-400/40 bg-rose-400/10 text-rose-300',
  warn: 'border-amber-400/40 bg-amber-400/10 text-amber-200',
  coral: 'border-coral/40 bg-coral/10 text-coral',
  muted: 'border-navy-900/15 bg-navy-900/5 text-navy-900/70',
};

export function Badge({ tone = 'muted', children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${BADGE_TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}

/** Scrollable table that never widens the page. */
export function DataTable({ columns, rows, rowKey = (_, i) => i, highlight }) {
  return (
    <div className="-mx-1 overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-coral/20 text-[11px] uppercase tracking-[0.14em] text-coral/80">
            {columns.map((c) => (
              <th key={c.key} className={`px-3 py-2.5 font-medium ${c.className || ''}`}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={rowKey(row, i)}
              className={`border-b border-navy-900/5 transition-colors hover:bg-navy-900/[0.03] ${highlight?.(row) ? 'bg-coral/[0.08]' : ''}`}
            >
              {columns.map((c) => (
                <td key={c.key} className={`px-3 py-2.5 text-navy-900/85 ${c.className || ''}`}>
                  {c.render ? c.render(row) : row[c.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Prose({ children, className = '' }) {
  if (!children) return null;
  return <p className={`whitespace-pre-line leading-relaxed text-navy-900/75 ${className}`}>{children}</p>;
}

export function List({ items, tone = 'coral' }) {
  if (!items?.length) return null;
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-navy-900/75">
          <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${tone === 'bad' ? 'bg-rose-300' : tone === 'good' ? 'bg-emerald-300' : 'bg-coral'}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* States ------------------------------------------------------------- */

export function Loading({ label = 'Consulting the ephemeris…', className = '' }) {
  return (
    <div role="status" className={`flex items-center justify-center gap-3 py-10 text-sm text-navy-900/60 ${className}`}>
      <Loader2 className="h-5 w-5 animate-spin text-coral" />
      {label}
    </div>
  );
}

export function ErrorNote({ error, onRetry }) {
  if (!error) return null;

  if (error.needsAiProvider) {
    return (
      <Notice icon={Wand2} title="AI readings are almost ready">
        The site owner needs to connect an AI provider in the VedIntel dashboard to enable narrative readings.
        Meanwhile, our Acharya can give you a personal reading.
      </Notice>
    );
  }

  if (error.isPlanGated) {
    return (
      <Notice icon={Lock} title="Available in personal consultation">
        This advanced analysis isn’t available online yet. Ask our Acharya for it during a consultation.
      </Notice>
    );
  }

  return (
    <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-400/30 bg-rose-400/[0.07] px-4 py-3 text-sm text-rose-200">
      <span className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        {error.message}
      </span>
      {onRetry && (
        <button onClick={onRetry} className="rounded-full border border-rose-300/40 px-3 py-1 text-xs hover:bg-rose-300/10">
          Try again
        </button>
      )}
    </div>
  );
}

function Notice({ icon: IconCmp, title, children }) {
  return (
    <div className="rounded-xl border border-coral/25 bg-coral/[0.06] px-5 py-4">
      <p className="flex items-center gap-2 font-display text-lg font-semibold text-coral">
        <IconCmp className="h-4 w-4" /> {title}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-navy-900/70">{children}</p>
      <a
        href={whatsappLink('Namaste, I would like a personal astrology reading.')}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-coral hover:underline"
      >
        <FaWhatsapp className="h-4 w-4" /> Ask on WhatsApp
      </a>
    </div>
  );
}

/**
 * Renders loading / error / data for a useAstro() state.
 * <Async state={q}>{(data) => ...}</Async>
 */
export function Async({ state, children, loadingLabel, skeleton }) {
  if (state.loading && !state.data) return skeleton || <Loading label={loadingLabel} />;
  if (state.error) return <ErrorNote error={state.error} />;
  if (!state.data) return null;
  return children(state.data);
}

/* Controls ----------------------------------------------------------- */

export function Tabs({ tabs, active, onChange, className = '' }) {
  const scroller = useRef(null);

  // On narrow screens the strip scrolls sideways — keep the selected tab visible.
  useEffect(() => {
    const box = scroller.current;
    const el = box?.querySelector('[aria-selected="true"]');
    if (!box || !el) return;
    const left = el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2;
    box.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [active]);

  return (
    <div ref={scroller} className={`no-scrollbar -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0 ${className}`}>
      <div role="tablist" className="flex w-max gap-1.5 rounded-full border border-coral/20 bg-navy-950/80 p-1.5 backdrop-blur-xl">
        {tabs.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(tab.id)}
              className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selected ? 'text-navy-950' : 'text-cream-100/70 hover:text-coral'
              }`}
            >
              {selected && (
                <motion.span layoutId={`tab-pill-${tabs[0].id}`} className="absolute inset-0 rounded-full bg-coral-gradient" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
              )}
              <span className="relative flex items-center gap-1.5">
                {tab.icon && <tab.icon className="h-3.5 w-3.5" />}
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LangToggle() {
  const { lang, setLang } = useAstroLang();
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-coral/25 bg-navy-950/60 p-1 pl-3 text-xs">
      <Languages className="h-3.5 w-3.5 text-coral" aria-hidden="true" />
      {ASTRO_LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          className={`rounded-full px-3 py-1 font-medium transition ${lang === l.code ? 'bg-coral text-navy-950' : 'text-cream-100/75 hover:text-coral'}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

/** Circular score for match % and similar. */
export function ScoreRing({ value, max, label, size = 150 }) {
  const pct = Math.max(0, Math.min(1, value / max));
  const r = 42;
  const circumference = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(248,244,236,0.08)" strokeWidth="7" />
        <motion.circle
          cx="50" cy="50" r={r} fill="none" stroke="url(#score-coral)" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - pct) }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="score-coral" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F4D98B" />
            <stop offset="100%" stopColor="#A67C13" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-4xl font-bold text-navy-900">
          {value}
          <span className="text-lg text-navy-900/50">/{max}</span>
        </span>
        {label && <span className="mt-0.5 text-xs uppercase tracking-[0.16em] text-coral">{label}</span>}
      </div>
    </div>
  );
}

/** Horizontal bar, used for strengths, bindus, biorhythm. */
export function Bar({ value, max, label, suffix = '', tone = 'coral' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-navy-900/75">{label}</span>
        <span className="tabular-nums text-navy-900/55">{value}{suffix}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-navy-900/[0.07]">
        <motion.div
          className={`h-full rounded-full ${tone === 'bad' ? 'bg-rose-400/70' : tone === 'good' ? 'bg-emerald-400/70' : 'bg-coral-gradient'}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export function ConsultCTA({ message, title = 'Want an Acharya to interpret this for you?', text }) {
  return (
    <Panel coral className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <p className="font-display text-xl font-semibold text-navy-900">{title}</p>
        <p className="mt-1 text-sm text-navy-900/60">
          {text || 'Computer calculations show the what — a personal consultation explains the why, and the remedies.'}
        </p>
      </div>
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-coral-gradient px-6 py-3 text-sm font-medium text-navy-950 shadow-glow transition hover:brightness-110"
      >
        <FaWhatsapp className="h-4 w-4" /> Consult on WhatsApp
      </a>
    </Panel>
  );
}
