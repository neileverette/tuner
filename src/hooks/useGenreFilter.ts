import { useState, useCallback } from 'react';
import { GENRE_IDS, type GenreId } from '../config/genres';

const STORAGE_KEY = 'tuner-genre-filter';

export type UseGenreFilterResult = {
  enabledGenres: Set<GenreId>;
  isGenreEnabled: (genreId: GenreId) => boolean;
  enableGenre: (genreId: GenreId) => void;
  disableGenre: (genreId: GenreId) => void;
  toggleGenre: (genreId: GenreId) => void;
  enableAll: () => void;
  isFiltering: boolean;
  enabledCount: number;
  totalCount: number;
};

function loadFromStorage(): Set<GenreId> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as string[];
      const validIds = parsed.filter((id): id is GenreId =>
        GENRE_IDS.includes(id as GenreId)
      );
      return new Set(validIds);
    }
  } catch {
    // Invalid data, return default
  }
  // Default: all genres enabled
  return new Set(GENRE_IDS);
}

function saveToStorage(genres: Set<GenreId>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...genres]));
}

export function useGenreFilter(): UseGenreFilterResult {
  const [enabledGenres, setEnabledGenres] = useState<Set<GenreId>>(loadFromStorage);

  const isGenreEnabled = useCallback(
    (genreId: GenreId) => enabledGenres.has(genreId),
    [enabledGenres]
  );

  const enableGenre = useCallback((genreId: GenreId) => {
    setEnabledGenres(prev => {
      if (prev.has(genreId)) return prev;
      const next = new Set(prev);
      next.add(genreId);
      saveToStorage(next);
      return next;
    });
  }, []);

  const disableGenre = useCallback((genreId: GenreId) => {
    setEnabledGenres(prev => {
      if (!prev.has(genreId)) return prev;
      const next = new Set(prev);
      next.delete(genreId);
      saveToStorage(next);
      return next;
    });
  }, []);

  const toggleGenre = useCallback((genreId: GenreId) => {
    setEnabledGenres(prev => {
      const next = new Set(prev);
      if (next.has(genreId)) {
        next.delete(genreId);
      } else {
        next.add(genreId);
      }
      saveToStorage(next);
      return next;
    });
  }, []);

  const enableAll = useCallback(() => {
    const all = new Set(GENRE_IDS);
    setEnabledGenres(all);
    saveToStorage(all);
  }, []);

  return {
    enabledGenres,
    isGenreEnabled,
    enableGenre,
    disableGenre,
    toggleGenre,
    enableAll,
    isFiltering: enabledGenres.size < GENRE_IDS.length,
    enabledCount: enabledGenres.size,
    totalCount: GENRE_IDS.length,
  };
}
