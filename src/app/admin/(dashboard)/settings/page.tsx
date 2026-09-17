import { requireAdmin } from '@/app/actions/auth';
import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { updateSettings } from '@/app/actions/settings';

export default async function SettingsPage() {
  await requireAdmin();
  
  // Grab the singleton settings row (or an empty object if none exists yet)
  const [settings] = await db.select().from(siteSettings).limit(1);
  const data = settings || {};

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Site Settings</h1>
      </div>

      <div className="bg-white rounded-[var(--radius-card)] shadow-sm border border-cream-200 overflow-hidden max-w-3xl">
        <form action={updateSettings} className="p-6 space-y-8">
          
          {/* GENERAL INFO SECTION */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-navy-900 border-b border-cream-200 pb-2">General Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-ink-800" htmlFor="brandName">Brand Name</label>
                <input 
                  id="brandName" name="brandName" type="text" required defaultValue={data.brandName || 'Vedic Future'}
                  className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-cream-50 focus:ring-2 focus:ring-coral-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-ink-800" htmlFor="tagline">Tagline</label>
                <input 
                  id="tagline" name="tagline" type="text" defaultValue={data.tagline || ''}
                  className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-cream-50 focus:ring-2 focus:ring-coral-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-ink-800" htmlFor="email">Public Email</label>
                <input 
                  id="email" name="email" type="email" defaultValue={data.email || ''}
                  className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-cream-50 focus:ring-2 focus:ring-coral-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-ink-800" htmlFor="address">Address</label>
                <input 
                  id="address" name="address" type="text" defaultValue={data.address || ''}
                  className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-cream-50 focus:ring-2 focus:ring-coral-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* CONTACT INFO SECTION */}
          <section className="space-y-4 pt-2">
            <h2 className="text-lg font-bold text-navy-900 border-b border-cream-200 pb-2">Contact Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-ink-800" htmlFor="whatsappNumber">WhatsApp Number (incl. country code)</label>
                <input 
                  id="whatsappNumber" name="whatsappNumber" type="text" placeholder="e.g. 919876543210" defaultValue={data.whatsappNumber || ''}
                  className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-cream-50 focus:ring-2 focus:ring-coral-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-ink-800" htmlFor="phoneNumber">Phone Number</label>
                <input 
                  id="phoneNumber" name="phoneNumber" type="text" defaultValue={data.phoneNumber || ''}
                  className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-cream-50 focus:ring-2 focus:ring-coral-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* HOMEPAGE HERO SECTION */}
          <section className="space-y-4 pt-2">
            <h2 className="text-lg font-bold text-navy-900 border-b border-cream-200 pb-2">Homepage Hero</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-ink-800" htmlFor="heroHeading">Hero Heading</label>
                <input 
                  id="heroHeading" name="heroHeading" type="text" defaultValue={data.heroHeading || ''}
                  className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-cream-50 focus:ring-2 focus:ring-coral-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-ink-800" htmlFor="heroSub">Hero Subheading</label>
                <textarea 
                  id="heroSub" name="heroSub" rows={2} defaultValue={data.heroSub || ''}
                  className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-cream-50 focus:ring-2 focus:ring-coral-500 outline-none resize-y"
                ></textarea>
              </div>
            </div>
          </section>

          {/* SITE ANNOUNCEMENT SECTION */}
          <section className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-cream-200 pb-2">
              <h2 className="text-lg font-bold text-navy-900">Announcement Banner</h2>
              <div className="flex items-center space-x-2">
                <input 
                  id="announcementActive" name="announcementActive" type="checkbox" defaultChecked={!!data.announcementActive}
                  className="w-5 h-5 rounded text-coral-500 focus:ring-coral-500 border-cream-300 cursor-pointer"
                />
                <label htmlFor="announcementActive" className="text-sm font-medium text-ink-900 cursor-pointer">
                  Banner Active
                </label>
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-ink-800" htmlFor="announcement">Announcement Text</label>
              <input 
                id="announcement" name="announcement" type="text" placeholder="e.g. 20% off all consultations this week!" defaultValue={data.announcement || ''}
                className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-cream-200 bg-cream-50 focus:ring-2 focus:ring-coral-500 outline-none"
              />
            </div>
          </section>

          {/* SUBMIT */}
          <div className="pt-6 border-t border-cream-100 flex justify-end">
            <button 
              type="submit" 
              className="bg-coral-500 hover:bg-coral-600 text-white font-medium px-8 py-3 rounded-[var(--radius-input)] transition-colors min-h-[44px]"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
