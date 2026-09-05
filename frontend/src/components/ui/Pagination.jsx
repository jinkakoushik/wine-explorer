/**
 * Page navigation for the explore grid. Renders numbered buttons
 * with ellipses for large page counts.
 */
export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  const nums = [];
  const add = (n) => nums.includes(n) || nums.push(n);

  add(1);
  if (page > 3) add('…');
  for (let n = page - 1; n <= page + 1; n++) {
    if (n > 1 && n < pages) add(n);
  }
  if (page < pages - 2) add('…');
  if (pages > 1) add(pages);

  const btn =
    'flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm transition-all duration-200';

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className={`${btn} border border-white/10 text-ink-300 hover:border-gold-400/40 hover:text-white disabled:pointer-events-none disabled:opacity-30`}
        aria-label="Previous page"
      >
        ←
      </button>

      {nums.map((n, i) =>
        n === '…' ? (
          <span key={`e${i}`} className="px-1 text-ink-600">
            …
          </span>
        ) : (
          <button
            key={n}
            onClick={() => onChange(n)}
            aria-current={n === page ? 'page' : undefined}
            className={`${btn} ${
              n === page
                ? 'bg-wine-gradient font-semibold text-white shadow-card'
                : 'border border-white/10 text-ink-300 hover:border-gold-400/40 hover:text-white'
            }`}
          >
            {n}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        className={`${btn} border border-white/10 text-ink-300 hover:border-gold-400/40 hover:text-white disabled:pointer-events-none disabled:opacity-30`}
        aria-label="Next page"
      >
        →
      </button>
    </nav>
  );
}
