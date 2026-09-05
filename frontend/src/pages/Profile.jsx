import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BottleImage from '../components/ui/BottleImage.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { reviewsService } from '../services/api.js';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function Profile() {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  const loadReviews = useCallback(async () => {
    try {
      const data = await reviewsService.mine();
      setMyReviews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleDelete = async (reviewId) => {
    setDeletingId(reviewId);
    try {
      await reviewsService.remove(reviewId);
      setMyReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    setConfirmingLogout(false);
    logout();
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Logout confirmation */}
      <Modal
        open={confirmingLogout}
        onClose={() => setConfirmingLogout(false)}
        title="Sign out of your cellar?"
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setConfirmingLogout(false)}>
              Stay signed in
            </Button>
            <Button variant="danger" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-ink-300">
          Your favorites and reviews are saved to your account and will be waiting the next
          time you sign in.
        </p>
      </Modal>

      {/* Header card */}
      <div className="card-dark relative overflow-hidden p-8 sm:p-10">
        <div className="absolute inset-0 bg-hero-radial opacity-60" />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gold-gradient font-display text-3xl font-bold text-ink-950 shadow-card">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </span>
          <div>
            <p className="label-caps">Cellar Member</p>
            <h1 className="mt-1 font-display text-3xl text-white sm:text-4xl">{user?.name}</h1>
            <p className="mt-1 text-sm text-ink-400">{user?.email}</p>
            {user?.createdAt && (
              <p className="mt-1 text-xs text-ink-500">
                Member since {formatDate(user.createdAt)}
              </p>
            )}
          </div>

          {/* Logout — required profile action */}
          <Button
            variant="ghost"
            size="sm"
            className="sm:ml-auto"
            onClick={() => setConfirmingLogout(true)}
          >
            Log out
          </Button>
        </div>

        <div className="relative mt-8 grid grid-cols-2 gap-4">
          <Link
            to="/favorites"
            className="rounded-xl border border-white/5 bg-ink-950/50 p-5 transition hover:border-gold-400/40"
          >
            <p className="font-display text-3xl text-gold-300">{favorites.length}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-ink-400">
              Favorite {favorites.length === 1 ? 'wine' : 'wines'}
            </p>
          </Link>
          <div className="rounded-xl border border-white/5 bg-ink-950/50 p-5">
            <p className="font-display text-3xl text-gold-300">{myReviews.length}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-ink-400">
              Review{myReviews.length === 1 ? '' : 's'} written
            </p>
          </div>
        </div>
      </div>

      {/* Favorites preview */}
      {favorites.length > 0 && (
        <section className="mt-12">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl text-white">Recent Favorites</h2>
            <Link to="/favorites" className="text-sm text-gold-300 hover:text-gold-200">
              View all →
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {favorites.slice(0, 5).map((w) => (
              <Link
                key={w._id}
                to={`/wine/${w._id}`}
                className="card-dark group flex flex-col items-center p-4 transition hover:border-wine-700/40"
              >
                <BottleImage src={w.image} alt={w.name} className="h-28 w-full" />
                <p className="mt-3 w-full truncate text-center text-xs text-ink-200">{w.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* My reviews */}
      <section className="mt-12">
        <h2 className="font-display text-2xl text-white">My Reviews</h2>

        <div className="mt-6">
          {loading ? (
            <LoadingSpinner label="Fetching your reviews…" />
          ) : error ? (
            <ErrorMessage message={error} onRetry={loadReviews} />
          ) : myReviews.length === 0 ? (
            <EmptyState
              icon="📝"
              title="No reviews yet"
              message="Tasted something memorable? Share your notes on any wine page."
              ctaTo="/explore"
              ctaLabel="Find a wine to review"
            />
          ) : (
            <div className="space-y-4">
              {myReviews.map((r) => (
                <article key={r._id} className="card-dark flex gap-4 p-5">
                  {r.wine && (
                    <Link to={`/wine/${r.wine._id}`} className="shrink-0">
                      <BottleImage src={r.wine.image} alt={r.wine.name} className="h-24 w-16" />
                    </Link>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link
                        to={`/wine/${r.wine?._id}`}
                        className="font-display text-lg text-white hover:text-gold-200"
                      >
                        {r.wine?.name || 'Wine'}
                      </Link>
                      <span className="text-sm text-gold-400">
                        {'★'.repeat(r.rating)}
                        <span className="text-ink-700">{'★'.repeat(5 - r.rating)}</span>
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink-500">{formatDate(r.createdAt)}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-300">{r.comment}</p>
                    <Button
                      variant="danger"
                      size="sm"
                      className="mt-3"
                      onClick={() => handleDelete(r._id)}
                      disabled={deletingId === r._id}
                    >
                      {deletingId === r._id ? 'Deleting…' : 'Delete'}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
