/**
 * NTS Radio channel-to-genre mappings and channel definitions.
 * 2 live channels + 16 Infinite Mixtapes mapped to normalized genre taxonomy.
 */

import type { SourceConfig, ChannelDefinition } from '../types.js';

/**
 * NTS Infinite Mixtape stream IDs (for URL construction).
 */
export const NTS_MIXTAPE_IDS = {
  'nts-poolside': 'mixtape4',
  'nts-slow-focus': 'mixtape',
  'nts-low-key': 'mixtape2',
  'nts-memory-lane': 'mixtape6',
  'nts-4-to-the-floor': 'mixtape5',
  'nts-island-time': 'mixtape21',
  'nts-the-tube': 'mixtape26',
  'nts-sheet-music': 'mixtape35',
  'nts-feelings': 'mixtape27',
  'nts-expansions': 'mixtape3',
  'nts-rap-house': 'mixtape22',
  'nts-labyrinth': 'mixtape31',
  'nts-sweat': 'mixtape24',
  'nts-otaku': 'mixtape36',
  'nts-the-pit': 'mixtape34',
  'nts-field-recordings': 'mixtape23',
} as const;

/**
 * NTS live channel numbers (for URL construction).
 */
export const NTS_LIVE_CHANNELS = {
  'nts-1': 'stream',
  'nts-2': 'stream2',
} as const;

const NTS_LOGO = 'https://media.ntslive.co.uk/crop/770x770/d0a1a0e6-a19a-48f4-884a-c3b72e76dd45_1551974400.png';

/**
 * NTS channel definitions with stream URLs.
 * Live channels use stream-relay-geo, mixtapes use stream-mixtape-geo.
 */
