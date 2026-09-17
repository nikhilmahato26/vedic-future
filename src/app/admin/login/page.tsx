import { login } from '@/app/actions/auth';
import { getVerifiedSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await getVerifiedSession();
  if (session) {
    redirect('/admin/services');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cream-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-[var(--radius-card)] shadow-sm border border-cream-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-ink-900">Vedic Future Admin</h1>
        <form action={login} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-800 mb-1" htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-saffron-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-800 mb-1" htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-saffron-500"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-saffron-500 hover:bg-saffron-600 text-white font-medium py-3 rounded-[var(--radius-input)] transition-colors min-h-[44px]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
