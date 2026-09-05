import { StarPicker } from '../ui/Rating.jsx';
import Button from '../ui/Button.jsx';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * A single user review. The owner sees Edit/Delete actions.
 */
export default function ReviewCard({ review, isOwner, onEdit, onDelete, deleting }) {
  const authorName = review.user?.name || 'Anonymous';
  const initial = authorName[0]?.toUpperCase() || '?';

  return (
    <article className="card-dark p-5 transition-colors hover:border-white/10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-wine-gradient text-sm font-bold text-white">
            {initial}
          </span>
          <div>
            <p className="text-sm font-medium text-white">{authorName}</p>
            <p className="text-[11px] text-ink-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg text-gold-400">
            {'★'.repeat(review.rating)}
            <span className="text-ink-700">{'★'.repeat(5 - review.rating)}</span>
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-200">{review.comment}</p>

      {isOwner && (
        <div className="mt-4 flex justify-end gap-2 border-t border-white/5 pt-3">
          <Button variant="ghost" size="sm" onClick={() => onEdit?.(review)}>
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete?.(review)}
            disabled={deleting}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      )}
    </article>
  );
}

export { StarPicker };
