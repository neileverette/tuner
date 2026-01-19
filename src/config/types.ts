/**
 * Shared TypeScript interfaces for multi-source radio aggregation.
 */

import type { GenreId } from './genres.js';

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
 * Stream quality level.
 */
export type StreamQuality = 'high' | 'medium' | 'low';

/**
 * Audio format type.
 */
export type StreamFormat = 'mp3' | 'aac' | 'flac';

/**
 * A single stream endpoint for a channel.
 */
export interface StreamDefinition {
  /** Quality tier */
  readonly quality: StreamQuality;

  /** Audio format */
  readonly format: StreamFormat;

  /** Bitrate in kbps (0 for lossless/variable) */
  readonly bitrate: number;

  /** Direct stream URL or URL template */
  readonly url: string;
}

/**
 * Static channel metadata (combined with live API data at runtime).
 */
export interface ChannelDefinition {
  /** Channel ID - matches channelId in ChannelGenreMapping */
  readonly id: string;

  /** Display title (placeholder if API provides real title) */
  readonly title: string;

  /** Channel description (placeholder if API provides) */
  readonly description: string;

  /** DJ name if applicable */
  readonly dj: string | null;

  /** Channel artwork at different sizes */
  readonly image: {
    readonly small: string;
    readonly medium: string;
    readonly large: string;
  };

  /** Available stream endpoints */
  readonly streams: readonly StreamDefinition[];

  /** Channel homepage URL */
  readonly homepage: string | null;
}

/**
 * API configuration for a radio source.
 */
export interface SourceApiConfig {
  /** Endpoint to fetch channel list (null if not available) */
  readonly channelsEndpoint: string | null;

  /** Endpoint for now playing data (may include {chanId} template) */
  readonly nowPlayingEndpoint: string | null;

  /** Stream URL template with placeholders (null if using static streams) */
  readonly streamUrlTemplate: string | null;

  /** Whether CORS proxy is required for browser requests */
  readonly proxyRequired: boolean;
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

  /** API configuration */
  readonly api: SourceApiConfig;

  /** Full channel definitions with metadata and stream URLs */
  readonly channelDefinitions: readonly ChannelDefinition[];
}
