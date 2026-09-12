import GlassCard from './GlassCard';
import Icon from './Icon';
import Button from './Button';
import { whatsappLink } from '../../data/site';
import { FaWhatsapp } from '../../utils/icons';

/**
 * Consultation package card. Pricing is intentionally "On Request" — premium
 * consultations are tailored, so we route interest to a direct conversation
 * rather than fixed numbers. Pass a `price` string to override.
 */
export default function PricingCard({
  name,
  price = 'On Request',
  period,
  description,
  features = [],
  highlight = false,
  icon = 'Sparkles',
}) {
  return (
    <GlassCard
      gold={highlight}
      glow={!highlight}
      className={`flex h-full flex-col p-8 ${
        highlight ? 'ring-1 ring-gold/40 shadow-glow' : ''
      }`}
    >
      {highlight && (
        <span className="absolute right-5 top-5 rounded-full bg-gold-gradient px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-cosmic-950">
          Most Sought
        </span>
      )}

      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gold/25 bg-gold/[0.08] text-gold">
        <Icon name={icon} className="h-6 w-6" />
      </div>

      <h3 className="font-display text-2xl font-semibold text-ivory">{name}</h3>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-ivory/55">{description}</p>
      )}

      <div className="mt-5 flex items-end gap-1.5">
        <span className="font-display text-3xl font-semibold text-gold-gradient">
          {price}
        </span>
        {period && <span className="pb-1 text-sm text-ivory/50">/ {period}</span>}
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-ivory/70">
            <Icon name="Check" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Button
        href={whatsappLink(`Namaste, I'm interested in the ${name} consultation.`)}
        target="_blank"
        rel="noopener noreferrer"
        variant={highlight ? 'gold' : 'glass'}
        icon={FaWhatsapp}
        iconRight={false}
        className="mt-7 w-full"
      >
        Enquire Now
      </Button>
    </GlassCard>
  );
}
