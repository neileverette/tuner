import { useState, useRef, useEffect } from 'react';
import { GENRE_LIST, type GenreId } from '../config/genres';

type GenreFilterProps = {
  enabledGenres: Set<GenreId>;
  onEnableGenre: (genreId: GenreId) => void;
  onDisableGenre: (genreId: GenreId) => void;
  onEnableAll: () => void;
};

export default function GenreFilter({
  enabledGenres,
  onEnableGenre,
  onDisableGenre,
  onEnableAll,
}: GenreFilterProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get disabled genres (ones that can be added back)
  const disabledGenres = GENRE_LIST.filter(g => !enabledGenres.has(g.id as GenreId));
  // Get enabled genres for chip display
  const enabledGenreList = GENRE_LIST.filter(g => enabledGenres.has(g.id as GenreId));

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Close dropdown on Escape
  useEffect(() => {
    if (!dropdownOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dropdownOpen]);

  const handleAddGenre = (genreId: GenreId) => {
    onEnableGenre(genreId);
    // Keep dropdown open for multi-select
  };

  const handleRemoveGenre = (genreId: GenreId) => {
    onDisableGenre(genreId);
  };

  const isFiltering = enabledGenres.size < GENRE_LIST.length;

  return (
    <div className="genre-filter-container" ref={containerRef}>
      {/* Enabled genre chips with X buttons */}
      <div className="genre-filter-chips">
        {/* Dropdown trigger - at the start, only show if there are disabled genres to add */}
        {disabledGenres.length > 0 && (
          <button
            className={`genre-add-trigger ${dropdownOpen ? 'active' : ''}`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            title="Add genre filter"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        )}

        {enabledGenreList.map(genre => (
          <button
            key={genre.id}
            className="genre-chip-removable"
            onClick={() => handleRemoveGenre(genre.id as GenreId)}
            title={`Remove ${genre.name}`}
          >
            <span className="genre-chip-label">{genre.name}</span>
            <span className="genre-chip-remove material-symbols-outlined">close</span>
          </button>
        ))}

        {/* Reset button - only show when filtering */}
        {isFiltering && (
          <button
            className="genre-reset-btn"
            onClick={onEnableAll}
            title="Show all genres"
          >
            Reset
          </button>
        )}
      </div>

      {/* Dropdown menu */}
      {dropdownOpen && disabledGenres.length > 0 && (
        <div className="genre-dropdown">
          <div className="genre-dropdown-header">Add Genre</div>
          {disabledGenres.map(genre => (
            <button
              key={genre.id}
              className="genre-dropdown-item"
              onClick={() => handleAddGenre(genre.id as GenreId)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
