import { motion } from 'framer-motion';

/**
 * Authentic North Indian Diamond Chart (Lagna Kundali)
 * Rendered using precision SVG coordinates.
 *
 * Houses:
 *  1: Top Center Diamond
 *  2: Top Left Triangle
 *  3: Left Top Triangle
 *  4: Left Center Diamond
 *  5: Left Bottom Triangle
 *  6: Bottom Left Triangle
 *  7: Bottom Center Diamond
 *  8: Bottom Right Triangle
 *  9: Right Bottom Triangle
 * 10: Right Center Diamond
 * 11: Right Top Triangle
 * 12: Top Right Triangle
 */

const HOUSE_COORDINATES = {
  1: { x: 200, y: 105, rashiX: 200, rashiY: 60, name: '1st House (Lagna)' },
  2: { x: 100, y: 55, rashiX: 130, rashiY: 35, name: '2nd House (Dhana)' },
  3: { x: 50, y: 105, rashiX: 40, rashiY: 70, name: '3rd House (Sahaja)' },
  4: { x: 100, y: 200, rashiX: 145, rashiY: 200, name: '4th House (Sukha)' },
  5: { x: 50, y: 300, rashiX: 40, rashiY: 335, name: '5th House (Putra)' },
  6: { x: 100, y: 350, rashiX: 130, rashiY: 370, name: '6th House (Ari)' },
  7: { x: 200, y: 295, rashiX: 200, rashiY: 345, name: '7th House (Yuvati)' },
  8: { x: 300, y: 350, rashiX: 270, rashiY: 370, name: '8th House (Randhra)' },
  9: { x: 350, y: 300, rashiX: 360, rashiY: 335, name: '9th House (Dharma)' },
  10: { x: 300, y: 200, rashiX: 255, rashiY: 200, name: '10th House (Karma)' },
  11: { x: 350, y: 105, rashiX: 360, rashiY: 70, name: '11th House (Labha)' },
  12: { x: 300, y: 55, rashiX: 270, rashiY: 35, name: '12th House (Vyaya)' },
};

const PLANET_COLORS = {
  Asc: '#E5C07B',
  Su: '#F59E0B',
  Mo: '#E0E7FF',
  Ma: '#EF4444',
  Me: '#10B981',
  Ju: '#FBBF24',
  Ve: '#EC4899',
  Sa: '#3B82F6',
  Ra: '#8B5CF6',
  Ke: '#9CA3AF',
};

export default function KundaliChart({ houses = {}, title = 'Lagna Kundali (D-1 Chart)' }) {
  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-gold/35 bg-cosmic-950/80 p-4 sm:p-6 shadow-glow">
      <div className="mb-4 flex items-center justify-between border-b border-gold/20 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-gold animate-ping" />
          <h4 className="font-display text-base font-semibold tracking-wide text-ivory sm:text-lg">
            {title}
          </h4>
        </div>
        <span className="rounded-full border border-gold/30 bg-gold/[0.08] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gold">
          North Indian Style
        </span>
      </div>

      <div className="relative aspect-square w-full">
        <svg
          viewBox="0 0 400 400"
          className="h-full w-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Sacred Gold Gradient */}
            <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFC386" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#AA7C11" />
            </linearGradient>

            {/* Inner background glow */}
            <radialGradient id="sacredCenterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0B132B" stopOpacity="0" />
            </radialGradient>

            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background */}
          <rect x="0" y="0" width="400" height="400" fill="#060A17" />
          <rect x="0" y="0" width="400" height="400" fill="url(#sacredCenterGlow)" />

          {/* Outer Border */}
          <rect
            x="2"
            y="2"
            width="396"
            height="396"
            fill="none"
            stroke="url(#goldStroke)"
            strokeWidth="2.5"
          />

          {/* Diagonals */}
          <line
            x1="0"
            y1="0"
            x2="400"
            y2="400"
            stroke="url(#goldStroke)"
            strokeWidth="1.8"
          />
          <line
            x1="0"
            y1="400"
            x2="400"
            y2="0"
            stroke="url(#goldStroke)"
            strokeWidth="1.8"
          />

          {/* Inner Diamond (connects midpoints: (200,0)-(0,200)-(200,400)-(400,200)-(200,0)) */}
          <polygon
            points="200,0 0,200 200,400 400,200"
            fill="none"
            stroke="url(#goldStroke)"
            strokeWidth="1.8"
          />

          {/* Decorative Corner Ornaments */}
          <circle cx="200" cy="200" r="3.5" fill="#D4AF37" />

          {/* Houses Rendering */}
          {Object.entries(HOUSE_COORDINATES).map(([houseNum, pos]) => {
            const house = houses[houseNum] || { rashi: { id: houseNum }, planets: [] };
            const rashiId = house.rashi?.id || houseNum;
            const planets = house.planets || [];

            return (
              <g key={houseNum} className="group transition-opacity duration-300">
                {/* Rashi Sign Number (Ancient Vedic convention: 1=Aries, 2=Taurus...) */}
                <text
                  x={pos.rashiX}
                  y={pos.rashiY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-gold/60 font-sans text-[11px] font-semibold"
                >
                  {rashiId}
                </text>

                {/* Planets placed in this house */}
                <g transform={`translate(${pos.x}, ${pos.y})`}>
                  {planets.map((p, idx) => {
                    const total = planets.length;
                    // Grid/offset logic inside the house
                    const row = Math.floor(idx / 3);
                    const col = idx % 3;
                    const offsetX = (col - (Math.min(total, 3) - 1) / 2) * 22;
                    const offsetY = (row - Math.floor((total - 1) / 3) / 2) * 14;

                    const planetColor = PLANET_COLORS[p.code] || '#D4AF37';

                    return (
                      <g
                        key={`${p.code}-${idx}`}
                        transform={`translate(${offsetX}, ${offsetY})`}
                      >
                        <rect
                          x="-10"
                          y="-7"
                          width="20"
                          height="14"
                          rx="3"
                          fill="#0D1730"
                          stroke={planetColor}
                          strokeWidth="0.8"
                          opacity="0.9"
                        />
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={planetColor}
                          className="font-sans text-[9px] font-bold"
                        >
                          {p.code}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Planetary Legend */}
      <div className="mt-4 border-t border-white/10 pt-3">
        <p className="mb-2 text-[10px] uppercase tracking-widest text-ivory/50">
          Graha Abbreviations:
        </p>
        <div className="grid grid-cols-5 gap-1.5 text-[10px] text-ivory/70">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E5C07B]" /> Asc: Lagna
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" /> Su: Sun
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E0E7FF]" /> Mo: Moon
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444]" /> Ma: Mars
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" /> Me: Mercury
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FBBF24]" /> Ju: Jupiter
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EC4899]" /> Ve: Venus
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" /> Sa: Saturn
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" /> Ra: Rahu
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#9CA3AF]" /> Ke: Ketu
          </span>
        </div>
      </div>
    </div>
  );
}
