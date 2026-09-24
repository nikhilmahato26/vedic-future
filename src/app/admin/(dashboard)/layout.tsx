import { requireAdmin, logout } from '@/app/actions/auth';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-cream-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <span className="font-bold">Vedic Future Admin</span>
        <form action={logout}>
          <button className="text-sm font-medium text-ink-500">Logout</button>
        </form>
      </header>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-cream-200 min-h-screen p-6 sticky top-0">
        <h2 className="text-xl font-bold mb-8">Vedic Future</h2>
        <nav className="flex-1 space-y-2">
          <Link href="/admin/services" className="block px-4 py-2 rounded-md bg-cream-100 text-coral-600 font-medium">Services (Pricing)</Link>
          <Link href="/admin/generate" className="block px-4 py-2 rounded-md hover:bg-cream-100 font-medium">Generate Reports</Link>
          <Link href="/admin/bookings" className="block px-4 py-2 rounded-md hover:bg-cream-100 font-medium">Inbox & Orders</Link>
          <Link href="/admin/settings" className="block px-4 py-2 rounded-md hover:bg-cream-100 font-medium">Settings</Link>
        </nav>
        <div className="pt-4 border-t border-cream-200">
          <div className="text-sm text-ink-500 truncate mb-2">{session.email}</div>
          <form action={logout}>
            <button className="text-sm font-medium hover:text-coral-600 transition-colors">Logout</button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-5xl">
        {children}
      </main>
    </div>
  );
}
