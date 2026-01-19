/**
 * API response type definitions for /api/channels endpoint.
 *
 * These types define the shape of data returned by the backend API.
 * Used by:
 * - Server-side aggregation (after compilation to JS)
 * - Frontend for type-safe API consumption
 */

/**
 * Channel representation in API responses.
 * Simplified view of ChannelDefinition for client consumption.
 */
export interface ApiChannel {
  /** Channel ID (e.g., "groovesalad", "rp-main") */
  readonly id: string;

  /** Source ID (e.g., "somafm", "radio-paradise") */
  readonly source: string;

  /** Display title */
  readonly title: string;

  /** Channel description */
  readonly description: string;

  /** Medium-sized image URL */
  readonly image: string;

  /** Channel homepage URL (null if not available) */
  readonly homepage: string | null;

  /** All genres this channel belongs to (primary + secondary) */
  readonly genres: readonly string[];
}

/**
 * Genre group containing channels.
 * Used in both genre view and nested within source view.
 */
export interface GenreGroup {
  /** Genre ID (e.g., "ambient", "electronic") */
  readonly id: string;

  /** Display name (e.g., "Ambient & Chill") */
  readonly name: string;

  /** Channels in this genre */
  readonly channels: readonly ApiChannel[];
}

/**
 * Source group containing genres and their channels.
 * Used in source view for hierarchical organization.
 */
export interface SourceGroup {
  /** Source ID (e.g., "somafm", "radio-paradise") */
  readonly id: string;

  /** Display name (e.g., "SomaFM", "Radio Paradise") */
  readonly name: string;

  /** Genres within this source, each containing channels */
  readonly genres: readonly GenreGroup[];
}

/**
 * Response shape for ?view=genre (default).
 * Channels grouped by genre across all sources.
 */
export interface GenreViewResponse {
  readonly view: 'genre';
  readonly genres: readonly GenreGroup[];
}

/**
 * Response shape for ?view=source.
 * Channels grouped by source, then by genre within each source.
 */
export interface SourceViewResponse {
  readonly view: 'source';
  readonly sources: readonly SourceGroup[];
}

/**
 * Union type for all /api/channels response shapes.
 */
export type ChannelsApiResponse = GenreViewResponse | SourceViewResponse;
