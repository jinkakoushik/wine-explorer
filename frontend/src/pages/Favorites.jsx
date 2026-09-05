import { Link } from 'react-router-dom';
import WineGrid from '../components/wines/WineGrid.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Favorites() {
  const { favorites, loading } = useFavorites();
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="label-caps">Your Cellar</p>
      <h1 className="mt-1 font-display text-4xl text-white sm:text-5xl">Favorites</h1>
      <p className="mt-2 text-sm text-ink-400">
        {loading
          ? 'Fetching your saved bottles…'
          : `${favorites.length} ${favorites.length === 1 ? 'bottle' : 'bottles'} saved${
              user ? `, ${user.name.split(' ')[0]}` : ''
            }`}
      </p>

      <div className="mt-10">
        <WineGrid
          wines={favorites}
          loading={loading}
          error=""
          emptyProps={{
            icon: '🤍',
            title: 'No favorites yet',
            message:
              'Tap the heart on any wine to save it here — your collection is stored with your account.',
            ctaTo: '/explore',
            ctaLabel: 'Discover wines',
          }}
        />
      </div>

      {favorites.length > 0 && (
        <p className="mt-8 text-center text-xs text-ink-500">
          Favorites are saved to your account — <Link to="/profile" className="text-gold-400 hover:text-gold-300">view your profile</Link>.
        </p>
      )}
    </div>
  );
}
