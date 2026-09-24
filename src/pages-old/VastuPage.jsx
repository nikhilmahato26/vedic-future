"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAstroHref } from '../context/AstroBase';
import PageHeader from '../components/astro/PageHeader';
import { BirthFields, birthIsComplete, emptyBirth } from '../components/astro/BirthForm';
import { Field, selectCls } from '../components/astro/fields';
import useAstro from '../hooks/useAstro';
import { birthParams, NAKSHATRA_NAMES } from '../lib/astro';
import {
  Async, Badge, ConsultCTA, LangToggle, List, Panel, PanelTitle, Prose, Stat,
} from '../components/astro/ui';
import {
  Compass, Home, Leaf, Info, AlertTriangle, ArrowRight, CalendarCheck,
  Droplets, Sun, ChefHat, Mountain, Bed, DoorOpen, Wind, Waves,
} from '../utils/icons';

const ZONES = [
  { dir: 'Northeast', hindi: 'Ishanya', Icon: Droplets, element: 'Water', use: 'Pooja room, meditation, water feature', avoid: 'Toilets, heavy storage, kitchen' },
  { dir: 'East', hindi: 'Purva', Icon: Sun, element: 'Air', use: 'Main entrance, living room, windows', avoid: 'Staircases, storage' },
  { dir: 'Southeast', hindi: 'Agneya', Icon: ChefHat, element: 'Fire', use: 'Kitchen, electrical panels, generator', avoid: 'Master bedroom, water storage' },
  { dir: 'South', hindi: 'Dakshin', Icon: Mountain, element: 'Fire', use: 'Heavy furniture, storage room', avoid: 'Main entrance, pooja room' },
  { dir: 'Southwest', hindi: 'Nairutya', Icon: Bed, element: 'Earth', use: 'Master bedroom, heavy structures', avoid: 'Entrance, underground water tank' },
  { dir: 'West', hindi: 'Paschim', Icon: DoorOpen, element: 'Water', use: 'Children’s room, dining area', avoid: 'Prolonged emptiness' },
  { dir: 'Northwest', hindi: 'Vayavya', Icon: Wind, element: 'Air', use: 'Guest room, garage, storage of grains', avoid: 'Master bedroom, kitchen' },
  { dir: 'North', hindi: 'Uttar', Icon: Waves, element: 'Water', use: 'Living room, cash locker, office desk', avoid: 'Toilets, staircase directly ahead' },
];

