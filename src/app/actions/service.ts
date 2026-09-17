"use server";

import { requireAdmin } from './auth';
import { db } from '@/db';
import { services } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { serviceSchema } from '@/lib/schemas/service';
import { revalidateTag, revalidatePath } from 'next/cache';
import { contentTags } from '@/lib/content';
import { redirect } from 'next/navigation';

export async function revalidateServicePaths(slug: string, prevSlug?: string) {
  // @ts-ignore
  revalidateTag(contentTags.services);
  // @ts-ignore
  revalidateTag(contentTags.service(slug));
  if (prevSlug && prevSlug !== slug) {
    // @ts-ignore
    revalidateTag(contentTags.service(prevSlug));
  }
  revalidatePath('/admin/services');
  revalidatePath(`/admin/services/${slug}/edit`);
}

export async function updateService(id: number, formData: FormData): Promise<void> {
  await requireAdmin();
  
  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    kind: formData.get('kind'),
    summary: formData.get('summary') || null,
    description: formData.get('description') || null,
    priceInr: formData.get('priceInr') || null,
    quoteOnly: formData.get('quoteOnly') === 'on',
    isPublished: formData.get('isPublished') === 'on',
  };

  const result = serviceSchema.safeParse(rawData);
  
  if (!result.success) {
    throw new Error('Validation failed');
  }

  const [existing] = await db.select({ slug: services.slug }).from(services).where(eq(services.id, id));
  if (!existing) throw new Error('Not found');

  const [dup] = await db.select().from(services).where(eq(services.slug, result.data.slug));
  if (dup && dup.id !== id) {
    throw new Error('Slug is already in use by another service');
  }

  await db.update(services).set({
    name: result.data.name,
    slug: result.data.slug,
    kind: result.data.kind,
    summary: result.data.summary,
    description: result.data.description,
    priceInr: result.data.priceInr,
    quoteOnly: result.data.quoteOnly,
    isPublished: result.data.isPublished,
    updatedAt: new Date(),
  }).where(eq(services.id, id));

  await revalidateServicePaths(result.data.slug, existing.slug);
  
  redirect('/admin/services');
}
