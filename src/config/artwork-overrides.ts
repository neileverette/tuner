/**
 * Configuration for stations that should use generated fallback thumbnails
 * instead of their default artwork (e.g., low-quality favicons, small logos).
 * 
 * This allows fine-grained control over thumbnail and hero artwork appearance
 * for stations with poor quality images.
 */

export interface ArtworkOverride {
  /** Station ID (e.g., 'rb-rautemusik-lounge', 'somafm:groovesalad') */
  stationId: string;
  
  /** Force fallback for carousel thumbnail (100x100px) */
  forceFallbackThumbnail: boolean;
  
  /** Force fallback for hero/cover artwork (full screen) */
  forceFallbackCover: boolean;
  
  /** Optional: Custom background color (overrides seeded random) */
  customColor?: string;
  
  /** Optional: Custom initials (overrides auto-generated) */
  customInitials?: string;
  
  /** Optional: Style variant for fallback */
  style?: 'solid' | 'gradient' | 'pattern';
  
  /** Optional: Display mode for thumbnail */
  thumbnailMode?: 'initials' | 'full-name';
  
  /** Optional: Display mode for cover */
  coverMode?: 'initials' | 'full-name';
  
  /** Reason for override (for documentation) */
  reason?: string;
}

/**
 * Array of stations configured to use fallback artwork.
 * Add stations here when their default artwork is poor quality.
 */
export const ARTWORK_OVERRIDES: ArtworkOverride[] = [
  {
    stationId: 'rb-rautemusik-lounge',
    forceFallbackThumbnail: true,
    forceFallbackCover: true,
    customColor: '#d946ef', // Magenta
    style: 'gradient',
    thumbnailMode: 'initials',
    coverMode: 'initials',
    customInitials: 'RL',
    reason: 'Using tiny favicon.ico (16x16px) - looks terrible when enlarged',
  },
  {
    stationId: 'rb-rautemusik-techno',
    forceFallbackThumbnail: true,
    forceFallbackCover: true,
    customColor: '#ea5455', // Red
    style: 'gradient',
    thumbnailMode: 'initials',
    coverMode: 'initials',
    customInitials: 'RT',
    reason: 'Using tiny favicon.ico (16x16px) - looks terrible when enlarged',
  },
  // Add all stations with generic play button or poor quality images
  {
    stationId: 'rb-0-n-chillout',
    forceFallbackThumbnail: true,
    forceFallbackCover: true,
    customColor: '#533483', // Purple
    style: 'gradient',
    thumbnailMode: 'initials',
    coverMode: 'initials',
    customInitials: '0C',
    reason: 'Generic play button thumbnail',
  },
  {
    stationId: 'rb-0-n-lounge',
    forceFallbackThumbnail: true,
    forceFallbackCover: true,
    customColor: '#2d6a4f', // Green
    style: 'gradient',
    thumbnailMode: 'initials',
    coverMode: 'initials',
    customInitials: '0L',
    reason: 'Generic play button thumbnail',
  },
];

/**
 * Get artwork override configuration for a station.
 * Returns null if no override is configured.
 */
export function getArtworkOverride(stationId: string): ArtworkOverride | null {
  return ARTWORK_OVERRIDES.find(override => override.stationId === stationId) ?? null;
}

/**
 * Check if a station should use fallback thumbnail in carousel.
 */
export function shouldUseFallbackThumbnail(stationId: string): boolean {
  const override = getArtworkOverride(stationId);
  return override?.forceFallbackThumbnail ?? false;
}

/**
 * Check if a station should use fallback cover in hero view.
 */
export function shouldUseFallbackCover(stationId: string): boolean {
  const override = getArtworkOverride(stationId);
  return override?.forceFallbackCover ?? false;
}

/**
 * Get custom color for a station, if configured.
 */
export function getCustomColor(stationId: string): string | null {
  const override = getArtworkOverride(stationId);
  return override?.customColor ?? null;
}

/**
 * Get custom initials for a station, if configured.
 */
export function getCustomInitials(stationId: string): string | null {
  const override = getArtworkOverride(stationId);
  return override?.customInitials ?? null;
}

/**
 * Get style variant for a station's fallback.
 */
export function getFallbackStyle(stationId: string): 'solid' | 'gradient' | 'pattern' {
  const override = getArtworkOverride(stationId);
  return override?.style ?? 'solid';
}

/**
 * Get display mode for thumbnail.
 */
export function getThumbnailMode(stationId: string): 'initials' | 'full-name' {
  const override = getArtworkOverride(stationId);
  return override?.thumbnailMode ?? 'initials';
}

/**
 * Get display mode for cover.
 */
export function getCoverMode(stationId: string): 'initials' | 'full-name' {
  const override = getArtworkOverride(stationId);
  return override?.coverMode ?? 'initials';
}

/**
 * Clean station name for display (remove leading underscores, replace middle underscores with spaces).
 */
export function cleanStationName(name: string): string {
  // Remove leading underscores
  let cleaned = name.replace(/^_+/, '');
  // Remove trailing underscores
  cleaned = cleaned.replace(/_+$/, '');
  // Replace middle underscores with spaces
  cleaned = cleaned.replace(/_/g, ' ');
  return cleaned;
}

// Made with Bob
