/**
 * SomaFM channel-to-genre mappings.
 * 49 channels mapped to normalized genre taxonomy.
 */

import type { SourceConfig, ChannelGenreMapping } from '../types';

const channelMappings: readonly ChannelGenreMapping[] = [
  // Ambient & Chill (9 channels)
  { channelId: 'groovesalad', primaryGenre: 'ambient', secondaryGenres: ['electronic'] },
  { channelId: 'gsclassic', primaryGenre: 'ambient', secondaryGenres: ['electronic'] },
  { channelId: 'dronezone', primaryGenre: 'ambient' },
  { channelId: 'deepspaceone', primaryGenre: 'ambient' },
  { channelId: 'darkzone', primaryGenre: 'ambient' },
  { channelId: 'synphaera', primaryGenre: 'ambient', secondaryGenres: ['electronic'] },
  { channelId: 'missioncontrol', primaryGenre: 'ambient', secondaryGenres: ['electronic'] },
  { channelId: 'doomed', primaryGenre: 'ambient' },
  { channelId: 'chillits', primaryGenre: 'ambient' },

  // Electronic (9 channels)
  { channelId: 'beatblender', primaryGenre: 'electronic' },
  { channelId: 'cliqhop', primaryGenre: 'electronic' },
  { channelId: 'dubstep', primaryGenre: 'electronic' },
  { channelId: 'fluid', primaryGenre: 'electronic' },
  { channelId: 'lush', primaryGenre: 'electronic' },
  { channelId: 'spacestation', primaryGenre: 'electronic' },
  { channelId: 'thetrip', primaryGenre: 'electronic' },
  { channelId: 'vaporwaves', primaryGenre: 'electronic' },
  { channelId: 'defcon', primaryGenre: 'electronic' },

  // Rock & Alternative (7 channels)
  { channelId: 'indiepop', primaryGenre: 'rock', secondaryGenres: ['electronic'] },
  { channelId: 'poptron', primaryGenre: 'rock' },
  { channelId: 'digitalis', primaryGenre: 'rock', secondaryGenres: ['electronic'] },
  { channelId: 'u80s', primaryGenre: 'rock', secondaryGenres: ['electronic'] },
  { channelId: 'folkfwd', primaryGenre: 'rock' },
  { channelId: 'metal', primaryGenre: 'rock' },
  { channelId: 'seventies', primaryGenre: 'rock' },

  // World & Global (5 channels)
  { channelId: 'suburbsofgoa', primaryGenre: 'world' },
  { channelId: 'thistle', primaryGenre: 'world' },
  { channelId: 'tikitime', primaryGenre: 'world', secondaryGenres: ['lounge'] },
  { channelId: 'bossa', primaryGenre: 'world' },
  { channelId: 'reggae', primaryGenre: 'world' },

  // Jazz & Soul (3 channels)
  { channelId: 'sonicuniverse', primaryGenre: 'jazz-soul' },
  { channelId: '7soul', primaryGenre: 'jazz-soul' },
  { channelId: 'insound', primaryGenre: 'jazz-soul' },

  // Lounge & Retro (2 channels)
  { channelId: 'illstreet', primaryGenre: 'lounge' },
  { channelId: 'secretagent', primaryGenre: 'lounge' },

  // Eclectic (7 channels)
  { channelId: 'brfm', primaryGenre: 'eclectic' },
  { channelId: 'covers', primaryGenre: 'eclectic' },
  { channelId: 'bootliquor', primaryGenre: 'eclectic' },
  { channelId: 'live', primaryGenre: 'eclectic' },
  { channelId: 'scanner', primaryGenre: 'eclectic' },
  { channelId: 'specials', primaryGenre: 'eclectic' },
  { channelId: 'sfinsf', primaryGenre: 'eclectic' },

  // Holiday (5 channels)
  { channelId: 'christmas', primaryGenre: 'holiday' },
  { channelId: 'jollysoul', primaryGenre: 'holiday' },
  { channelId: 'xmasinfrisko', primaryGenre: 'holiday' },
  { channelId: 'xmasrocks', primaryGenre: 'holiday' },
  { channelId: 'deptstore', primaryGenre: 'holiday' },

  // Additional mappings (2 channels)
  { channelId: 'sf1033', primaryGenre: 'ambient' },
  { channelId: 'n5md', primaryGenre: 'electronic' },
];

export const SOMAFM_CONFIG: SourceConfig = {
  id: 'somafm',
  name: 'SomaFM',
  homepage: 'https://somafm.com',
  channels: channelMappings,
};
