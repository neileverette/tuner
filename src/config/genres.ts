/**
 * Genre taxonomy for multi-source radio aggregation.
 *
 * Design principles:
 * - 8 parent categories based on SomaFM distribution analysis
 * - Channels can have primary + secondary genre assignments
 * - IDs are lowercase, URL-safe identifiers
 * - Names are display labels
 */

export interface GenreDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly icon?: string;
}

export const GENRES = {
  ambient: {
    id: 'ambient',
    name: 'Ambient & Chill',
    description: 'Atmospheric, downtempo, drone, chill',
    order: 1,
    icon: 'cloud',
  },
  electronic: {
    id: 'electronic',
    name: 'Electronic',
    description: 'IDM, house, techno, dubstep, synthwave',
    order: 2,
    icon: 'bolt',
  },
  rock: {
    id: 'rock',
    name: 'Rock & Alternative',
    description: 'Indie, alternative, classic rock, metal',
    order: 3,
    icon: 'guitar',
  },
  world: {
    id: 'world',
    name: 'World & Global',
    description: 'International, Celtic, reggae, bossa',
    order: 4,
    icon: 'globe',
  },
  'jazz-soul': {
    id: 'jazz-soul',
    name: 'Jazz & Soul',
    description: 'Jazz, soul, R&B, oldies',
    order: 5,
    icon: 'music',
  },
  lounge: {
    id: 'lounge',
    name: 'Lounge & Retro',
    description: 'Lounge, tiki, spy music',
    order: 6,
    icon: 'martini',
  },
  eclectic: {
    id: 'eclectic',
    name: 'Eclectic',
    description: 'Mixed genres, curated variety',
    order: 7,
    icon: 'shuffle',
  },
  holiday: {
    id: 'holiday',
    name: 'Holiday',
    description: 'Christmas, seasonal',
    order: 8,
    icon: 'snowflake',
  },
} as const satisfies Record<string, GenreDefinition>;

// Derived types - use these everywhere, never raw strings
export type GenreId = keyof typeof GENRES;

// Type-safe genre list for iteration (sorted by order)
export const GENRE_LIST = (Object.values(GENRES) as GenreDefinition[])
  .sort((a, b) => a.order - b.order);

// Type-safe ID list
export const GENRE_IDS = GENRE_LIST.map(g => g.id) as GenreId[];

// Lookup helper
export function getGenre(id: GenreId): GenreDefinition {
  return GENRES[id];
}

// Validation helper (for runtime data)
export function isValidGenreId(id: string): id is GenreId {
  return id in GENRES;
}
