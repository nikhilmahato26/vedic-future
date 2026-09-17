import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/ui/FloatingActions';
import { AstroLangProvider } from '@/context/AstroLang';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AstroLangProvider>
      <Navbar />
      {children}
      <Footer />
      <FloatingActions />
    </AstroLangProvider>
  );
}
