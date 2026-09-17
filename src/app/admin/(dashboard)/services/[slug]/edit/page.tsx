import { requireAdmin } from '@/app/actions/auth';
import { db } from '@/db';
import { services } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { updateService } from '@/app/actions/service';
import Link from 'next/link';

export default async function EditServicePage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const slug = (await params).slug;
  const [service] = await db.select().from(services).where(eq(services.slug, slug));
  
  if (!service) notFound();

  // Bind the ID to the server action
  const actionWithId = updateService.bind(null, service.id);

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/services" className="text-ink-500 hover:text-ink-900 text-sm mb-2 inline-block">
          ← Back to Services
        </Link>
        <h1 className="text-2xl font-bold">Edit {service.name}</h1>
      </div>

      <div className="bg-white rounded-[var(--radius-card)] shadow-sm border border-cream-200 overflow-hidden max-w-2xl">
        <form action={actionWithId} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-ink-800" htmlFor="name">Name</label>
              <input 
                id="name" name="name" type="text" required defaultValue={service.name}
                className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-cream-50 focus:ring-2 focus:ring-saffron-500 outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-ink-800" htmlFor="slug">Slug</label>
              <input 
                id="slug" name="slug" type="text" required defaultValue={service.slug}
                className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-cream-50 focus:ring-2 focus:ring-saffron-500 outline-none font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-ink-800" htmlFor="kind">Service Kind</label>
            <select 
              id="kind" name="kind" required defaultValue={service.kind}
              className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-cream-50 focus:ring-2 focus:ring-saffron-500 outline-none"
            >
              <option value="kundali">Kundali</option>
              <option value="horoscope">Horoscope</option>
              <option value="vastu">Vastu</option>
              <option value="matching">Matching</option>
              <option value="muhurta">Muhurta</option>
              <option value="panchang">Panchang</option>
              <option value="dhan_yoga">Dhan Yoga</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-cream-100">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-ink-800" htmlFor="priceInr">Price (INR)</label>
              <input 
                id="priceInr" name="priceInr" type="number" step="1" inputMode="numeric"
                defaultValue={service.priceInr ?? ''}
                disabled={!!service.quoteOnly}
                className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-cream-50 focus:ring-2 focus:ring-saffron-500 outline-none disabled:opacity-50"
              />
              <p className="text-xs text-ink-500">Must be filled unless Quote Only is checked.</p>
            </div>

            <div className="flex items-center space-x-3 pt-6">
              <input 
                id="quoteOnly" name="quoteOnly" type="checkbox" defaultChecked={!!service.quoteOnly}
                className="w-5 h-5 rounded text-saffron-500 focus:ring-saffron-500 border-cream-300"
              />
              <label htmlFor="quoteOnly" className="text-sm font-medium text-ink-800 cursor-pointer">
                Quote Only (Hide Price)
              </label>
            </div>
          </div>

          <div className="space-y-1 pt-4 border-t border-cream-100">
            <label className="block text-sm font-medium text-ink-800" htmlFor="summary">Summary (One line)</label>
            <input 
              id="summary" name="summary" type="text" defaultValue={service.summary || ''}
              className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-cream-50 focus:ring-2 focus:ring-saffron-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-ink-800" htmlFor="description">Full Description</label>
            <textarea 
              id="description" name="description" rows={4} defaultValue={service.description || ''}
              className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-cream-50 focus:ring-2 focus:ring-saffron-500 outline-none resize-y"
            ></textarea>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-cream-100">
            <div className="flex items-center space-x-3">
              <input 
                id="isPublished" name="isPublished" type="checkbox" defaultChecked={!!service.isPublished}
                className="w-5 h-5 rounded text-saffron-500 focus:ring-saffron-500 border-cream-300"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-ink-900 cursor-pointer">
                Publish on Site
              </label>
            </div>

            <button 
              type="submit" 
              className="bg-saffron-500 hover:bg-saffron-600 text-white font-medium px-6 py-3 rounded-[var(--radius-input)] transition-colors min-h-[44px]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
