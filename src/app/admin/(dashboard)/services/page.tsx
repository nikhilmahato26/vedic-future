import { requireAdmin } from '@/app/actions/auth';
import { db } from '@/db';
import { services } from '@/db/schema';
import { asc } from 'drizzle-orm';
import Link from 'next/link';

export default async function ServicesAdminPage() {
  await requireAdmin();
  const allServices = await db.select().from(services).orderBy(asc(services.sortOrder));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services & Pricing</h1>
      </div>

      <div className="bg-white rounded-[var(--radius-card)] shadow-sm border border-cream-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream-50 border-b border-cream-200 text-sm text-ink-500">
                <th className="p-4 font-medium">Service</th>
                <th className="p-4 font-medium">Kind</th>
                <th className="p-4 font-medium text-right">Price (INR)</th>
                <th className="p-4 font-medium text-center">Published</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200 text-sm">
              {allServices.map((svc) => (
                <tr key={svc.id} className="hover:bg-cream-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-ink-900">{svc.name}</div>
                    <div className="text-ink-500 text-xs mt-1">/{svc.slug}</div>
                  </td>
                  <td className="p-4"><span className="bg-cream-200 text-ink-800 px-2 py-1 rounded-[var(--radius-chip)] text-xs uppercase tracking-wider">{svc.kind}</span></td>
                  <td className="p-4 text-right tabular-nums font-medium">
                    {svc.quoteOnly ? (
                      <span className="text-ink-500 italic">Quote</span>
                    ) : (
                      `₹${svc.priceInr}`
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {svc.isPublished ? (
                      <span className="text-green-700 bg-green-50 px-2 py-1 rounded-[var(--radius-chip)] text-xs">Yes</span>
                    ) : (
                      <span className="text-ink-500 bg-cream-100 px-2 py-1 rounded-[var(--radius-chip)] text-xs">No</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/admin/services/${svc.slug}/edit`}
                      className="text-saffron-600 hover:text-saffron-500 font-medium bg-saffron-50/50 px-3 py-2 rounded-md min-h-[36px] inline-flex items-center justify-center"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allServices.length === 0 && (
          <div className="p-8 text-center text-ink-500">No services found.</div>
        )}
      </div>
    </div>
  );
}
