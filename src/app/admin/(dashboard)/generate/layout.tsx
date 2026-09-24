import { AstroLangProvider } from '@/context/AstroLang';
import { SettingsProvider } from '@/context/SiteSettings';
import { AstroBaseProvider } from '@/context/AstroBase';
import { getSiteSettings } from '@/lib/content';

export const metadata = { robots: { index: false, follow: false } };

// The public astrology pages, mounted for admins without a service (so no checkout).
export default async function GenerateLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <AstroLangProvider>
      <SettingsProvider settings={settings}>
        <AstroBaseProvider base="/admin/generate">
          <div className="-mx-4 md:-mx-8">{children}</div>
        </AstroBaseProvider>
      </SettingsProvider>
    </AstroLangProvider>
  );
}
