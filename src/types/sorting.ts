/**
 * Available sort options for station lists
 */
export type SortOption = 'station' | 'genre' | 'popularity';

/**
 * Sort option configuration for UI display
 */
export type SortOptionConfig = {
  value: SortOption;
  label: string;
};

/**
 * Available sort options with display labels
 */
export const SORT_OPTIONS: SortOptionConfig[] = [
  { value: 'station', label: 'Sort: Station' },
  { value: 'genre', label: 'Sort: Genre' },
  { value: 'popularity', label: 'Sort: Popularity' },
];

/**
 * Get display label for a sort option
 */
export function getSortLabel(option: SortOption): string {
  const config = SORT_OPTIONS.find((o) => o.value === option);
  return config?.label ?? 'Station';
}
