/**
 * Source registry - aggregates all radio source configurations.
 */

import { SOMAFM_CONFIG } from './somafm.js';
import { RADIO_PARADISE_CONFIG } from './radio-paradise.js';
import { NTS_CONFIG } from './nts.js';
import type { SourceConfig, ChannelGenreMapping, ChannelDefinition } from '../types.js';

// Re-export individual source configs
export { SOMAFM_CONFIG } from './somafm.js';
export { RADIO_PARADISE_CONFIG } from './radio-paradise.js';
export { RP_CHANNEL_IDS } from './radio-paradise.js';
export { NTS_CONFIG } from './nts.js';
export { NTS_MIXTAPE_IDS, NTS_LIVE_CHANNELS } from './nts.js';

// All sources
export const SOURCES: readonly SourceConfig[] = [
  SOMAFM_CONFIG,
  RADIO_PARADISE_CONFIG,
  NTS_CONFIG,
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

/**
 * Channel definition with source ID attached.
 */
export interface ChannelDefinitionWithSource extends ChannelDefinition {
  readonly sourceId: string;
}

/**
 * Get a single channel definition by source ID and channel ID.
 */
export function getChannelDefinition(sourceId: string, channelId: string): ChannelDefinition | undefined {
  const source = getSource(sourceId);
  if (!source) return undefined;
  return source.channelDefinitions.find(ch => ch.id === channelId);
}

/**
 * Get all channel definitions from all sources with source ID attached.
 */
export function getAllChannelDefinitions(): readonly ChannelDefinitionWithSource[] {
  return SOURCES.flatMap(source =>
    source.channelDefinitions.map(channel => ({
      ...channel,
      sourceId: source.id,
    }))
  );
}
