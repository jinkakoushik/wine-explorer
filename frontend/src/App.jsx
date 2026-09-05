import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import WineDetails from './pages/WineDetails.jsx';
import Countries from './pages/Countries.jsx';
import CountryWines from './pages/CountryWines.jsx';
import Favorites from './pages/Favorites.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

const pageMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export default function App() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<motion.div {...pageMotion}><Home /></motion.div>} />
            <Route path="/explore" element={<motion.div {...pageMotion}><Explore /></motion.div>} />
            <Route path="/wine/:id" element={<motion.div {...pageMotion}><WineDetails /></motion.div>} />
            <Route path="/countries" element={<motion.div {...pageMotion}><Countries /></motion.div>} />
            <Route path="/countries/:country" element={<motion.div {...pageMotion}><CountryWines /></motion.div>} />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <motion.div {...pageMotion}><Favorites /></motion.div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<motion.div {...pageMotion}><Login /></motion.div>} />
            <Route path="/register" element={<motion.div {...pageMotion}><Register /></motion.div>} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <motion.div {...pageMotion}><Profile /></motion.div>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<motion.div {...pageMotion}><NotFound /></motion.div>} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
