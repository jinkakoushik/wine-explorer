import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * Heart button that toggles the wine in the user's favorites.
 * Persists via the API and animates on click.
 */
export default function FavoriteButton({ wineId, name, size = 'md', withLabel = false }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bursting, setBursting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const active = isFavorite(wineId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    if (busy) return;

    setBusy(true);
    setError('');
    try {
      await toggleFavorite(wineId);
      if (!active) {
        setBursting(true);
        setTimeout(() => setBursting(false), 650);
      }
    } catch (err) {
      setError(err.message || 'Could not update favorites');
    } finally {
      setBusy(false);
    }
  };

  const dims = size === 'lg' ? 'h-11 w-11 text-lg' : 'h-9 w-9 text-sm';
  const heart = active ? '♥' : '♡';

  return (
    <div className="relative inline-flex">
      <button
        onClick={handleClick}
        disabled={busy}
        aria-pressed={active}
        aria-label={active ? `Remove ${name || 'wine'} from favorites` : `Add ${name || 'wine'} to favorites`}
        title={error || (active ? 'Remove from favorites' : 'Add to favorites')}
        className={`relative flex ${dims} items-center justify-center rounded-full border backdrop-blur-md
          transition-all duration-200 active:scale-90 disabled:opacity-60
          ${
            active
              ? 'border-wine-400/60 bg-wine-600/30 text-wine-300 shadow-glow'
              : 'border-white/10 bg-ink-950/60 text-ink-200 hover:border-wine-400/50 hover:text-wine-300'
          }`}
      >
        <span className={active ? 'drop-shadow-[0_0_5px_rgba(224,74,109,0.7)]' : ''}>{heart}</span>

        {/* Heart-burst animation on favorite */}
        {bursting && (
          <>
            <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-wine-500/40" />
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-1 animate-fade-out rounded-full bg-gold-400"
                style={{ transform: `rotate(${i * 60}deg) translateX(14px)` }}
              />
            ))}
          </>
        )}
      </button>

      {withLabel && (
        <span className="ml-2 text-xs text-ink-300">
          {active ? 'Saved' : 'Add to favorites'}
        </span>
      )}
    </div>
  );
}
