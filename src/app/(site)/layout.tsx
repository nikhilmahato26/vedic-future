import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/ui/FloatingActions';
import { AstroLangProvider } from '@/context/AstroLang';
import { SettingsProvider } from '@/context/SiteSettings';
import { getSiteSettings } from '@/lib/content';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  
  return (
    <AstroLangProvider>
      <SettingsProvider settings={settings}>
        <Navbar />
        {children}
        <Footer />
        <FloatingActions />
      </SettingsProvider>
    </AstroLangProvider>
  );
}
