import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';

const NAV_LINKS = [
  { to: '/explore', label: 'Explore' },
  { to: '/countries', label: 'Countries' },
  { to: '/favorites', label: 'Favorites' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { count } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `relative px-1 py-2 text-sm tracking-wide transition-colors duration-200 ${
      isActive ? 'text-white' : 'text-ink-300 hover:text-white'
    }`;

  const activeDot = ({ isActive }) =>
    isActive
      ? 'after:absolute after:-bottom-0.5 after:left-1 after:right-1 after:h-px after:bg-gold-400 after:content-[""]'
      : '';

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong shadow-card' : 'bg-transparent border-b border-white/5'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wine-gradient text-lg shadow-card">
            🍷
          </span>
          <span className="font-logo text-lg tracking-wider text-white">
            Wine<span className="text-gradient-gold">Explorer</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={`${linkClass} ${activeDot}`}>
              {l.label}
              {l.to === '/favorites' && count > 0 && (
                <span className="ml-1.5 rounded-full bg-wine-700 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {count}
                </span>
              )}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full border border-white/10 py-1.5 pl-1.5 pr-4 transition hover:border-gold-400/50"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-gradient text-xs font-bold text-ink-950">
                  {user?.name?.[0]?.toUpperCase() || '?'}
                </span>
                <span className="text-sm text-ink-200">{user?.name?.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="text-sm text-ink-400 transition hover:text-white">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-ink-300 transition hover:text-white">
                Login
              </Link>
              <Link to="/register" className="btn-primary !px-5 !py-2">
                Join Us
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: heart + hamburger */}
        <div className="flex items-center gap-1 md:hidden">
          <Link
            to="/favorites"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-200 transition hover:bg-white/5"
            aria-label="Favorites"
          >
            ♡
            {count > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-wine-600 px-1 text-[9px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-100 transition hover:bg-white/5"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="glass-strong border-t border-white/5 md:hidden">
          <div className="space-y-1 px-4 py-4">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-sm ${
                    isActive ? 'bg-wine-800/40 text-white' : 'text-ink-200 hover:bg-white/5'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}

            <div className="my-3 h-px bg-white/10" />

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/profile"
                  className="block rounded-xl px-4 py-3 text-sm text-ink-200 hover:bg-white/5"
                >
                  Profile ({user?.name})
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl px-4 py-3 text-left text-sm text-ink-300 hover:bg-white/5"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link to="/login" className="btn-ghost flex-1 !py-2.5">
                  Login
                </Link>
                <Link to="/register" className="btn-primary flex-1 !py-2.5">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
