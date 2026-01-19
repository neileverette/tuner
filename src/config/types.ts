/**
 * Shared TypeScript interfaces for multi-source radio aggregation.
 */

import type { GenreId } from './genres';

/**
 * Channel-to-genre mapping for a single channel.
 */
export interface ChannelGenreMapping {
  /** Channel ID from source (e.g., "groovesalad" for SomaFM) */
  readonly channelId: string;

  /** Primary genre - channel appears in this category by default */
  readonly primaryGenre: GenreId;

  /** Secondary genres - channel also appears when these are selected */
  readonly secondaryGenres?: readonly GenreId[];
}

/**
 * Configuration for a radio source (SomaFM, Radio Paradise, etc.)
 */
export interface SourceConfig {
  /** Unique source identifier (e.g., "somafm", "radio-paradise") */
  readonly id: string;

  /** Display name (e.g., "SomaFM", "Radio Paradise") */
  readonly name: string;

  /** Source homepage URL */
  readonly homepage: string;

  /** Channel-to-genre mappings */
  readonly channels: readonly ChannelGenreMapping[];
}
