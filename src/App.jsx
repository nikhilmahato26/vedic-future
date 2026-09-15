import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingActions from './components/ui/FloatingActions';
import { AstroLangProvider } from './context/AstroLang';
import Home from './pages/Home';
import { Loading } from './components/astro/ui';

// Astrology pages are split out so the home page doesn't download them.
const AstrologyHub = lazy(() => import('./pages/AstrologyHub'));
const KundaliPage = lazy(() => import('./pages/KundaliPage'));
const MatchingPage = lazy(() => import('./pages/MatchingPage'));
const PanchangPage = lazy(() => import('./pages/PanchangPage'));
const HoroscopePage = lazy(() => import('./pages/HoroscopePage'));
const MuhurtaPage = lazy(() => import('./pages/MuhurtaPage'));
const VastuPage = lazy(() => import('./pages/VastuPage'));
const DhanYogaPage = lazy(() => import('./pages/DhanYogaPage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));

/** Scroll to top on page change, or to the #section when the URL has a hash. */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return undefined;
    }
    // Home sections mount after navigation; give them a frame before scrolling.
    const timer = setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AstroLangProvider>
        <ScrollManager />
        <div className="relative min-h-screen bg-cream-100">
          <Navbar />
          <main>
            <Suspense fallback={<Loading className="min-h-screen" label="Loading…" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/astrology" element={<AstrologyHub />} />
              <Route path="/kundali" element={<KundaliPage />} />
              <Route path="/kundli-milan" element={<MatchingPage />} />
              <Route path="/panchang" element={<PanchangPage />} />
              <Route path="/horoscope" element={<HoroscopePage />} />
              <Route path="/muhurat" element={<MuhurtaPage />} />
              <Route path="/vastu" element={<VastuPage />} />
              <Route path="/dhan-yoga" element={<DhanYogaPage />} />
              <Route path="/astro-tools" element={<ToolsPage />} />
              <Route path="*" element={<Home />} />
            </Routes>
            </Suspense>
          </main>
          <Footer />
          <FloatingActions />
        </div>
      </AstroLangProvider>
    </BrowserRouter>
  );
}
