import { useState } from 'react';
import { StarPicker } from '../ui/Rating.jsx';

/**
 * Star rating + comment form for creating or editing a review.
 */
export default function ReviewForm({
  initialRating = 0,
  initialComment = '',
  submitLabel = 'Publish Review',
  submitting = false,
  error = '',
  onSubmit,
  onCancel,
}) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return;
    onSubmit({ rating, comment: comment.trim() });
  };

  const canSubmit = rating > 0 && comment.length >= 3 && !submitting;

  return (
    <form onSubmit={handleSubmit} className="card-dark p-6">
      <h3 className="font-display text-xl text-white">
        {initialComment ? 'Edit your review' : 'Share your tasting experience'}
      </h3>

      <div className="mt-5">
        <p className="label-caps !text-[10px]">Your rating</p>
        <div className="mt-2">
          <StarPicker value={rating} onChange={setRating} disabled={submitting} />
        </div>
      </div>

      <div className="mt-5">
        <p className="label-caps !text-[10px]">Your notes</p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="Aromas, flavors, texture, the occasion…"
          className="input-dark mt-2 resize-none"
          disabled={submitting}
        />
        <p className="mt-1 text-right text-[11px] text-ink-600">{comment.length}/1000</p>
      </div>

      {error && (
        <p className="rounded-lg bg-wine-950/50 px-4 py-2.5 text-sm text-wine-300">{error}</p>
      )}

      <div className="mt-4 flex gap-3">
        <button type="submit" disabled={!canSubmit} className="btn-primary">
          {submitting ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost" disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
