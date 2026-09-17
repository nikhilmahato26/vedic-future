import { requireAdmin } from '@/app/actions/auth';
import { db } from '@/db';
import { enquiries } from '@/db/schema';
import { desc } from 'drizzle-orm';

export default async function BookingsAdminPage() {
  await requireAdmin();
  
  const allEnquiries = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    lost: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inbox & Orders</h1>
      </div>

      <div className="bg-white rounded-[var(--radius-card)] shadow-sm border border-cream-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-cream-50 border-b border-cream-200 text-sm text-ink-500">
                <th className="p-4 font-medium">Ref / Date</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Service</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200 text-sm">
              {allEnquiries.map((enq) => {
                const message = encodeURIComponent(`Namaste ${enq.name}, regarding your enquiry for ${enq.productNameSnapshot} (Ref: ${enq.refCode}). `);
                const waLink = `https://wa.me/91${enq.phone}?text=${message}`;

                return (
                  <tr key={enq.id} className="hover:bg-cream-50 transition-colors">
                    <td className="p-4 align-top">
                      <div className="font-mono text-xs font-semibold text-coral-600">{enq.refCode}</div>
                      <div className="text-ink-500 text-xs mt-1">
                        {enq.createdAt ? new Date(enq.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="font-medium text-ink-900">{enq.name}</div>
                      <div className="text-ink-500 text-xs mt-1">{enq.phone}</div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="font-medium text-ink-900">{enq.productNameSnapshot}</div>
                      <div className="text-ink-500 text-xs mt-1">
                        Target Date: {enq.consultationDate || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      {enq.paymentStatus === 'paid' ? (
                        <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-[var(--radius-chip)] text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          ₹{enq.productPriceSnapshotInr} Paid
                        </span>
                      ) : enq.paymentStatus === 'pending' && enq.productPriceSnapshotInr === null ? (
                        <span className="text-ink-500 bg-cream-100 px-2 py-1 rounded-[var(--radius-chip)] text-xs">Quote Needed</span>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 px-2 py-1 rounded-[var(--radius-chip)] text-xs">Pending ₹{enq.productPriceSnapshotInr}</span>
                      )}
                    </td>
                    <td className="p-4 align-top">
                      <span className={`px-2 py-1 rounded-[var(--radius-chip)] text-xs uppercase tracking-wider font-medium ${statusColors[enq.status || 'new']}`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="p-4 align-top text-right space-x-2">
                      <a 
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 font-medium bg-green-50 px-3 py-2 rounded-md inline-flex items-center text-xs"
                      >
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {allEnquiries.length === 0 && (
          <div className="p-8 text-center text-ink-500">No orders or enquiries yet.</div>
        )}
      </div>
    </div>
  );
}
