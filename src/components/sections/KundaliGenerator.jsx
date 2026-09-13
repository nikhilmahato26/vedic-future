import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import SacredBackdrop from '../ui/SacredBackdrop';
import KundaliChart from '../ui/KundaliChart';
import { generateKundali } from '../../utils/kundaliCalculator';
import { site, whatsappLink, primaryPhoneDigits } from '../../data/site';
import {
  Sparkles,
  FaWhatsapp,
  RotateCcw,
  Printer,
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  Gem,
  Sun,
  Moon,
  Flame,
  ShieldCheck,
} from '../../utils/icons';
import { fadeUp, viewport } from '../../utils/motion';

const CITIES = ['Delhi', 'Mumbai', 'Kolkata', 'Bengaluru', 'Jaipur', 'Lucknow', 'Varanasi', 'Ahmedabad'];

export default function KundaliGenerator({ isEmbedded = false }) {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    dob: '1998-05-15',
    time: '10:30',
    place: 'Delhi',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('chart');
  const resultRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter your full name');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const generated = generateKundali(formData);
      setResult(generated);
      setLoading(false);
      setActiveTab('chart');

      // Smooth scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 850);
  };

  const handleReset = () => {
    setResult(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const getWhatsAppMessage = () => {
    if (!result) return '';
    return (
      `Namaste Vedic Future Acharya ji 🙏\n\n` +
      `I have generated my Janam Kundali on your website and would like a detailed personal consultation.\n\n` +
      `• Name: ${result.meta.name}\n` +
      `• Gender: ${result.meta.gender}\n` +
      `• DOB: ${result.meta.dob}\n` +
      `• Birth Time: ${result.meta.time}\n` +
      `• Birth Place: ${result.meta.place}\n` +
      `• Lagna: ${result.astronomy.lagna.name} (${result.astronomy.lagna.english})\n` +
      `• Rashi: ${result.astronomy.rashi.name} (${result.astronomy.rashi.english})\n` +
      `• Nakshatra: ${result.astronomy.nakshatra} (Pada ${result.astronomy.pada})\n` +
      `• Manglik Status: ${result.manglikStatus.title}\n` +
      `• Active Mahadasha: ${result.astronomy.dasha}\n\n` +
      `Please let me know when we can schedule a consultation.`
    );
  };

  return (
    <section id="kundali" className={`relative overflow-hidden ${isEmbedded ? 'pt-8 pb-12' : 'section-pad'}`}>
      {!isEmbedded && <SacredBackdrop variant="default" stars={35} />}

      <div className="container-luxe relative z-10">
        {!isEmbedded && (
          <SectionTitle
            eyebrow="Vedic Jyotish Tool"
            title="Free Janam Kundali Generator"
            subtitle="Discover your cosmic blueprint. Calculate your Lagna chart, planetary placements, Rashi, Nakshatra, and Manglik Dosha instantly with authentic Vedic principles."
          />
        )}

        {/* Input Form Card */}
        {!result && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className="mx-auto mt-10 max-w-3xl"
          >
            <GlassCard gold glow className="p-7 sm:p-10">
              <div className="mb-8 flex items-center justify-between border-b border-gold/20 pb-5">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-ivory sm:text-3xl">
                    Enter Birth Details
                  </h3>
                  <p className="mt-1 text-xs text-ivory/60 sm:text-sm">
                    Exact birth date &amp; time provide precise Ascendant &amp; planetary houses.
                  </p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1 text-xs font-medium text-gold">
                  <Sparkles className="h-3.5 w-3.5" /> 100% Free &amp; Instant
                </span>
              </div>

              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ivory/70">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-ivory/30 bg-ivory/[0.07] px-4 py-3 text-ivory placeholder:text-ivory/40 outline-none transition focus:border-gold/60 focus:bg-ivory/[0.12] focus:ring-1 focus:ring-gold/30"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ivory/70">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-ivory/30 bg-cosmic-900 px-4 py-3 text-ivory outline-none transition focus:border-gold/60 focus:ring-1 focus:ring-gold/30"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Place */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ivory/70">
                      Place of Birth *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="place"
                        required
                        placeholder="City, State (e.g. Delhi)"
                        value={formData.place}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-ivory/30 bg-ivory/[0.07] px-4 py-3 text-ivory placeholder:text-ivory/40 outline-none transition focus:border-gold/60 focus:bg-ivory/[0.12] focus:ring-1 focus:ring-gold/30"
                      />
                      <MapPin className="absolute right-3.5 top-3.5 h-4 w-4 text-gold/60" />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ivory/70">
                      Date of Birth *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="dob"
                        required
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-ivory/30 bg-ivory/[0.07] px-4 py-3 text-ivory outline-none transition focus:border-gold/60 focus:bg-ivory/[0.12] focus:ring-1 focus:ring-gold/30 [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  {/* Time of Birth */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ivory/70">
                      Time of Birth *
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        name="time"
                        required
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-ivory/30 bg-ivory/[0.07] px-4 py-3 text-ivory outline-none transition focus:border-gold/60 focus:bg-ivory/[0.12] focus:ring-1 focus:ring-gold/30 [color-scheme:dark]"
                      />
                    </div>
                  </div>
                </div>

                {/* City Quick Pills */}
                <div>
                  <p className="mb-2 text-[11px] uppercase tracking-wider text-ivory/50">
                    Quick Select Birth City:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {CITIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, place: c }))}
                        className={`rounded-full px-3 py-1 text-xs transition ${
                          formData.place.toLowerCase() === c.toLowerCase()
                            ? 'border border-gold bg-gold/20 text-gold font-medium'
                            : 'border border-white/10 bg-white/[0.03] text-ivory/70 hover:border-gold/40 hover:text-gold'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    icon={Sparkles}
                    iconRight={false}
                    className="w-full justify-center py-4 text-base font-semibold shadow-glow"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-cosmic-950 border-t-transparent animate-spin" />
                        Calculating Astronomical Kundali...
                      </span>
                    ) : (
                      'Generate Janam Kundali Now'
                    )}
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-5 text-center text-xs text-ivory/50 pt-2">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-gold" /> Precise Ascendant / Lagna
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-gold" /> Accurate 9 Grahas in 12 Bhavas
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-gold" /> Complete Privacy Protected
                  </span>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        )}

        {/* Results View */}
        {result && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8 space-y-8"
          >
            {/* Header / Actions Card */}
            <div className="flex flex-col gap-4 rounded-2xl border border-gold/30 bg-cosmic-950/90 p-6 sm:flex-row sm:items-center sm:justify-between shadow-glow">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-gold">
                  <Sparkles className="h-3 w-3" /> Vedic Janam Kundali
                </span>
                <h3 className="mt-2 font-display text-2xl font-bold text-ivory sm:text-3xl">
                  {result.meta.name}
                </h3>
                <p className="mt-1 text-xs text-ivory/60 sm:text-sm">
                  Born on {result.meta.dob} at {result.meta.time} • {result.meta.place} ({result.meta.gender})
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  href={whatsappLink(getWhatsAppMessage(), primaryPhoneDigits)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="gold"
                  size="sm"
                  icon={FaWhatsapp}
                  iconRight={false}
                >
                  Consult Acharya
                </Button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.04] px-4 py-2 text-xs font-medium text-ivory transition hover:border-gold/50 hover:text-gold"
                >
                  <Printer className="h-3.5 w-3.5" /> Print Chart
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.04] px-4 py-2 text-xs font-medium text-ivory/70 transition hover:border-red-400/50 hover:text-red-300"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> New Kundali
                </button>
              </div>
            </div>

            {/* 4 Core Pillars KPI Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {/* Lagna */}
              <div className="glass-gold rounded-2xl p-5 border border-gold/30">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gold/80">
                    Lagna (Ascendant)
                  </p>
                  <span className="text-xl text-gold">{result.astronomy.lagna.symbol}</span>
                </div>
                <h4 className="mt-2 font-display text-2xl font-bold text-ivory">
                  {result.astronomy.lagna.name}
                </h4>
                <p className="text-xs text-ivory/60">
                  {result.astronomy.lagna.english} • Ruled by {result.astronomy.lagna.lord}
                </p>
              </div>

              {/* Rashi */}
              <div className="glass-gold rounded-2xl p-5 border border-gold/30">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gold/80">
                    Moon Sign (Rashi)
                  </p>
                  <Moon className="h-5 w-5 text-indigo-300" />
                </div>
                <h4 className="mt-2 font-display text-2xl font-bold text-ivory">
                  {result.astronomy.rashi.name}
                </h4>
                <p className="text-xs text-ivory/60">
                  {result.astronomy.rashi.english} • Ruled by {result.astronomy.rashi.lord}
                </p>
              </div>

              {/* Nakshatra */}
              <div className="glass-gold rounded-2xl p-5 border border-gold/30">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gold/80">
                    Nakshatra &amp; Pada
                  </p>
                  <Sun className="h-5 w-5 text-amber-300" />
                </div>
                <h4 className="mt-2 font-display text-2xl font-bold text-ivory">
                  {result.astronomy.nakshatra}
                </h4>
                <p className="text-xs text-ivory/60">
                  Pada {result.astronomy.pada} • Lord {result.astronomy.nakshatraLord}
                </p>
              </div>

              {/* Active Mahadasha */}
              <div className="glass-gold rounded-2xl p-5 border border-gold/30">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gold/80">
                    Active Mahadasha
                  </p>
                  <Flame className="h-5 w-5 text-orange-400" />
                </div>
                <h4 className="mt-2 font-display text-2xl font-bold text-ivory">
                  {result.astronomy.dasha}
                </h4>
                <p className="text-xs text-ivory/60">{result.astronomy.dashaDuration}</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 border-b border-gold/20 pb-4">
              {[
                { id: 'chart', label: 'Lagna Chart & Dosha' },
                { id: 'planets', label: 'Planetary Positions (Grahas)' },
                { id: 'predictions', label: 'Life Predictions' },
                { id: 'remedies', label: 'Vedic Remedies' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                    activeTab === t.id
                      ? 'border border-gold bg-gold/20 text-gold shadow-glow'
                      : 'border border-white/10 bg-white/[0.03] text-ivory/70 hover:border-gold/40 hover:text-ivory'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB 1: Lagna Kundali Chart & Overview */}
            {activeTab === 'chart' && (
              <div className="grid gap-8 lg:grid-cols-2 items-start">
                {/* SVG Chart */}
                <div>
                  <KundaliChart
                    houses={result.houses}
                    title={`${result.meta.name}'s Lagna Kundali (D-1)`}
                  />
                </div>

                {/* Side Insights: Manglik & Lucky Attributes */}
                <div className="space-y-6">
                  {/* Manglik Status Card */}
                  <div
                    className={`rounded-2xl border p-6 ${
                      result.manglikStatus.hasDosha
                        ? 'border-amber-500/40 bg-amber-500/[0.06]'
                        : 'border-emerald-500/40 bg-emerald-500/[0.06]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                          result.manglikStatus.hasDosha
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        <ShieldCheck className="h-4 w-4" /> {result.manglikStatus.title}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-ivory/80">
                      {result.manglikStatus.description}
                    </p>
                    <div className="mt-4 rounded-xl border border-white/10 bg-cosmic-950/60 p-3.5 text-xs text-gold/90">
                      <strong>Vedic Guidance:</strong> {result.manglikStatus.remedy}
                    </div>
                  </div>

                  {/* Lucky Traits */}
                  <div className="glass-gold rounded-2xl p-6 border border-gold/30">
                    <h4 className="font-display text-lg font-semibold text-ivory">
                      Auspicious Attributes
                    </h4>
                    <span className="mt-2 block h-px w-12 bg-gold/50" />

                    <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                        <p className="text-[11px] uppercase tracking-wider text-ivory/50">
                          Lucky Gemstone
                        </p>
                        <p className="mt-1 font-semibold text-gold flex items-center gap-1.5">
                          <Gem className="h-3.5 w-3.5" /> {result.luckyData.gemstone}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                        <p className="text-[11px] uppercase tracking-wider text-ivory/50">
                          Lucky Number
                        </p>
                        <p className="mt-1 font-semibold text-gold">
                          Number {result.luckyData.number}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                        <p className="text-[11px] uppercase tracking-wider text-ivory/50">
                          Lucky Color
                        </p>
                        <p className="mt-1 font-semibold text-ivory/90">
                          {result.luckyData.color}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                        <p className="text-[11px] uppercase tracking-wider text-ivory/50">
                          Favourable Day
                        </p>
                        <p className="mt-1 font-semibold text-ivory/90">
                          {result.luckyData.day} ({result.luckyData.direction})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Planetary Positions Table */}
            {activeTab === 'planets' && (
              <div className="overflow-x-auto rounded-2xl border border-gold/30 bg-cosmic-950/80 p-6 shadow-glow">
                <h4 className="font-display text-xl font-semibold text-ivory mb-2">
                  Planetary Positions (Graha Spashta)
                </h4>
                <p className="text-xs text-ivory/60 mb-6">
                  Detailed distribution of the Navagrahas across the 12 Bhavas and Rashis.
                </p>

                <table className="w-full text-left text-sm text-ivory/80">
                  <thead className="border-b border-gold/30 text-xs uppercase tracking-wider text-gold font-semibold">
                    <tr>
                      <th className="py-3 px-4">Graha (Planet)</th>
                      <th className="py-3 px-4">Rashi (Sign)</th>
                      <th className="py-3 px-4">House (Bhava)</th>
                      <th className="py-3 px-4">Degree</th>
                      <th className="py-3 px-4">Sign Lord</th>
                      <th className="py-3 px-4">Element</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {result.planetaryPositions.map((p) => (
                      <tr key={p.name} className="transition hover:bg-white/[0.03]">
                        <td className="py-3.5 px-4 font-semibold text-ivory flex items-center gap-2">
                          <span className="rounded bg-cosmic-800 px-1.5 py-0.5 text-[10px] text-gold border border-gold/20">
                            {p.code}
                          </span>
                          {p.name}
                        </td>
                        <td className="py-3.5 px-4">{p.rashiName}</td>
                        <td className="py-3.5 px-4 font-medium text-gold">{p.house}</td>
                        <td className="py-3.5 px-4">{p.degree}</td>
                        <td className="py-3.5 px-4">{p.lord}</td>
                        <td className="py-3.5 px-4">{p.element}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 3: Life Predictions */}
            {activeTab === 'predictions' && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="glass-gold rounded-2xl p-6 border border-gold/30">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold border border-gold/30">
                      <Sun className="h-5 w-5" />
                    </span>
                    <h4 className="font-display text-xl font-semibold text-ivory">
                      Personality &amp; Life Purpose
                    </h4>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ivory/70">
                    {result.predictions.personality}
                  </p>
                </div>

                <div className="glass-gold rounded-2xl p-6 border border-gold/30">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold border border-gold/30">
                      <Icon name="Briefcase" className="h-5 w-5" />
                    </span>
                    <h4 className="font-display text-xl font-semibold text-ivory">
                      Career, Finance &amp; Growth
                    </h4>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ivory/70">
                    {result.predictions.career}
                  </p>
                </div>

                <div className="glass-gold rounded-2xl p-6 border border-gold/30">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold border border-gold/30">
                      <Icon name="Heart" className="h-5 w-5" />
                    </span>
                    <h4 className="font-display text-xl font-semibold text-ivory">
                      Marriage &amp; Relationships
                    </h4>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ivory/70">
                    {result.predictions.marriage}
                  </p>
                </div>

                <div className="glass-gold rounded-2xl p-6 border border-gold/30">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold border border-gold/30">
                      <Icon name="Activity" className="h-5 w-5" />
                    </span>
                    <h4 className="font-display text-xl font-semibold text-ivory">
                      Health &amp; Vitality
                    </h4>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ivory/70">
                    {result.predictions.health}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: Vedic Remedies */}
            {activeTab === 'remedies' && (
              <div className="space-y-6">
                <div className="glass-gold rounded-2xl p-7 border border-gold/30">
                  <h4 className="font-display text-2xl font-semibold text-ivory">
                    Prescribed Vedic Upay &amp; Remedies
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/75">
                    {result.predictions.remedy}
                  </p>

                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    {/* Recommended Pooja */}
                    <div className="rounded-xl border border-gold/25 bg-cosmic-950/70 p-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                        Recommended Ritual
                      </p>
                      <h5 className="mt-2 font-display text-lg font-semibold text-ivory">
                        {result.manglikStatus.hasDosha ? 'Navagraha & Mangal Shanti' : 'Ganapathi & Lakshmi Homam'}
                      </h5>
                      <p className="mt-2 text-xs text-ivory/60 leading-relaxed">
                        Conducted by Vedic Future’s authentic pandits to harmonize planetary currents and unlock personal milestones.
                      </p>
                      <Button
                        href={whatsappLink(`Namaste, I would like to arrange a ${result.manglikStatus.hasDosha ? 'Mangal Shanti' : 'Lakshmi Homam'} pooja.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="gold"
                        size="sm"
                        className="mt-4"
                      >
                        Arrange this Pooja
                      </Button>
                    </div>

                    {/* Recommended Yantra */}
                    <div className="rounded-xl border border-gold/25 bg-cosmic-950/70 p-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                        Energized Sacred Yantra
                      </p>
                      <h5 className="mt-2 font-display text-lg font-semibold text-ivory">
                        Energized {result.astronomy.lagna.element === 'Fire' ? 'Surya & Shree Yantra' : 'Kubera & Protection Yantra'}
                      </h5>
                      <p className="mt-2 text-xs text-ivory/60 leading-relaxed">
                        Hand-drawn and energized according to your Janma Kundali to radiate continuous protective aura in your home or office.
                      </p>
                      <Button
                        href={whatsappLink(`Namaste, I want to order an energized Yantra tailored for ${result.astronomy.lagna.name} Lagna.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="glass"
                        size="sm"
                        className="mt-4"
                      >
                        Enquire for Yantra
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Conversion Banner */}
            <div className="rounded-2xl border border-gold/30 bg-gradient-to-r from-cosmic-800 via-cosmic-900 to-cosmic-950 p-7 text-center sm:p-10 shadow-glow">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold mb-3">
                <Sparkles className="h-7 w-7" />
              </span>
              <h4 className="font-display text-2xl font-bold text-ivory sm:text-3xl">
                Ready for a Comprehensive Personal Reading?
              </h4>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ivory/70">
                While this chart maps your fundamental blueprint, our Acharya provides deep time-honoured insights into transit timing, dasha junctions, and specific solutions for marriage, wealth, and career.
              </p>

              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  href={whatsappLink(getWhatsAppMessage(), primaryPhoneDigits)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="gold"
                  size="lg"
                  icon={FaWhatsapp}
                  iconRight={false}
                >
                  Discuss Chart With Acharya on WhatsApp
                </Button>
                <Button href="#contact" variant="glass" size="lg">
                  Book In-Person Sitting
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
