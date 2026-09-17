"use client";
import { useEffect, useMemo, useState } from 'react';
import CheckoutModal from '../components/ui/CheckoutModal';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import PageHeader from '../components/astro/PageHeader';
import BirthForm from '../components/astro/BirthForm';
import { LangToggle, Panel, Tabs } from '../components/astro/ui';
import { OverviewTab, PlanetsTab, ChartsTab, DashaTab } from '../components/astro/kundali/CoreTabs';
import { DoshaTab, RemediesTab, YogasTab, StrengthTab } from '../components/astro/kundali/DoshaTabs';
import { PredictionsTab, NumerologyTab, AdvancedTab } from '../components/astro/kundali/PredictTabs';
import { AiReadingTab, PdfReportTab } from '../components/astro/kundali/PremiumTabs';
import { birthFromSearch, birthToSearch, formatDate } from '../lib/astro';
import { whatsappLink } from '../data/site';
import {
  Sparkles, Orbit, Grid3x3, Hourglass, Flame, Gem, Crown, Activity, ScrollText, Hash, Compass, Wand2, FileText,
  RotateCcw, Share2, Printer, FaWhatsapp, CalendarDays, Clock, MapPin, Check,
} from '../utils/icons';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Sparkles, Component: OverviewTab },
  { id: 'planets', label: 'Planets', icon: Orbit, Component: PlanetsTab },
  { id: 'charts', label: 'Divisional Charts', icon: Grid3x3, Component: ChartsTab },
  { id: 'dasha', label: 'Dasha', icon: Hourglass, Component: DashaTab },
  { id: 'dosha', label: 'Doshas', icon: Flame, Component: DoshaTab },
  { id: 'remedies', label: 'Gems & Rudraksha', icon: Gem, Component: RemediesTab },
  { id: 'yogas', label: 'Yogas', icon: Crown, Component: YogasTab },
  { id: 'strength', label: 'Ashtakvarga & Shadbala', icon: Activity, Component: StrengthTab },
  { id: 'predictions', label: 'Predictions', icon: ScrollText, Component: PredictionsTab },
  { id: 'numerology', label: 'Numerology', icon: Hash, Component: NumerologyTab },
  { id: 'advanced', label: 'KP · Jaimini · World', icon: Compass, Component: AdvancedTab },
  { id: 'ai', label: 'AI Reading', icon: Wand2, Component: AiReadingTab },
  { id: 'pdf', label: 'PDF Report', icon: FileText, Component: PdfReportTab },
];

export default function KundaliPage({ service }) {
  const [pendingAuth, setPendingAuth] = useState(null);
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
  const birth = useMemo(() => birthFromSearch(searchParams), [searchParams]);
  const activeTab = TABS.some((t) => t.id === searchParams.get('tab')) ? searchParams.get('tab') : 'overview';
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = birth?.name ? `${birth.name}'s Kundali · Vedic Future` : 'Free Janam Kundali · Vedic Future';
  }, [birth?.name]);

  const submit = (b) => {
    if (service) {
      setPendingAuth(b);
    } else {
      setSearchParams({ ...birthToSearch(b), tab: activeTab });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const setTab = (tab) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    setSearchParams(next, { replace: true });
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: 'My Vedic Kundali', url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // user dismissed the share sheet
    }
  };

  const Active = TABS.find((t) => t.id === activeTab).Component;

  return (
    <>
      <PageHeader
        eyebrow="Janam Kundali"
        title={birth ? <>{birth.name ? `${birth.name}'s` : 'Your'} <span className="text-coral-gradient">Janam Kundali</span></> : <>Free <span className="text-coral-gradient">Janam Kundali</span></>}
        subtitle={birth
          ? undefined
          : 'Swiss Ephemeris precision: Lagna & Navamsa charts, 16 divisional charts, Vimshottari, Yogini & Chara dashas, doshas, yogas, Ashtakvarga, remedies and a downloadable PDF report.'}
      >
        {birth && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-navy-900/65">
            <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-coral" />{formatDate(birth.date)}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-coral" />{birth.time}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-coral" />{birth.place.label}</span>
          </div>
        )}
      </PageHeader>

      <section className="container-luxe relative z-10 pb-24">
        {!birth ? (
          <div className="mx-auto max-w-3xl">
            <Panel coral className="sm:p-10">
              <h2 className="mb-6 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">Enter birth details</h2>
              <BirthForm onSubmit={submit} submitLabel="Generate my Kundali" />
            </Panel>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
              <LangToggle />
              <div className="flex flex-wrap gap-2">
                <ToolbarButton onClick={share} icon={copied ? Check : Share2}>{copied ? 'Link copied' : 'Share'}</ToolbarButton>
                <ToolbarButton onClick={() => window.print()} icon={Printer}>Print</ToolbarButton>
                <ToolbarButton onClick={() => setSearchParams({})} icon={RotateCcw}>New Kundali</ToolbarButton>
                <a
                  href={whatsappLink(`Namaste Acharya ji 🙏 I generated my Kundali on your website and would like a detailed consultation.

• Name: ${birth.name || '-'}
• DOB: ${formatDate(birth.date)}
• Time: ${birth.time}
• Place: ${birth.place.label}

My report: ${typeof window !== 'undefined' ? window.location.href : ''}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-coral-gradient px-4 py-2 text-sm font-medium text-navy-950 shadow-glow hover:brightness-110"
                >
                  <FaWhatsapp className="h-4 w-4" /> Consult Acharya
                </a>
              </div>
            </div>

            <Tabs tabs={TABS} active={activeTab} onChange={setTab} className="sticky top-[76px] z-20 mb-8 print:hidden" />

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <Active birth={birth} />
              </motion.div>
            </AnimatePresence>
          </>
        )}

        {service && (
          <CheckoutModal
            isOpen={!!pendingAuth}
            onClose={() => setPendingAuth(null)}
            service={service}
            isUnlockMode={true}
            onSuccess={() => {
              setSearchParams({ ...birthToSearch(pendingAuth), tab: activeTab });
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setPendingAuth(null);
            }}
          />
        )}

      </section>
    </>
  );
}

function ToolbarButton({ icon: IconCmp, children, onClick }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 rounded-full border border-navy-900/15 px-4 py-2 text-sm text-navy-900/75 transition hover:border-coral/50 hover:text-coral">
      <IconCmp className="h-4 w-4" /> {children}
    </button>
  );
}
