/**
 * Radio Paradise channel-to-genre mappings.
 * 4 channels mapped to normalized genre taxonomy.
 */

import type { SourceConfig } from '../types';

export const RADIO_PARADISE_CONFIG: SourceConfig = {
  id: 'radio-paradise',
  name: 'Radio Paradise',
  homepage: 'https://radioparadise.com',
  channels: [
    {
      channelId: 'rp-main',
      primaryGenre: 'eclectic',
      secondaryGenres: ['rock', 'electronic', 'world'],
    },
    {
      channelId: 'rp-mellow',
      primaryGenre: 'ambient',
    },
    {
      channelId: 'rp-rock',
      primaryGenre: 'rock',
    },
    {
      channelId: 'rp-global',
      primaryGenre: 'world',
    },
  ],
};
