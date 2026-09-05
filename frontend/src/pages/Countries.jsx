import { useEffect, useState } from 'react';
import CountryCard from '../components/countries/CountryCard.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import SearchBar from '../components/wines/SearchBar.jsx';
import { metaService } from '../services/api.js';

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    metaService
      .countries()
      .then((data) => {
        if (!cancelled) setCountries(data);
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

  const visible = countries.filter((c) =>
    c.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="label-caps">Around The World</p>
          <h1 className="mt-1 font-display text-4xl text-white sm:text-5xl">
            Explore by Country
          </h1>
          <p className="mt-2 text-sm text-ink-400">
            From the Old World classics to New World pioneers — every terroir tells a story.
          </p>
        </div>
        <div className="lg:w-80">
          <SearchBar
            value={search}
            onChange={setSearch}
            onSubmit={() => {}}
            size="md"
            placeholder="Find a country…"
          />
        </div>
      </div>

      <div className="mt-10">
        {loading ? (
          <LoadingSpinner size="lg" label="Charting the wine world…" />
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => window.location.reload()} />
        ) : visible.length === 0 ? (
          <EmptyState
            icon="🌍"
            title="No countries match"
            message="Try a different search — or explore the full collection."
            ctaTo="/explore"
            ctaLabel="Explore all wines"
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((c, i) => (
              <CountryCard key={c.name} country={c} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
