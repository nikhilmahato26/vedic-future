import { db } from '../index';
import { adminUsers, services, siteSettings } from '../schema';
import { seedAdmin, seedServices } from './data';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🌱 Seeding database...');

  // Admin User
  const existingAdmin = await db.select().from(adminUsers).where(eq(adminUsers.email, seedAdmin.email));
  if (existingAdmin.length === 0) {
    await db.insert(adminUsers).values(seedAdmin);
    console.log(`✅ Created admin user: ${seedAdmin.email} / password123`);
  } else {
    console.log('ℹ️ Admin user already exists.');
  }

  // Site Settings
  const existingSettings = await db.select().from(siteSettings);
  if (existingSettings.length === 0) {
    await db.insert(siteSettings).values({
      brandName: 'Vedic Future',
      tagline: 'Illuminating your path with Vedic wisdom',
      whatsappNumber: '919876543210',
      email: 'contact@vedicfuture.com',
    });
    console.log('✅ Created site settings');
  }

  // Services
  for (const svc of seedServices) {
    const existingSvc = await db.select().from(services).where(eq(services.slug, svc.slug));
    if (existingSvc.length === 0) {
      await db.insert(services).values(svc);
      console.log(`✅ Created service: ${svc.name}`);
    }
  }

  console.log('✅ Seeding complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