const channelDefinitions: readonly ChannelDefinition[] = [
  // Live Channels
  {
    id: 'nts-1',
    title: 'NTS 1',
    description: 'Live broadcasts from NTS London - eclectic underground radio',
    dj: null,
    image: {
      small: NTS_LOGO,
      medium: NTS_LOGO,
      large: NTS_LOGO,
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream-relay-geo.ntslive.net/stream' },
    ],
    homepage: 'https://www.nts.live/1',
  },
  {
    id: 'nts-2',
    title: 'NTS 2',
    description: 'Live broadcasts from NTS London - eclectic underground radio',
    dj: null,
    image: {
      small: NTS_LOGO,
      medium: NTS_LOGO,
      large: NTS_LOGO,
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream-relay-geo.ntslive.net/stream2' },
    ],
    homepage: 'https://www.nts.live/2',
  },

  // Infinite Mixtapes
  {
    id: 'nts-poolside',
    title: 'NTS - Poolside',
    description: 'Balearic, boogie, and sophisti-pop for poolsides, beaches and car stereos',
    dj: null,
    image: {
      small: NTS_LOGO,
      medium: NTS_LOGO,
      large: NTS_LOGO,
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream-mixtape-geo.ntslive.net/mixtape4' },
    ],
    homepage: 'https://www.nts.live/infinite-mixtapes',
  },
  {
    id: 'nts-slow-focus',
    title: 'NTS - Slow Focus',
    description: 'Meditative, relaxing and beatless: ambient, drone and ragas',
    dj: null,
    image: {
      small: NTS_LOGO,
      medium: NTS_LOGO,
      large: NTS_LOGO,
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream-mixtape-geo.ntslive.net/mixtape' },
    ],
    homepage: 'https://www.nts.live/infinite-mixtapes',
  },
  {
    id: 'nts-low-key',
    title: 'NTS - Low Key',
    description: 'Keeping it simple with lo-fi hip-hop and smooth R&B',
    dj: null,
    image: {
      small: NTS_LOGO,
      medium: NTS_LOGO,
      large: NTS_LOGO,
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream-mixtape-geo.ntslive.net/mixtape2' },
    ],
    homepage: 'https://www.nts.live/infinite-mixtapes',
  },
  {
    id: 'nts-memory-lane',
    title: 'NTS - Memory Lane',
    description: 'Turn on, tune in, drop out - psychedelic sounds',
    dj: null,
    image: {
      small: NTS_LOGO,
      medium: NTS_LOGO,
      large: NTS_LOGO,
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream-mixtape-geo.ntslive.net/mixtape6' },
    ],
    homepage: 'https://www.nts.live/infinite-mixtapes',
  },
  {
    id: 'nts-4-to-the-floor',
    title: 'NTS - 4 To The Floor',
    description: 'House and techno from past to present',
    dj: null,
    image: {
      small: NTS_LOGO,
      medium: NTS_LOGO,
      large: NTS_LOGO,
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream-mixtape-geo.ntslive.net/mixtape5' },
    ],
    homepage: 'https://www.nts.live/infinite-mixtapes',
  },
  {
    id: 'nts-island-time',
    title: 'NTS - Island Time',
    description: 'Easy skanking - reggae, dub, and plenty more',
    dj: null,
    image: {
      small: NTS_LOGO,
      medium: NTS_LOGO,
      large: NTS_LOGO,
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream-mixtape-geo.ntslive.net/mixtape21' },
    ],
    homepage: 'https://www.nts.live/infinite-mixtapes',
  },
  {
    id: 'nts-the-tube',
    title: 'NTS - The Tube',
    description: 'Oddball post-punk, industrial provocation, and minimal wave',
    dj: null,
    image: {
      small: NTS_LOGO,
      medium: NTS_LOGO,
      large: NTS_LOGO,
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream-mixtape-geo.ntslive.net/mixtape26' },
    ],
    homepage: 'https://www.nts.live/infinite-mixtapes',
  },
  {
    id: 'nts-sheet-music',
    title: 'NTS - Sheet Music',
    description: 'The best of classical and contemporary composition',
    dj: null,
    image: {
      small: NTS_LOGO,
      medium: NTS_LOGO,
      large: NTS_LOGO,
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream-mixtape-geo.ntslive.net/mixtape35' },
    ],
    homepage: 'https://www.nts.live/infinite-mixtapes',
  },
  {
    id: 'nts-feelings',
    title: 'NTS - Feelings',
    description: 'Sweet soul, gospel, boogie, and beyond',
    dj: null,
    image: {
      small: NTS_LOGO,
      medium: NTS_LOGO,
      large: NTS_LOGO,
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream-mixtape-geo.ntslive.net/mixtape27' },
    ],
    homepage: 'https://www.nts.live/infinite-mixtapes',
  },
  {
    id: 'nts-expansions',
    title: 'NTS - Expansions',
    description: 'Jazz and its many mind-expanding variations',
    dj: null,
    image: {
      small: NTS_LOGO,
      medium: NTS_LOGO,
      large: NTS_LOGO,
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream-mixtape-geo.ntslive.net/mixtape3' },
    ],
    homepage: 'https://www.nts.live/infinite-mixtapes',
  },
  {
    id: 'nts-rap-house',
    title: 'NTS - Rap House',
    description: '808s and champagne - hip-hop meets electronic',
    dj: null,
    image: {
      small: NTS_LOGO,
      medium: NTS_LOGO,
      large: NTS_LOGO,
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream-mixtape-geo.ntslive.net/mixtape22' },
    ],
    homepage: 'https://www.nts.live/infinite-mixtapes',
  },
  {
    id: 'nts-labyrinth',
    title: 'NTS - Labyrinth',
    description: 'Lose yourself in atmospheric breaks, tripped out techno, and cerebral electronics',
    dj: null,
    image: {
      small: NTS_LOGO,
      medium: NTS_LOGO,
      large: NTS_LOGO,
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream-mixtape-geo.ntslive.net/mixtape31' },
    ],
    homepage: 'https://www.nts.live/infinite-mixtapes',
  },
  {
    id: 'nts-sweat',
    title: 'NTS - Sweat',
    description: 'A new wave of international party music',
    dj: null,
    image: {
      small: NTS_LOGO,
      medium: NTS_LOGO,
      large: NTS_LOGO,
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream-mixtape-geo.ntslive.net/mixtape24' },
    ],
    homepage: 'https://www.nts.live/infinite-mixtapes',
  },
  {
    id: 'nts-otaku',
    title: 'NTS - Otaku',
    description: 'Video game and anime soundtracks, for fanboys and fangirls',
    dj: null,
    image: {
      small: NTS_LOGO,
      medium: NTS_LOGO,
      large: NTS_LOGO,
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream-mixtape-geo.ntslive.net/mixtape36' },
    ],
    homepage: 'https://www.nts.live/infinite-mixtapes',
  },
  {
    id: 'nts-the-pit',
    title: 'NTS - The Pit',
    description: 'Behold the songs of the ancient metal bards',
    dj: null,
    image: {
      small: NTS_LOGO,
      medium: NTS_LOGO,
      large: NTS_LOGO,
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream-mixtape-geo.ntslive.net/mixtape34' },
    ],
    homepage: 'https://www.nts.live/infinite-mixtapes',
  },
  {
    id: 'nts-field-recordings',
    title: 'NTS - Field Recordings',
    description: 'Natural ambience from NTS listeners around the world',
    dj: null,
    image: {
      small: NTS_LOGO,
      medium: NTS_LOGO,
      large: NTS_LOGO,
    },
    streams: [
      { quality: 'medium', format: 'mp3', bitrate: 128, url: 'https://stream-mixtape-geo.ntslive.net/mixtape23' },
    ],
    homepage: 'https://www.nts.live/infinite-mixtapes',
  },
];

