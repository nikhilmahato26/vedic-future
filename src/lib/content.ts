import "server-only";
import { unstable_cache } from 'next/cache';
import { db, hasDatabase } from '../db';
import { services, siteSettings } from '../db/schema';
import { eq, asc } from 'drizzle-orm';
import { seedServices } from '../db/seed/data';

export const contentTags = {
  settings: 'site_settings',
  services: 'services',
  service: (slug: string) => `service:${slug}`,
};

export const getSiteSettings = unstable_cache(async () => {
  if (!hasDatabase()) return null;
  const [settings] = await db.select().from(siteSettings).limit(1);
  return settings || null;
}, ['site_settings'], { tags: [contentTags.settings], revalidate: 3600 });

export const getServices = unstable_cache(async () => {
  if (!hasDatabase()) return seedServices;
  return await db.select().from(services)
    .where(eq(services.isPublished, true))
    .orderBy(asc(services.sortOrder));
}, ['services_list'], { tags: [contentTags.services], revalidate: 3600 });

export const getServiceBySlug = unstable_cache(async (slug: string) => {
  if (!hasDatabase()) return seedServices.find(s => s.slug === slug) || null;
  const [service] = await db.select().from(services)
    .where(eq(services.slug, slug));
  return service || null;
}, ['service_by_slug'], { tags: ['services'], revalidate: 3600 });
