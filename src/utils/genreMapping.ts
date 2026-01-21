import type { Channel } from '../types';
import type { GenreId } from '../config/genres';
import { isValidGenreId } from '../config/genres';
import { SOMAFM_CONFIG } from '../config/sources/somafm';
import { RADIO_PARADISE_CONFIG } from '../config/sources/radio-paradise';

// Build a lookup map from channel ID to primary genre
const CHANNEL_GENRE_MAP: Map<string, GenreId> = new Map();

// Add SomaFM mappings
for (const mapping of SOMAFM_CONFIG.channels) {
  CHANNEL_GENRE_MAP.set(`somafm:${mapping.channelId}`, mapping.primaryGenre as GenreId);
}

// Add Radio Paradise mappings
for (const mapping of RADIO_PARADISE_CONFIG.channels) {
  CHANNEL_GENRE_MAP.set(`radioparadise:${mapping.channelId}`, mapping.primaryGenre as GenreId);
}

/**
 * Get the normalized primary genre for a channel.
 * Falls back to 'eclectic' if no mapping exists.
 */
export function getChannelGenreId(channel: Channel): GenreId {
  const mapped = CHANNEL_GENRE_MAP.get(channel.id);
  if (mapped) return mapped;

  // Fallback: try to match the raw genre string to a genre ID
  const rawGenre = channel.genre.toLowerCase().replace(/[^a-z-]/g, '');
  if (isValidGenreId(rawGenre)) return rawGenre;

  // Default fallback
  return 'eclectic';
}

/**
 * Filter channels by enabled genres.
 */
export function filterChannelsByGenre(
  channels: Channel[],
  enabledGenres: Set<GenreId>
): Channel[] {
  if (enabledGenres.size === 0) return [];
  return channels.filter(channel =>
    enabledGenres.has(getChannelGenreId(channel))
  );
}
