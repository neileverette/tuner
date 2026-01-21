import type { Channel } from '../types/channel';
import type { SortOption } from '../types/sorting';

/**
 * Sort channels by title alphabetically (case-insensitive)
 */
function sortByStation(a: Channel, b: Channel): number {
  return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
}

/**
 * Sort channels by genre alphabetically, then by title as secondary sort
 */
function sortByGenre(a: Channel, b: Channel): number {
  const genreCompare = a.genre.toLowerCase().localeCompare(b.genre.toLowerCase());
  if (genreCompare !== 0) return genreCompare;
  return sortByStation(a, b);
}

/**
 * Sort channels by listener count (descending)
 * Channels with null listeners (e.g., Radio Paradise) sort to the TOP
 */
function sortByPopularity(a: Channel, b: Channel): number {
  // null listeners go to the top
  if (a.listeners === null && b.listeners === null) {
    return sortByStation(a, b); // secondary sort by station name
  }
  if (a.listeners === null) return -1; // a goes first
  if (b.listeners === null) return 1;  // b goes first

  // Both have listener counts - sort descending (higher first)
  const diff = b.listeners - a.listeners;
  if (diff !== 0) return diff;
  return sortByStation(a, b); // secondary sort by station name
}

/**
 * Sort channels based on the selected sort option
 * Returns a new sorted array (does not mutate the original)
 */
export function sortChannels(channels: Channel[], sortOption: SortOption): Channel[] {
  const sorted = [...channels];

  switch (sortOption) {
    case 'station':
      sorted.sort(sortByStation);
      break;
    case 'genre':
      sorted.sort(sortByGenre);
      break;
    case 'popularity':
      sorted.sort(sortByPopularity);
      break;
  }

  return sorted;
}
