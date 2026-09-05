import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { favoritesService } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isAuthenticated, user, initializing } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [favorites, setFavorites] = useState([]); // full wine docs
  const [loading, setLoading] = useState(false);

  // Hydrate from the API whenever the signed-in user changes
  useEffect(() => {
    if (initializing) return;

    if (!isAuthenticated) {
      setFavoriteIds(new Set());
      setFavorites([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    favoritesService
      .list()
      .then((wines) => {
        if (cancelled) return;
        setFavorites(wines);
        setFavoriteIds(new Set(wines.map((w) => w._id)));
      })
      .catch(() => {
        // Favorites are non-critical; start empty on failure
        if (!cancelled) {
          setFavorites([]);
          setFavoriteIds(new Set());
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, initializing, user?.id]);

  const isFavorite = useCallback((wineId) => favoriteIds.has(wineId), [favoriteIds]);

  const toggleFavorite = useCallback(
    async (wineId) => {
      if (!isAuthenticated) {
        throw new Error('Please log in to save favorites');
      }

      const wasFavorite = favoriteIds.has(wineId);

      // Optimistic UI update
      if (wasFavorite) {
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(wineId);
          return next;
        });
        setFavorites((prev) => prev.filter((w) => w._id !== wineId));
      } else {
        setFavoriteIds((prev) => new Set(prev).add(wineId));
      }

      try {
        if (wasFavorite) {
          await favoritesService.remove(wineId);
        } else {
          await favoritesService.add(wineId);
          // Refresh full docs so the favorites page stays accurate
          const wines = await favoritesService.list();
          setFavorites(wines);
        }
        return !wasFavorite;
      } catch (err) {
        // Roll back on failure
        if (wasFavorite) {
          setFavoriteIds((prev) => new Set(prev).add(wineId));
        } else {
          setFavoriteIds((prev) => {
            const next = new Set(prev);
            next.delete(wineId);
            return next;
          });
        }
        throw err;
      }
    },
    [favoriteIds, isAuthenticated]
  );

  const value = {
    favoriteIds,
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    count: favoriteIds.size,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
