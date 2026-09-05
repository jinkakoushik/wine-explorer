const STAR_EMPTY = '☆';
const STAR_FULL = '★';

/** Static star badge: overall score + review count */
export function RatingBadge({ rating, numReviews, size = 'md' }) {
  const rounded = Math.round((rating || 0) * 10) / 10;
  const dims = size === 'lg' ? 'text-base px-3 py-1.5' : 'text-xs px-2.5 py-1';
  const stars = size === 'lg' ? 'text-sm' : 'text-[10px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-ink-950/70 ${dims}`}
      title={numReviews != null ? `${rounded} / 5 from ${numReviews} reviews` : `${rounded} / 5`}
    >
      <span className={`text-gold-400 ${stars}`}>{STAR_FULL}</span>
      <span className="font-semibold text-gold-200">{rounded.toFixed(1)}</span>
      {numReviews != null && numReviews > 0 && (
        <span className="text-ink-400">({numReviews})</span>
      )}
    </span>
  );
}

/** Interactive 1–5 star input for the review form */
export function StarPicker({ value = 0, onChange, disabled = false }) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className={`text-2xl leading-none transition-all duration-150 ${
            n <= value
              ? 'scale-110 text-gold-400 drop-shadow-[0_0_6px_rgba(212,177,62,0.45)]'
              : 'text-ink-600 hover:text-gold-500/70'
          } ${disabled ? 'cursor-not-allowed opacity-60' : 'hover:scale-110'}`}
        >
          {n <= value ? STAR_FULL : STAR_EMPTY}
        </button>
      ))}
    </div>
  );
}
