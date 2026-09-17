import { db } from '../index';
import { services } from '../schema';
import { eq } from 'drizzle-orm';

const moreServices = [
  { kind: 'panchang' as const, slug: 'panchang', name: 'Premium Panchang', summary: 'Daily astrology almanac', description: 'Access today\'s detailed panchang, yogas, and timings.', priceInr: 101, sortOrder: 4, isPublished: true },
  { kind: 'horoscope' as const, slug: 'horoscope', name: 'Detailed Horoscope', summary: 'Daily/Weekly predictions', description: 'Read your personalized astrological forecast.', priceInr: 501, sortOrder: 5, isPublished: true },
  { kind: 'muhurta' as const, slug: 'muhurat', name: 'Auspicious Muhurat', summary: 'Find the perfect timing', description: 'Get the most auspicious timing for life events.', priceInr: 1100, sortOrder: 6, isPublished: true },
  { kind: 'dhan_yoga' as const, slug: 'dhan-yoga', name: 'Dhan Yoga Check', summary: 'Wealth combinations', description: 'Find specific astrological indicators of wealth.', priceInr: 501, sortOrder: 7, isPublished: true },
];

async function main() {
  for (const svc of moreServices) {
    const existingSvc = await db.select().from(services).where(eq(services.slug, svc.slug));
    if (existingSvc.length === 0) {
      await db.insert(services).values(svc);
      console.log(`✅ Created service: ${svc.name}`);
    }
  }
  process.exit(0);
}
main();
