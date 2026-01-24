/**
 * Utility for generating fallback thumbnails for stations without artwork
 */

// Generate seeded random number from string - using mulberry32 algorithm
function seededRandom(seed: string, index: number): number {
  let h = 0
  const str = seed + '_' + index
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 2654435761)
  }
  h = Math.imul(h ^ (h >>> 16), 2654435761)
  h = Math.imul(h ^ (h >>> 16), 2654435761)
  return (h >>> 0) / 4294967296
}

// Color palette for fallback thumbnails
const FALLBACK_COLORS = [
  '#1a1a2e', // Dark blue
  '#16213e', // Navy
  '#0f3460', // Deep blue
  '#533483', // Purple
  '#2d4059', // Slate
  '#ea5455', // Red
  '#f07b3f', // Orange
  '#ffd460', // Yellow
  '#2d6a4f', // Green
  '#1b4965', // Teal
  '#5f0f40', // Maroon
  '#9a031e', // Crimson
]

/**
 * Generate a consistent background color for a station based on its ID
 */
export function generateFallbackColor(stationId: string): string {
  const index = Math.floor(seededRandom(stationId, 0) * FALLBACK_COLORS.length)
  return FALLBACK_COLORS[index]
}

/**
 * Extract initials from station name for fallback thumbnail text
 * Examples:
 * - "Radio Paradise" -> "RP"
 * - "KEXP" -> "KE"
 * - "Jazz FM" -> "JF"
 * - "BBC Radio 1" -> "BR"
 */
export function extractInitials(name: string): string {
  // Remove common prefixes
  const cleaned = name
    .replace(/^(Radio|Station|FM|AM)\s+/i, '')
    .trim()
  
  // Split by spaces and take first letter of first two words
  const words = cleaned.split(/\s+/).filter(w => w.length > 0)
  
  if (words.length === 0) {
    return '??'
  }
  
  if (words.length === 1) {
    // Single word: take first two letters
    return words[0].substring(0, 2).toUpperCase()
  }
  
  // Multiple words: take first letter of first two words
  return (words[0][0] + words[1][0]).toUpperCase()
}

/**
 * Check if a station needs a fallback thumbnail
 */
export function needsFallbackThumbnail(imageUrl: string | null | undefined): boolean {
  return !imageUrl || imageUrl.trim() === ''
}

/**
 * Generate fallback thumbnail data for a station
 */
export interface FallbackThumbnail {
  backgroundColor: string
  initials: string
  needsFallback: boolean
}

export function generateFallbackThumbnail(
  stationId: string,
  stationName: string,
  imageUrl: string | null | undefined
): FallbackThumbnail {
  const needsFallback = needsFallbackThumbnail(imageUrl)
  
  return {
    backgroundColor: generateFallbackColor(stationId),
    initials: extractInitials(stationName),
    needsFallback,
  }
}

// Made with Bob
