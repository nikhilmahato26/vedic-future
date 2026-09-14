import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from '../../utils/icons';
import SacredBackdrop from '../ui/SacredBackdrop';
import { site } from '../../data/site';

const mediaItems = [
  {
    type: 'video',
    src: 'https://res.cloudinary.com/dynbpb9u0/video/upload/v1780658790/WhatsApp_Video_2026-06-05_at_16.55.47_ddpcow.mp4',
    label: 'Vedic Future — Video 1',
  },
  {
    type: 'video',
    src: 'https://res.cloudinary.com/dynbpb9u0/video/upload/v1780658797/WhatsApp_Video_2026-06-05_at_15.17.16_fiqitd.mp4',
    label: 'Vedic Future — Video 2',
  },
  {
    type: 'image',
    src: 'https://res.cloudinary.com/dynbpb9u0/image/upload/v1780658798/WhatsApp_Image_2026-06-05_at_15.19.41_box3bk.jpg',
    label: 'Vedic Future — Photo 1',
  },
  {
    type: 'image',
    src: 'https://res.cloudinary.com/dynbpb9u0/image/upload/v1780658798/WhatsApp_Image_2026-06-05_at_15.18.14_fcfee9.jpg',
    label: 'Vedic Future — Photo 2',
  },
  {
    type: 'image',
    src: 'https://res.cloudinary.com/dynbpb9u0/image/upload/v1780743620/WhatsApp_Image_2026-06-06_at_15.51.05_y5uuww.jpg',
    label: 'Vedic Future — Photo 3',
  },
  {
    type: 'video',
    src: 'https://res.cloudinary.com/dynbpb9u0/video/upload/v1780743607/WhatsApp_Video_2026-06-06_at_15.58.05_lv4uhf.mp4',
    label: 'Vedic Future — Video 3',
  },
  {
    type: 'video',
    src: 'https://res.cloudinary.com/dynbpb9u0/video/upload/v1780743595/WhatsApp_Video_2026-06-06_at_15.55.09_mcpdfg.mp4',
    label: 'Vedic Future — Video 4',
  },
  {
    type: 'video',
    src: 'https://res.cloudinary.com/dynbpb9u0/video/upload/v1780743595/WhatsApp_Video_2026-06-06_at_15.50.31_vdrcj8.mp4',
    label: 'Vedic Future — Video 5',
  },
];

// Split items into N columns in round-robin order
function splitColumns(items, cols) {
  const columns = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => columns[i % cols].push(item));
  return columns;
}

function VideoCard({ src, label }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-coral/25 bg-navy-950/70 shadow-glow"
    >
      <video
        ref={videoRef}
        src={src}
        aria-label={label}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-auto object-contain block"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
      <div className="absolute bottom-3 right-3 z-10 flex gap-2">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-navy-950/80 text-white backdrop-blur-md transition hover:border-coral/60 hover:text-coral"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-navy-950/80 text-white backdrop-blur-md transition hover:border-coral/60 hover:text-coral"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </motion.div>
  );
}

function ImageCard({ src, label }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-2xl border border-coral/25 bg-navy-950/70 shadow-glow"
    >
      <img
        src={src}
        alt={label}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-auto object-contain block transition-all duration-700 ease-in-out hover:scale-105 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </motion.div>
  );
}

export default function Gallery() {
  const cols2 = splitColumns(mediaItems, 2);
  const cols3 = splitColumns(mediaItems, 3);

  return (
    <section id="gallery" className="relative overflow-hidden py-24 lg:py-32">
      <SacredBackdrop variant="alt" stars={30} />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-32 bg-cream-veil" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-32 bg-cream-veil" />

      <div className="container-luxe relative z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 text-center"
        >
          <h2 className="font-display text-4xl font-semibold text-navy-900 sm:text-5xl">
            {site.name}
          </h2>
          <p className="mt-2 font-sanskrit text-lg tracking-widest text-coral-gradient-animate">
            Sacred Space &amp; Consultations
          </p>
          <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-coral/60 to-transparent" />
          <p className="mx-auto mt-6 max-w-xl text-base text-navy-900/60">
            A glimpse into our sacred space and divine consultations
          </p>
        </motion.div>

        {/* 2-col layout on sm, hidden on lg */}
        <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:hidden">
          {cols2.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-5 sm:gap-6">
              {col.map((item) =>
                item.type === 'video' ? (
                  <VideoCard key={item.src} src={item.src} label={item.label} />
                ) : (
                  <ImageCard key={item.src} src={item.src} label={item.label} />
                )
              )}
            </div>
          ))}
        </div>

        {/* 3-col layout on lg+ */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
          {cols3.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-6">
              {col.map((item) =>
                item.type === 'video' ? (
                  <VideoCard key={item.src} src={item.src} label={item.label} />
                ) : (
                  <ImageCard key={item.src} src={item.src} label={item.label} />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
