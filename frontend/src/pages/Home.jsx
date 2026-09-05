import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchBar from '../components/wines/SearchBar.jsx';
import WineCard from '../components/wines/WineCard.jsx';
import CountryCard from '../components/countries/CountryCard.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import { winesService, metaService } from '../services/api.js';

const CATEGORIES = [
  { type: 'Red', label: 'Red', icon: '🍷', blurb: 'Bold & structured' },
  { type: 'White', label: 'White', icon: '🥂', blurb: 'Crisp & mineral' },
  { type: 'Rosé', label: 'Rosé', icon: '🌸', blurb: 'Fresh & delicate' },
  { type: 'Sparkling', label: 'Sparkling', icon: '🍾', blurb: 'Fine & festive' },
  { type: 'Dessert', label: 'Dessert', icon: '🍯', blurb: 'Lush & golden' },
];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState([]);
  const [countries, setCountries] = useState([]);
  const [grapes, setGrapes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // One shared load for the home sections
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    Promise.all([
      winesService.list({ sort: 'rating', limit: 4 }),
      metaService.countries(),
      metaService.grapes(),
    ])
      .then(([winesRes, countriesRes, grapesRes]) => {
        if (cancelled) return;
        setFeatured(winesRes.data);
        setCountries(countriesRes.slice(0, 8));
        setGrapes(grapesRes.slice(0, 10));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const submitSearch = (value) => {
    const term = value.trim();
    if (term) navigate(`/explore?search=${encodeURIComponent(term)}`);
    else navigate('/explore');
  };

  return (
    <div>
      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-radial" />
        <div className="pointer-events-none absolute -right-32 top-10 select-none opacity-[0.06]">
          <span className="font-display text-[22rem] leading-none">W</span>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-20 text-center sm:px-6 sm:pt-28">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="label-caps"
          >
            The World's Cellar, Curated
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-4 font-display text-5xl font-medium leading-[1.05] text-white sm:text-7xl"
          >
            Discover Your <span className="text-gradient-gold italic">Next Wine</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg"
          >
            Browse thousands of bottles from Bordeaux to Barossa — search by grape, region,
            or mood, save your favorites, and find the perfect pairing for every table.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-9 flex justify-center"
          >
            <SearchBar
              value={search}
              onChange={setSearch}
              onSubmit={submitSearch}
              placeholder="Try “Cabernet”, “Bordeaux”, or “Sparkling”…"
            />
          </motion.div>

          {/* Quick categories */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            {CATEGORIES.map((c) => (
              <Link
                key={c.type}
                to={`/explore?type=${encodeURIComponent(c.type)}`}
                className="group flex items-center gap-3 rounded-full border border-white/10
                  bg-ink-900/60 py-2 pl-3 pr-5 backdrop-blur-md transition-all duration-300
                  hover:border-gold-400/50 hover:bg-ink-800/70 hover:shadow-card"
              >
                <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                  {c.icon}
                </span>
                <span className="text-left">
                  <span className="block text-sm font-medium text-white">{c.label}</span>
                  <span className="block text-[10px] uppercase tracking-wider text-ink-500">
                    {c.blurb}
                  </span>
                </span>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= Featured wines ================= */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="label-caps">Highest Rated</p>
            <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl">Featured Wines</h2>
          </div>
          <Link
            to="/explore"
            className="hidden shrink-0 items-center gap-1 text-sm text-gold-300 transition hover:text-gold-200 sm:flex"
          >
            Explore all wines →
          </Link>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card-dark overflow-hidden">
                  <div className="skeleton h-60 rounded-none" />
                  <div className="space-y-3 p-5">
                    <div className="skeleton h-5 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <ErrorMessage message={error} onRetry={() => window.location.reload()} />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((wine, i) => (
                <WineCard key={wine._id} wine={wine} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= Popular countries ================= */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="label-caps">Terroir Tour</p>
            <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl">Popular Countries</h2>
          </div>
          <Link
            to="/countries"
            className="hidden shrink-0 items-center gap-1 text-sm text-gold-300 transition hover:text-gold-200 sm:flex"
          >
            All countries →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {loading
            ? [...Array(4)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)
            : countries.map((c, i) => <CountryCard key={c.name} country={c} index={i} />)}
        </div>
      </section>

      {/* ================= Popular grapes ================= */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="label-caps">From The Vine</p>
        <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl">Popular Grape Varieties</h2>

        <div className="mt-8 flex flex-wrap gap-3">
          {loading
            ? [...Array(8)].map((_, i) => <div key={i} className="skeleton h-11 w-44 rounded-full" />)
            : grapes.map((g) => (
                <Link
                  key={g.name}
                  to={`/explore?grape=${encodeURIComponent(g.name)}`}
                  className="group flex items-center gap-3 rounded-full border border-white/10
                    bg-ink-900/60 px-5 py-2.5 transition-all duration-300
                    hover:border-wine-500/50 hover:bg-wine-950/30"
                >
                  <span className="text-sm font-medium text-ink-100 group-hover:text-white">
                    {g.name}
                  </span>
                  <span className="rounded-full bg-ink-800 px-2 py-0.5 text-[10px] text-ink-400">
                    {g.count}
                  </span>
                </Link>
              ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-wine-800/40 bg-wine-gradient px-6 py-16 text-center shadow-card sm:px-16">
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-gold-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-wine-400/10 blur-3xl" />

          <h2 className="relative font-display text-4xl text-white sm:text-5xl">
            Your Next Bottle Is Waiting
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-ink-100/80">
            Explore the full collection — filter by country, grape, body, and price to find
            exactly what your table deserves.
          </p>
          <Link to="/explore" className="btn-primary relative mt-8 !bg-gold-gradient !text-ink-950">
            Explore Wines
          </Link>
        </div>
      </section>
    </div>
  );
}
