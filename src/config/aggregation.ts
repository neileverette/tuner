/**
 * Channel aggregation utilities for /api/channels endpoint.
 *
 * Transforms source registry data into API response shapes.
 */

import { GENRE_LIST, getGenre } from './genres.js';
import type { GenreId } from './genres.js';
import { SOURCES, getAllChannelDefinitions, getAllChannelMappings } from './sources/index.js';
import type { ChannelDefinitionWithSource, ChannelMappingWithSource } from './sources/index.js';
import type {
  ApiChannel,
  GenreGroup,
  SourceGroup,
  GenreViewResponse,
  SourceViewResponse,
} from './api-types.js';

/**
 * Transform a channel definition + mapping into API response format.
 */
function toApiChannel(
  definition: ChannelDefinitionWithSource,
  mapping: ChannelMappingWithSource
): ApiChannel {
  const allGenres: string[] = [mapping.primaryGenre];
  if (mapping.secondaryGenres) {
    allGenres.push(...mapping.secondaryGenres);
  }

  return {
    id: definition.id,
    source: definition.sourceId,
    title: definition.title,
    description: definition.description,
    image: definition.image.medium,
    homepage: definition.homepage,
    genres: allGenres,
  };
}

/**
 * Build a lookup map from channel definitions.
 */
function buildDefinitionMap(): Map<string, ChannelDefinitionWithSource> {
  const definitions = getAllChannelDefinitions();
  const map = new Map<string, ChannelDefinitionWithSource>();
  for (const def of definitions) {
    // Key by sourceId:channelId for uniqueness
    map.set(`${def.sourceId}:${def.id}`, def);
  }
  return map;
}

/**
 * Aggregate channels by genre across all sources.
 *
 * @returns GenreViewResponse with channels grouped by genre
 */
export function aggregateByGenre(): GenreViewResponse {
  const definitionMap = buildDefinitionMap();
  const mappings = getAllChannelMappings();

  // Build genre -> channels map
  const genreChannels = new Map<GenreId, ApiChannel[]>();

  for (const mapping of mappings) {
    const key = `${mapping.sourceId}:${mapping.channelId}`;
    const definition = definitionMap.get(key);
    if (!definition) continue;

    const apiChannel = toApiChannel(definition, mapping);

    // Add to primary genre
    if (!genreChannels.has(mapping.primaryGenre)) {
      genreChannels.set(mapping.primaryGenre, []);
    }
    genreChannels.get(mapping.primaryGenre)!.push(apiChannel);

    // Add to secondary genres
    if (mapping.secondaryGenres) {
      for (const secondaryGenre of mapping.secondaryGenres) {
        if (!genreChannels.has(secondaryGenre)) {
          genreChannels.set(secondaryGenre, []);
        }
        genreChannels.get(secondaryGenre)!.push(apiChannel);
      }
    }
  }

  // Build response using GENRE_LIST for consistent ordering
  const genres: GenreGroup[] = GENRE_LIST.map((genre) => ({
    id: genre.id,
    name: genre.name,
    channels: genreChannels.get(genre.id as GenreId) || [],
  }));

  return {
    view: 'genre',
    genres,
  };
}

/**
 * Aggregate channels by source, then by genre within each source.
 *
 * @returns SourceViewResponse with hierarchical source -> genre -> channels
 */
export function aggregateBySource(): SourceViewResponse {
  const definitionMap = buildDefinitionMap();
  const mappings = getAllChannelMappings();

  // Build source -> genre -> channels nested map
  const sourceGenreChannels = new Map<string, Map<GenreId, ApiChannel[]>>();

  for (const mapping of mappings) {
    const key = `${mapping.sourceId}:${mapping.channelId}`;
    const definition = definitionMap.get(key);
    if (!definition) continue;

    const apiChannel = toApiChannel(definition, mapping);

    // Initialize source map if needed
    if (!sourceGenreChannels.has(mapping.sourceId)) {
      sourceGenreChannels.set(mapping.sourceId, new Map());
    }
    const genreMap = sourceGenreChannels.get(mapping.sourceId)!;

    // Add to primary genre
    if (!genreMap.has(mapping.primaryGenre)) {
      genreMap.set(mapping.primaryGenre, []);
    }
    genreMap.get(mapping.primaryGenre)!.push(apiChannel);

    // Add to secondary genres
    if (mapping.secondaryGenres) {
      for (const secondaryGenre of mapping.secondaryGenres) {
        if (!genreMap.has(secondaryGenre)) {
          genreMap.set(secondaryGenre, []);
        }
        genreMap.get(secondaryGenre)!.push(apiChannel);
      }
    }
  }

  // Build response using SOURCES for consistent ordering
  const sources: SourceGroup[] = SOURCES.map((source) => {
    const genreMap = sourceGenreChannels.get(source.id) || new Map();

    // Use GENRE_LIST for consistent genre ordering within source
    const genres: GenreGroup[] = GENRE_LIST
      .filter((genre) => genreMap.has(genre.id as GenreId))
      .map((genre) => ({
        id: genre.id,
        name: genre.name,
        channels: genreMap.get(genre.id as GenreId) || [],
      }));

    return {
      id: source.id,
      name: source.name,
      genres,
    };
  });

  return {
    view: 'source',
    sources,
  };
}