export default function VastuPage({ service }) {
  const href = useAstroHref();
  const [mode, setMode] = useState('birth'); // 'birth' | 'nakshatra'
  const [birth, setBirth] = useState(emptyBirth);
  const [nakshatra, setNakshatra] = useState('');
  const [manualPick, setManualPick] = useState('Rohini');

  useEffect(() => {
    document.title = 'Vastu Shastra Guide · Vedic Future';
  }, []);

  const birthReady = birthIsComplete(birth);
  const detailsParams = birthReady ? birthParams(birth) : null;
  const planetDetails = useAstro('horoscope/planet-details', mode === 'birth' ? detailsParams : null, { localized: false });

  useEffect(() => {
    const moon = planetDetails.data && Object.values(planetDetails.data).find((p) => p.name === 'Mo');
    if (moon) setNakshatra(moon.nakshatra);
  }, [planetDetails.data]);

  const activeNakshatra = mode === 'birth' ? nakshatra : manualPick;
  const vastu = useAstro('utilities/nakshatra-vastu-details', activeNakshatra ? { nakshatra: activeNakshatra } : null);

  return (
    <>
      <PageHeader
        eyebrow="Vastu Shastra"
        title={<>Vastu <span className="text-coral-gradient">Shastra</span> Guide</>}
        subtitle="The science of directional harmony. Find your personal Vastu direction from your birth Nakshatra, and learn the zone-by-zone layout classical Vastu prescribes for every home."
      />

      <section className="container-luxe relative z-10 pb-24">
        <div className="mb-6 flex justify-end"><LangToggle /></div>

        {/* Mode + input */}
        <Panel coral className="mb-6">
          <PanelTitle icon={Compass} title="Find your personal Vastu direction" subtitle="Based on your birth Nakshatra (the Moon's position at birth)" />
          <div className="mb-6 grid w-full max-w-md grid-cols-2 gap-2 rounded-full border border-coral/20 bg-navy-950/60 p-1 text-sm">
            {[['birth', 'From my birth details'], ['nakshatra', 'I know my Nakshatra']].map(([v, l]) => (
              <button
                key={v}
                type="button"
                onClick={() => setMode(v)}
                aria-pressed={mode === v}
                className={`rounded-full px-3 py-2 font-medium transition ${mode === v ? 'bg-coral text-navy-950' : 'text-cream-100/75 hover:text-coral'}`}
              >
                {l}
              </button>
            ))}
          </div>

          {mode === 'birth' ? (
            <div className="space-y-3">
              <BirthFields value={birth} onChange={setBirth} showName={false} showGender={false} compact />
              {!birthReady && (
                <p className="text-sm text-navy-900/50">Fill in your date, time and place of birth to detect your Nakshatra.</p>
              )}
            </div>
          ) : (
            <Field label="Birth Nakshatra" className="max-w-sm">
              <select className={selectCls} value={manualPick} onChange={(e) => setManualPick(e.target.value)}>
                {NAKSHATRA_NAMES.map((n) => <option key={n}>{n}</option>)}
              </select>
            </Field>
          )}
        </Panel>

        {/* Result */}
        {activeNakshatra && (
          <div className="mb-10 space-y-6">
            <Async state={vastu} loadingLabel="Reading your Vastu profile…">
              {(r) => (
                <>
                  <Panel>
                    <div className="flex flex-wrap items-center gap-3 border-b border-coral/15 pb-5">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-coral/30 bg-coral/10 text-coral">
                        <Compass className="h-6 w-6" />
                      </span>
                      <div>
                        <p className="font-display text-2xl font-semibold text-navy-900">{r.nakshatra} Nakshatra <span className="text-base font-normal text-navy-900/50">(#{r.number})</span></p>
                        <p className="text-sm text-navy-900/55">Ruled by {r.planet} · Deity {r.deity} · {r.animal_symbol}</p>
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <Stat accent label="Vastu direction" value={r.vastu_direction} />
                      <Stat accent label="Element" value={r.element} />
                      <Stat label="Favourable directions" value={r.favorable_directions?.join(', ')} />
                      <Stat label="Lucky colours" value={r.colors?.join(', ')} />
                    </div>
                  </Panel>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <Panel>
                      <PanelTitle icon={Home} title="Ideal home placement" />
                      <Prose>{r.home_placement}</Prose>
                      {r.activities && (
                        <div className="mt-4">
                          <p className="mb-1.5 text-xs uppercase tracking-[0.16em] text-coral/80">Best suited for</p>
                          <Prose className="text-sm">{r.activities}</Prose>
                        </div>
                      )}
                    </Panel>
                    <Panel>
                      <PanelTitle icon={AlertTriangle} title="What to avoid" />
                      <Prose>{r.inauspicious}</Prose>
                      {r.colors?.length > 0 && (
                        <div className="mt-4">
                          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-coral/80">Supportive colours</p>
                          <div className="flex flex-wrap gap-2">
                            {r.colors.map((c) => <Badge key={c} tone="coral">{c}</Badge>)}
                          </div>
                        </div>
                      )}
                    </Panel>
                  </div>
                </>
              )}
            </Async>

            <Panel className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
                <div>
                  <p className="font-display text-lg font-semibold text-navy-900">Planning to move in?</p>
                  <p className="text-sm text-navy-900/60">Find an auspicious Griha Pravesh (house-warming) date.</p>
                </div>
              </div>
              <Link href={href('/muhurat')} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-coral/50 px-5 py-2.5 text-sm font-medium text-coral transition hover:bg-coral/10">
                Find Griha Pravesh Muhurat <ArrowRight className="h-4 w-4" />
              </Link>
            </Panel>
          </div>
        )}

        {/* Zone-by-zone guide */}
        <Panel className="mb-6">
          <PanelTitle icon={Leaf} title="The Vastu Purusha Mandala" subtitle="Classical zone-by-zone guide to the eight directions of a home or office" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ZONES.map((z) => (
              <div key={z.dir} className="rounded-xl border border-navy-900/10 bg-navy-900/[0.03] p-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-coral/30 bg-coral/10 text-coral">
                    <z.Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold text-navy-900">{z.dir}</p>
                    <p className="text-[11px] text-navy-900/45">{z.hindi} · {z.element}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-navy-900/70"><span className="text-emerald-600 font-medium">Best for:</span> {z.use}</p>
                <p className="mt-1.5 text-sm text-navy-900/60"><span className="text-rose-600 font-medium">Avoid:</span> {z.avoid}</p>
              </div>
            ))}
          </div>
        </Panel>

        {/* Why professional Vastu */}
        <Panel coral className="mb-10">
          <PanelTitle icon={Info} title="Why a personal Vastu consultation matters" />
          <Prose>
            Nakshatra Vastu tells you your personal directional alignment. A full Vastu correction, though, reads
            your actual floor plan against the compass, the entrance, room placement, and structural elements
            together — something no calculator can do from birth details alone. Our Acharya offers both on-site visits
            and remote consultations from your floor plan and compass photos.
          </Prose>
          <List
            items={[
              'Site visit or floor-plan + compass photo review',
              'Room-by-room placement correction (kitchen, bedroom, pooja, entrance)',
              'Non-structural remedies — mirrors, colours, Vastu yantras — where walls cannot move',
              'Muhurat for Griha Pravesh, renovation start, or Bhoomi Pujan',
            ]}
          />
        </Panel>

        <ConsultCTA
          title="Book a full Vastu consultation"
          text="Share your floor plan or address a home visit, and get a complete directional analysis with practical remedies."
          message="Namaste 🙏 I would like a Vastu consultation for my home/office."
        />
      </section>
    </>
  );
}
