import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import WineGrid from '../components/wines/WineGrid.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import SortDropdown from '../components/ui/SortDropdown.jsx';
import Button from '../components/ui/Button.jsx';
import SearchBar from '../components/wines/SearchBar.jsx';
import { winesService } from '../services/api.js';

const TYPES = ['Red', 'White', 'Rosé', 'Sparkling', 'Dessert', 'Fortified'];
const SORTS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'price', label: 'Price ↑' },
  { value: 'priceDesc', label: 'Price ↓' },
  { value: 'name', label: 'A–Z' },
  { value: 'newest', label: 'Newest' },
];

/** Small pill chip used for type filters */
function ChipButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
        active
          ? 'border-wine-400 bg-wine-gradient text-white shadow-glow'
          : 'border-white/10 bg-ink-900/60 text-ink-300 hover:border-wine-500/40 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

export default function CountryWines() {
  const { country } = useParams();
  const decoded = decodeURIComponent(country);

  const [type, setType] = useState('');
  const [sort, setSort] = useState('rating');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [wines, setWines] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setPage(1);
  }, [decoded, type, sort, search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    winesService
      .list({ country: decoded, type, search, sort, page, limit: 12 })
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
  }, [decoded, type, sort, page, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-ink-500" aria-label="Breadcrumb">
        <Link to="/" className="transition hover:text-ink-200">Home</Link>
        <span>/</span>
        <Link to="/countries" className="transition hover:text-ink-200">Countries</Link>
        <span>/</span>
        <span className="text-ink-300">{decoded}</span>
      </nav>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="label-caps">Wines of the World</p>
          <h1 className="mt-1 font-display text-4xl text-white sm:text-5xl">{decoded}</h1>
          <p className="mt-2 text-sm text-ink-400">
            {loading
              ? 'Uncorking…'
              : `${total} ${total === 1 ? 'wine' : 'wines'} from ${decoded}${
                  search ? ` matching “${search}”` : ''
                }`}
          </p>
        </div>
        <div className="lg:w-80">
          <SearchBar
            value={search}
            onChange={setSearch}
            onSubmit={() => {}}
            size="md"
            placeholder={`Search ${decoded} wines…`}
          />
        </div>
      </div>

      {/* Type chips + sort */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <ChipButton active={type === ''} onClick={() => setType('')}>
            All
          </ChipButton>
          {TYPES.map((t) => (
            <ChipButton key={t} active={type === t} onClick={() => setType(type === t ? '' : t)}>
              {t}
            </ChipButton>
          ))}
        </div>

        <SortDropdown options={SORTS} value={sort} onChange={setSort} />
      </div>

      <div className="mt-8">
        <WineGrid
          wines={wines}
          loading={loading}
          error={error}
          onRetry={() => setPage((p) => p)}
          emptyProps={{
            message: search
              ? `Nothing from ${decoded} matches “${search}”${type ? ` in the ${type.toLowerCase()} category` : ''}.`
              : `No ${type ? type.toLowerCase() : ''} wines from ${decoded} match right now.`,
            ctaTo: '/countries',
            ctaLabel: 'Browse other countries',
          }}
        />
      </div>

      <Pagination page={page} pages={pages} onChange={setPage} />
    </div>
  );
}
