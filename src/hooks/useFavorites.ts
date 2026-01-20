import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'tuner-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  const toggleFavorite = useCallback((channelId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(channelId)) {
        next.delete(channelId);
      } else {
        next.add(channelId);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((channelId: string) => {
    return favorites.has(channelId);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
