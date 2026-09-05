import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import SearchBar from '../components/wines/SearchBar.jsx';
import FilterPanel from '../components/wines/FilterPanel.jsx';
import WineGrid from '../components/wines/WineGrid.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import SortDropdown from '../components/ui/SortDropdown.jsx';
import Button from '../components/ui/Button.jsx';
import { winesService } from '../services/api.js';

const SORTS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'price', label: 'Price: Low to High' },
  { value: 'priceDesc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

// Only these keys may appear in the ?query string
const VALID_FILTER_KEYS = [
  'search', 'type', 'country', 'region', 'grape', 'body',
  'sweetness', 'vintage', 'minPrice', 'maxPrice', 'minRating',
];

/** Filters object <-> URL query string */
function filtersToParams(filters) {
  const params = {};
  VALID_FILTER_KEYS.forEach((k) => {
    if (filters[k] !== '' && filters[k] != null) params[k] = String(filters[k]);
  });
  return params;
}

function paramsToFilters(searchParams) {
  const filters = {};
  VALID_FILTER_KEYS.forEach((k) => {
    const v = searchParams.get(k);
    if (v) filters[k] = v;
  });
  return filters;
}

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => paramsToFilters(searchParams), [searchParams]);
  const sort = searchParams.get('sort') || 'rating';
  const page = Math.max(1, parseInt(searchParams.get('page'), 10) || 1);

  const [wines, setWines] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCount, setActiveCount] = useState(0);

  // Fetch wines from the backend whenever filters/sort/page change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    winesService
      .list({ ...filters, sort, page, limit: 12 })
      .then((res) => {
        if (cancelled) return;
        setWines(res.data);
        setTotal(res.total);
        setPages(res.pages);
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
  }, [searchParams]); // refetch whenever the URL changes

  const updateParams = (updates, { resetPage = true } = {}) => {
    const next = filtersToParams(filters);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === '' || v == null) delete next[k];
      else next[k] = String(v);
    });
    if (resetPage) delete next.page;
    setSearchParams(next, { replace: false });
  };

  const handleFiltersChange = (nextFilters) => updateParams({ ...filters, ...nextFilters });
  const handleSearch = (term) => updateParams({ ...filters, search: term });
  const handleSort = (value) => updateParams({ sort: value }, { resetPage: false });
  const handlePage = (p) => updateParams({ page: p }, { resetPage: false });

  // Count active filters for the mobile button badge
  useEffect(() => {
    setActiveCount(
      Object.keys(filters).filter(
        (k) => k !== 'search' && filters[k] !== '' && filters[k] != null
      ).length
    );
  }, [filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="label-caps">The Collection</p>
          <h1 className="mt-1 font-display text-4xl text-white sm:text-5xl">Explore Wines</h1>
          <p className="mt-2 text-sm text-ink-400">
            {loading
              ? 'Searching the cellar…'
              : `${total} ${total === 1 ? 'wine' : 'wines'} found${
                  filters.search ? ` for “${filters.search}”` : ''
                }`}
          </p>
        </div>
        <div className="lg:w-96">
          <SearchBar
            value={filters.search || ''}
            onChange={(v) => handleSearch(v)}
            onSubmit={() => {}} // onChange already syncs to the URL
            size="md"
            placeholder="Search wines…"
          />
        </div>
      </div>

      {/* Mobile filter button */}
      <div className="mt-6 flex items-center justify-between lg:hidden">
        <Button variant="ghost" size="sm" onClick={() => setDrawerOpen(true)}>
          Filters {activeCount > 0 && (
            <span className="ml-1 rounded-full bg-wine-600 px-2 py-0.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </Button>

        <SortDropdown options={SORTS} value={sort} onChange={handleSort} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Desktop filter sidebar */}
        <FilterPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          className="hidden self-start lg:sticky lg:top-24 lg:block"
        />

        {/* Results */}
        <div>
          <div className="mb-6 hidden items-center justify-end lg:flex">
            <SortDropdown options={SORTS} value={sort} onChange={handleSort} />
          </div>

          <WineGrid
            wines={wines}
            loading={loading}
            error={error}
            onRetry={() => updateParams({})}
            emptyProps={{
              message: 'Try adjusting your search or removing some filters.',
              ctaTo: '/explore',
              ctaLabel: 'Clear all filters',
            }}
          />

          <Pagination page={page} pages={pages} onChange={handlePage} />
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink-950/70 backdrop-blur-sm lg:hidden"
            onClick={() => setDrawerOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-y-0 left-0 w-[86%] max-w-sm overflow-y-auto bg-ink-950 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-2xl text-white">Filters</h2>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-ink-200"
                  aria-label="Close filters"
                >
                  ✕
                </button>
              </div>
              <FilterPanel filters={filters} onFiltersChange={handleFiltersChange} />
              <div className="mt-4">
                <Button variant="primary" className="w-full" onClick={() => setDrawerOpen(false)}>
                  Show {total} wines
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
