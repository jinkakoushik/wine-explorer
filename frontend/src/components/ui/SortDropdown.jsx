/**
 * Sort dropdown used by the Explore and Country pages.
 * A single styled <select> so sorting looks and behaves identically
 * everywhere; fully controlled via value/onChange.
 */
export default function SortDropdown({ options, value, onChange, label = 'Sort by', className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <label className="hidden text-xs uppercase tracking-wider text-ink-500 sm:block">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="appearance-none rounded-full border border-white/10 bg-ink-900/80 px-4 py-2.5
          text-sm text-ink-100 outline-none transition
          focus:border-wine-500/60 focus:ring-2 focus:ring-wine-500/20
          hover:border-white/20 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
