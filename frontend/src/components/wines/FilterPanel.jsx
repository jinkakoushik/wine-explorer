import { useEffect, useState } from 'react';
import { winesService } from '../../services/api.js';

const TYPES = ['Red', 'White', 'Rosé', 'Sparkling', 'Dessert', 'Fortified'];
const BODIES = ['Light-bodied', 'Medium-bodied', 'Full-bodied'];
const SWEETNESS = ['Bone Dry', 'Dry', 'Off-Dry', 'Sweet', 'Very Sweet'];
const RATINGS = [
  { value: '4.5', label: '4.5+' },
  { value: '4.0', label: '4.0+' },
  { value: '3.5', label: '3.5+' },
];
const PRICE_STEPS = [20, 50, 100, 250, 500, 1000];

/**
 * Backend-driven filter panel. Options for country, region, grape, and
 * vintage are fetched from /api/wines/meta/options.
 *
 * `filters` is a flat object: { search, type, country, region, grape,
 * body, sweetness, vintage, minPrice, maxPrice, minRating }.
 * Every change calls `onFiltersChange(nextFilters)` immediately.
 */
export default function FilterPanel({ filters, onFiltersChange, className = '' }) {
  const [options, setOptions] = useState(null);
  const [optionsError, setOptionsError] = useState('');
  const [maxPrice, setMaxPrice] = useState(
    filters.maxPrice ? Number(filters.maxPrice) : 1000
  );

  // Fetch dynamic filter options from the backend
  useEffect(() => {
    let cancelled = false;
    winesService
      .getFilterOptions()
      .then((data) => {
        if (!cancelled) setOptions(data);
      })
      .catch((err) => {
        if (!cancelled) setOptionsError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const set = (key, value) => {
    const next = { ...filters };
    if (value === '' || value == null) {
      delete next[key];
    } else {
      next[key] = value;
    }
    onFiltersChange(next);
  };

  const activeCount = Object.keys(filters).filter(
    (k) => k !== 'search' && filters[k] !== '' && filters[k] != null
  ).length;

  const selectClass =
    'w-full appearance-none rounded-lg border border-white/10 bg-ink-900/80 px-3 py-2.5 text-sm ' +
    'text-ink-100 outline-none transition focus:border-wine-500/60 focus:ring-2 focus:ring-wine-500/20';

  const labelClass = 'label-caps !text-[10px]';

  return (
    <aside className={`card-dark p-5 ${className}`} aria-label="Wine filters">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl text-white">Refine</h3>
        {activeCount > 0 && (
          <button
            onClick={() => {
              onFiltersChange({});
              setMaxPrice(1000);
            }}
            className="rounded-full border border-wine-500/30 px-3 py-1 text-[11px] text-wine-300 transition hover:bg-wine-800/30"
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {optionsError && (
        <p className="mt-3 rounded-lg bg-wine-950/40 px-3 py-2 text-xs text-wine-300">
          Could not load filter options — {optionsError}
        </p>
      )}

      <div className="mt-5 space-y-5">
        {/* Wine type */}
        <div>
          <span className={labelClass}>Wine Type</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => set('type', filters.type === t ? '' : t)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-all duration-200 ${
                  filters.type === t
                    ? 'border-wine-400 bg-wine-gradient text-white shadow-glow'
                    : 'border-white/10 bg-ink-900/60 text-ink-300 hover:border-wine-500/40 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Country */}
        <div>
          <span className={labelClass}>Country</span>
          <select
            value={filters.country || ''}
            onChange={(e) => set('country', e.target.value)}
            className={`${selectClass} mt-2`}
          >
            <option value="">All countries</option>
            {(options?.countries || []).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Region */}
        <div>
          <span className={labelClass}>Region</span>
          <select
            value={filters.region || ''}
            onChange={(e) => set('region', e.target.value)}
            className={`${selectClass} mt-2`}
          >
            <option value="">All regions</option>
            {(options?.regions || []).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Grape */}
        <div>
          <span className={labelClass}>Grape Variety</span>
          <select
            value={filters.grape || ''}
            onChange={(e) => set('grape', e.target.value)}
            className={`${selectClass} mt-2`}
          >
            <option value="">All grapes</option>
            {(options?.grapes || []).map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <div className="flex items-center justify-between">
            <span className={labelClass}>Max Price</span>
            <span className="text-xs font-semibold text-gold-300">
              {maxPrice >= 1000 ? '$1000+' : `$${maxPrice}`}
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="1000"
            step="10"
            value={maxPrice}
            onChange={(e) => {
              const v = Number(e.target.value);
              setMaxPrice(v);
              set('maxPrice', v);
            }}
            className="mt-2 w-full accent-wine-500"
          />
        </div>

        {/* Rating */}
        <div>
          <span className={labelClass}>Minimum Rating</span>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {RATINGS.map((r) => (
              <button
                key={r.value}
                onClick={() => set('minRating', filters.minRating === r.value ? '' : r.value)}
                className={`rounded-lg border py-2 text-xs font-medium transition ${
                  filters.minRating === r.value
                    ? 'border-gold-400 bg-gold-500/15 text-gold-200'
                    : 'border-white/10 bg-ink-900/60 text-ink-300 hover:border-gold-400/40'
                }`}
              >
                ★ {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vintage */}
        <div>
          <span className={labelClass}>Vintage</span>
          <select
            value={filters.vintage || ''}
            onChange={(e) => set('vintage', e.target.value)}
            className={`${selectClass} mt-2`}
          >
            <option value="">Any vintage</option>
            {(options?.vintages || []).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Body */}
        <div>
          <span className={labelClass}>Body</span>
          <select
            value={filters.body || ''}
            onChange={(e) => set('body', e.target.value)}
            className={`${selectClass} mt-2`}
          >
            <option value="">Any body</option>
            {BODIES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Sweetness */}
        <div>
          <span className={labelClass}>Sweetness</span>
          <select
            value={filters.sweetness || ''}
            onChange={(e) => set('sweetness', e.target.value)}
            className={`${selectClass} mt-2`}
          >
            <option value="">Any sweetness</option>
            {SWEETNESS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}
