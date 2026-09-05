import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import WineDetails from '../components/wines/WineDetails.jsx';
import WineCard from '../components/wines/WineCard.jsx';
import ReviewCard from '../components/wines/ReviewCard.jsx';
import ReviewForm from '../components/wines/ReviewForm.jsx';
import FavoriteButton from '../components/ui/FavoriteButton.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Modal from '../components/ui/Modal.jsx';
import Button from '../components/ui/Button.jsx';
import { winesService, reviewsService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';

export default function WineDetailsPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { isFavorite } = useFavorites();

  const [wine, setWine] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewsError, setReviewsError] = useState('');

  // Review form state
  const [editingReview, setEditingReview] = useState(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [myReview, setMyReview] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    setReviewsError('');
    try {
      const wineData = await winesService.getById(id);
      setWine(wineData);

      // Reviews + similar wines can fail independently
      try {
        const revRes = await reviewsService.listForWine(id, { limit: 12 });
        setReviews(revRes.data);
      } catch (err) {
        setReviews([]);
        setReviewsError(err.message);
      }

      try {
        const simRes = await winesService.list({
          type: wineData.type,
          limit: 5,
          sort: 'rating',
        });
        setSimilar(simRes.data.filter((w) => w._id !== id).slice(0, 4));
      } catch {
        setSimilar([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setEditingReview(null);
    setFormError('');
    setMyReview(null);
    loadAll();
  }, [loadAll]);

  const refreshReviews = async () => {
    try {
      const revRes = await reviewsService.listForWine(id, { limit: 12 });
      setReviews(revRes.data);
      // Wine's rating/numReviews changed server-side — refetch the wine too
      setWine(await winesService.getById(id));
    } catch (err) {
      setReviewsError(err.message);
    }
  };

  const handleSubmitReview = async ({ rating, comment }) => {
    setSubmitting(true);
    setFormError('');
    try {
      if (editingReview) {
        await reviewsService.update(editingReview._id, { rating, comment });
        setEditingReview(null);
      } else {
        await reviewsService.create(id, { rating, comment });
      }
      await refreshReviews();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (review) => {
    setDeletingId(review._id);
    setFormError('');
    try {
      await reviewsService.remove(review._id);
      if (editingReview?._id === review._id) setEditingReview(null);
      setReviewToDelete(null);
      await refreshReviews();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // ----- Render states -----
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" label="Opening the bottle…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <ErrorMessage message={error} onRetry={loadAll} />
        <div className="mt-6 text-center">
          <Link to="/explore" className="text-sm text-gold-300 hover:text-gold-200">
            ← Back to all wines
          </Link>
        </div>
      </div>
    );
  }

  const favorited = isFavorite(wine._id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-ink-500" aria-label="Breadcrumb">
        <Link to="/" className="transition hover:text-ink-200">Home</Link>
        <span>/</span>
        <Link to="/explore" className="transition hover:text-ink-200">Wines</Link>
        <span>/</span>
        <Link
          to={`/countries/${encodeURIComponent(wine.country)}`}
          className="transition hover:text-ink-200"
        >
          {wine.country}
        </Link>
        <span>/</span>
        <span className="truncate text-ink-300">{wine.name}</span>
      </nav>

      <WineDetails wine={wine} />

      {/* Reviews */}
      <section className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="label-caps">Community Tasting Notes</p>
            <h2 className="mt-1 font-display text-3xl text-white">
              Reviews {reviews.length > 0 && <span className="text-ink-500">({reviews.length})</span>}
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Form column */}
          <div>
            {isAuthenticated ? (
              <ReviewForm
                key={editingReview?._id || 'new'}
                initialRating={editingReview?.rating || 0}
                initialComment={editingReview?.comment || ''}
                submitLabel={editingReview ? 'Save Changes' : 'Publish Review'}
                submitting={submitting}
                error={formError}
                onSubmit={handleSubmitReview}
                onCancel={
                  editingReview
                    ? () => {
                        setEditingReview(null);
                        setFormError('');
                      }
                    : undefined
                }
              />
            ) : (
              <div className="card-dark flex flex-col items-center p-8 text-center">
                <span className="text-3xl">🗝️</span>
                <h3 className="mt-3 font-display text-xl text-white">Join the conversation</h3>
                <p className="mt-2 text-sm text-ink-400">
                  Log in or create an account to rate this wine and share your notes.
                </p>
                <div className="mt-5 flex gap-3">
                  <Link to="/login" className="btn-primary !px-6 !py-2.5">Log in</Link>
                  <Link to="/register" className="btn-ghost !px-6 !py-2.5">Register</Link>
                </div>
              </div>
            )}
          </div>

          {/* Reviews list column */}
          <div className="space-y-4">
            {reviewsError && (
              <ErrorMessage message={reviewsError} onRetry={refreshReviews} />
            )}
            {!reviewsError && reviews.length === 0 && (
              <EmptyState
                icon="📝"
                title="No reviews yet"
                message="Be the first to share tasting notes for this bottle."
              />
            )}
            {reviews.map((review) => {
              const owner = user && review.user?._id === user.id;
              return (
                <ReviewCard
                  key={review._id}
                  review={review}
                  isOwner={owner}
                  deleting={deletingId === review._id}
                  onEdit={(r) => {
                    setEditingReview(r);
                    window.scrollTo({ top: document.body.scrollHeight * 0.4, behavior: 'smooth' });
                  }}
                  onDelete={setReviewToDelete}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Delete-review confirmation */}
      <Modal
        open={Boolean(reviewToDelete)}
        onClose={() => setReviewToDelete(null)}
        title="Delete this review?"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setReviewToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={deletingId === reviewToDelete?._id}
              onClick={() => reviewToDelete && handleDeleteReview(reviewToDelete)}
            >
              {deletingId === reviewToDelete?._id ? 'Deleting…' : 'Delete review'}
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-ink-300">
          Your tasting notes for “{wine.name}” will be removed permanently, and the wine's
          average rating will be recalculated without your score.
        </p>
      </Modal>

      {/* Similar wines */}
      {similar.length > 0 && (
        <section className="mt-16">
          <p className="label-caps">If You Like This</p>
          <h2 className="mt-1 font-display text-3xl text-white">You May Also Like</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((w, i) => (
              <WineCard key={w._id} wine={w} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
