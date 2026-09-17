import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vedicfuture.com';
  
  const routes = [
    '',
    '/astrology',
    '/astro-tools',
    '/kundali',
    '/kundli-milan',
    '/panchang',
    '/horoscope',
    '/muhurat',
    '/vastu',
    '/dhan-yoga'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  return routes;
}
