/**
 * Radio Paradise channel-to-genre mappings and channel definitions.
 * 4 channels mapped to normalized genre taxonomy with stream URLs.
 */

import type { SourceConfig, ChannelDefinition } from '../types';

/**
 * Radio Paradise channel API identifiers (for now playing API).
 */
export const RP_CHANNEL_IDS = {
  'rp-main': 0,
  'rp-mellow': 1,
  'rp-rock': 2,
  'rp-global': 3,
} as const;

/**
 * Radio Paradise channel definitions with stream URLs.
 * Streams ordered by quality: AAC 320k (high), FLAC (high), MP3 128k (medium).
 */
const channelDefinitions: readonly ChannelDefinition[] = [
  {
    id: 'rp-main',
    title: 'Radio Paradise - Main Mix',
    description: 'Eclectic blend of rock, electronica, world music',
    dj: null,
    image: {
      small: 'https://img.radioparadise.com/assets/rp-logo.png',
      medium: 'https://img.radioparadise.com/assets/rp-logo.png',
      large: 'https://img.radioparadise.com/assets/rp-logo.png',
    },
    streams: [
      { quality: 'high', format: 'aac', bitrate: 320, url: 'https://stream.radioparadise.com/aac-320' },
      { quality: 'high', format: 'flac', bitrate: 0, url: 'https://stream.radioparadise.com/flac' },
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream.radioparadise.com/mp3-128' },
    ],
    homepage: 'https://radioparadise.com',
  },
  {
    id: 'rp-mellow',
    title: 'Radio Paradise - Mellow Mix',
    description: 'Downtempo, chill, ambient, acoustic',
    dj: null,
    image: {
      small: 'https://img.radioparadise.com/assets/rp-logo.png',
      medium: 'https://img.radioparadise.com/assets/rp-logo.png',
      large: 'https://img.radioparadise.com/assets/rp-logo.png',
    },
    streams: [
      { quality: 'high', format: 'aac', bitrate: 320, url: 'https://stream.radioparadise.com/mellow-320' },
      { quality: 'high', format: 'flac', bitrate: 0, url: 'https://stream.radioparadise.com/mellow-flac' },
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream.radioparadise.com/mellow-128' },
    ],
    homepage: 'https://radioparadise.com',
  },
  {
    id: 'rp-rock',
    title: 'Radio Paradise - Rock Mix',
    description: 'Rock-focused, classic to modern',
    dj: null,
    image: {
      small: 'https://img.radioparadise.com/assets/rp-logo.png',
      medium: 'https://img.radioparadise.com/assets/rp-logo.png',
      large: 'https://img.radioparadise.com/assets/rp-logo.png',
    },
    streams: [
      { quality: 'high', format: 'aac', bitrate: 320, url: 'https://stream.radioparadise.com/rock-320' },
      { quality: 'high', format: 'flac', bitrate: 0, url: 'https://stream.radioparadise.com/rock-flac' },
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream.radioparadise.com/rock-128' },
    ],
    homepage: 'https://radioparadise.com',
  },
  {
    id: 'rp-global',
    title: 'Radio Paradise - Global Mix',
    description: 'World music and international sounds',
    dj: null,
    image: {
      small: 'https://img.radioparadise.com/assets/rp-logo.png',
      medium: 'https://img.radioparadise.com/assets/rp-logo.png',
      large: 'https://img.radioparadise.com/assets/rp-logo.png',
    },
    streams: [
      { quality: 'high', format: 'aac', bitrate: 320, url: 'https://stream.radioparadise.com/global-320' },
      { quality: 'high', format: 'flac', bitrate: 0, url: 'https://stream.radioparadise.com/global-flac' },
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream.radioparadise.com/global-128' },
    ],
    homepage: 'https://radioparadise.com',
  },
];

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
  api: {
    channelsEndpoint: null, // No public channel list API
    nowPlayingEndpoint: 'https://api.radioparadise.com/api/get_block?bitrate=4&info=true&chan={chanId}',
    streamUrlTemplate: null, // Using static stream definitions
    proxyRequired: true,
  },
  channelDefinitions,
};
