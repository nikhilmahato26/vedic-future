import GlassCard from './GlassCard';
import Icon from './Icon';

export default function TestimonialCard({ quote, name, role, location }) {
  return (
    <GlassCard gold glow={false} className="flex h-full flex-col p-8">
      <Icon name="Quote" className="mb-5 h-9 w-9 text-gold/40" />

      <p className="flex-1 font-display text-lg leading-relaxed text-ivory/85 text-pretty">
        “{quote}”
      </p>

      <div className="mt-6 flex items-center gap-1 text-gold">
        {Array.from({ length: 5 }).map((_, i) => (
          <Icon key={i} name="Star" className="h-4 w-4 fill-gold" />
        ))}
      </div>

      <div className="mt-5 border-t border-white/10 pt-5">
        <p className="font-sans font-semibold text-ivory">{name}</p>
        <p className="text-sm text-gold/80">{role}</p>
        <p className="text-xs text-ivory/45">{location}</p>
      </div>
    </GlassCard>
  );
}
