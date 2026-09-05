import { useState } from 'react';

/**
 * Large premium search input. Enter submits; a clear button resets.
 */
export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search by wine, winery, grape, or region…',
  size = 'lg',
  autoFocus = false,
}) {
  const [focused, setFocused] = useState(false);

  const isLg = size === 'lg';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
      className={`relative flex items-center ${isLg ? 'max-w-2xl' : ''}`}
      role="search"
    >
      <span
        className={`pointer-events-none absolute left-5 text-ink-400 transition-colors ${
          focused ? 'text-gold-300' : ''
        } ${isLg ? 'text-lg' : 'text-sm'}`}
      >
        ⌕
      </span>
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        aria-label="Search wines"
        className={`input-dark !rounded-full !border-white/10 !bg-ink-900/80 pl-12 ${
          isLg ? '!py-4 pr-28 text-base shadow-card' : '!py-2.5 pr-12 text-sm'
        } backdrop-blur-xl transition-shadow ${focused ? '!shadow-glow' : ''}`}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-5 flex h-6 w-6 items-center justify-center rounded-full
            bg-ink-800 text-xs text-ink-300 transition hover:bg-ink-700 hover:text-white"
        >
          ✕
        </button>
      )}
      {isLg && !value && (
        <button
          type="submit"
          className="absolute right-2 hidden h-10 items-center rounded-full bg-wine-gradient px-6
            text-sm font-medium text-white shadow-card transition-all duration-300
            hover:shadow-glow hover:brightness-110 sm:flex"
        >
          Search
        </button>
      )}
    </form>
  );
}
