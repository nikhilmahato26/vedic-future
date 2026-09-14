import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  FaWhatsapp,
  FaYoutube,
  Play,
  Pause,
  Volume2,
  VolumeX,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
} from '../../utils/icons';
import Button from '../ui/Button';
import SacredBackdrop from '../ui/SacredBackdrop';
import { site, telLink, whatsappLink, primaryPhoneDigits } from '../../data/site';
import { trustIndicators } from '../../data/content';
import logoImg from '../../assets/images/logo.png';
import heroPlaceholderImg from '../../assets/images/hero-placeholder.jpg';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // If a video URL is provided in site.heroVideoUrl, play that; otherwise show the placeholder
  const heroVideoUrl = site.heroVideoUrl;

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
      return;
    }

    video.pause();
    setIsPlaying(false);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16 lg:pt-32"
    >
      <SacredBackdrop variant="default" stars={55} />
      {/* bottom veil so it melts into the next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-cream-veil" />

      <div className="container-luxe relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.78fr)] lg:gap-14"
        >
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
            {/* Badge */}
            <motion.div
              variants={item}
              className="glass-coral mb-8 inline-flex items-center gap-3 rounded-full px-5 py-2 text-xs font-medium uppercase tracking-[0.2em] text-coral"
            >
              <img src={logoImg} alt="" aria-hidden="true" className="h-8 w-8 object-contain" />
              25+ Years Experience
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={item}
              className="font-display text-4xl font-semibold leading-[1.08] text-navy-900 sm:text-6xl lg:text-7xl text-balance"
            >
              Unlock Your Destiny Through
              <span className="mt-1 block text-coral-gradient-animate">Vedic Wisdom</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={item}
              className="mt-7 max-w-2xl text-base leading-relaxed text-navy-900/70 sm:text-lg"
            >
              Vedic Astrology • Numerology • Vastu • Spiritual Healing • Poojas &amp; Homas
            </motion.p>

            <motion.div
              variants={item}
              className="mt-5 flex flex-col items-center justify-center gap-3 text-sm text-navy-900/65 sm:flex-row sm:flex-wrap lg:justify-start"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-navy-900/80">
                <span className="h-2 w-2 rounded-full bg-coral animate-pulse" />
                Location: {site.location.full}
              </span>
              <span className="max-w-xl">
                Consultations available in {site.serviceLanguages.join(' & ')} • Delhi &amp; Online
              </span>
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={item}
              className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap lg:justify-start"
            >
              <Button href="#contact" variant="coral" size="lg" icon={CalendarDays} iconRight={false}>
                Book Consultation
              </Button>
              <Button
                href={telLink(primaryPhoneDigits)}
                variant="glass"
                size="lg"
                icon={Phone}
                iconRight={false}
              >
                Call Now
              </Button>
              <Button
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="lg"
                icon={FaWhatsapp}
                iconRight={false}
              >
                WhatsApp Consultation
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.ul
              variants={item}
              className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 lg:justify-start"
            >
              {trustIndicators.map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-navy-900/70">
                  <CheckCircle2 className="h-4 w-4 text-coral" />
                  {t}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Hero Media / Video Placeholder */}
          <motion.div
            variants={item}
            className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-coral/15 blur-3xl animate-pulse" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-coral/40 bg-navy-950/80 shadow-glow-lg">
              {heroVideoUrl ? (
                // If a video URL is configured
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    src={heroVideoUrl}
                    poster={heroPlaceholderImg}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={`${site.name} introduction video`}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause hero video' : 'Play hero video'}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-navy-950/75 text-white shadow-glass backdrop-blur-md transition hover:border-coral/60 hover:text-coral"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={isMuted ? 'Unmute hero video' : 'Mute hero video'}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-navy-950/75 text-white shadow-glass backdrop-blur-md transition hover:border-coral/60 hover:text-coral"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                // Video Placeholder with rich interactive preview
                <div
                  className="group relative aspect-[3/4] w-full cursor-pointer overflow-hidden"
                  onClick={() => setShowVideoModal(true)}
                >
                  <img
                    src={heroPlaceholderImg}
                    alt={`${site.name} Introduction Video Placeholder`}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-navy-950/60 transition-opacity duration-300 group-hover:opacity-80" />

                  {/* Top badges */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                    <span className="glass-coral inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-coral">
                      <span className="h-2 w-2 rounded-full bg-coral animate-ping" />
                      {site.name}
                    </span>
                    <span className="rounded-full border border-white/20 bg-navy-950/70 px-3 py-1 text-[10px] font-medium tracking-wider text-white/85 backdrop-blur-md">
                      Video Placeholder
                    </span>
                  </div>

                  {/* Center Play Button with ripple effect */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div className="relative flex items-center justify-center">
                      <span className="absolute h-24 w-24 rounded-full bg-coral/20 animate-ping opacity-75" />
                      <span className="absolute h-20 w-20 rounded-full bg-coral/30 blur-sm" />
                      <button
                        type="button"
                        aria-label="Play introduction video placeholder"
                        className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-coral bg-coral-gradient text-navy-950 shadow-[0_0_30px_rgba(230,122,91,0.55)] transition-transform duration-300 group-hover:scale-110"
                      >
                        <Play className="h-7 w-7 fill-current ml-1" />
                      </button>
                    </div>
                    <p className="mt-4 font-display text-sm font-semibold tracking-wider text-white drop-shadow-md">
                      Watch Introduction
                    </p>
                  </div>

                  {/* Bottom info bar */}
                  <div className="absolute bottom-4 inset-x-4 z-10 rounded-xl border border-white/10 bg-navy-900/80 p-3.5 backdrop-blur-md">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="font-medium text-white">Sacred Introduction Preview</p>
                        <p className="text-[10px] text-white/55">Vedic Astrology &amp; Divine Solutions</p>
                      </div>
                      <span className="rounded-md border border-coral/30 bg-coral/10 px-2 py-0.5 text-[10px] text-coral font-medium">
                        HD 1080p
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Video Placeholder Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-md"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-coral/30 bg-white p-6 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-coral/10 text-coral mb-4">
              <Play className="h-8 w-8 fill-current" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-navy-900">
              {site.name} Video Placeholder
            </h3>
            <p className="mt-3 text-sm text-navy-900/70 leading-relaxed">
              This is the dedicated placeholder spot for the official {site.name} introduction video.
              To connect your live video file or YouTube clip, simply set{' '}
              <code className="rounded bg-navy-900/8 px-1.5 py-0.5 text-coral font-mono text-xs">
                heroVideoUrl
              </code>{' '}
              in <span className="text-coral">src/data/site.js</span>.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button href="#contact" variant="coral" size="sm" onClick={() => setShowVideoModal(false)}>
                Book Consultation Now
              </Button>
              <Button
                variant="glass"
                size="sm"
                onClick={() => setShowVideoModal(false)}
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-navy-900/40 sm:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.25em]">Scroll</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ChevronDown className="h-5 w-5 text-coral/70" />
        </motion.span>
      </motion.a>
    </section>
  );
}
