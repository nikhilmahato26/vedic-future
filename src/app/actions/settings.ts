"use server";

import { requireAdmin } from './auth';
import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { revalidateTag, revalidatePath } from 'next/cache';
import { contentTags } from '@/lib/content';
import { redirect } from 'next/navigation';

const settingsSchema = z.object({
  brandName: z.string().min(1, 'Brand name is required'),
  tagline: z.string().optional(),
  whatsappNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  heroHeading: z.string().optional(),
  heroSub: z.string().optional(),
  announcement: z.string().optional(),
  announcementActive: z.coerce.boolean().default(false),
});

export async function updateSettings(formData: FormData): Promise<void> {
  await requireAdmin();

  const rawData = {
    brandName: formData.get('brandName'),
    tagline: formData.get('tagline'),
    whatsappNumber: formData.get('whatsappNumber'),
    phoneNumber: formData.get('phoneNumber'),
    email: formData.get('email'),
    address: formData.get('address'),
    heroHeading: formData.get('heroHeading'),
    heroSub: formData.get('heroSub'),
    announcement: formData.get('announcement'),
    announcementActive: formData.get('announcementActive') === 'on',
  };

  const result = settingsSchema.safeParse(rawData);
  if (!result.success) {
    throw new Error('Validation failed: ' + Object.keys(result.error.flatten().fieldErrors).join(', '));
  }

  const [existing] = await db.select().from(siteSettings).limit(1);
  
  if (existing) {
    await db.update(siteSettings).set({
      brandName: result.data.brandName,
      tagline: result.data.tagline || null,
      whatsappNumber: result.data.whatsappNumber || null,
      phoneNumber: result.data.phoneNumber || null,
      email: result.data.email || null,
      address: result.data.address || null,
      heroHeading: result.data.heroHeading || null,
      heroSub: result.data.heroSub || null,
      announcement: result.data.announcement || null,
      announcementActive: result.data.announcementActive,
    }).where(eq(siteSettings.id, existing.id));
  } else {
    await db.insert(siteSettings).values({
      brandName: result.data.brandName,
      tagline: result.data.tagline || null,
      whatsappNumber: result.data.whatsappNumber || null,
      phoneNumber: result.data.phoneNumber || null,
      email: result.data.email || null,
      address: result.data.address || null,
      heroHeading: result.data.heroHeading || null,
      heroSub: result.data.heroSub || null,
      announcement: result.data.announcement || null,
      announcementActive: result.data.announcementActive,
    });
  }

  // @ts-ignore
  revalidateTag(contentTags.settings);
  revalidatePath('/');
  revalidatePath('/admin/settings');
  
  redirect('/admin/settings');
}
