/**
 * Decorative sacred-geometry mandala. Purely ornamental (aria-hidden).
 * Use as a soft, slowly-rotating background accent.
 */
export default function Mandala({ className = '', strokeOpacity = 0.5 }) {
  const petals = Array.from({ length: 12 });
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="#D4AF37" strokeOpacity={strokeOpacity}>
        <circle cx="100" cy="100" r="96" strokeWidth="0.6" />
        <circle cx="100" cy="100" r="78" strokeWidth="0.4" />
        <circle cx="100" cy="100" r="48" strokeWidth="0.6" />
        <circle cx="100" cy="100" r="24" strokeWidth="0.8" />
        {petals.map((_, i) => {
          const angle = (i * 360) / petals.length;
          return (
            <g key={i} transform={`rotate(${angle} 100 100)`}>
              <path
                d="M100 20 C 116 52, 116 68, 100 96 C 84 68, 84 52, 100 20 Z"
                strokeWidth="0.6"
              />
              <line x1="100" y1="4" x2="100" y2="24" strokeWidth="0.5" />
            </g>
          );
        })}
      </g>
      <circle cx="100" cy="100" r="5" fill="#D4AF37" fillOpacity={strokeOpacity + 0.2} />
    </svg>
  );
}
