/**
 * Source registry - aggregates all radio source configurations.
 */

import { SOMAFM_CONFIG } from './somafm';
import { RADIO_PARADISE_CONFIG } from './radio-paradise';
import type { SourceConfig, ChannelGenreMapping } from '../types';

// Re-export individual source configs
export { SOMAFM_CONFIG } from './somafm';
export { RADIO_PARADISE_CONFIG } from './radio-paradise';

// All sources
export const SOURCES: readonly SourceConfig[] = [
  SOMAFM_CONFIG,
  RADIO_PARADISE_CONFIG,
];

/**
 * Get a source configuration by ID.
 */
export function getSource(id: string): SourceConfig | undefined {
  return SOURCES.find(source => source.id === id);
}

/**
 * Channel mapping with source ID attached.
 */
export interface ChannelMappingWithSource extends ChannelGenreMapping {
  readonly sourceId: string;
}

/**
 * Get all channel mappings from all sources with source ID attached.
 */
export function getAllChannelMappings(): readonly ChannelMappingWithSource[] {
  return SOURCES.flatMap(source =>
    source.channels.map(channel => ({
      ...channel,
      sourceId: source.id,
    }))
  );
}
