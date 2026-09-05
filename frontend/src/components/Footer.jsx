import { Link } from 'react-router-dom';

const EXPLORE_LINKS = [
  { to: '/explore', label: 'All Wines' },
  { to: '/countries', label: 'Countries' },
  { to: '/favorites', label: 'My Favorites' },
];

const TYPES = ['Red', 'White', 'Rosé', 'Sparkling', 'Dessert'];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-ink-900/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wine-gradient text-lg">
                🍷
              </span>
              <span className="font-logo text-lg tracking-wider text-white">
                Wine<span className="text-gradient-gold">Explorer</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
              Discover, compare, and savor exceptional wines from the world's most celebrated
              regions — from Bordeaux cellars to Marlborough slopes.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="label-caps">Explore</h4>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-ink-300 transition hover:text-gold-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Browse by type */}
          <div>
            <h4 className="label-caps">Browse by Type</h4>
            <ul className="mt-4 space-y-2.5">
              {TYPES.map((t) => (
                <li key={t}>
                  <Link
                    to={`/explore?type=${encodeURIComponent(t)}`}
                    className="text-sm text-ink-300 transition hover:text-gold-300"
                  >
                    {t} Wines
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Note */}
          <div>
            <h4 className="label-caps">The Cellar Note</h4>
            <p className="mt-4 text-sm leading-relaxed text-ink-400">
              Drink responsibly. Ratings blend editorial scores with community reviews. Prices
              are indicative retail values.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 sm:flex-row">
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} Wine Explorer. Crafted for lovers of the vine.
          </p>
          <p className="text-xs text-ink-500">
            Built with React · Express · MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
}