export const NTS_CONFIG: SourceConfig = {
  id: 'nts',
  name: 'NTS Radio',
  homepage: 'https://www.nts.live',
  channels: [
    // Live channels
    {
      channelId: 'nts-1',
      primaryGenre: 'eclectic',
    },
    {
      channelId: 'nts-2',
      primaryGenre: 'eclectic',
    },
    // Infinite Mixtapes
    {
      channelId: 'nts-poolside',
      primaryGenre: 'lounge',
      secondaryGenres: ['ambient'],
    },
    {
      channelId: 'nts-slow-focus',
      primaryGenre: 'ambient',
    },
    {
      channelId: 'nts-low-key',
      primaryGenre: 'jazz-soul',
    },
    {
      channelId: 'nts-memory-lane',
      primaryGenre: 'rock',
      secondaryGenres: ['eclectic'],
    },
    {
      channelId: 'nts-4-to-the-floor',
      primaryGenre: 'electronic',
    },
    {
      channelId: 'nts-island-time',
      primaryGenre: 'world',
    },
    {
      channelId: 'nts-the-tube',
      primaryGenre: 'rock',
      secondaryGenres: ['electronic'],
    },
    {
      channelId: 'nts-sheet-music',
      primaryGenre: 'eclectic',
      secondaryGenres: ['ambient'],
    },
    {
      channelId: 'nts-feelings',
      primaryGenre: 'jazz-soul',
    },
    {
      channelId: 'nts-expansions',
      primaryGenre: 'jazz-soul',
    },
    {
      channelId: 'nts-rap-house',
      primaryGenre: 'electronic',
      secondaryGenres: ['jazz-soul'],
    },
    {
      channelId: 'nts-labyrinth',
      primaryGenre: 'electronic',
      secondaryGenres: ['ambient'],
    },
    {
      channelId: 'nts-sweat',
      primaryGenre: 'electronic',
      secondaryGenres: ['world'],
    },
    {
      channelId: 'nts-otaku',
      primaryGenre: 'eclectic',
    },
    {
      channelId: 'nts-the-pit',
      primaryGenre: 'rock',
    },
    {
      channelId: 'nts-field-recordings',
      primaryGenre: 'ambient',
    },
  ],
  api: {
    channelsEndpoint: null, // Using static channel definitions
    nowPlayingEndpoint: 'https://www.nts.live/api/v2/live',
    streamUrlTemplate: null, // Using static stream definitions
    proxyRequired: true,
  },
  channelDefinitions,
};
