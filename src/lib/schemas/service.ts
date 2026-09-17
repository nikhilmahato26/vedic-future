import { z } from 'zod';
import { serviceKindEnum } from '@/db/schema';

// Use actual enum values from Drizzle
const serviceKinds = ['kundali', 'horoscope', 'vastu', 'matching', 'muhurta', 'panchang', 'dhan_yoga'] as const;

export const serviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  kind: z.enum(serviceKinds),
  summary: z.string().optional(),
  description: z.string().optional(),
  priceInr: z.coerce.number().optional().nullable(),
  quoteOnly: z.coerce.boolean().default(false),
  isPublished: z.coerce.boolean().default(false),
}).refine(data => {
  if (!data.quoteOnly && (data.priceInr === undefined || data.priceInr === null || data.priceInr <= 0)) {
    return false;
  }
  return true;
}, {
  message: "Set a price, or mark it as quote-only.",
  path: ['priceInr']
});
