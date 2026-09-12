import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingActions from './components/ui/FloatingActions';
import Home from './pages/Home';

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-cosmic-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <FloatingActions />
      </div>
    </BrowserRouter>
  );
}
