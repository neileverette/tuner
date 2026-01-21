import type { SourceAdapter, AdapterConfig, Channel, NowPlaying, StreamQuality } from '../types';

interface NTSChannelDef {
  id: string;
  title: string;
  description: string;
  genre: string;
  streamType: 'live' | 'mixtape';
  streamPath: string;
  bgColor: string;
}

interface NTSLiveResponse {
  results: Array<{
    channel_name: string;
    now: {
      broadcast_title: string;
      embeds?: {
        details?: {
          name?: string;
          description?: string;
          media?: {
            picture_small?: string;
            picture_medium?: string;
            picture_large?: string;
            background_large?: string;
          };
        };
      };
    };
  }>;
}

const NTS_LOGO = 'https://media.ntslive.co.uk/crop/770x770/d0a1a0e6-a19a-48f4-884a-c3b72e76dd45_1551974400.png';

const NTS_CHANNELS: NTSChannelDef[] = [
  // Live channels
  { id: '1', title: 'NTS 1', description: 'Live broadcasts from NTS London', genre: 'Eclectic', streamType: 'live', streamPath: '1', bgColor: '#1a1a1a' },
  { id: '2', title: 'NTS 2', description: 'Live broadcasts from NTS London', genre: 'Eclectic', streamType: 'live', streamPath: '2', bgColor: '#2d2d2d' },
  // Infinite Mixtapes - each with unique color
  { id: 'poolside', title: 'NTS - Poolside', description: 'Balearic, boogie, and sophisti-pop', genre: 'Lounge', streamType: 'mixtape', streamPath: 'mixtape4', bgColor: '#1e6b8a' },
  { id: 'slow-focus', title: 'NTS - Slow Focus', description: 'Ambient, drone and ragas', genre: 'Ambient', streamType: 'mixtape', streamPath: 'mixtape', bgColor: '#2a4a5e' },
  { id: 'low-key', title: 'NTS - Low Key', description: 'Lo-fi hip-hop and smooth R&B', genre: 'Hip-Hop/R&B', streamType: 'mixtape', streamPath: 'mixtape2', bgColor: '#4a3b6b' },
  { id: 'memory-lane', title: 'NTS - Memory Lane', description: 'Turn on, tune in, drop out', genre: 'Psychedelic', streamType: 'mixtape', streamPath: 'mixtape6', bgColor: '#6b3a5c' },
  { id: '4-to-the-floor', title: 'NTS - 4 To The Floor', description: 'House and techno', genre: 'Electronic', streamType: 'mixtape', streamPath: 'mixtape5', bgColor: '#8b2a4a' },
  { id: 'island-time', title: 'NTS - Island Time', description: 'Reggae, dub, and more', genre: 'Reggae/Dub', streamType: 'mixtape', streamPath: 'mixtape21', bgColor: '#2e7d4a' },
  { id: 'the-tube', title: 'NTS - The Tube', description: 'Post-punk, industrial, minimal wave', genre: 'Post-Punk', streamType: 'mixtape', streamPath: 'mixtape26', bgColor: '#4a4a4a' },
  { id: 'sheet-music', title: 'NTS - Sheet Music', description: 'Classical and contemporary composition', genre: 'Classical', streamType: 'mixtape', streamPath: 'mixtape35', bgColor: '#5c4a3a' },
  { id: 'feelings', title: 'NTS - Feelings', description: 'Soul, gospel, boogie', genre: 'Soul/Gospel', streamType: 'mixtape', streamPath: 'mixtape27', bgColor: '#8b5a3c' },
  { id: 'expansions', title: 'NTS - Expansions', description: 'Jazz and its variations', genre: 'Jazz', streamType: 'mixtape', streamPath: 'mixtape3', bgColor: '#3a5a8b' },
  { id: 'rap-house', title: 'NTS - Rap House', description: '808s and champagne', genre: 'Hip-Hop', streamType: 'mixtape', streamPath: 'mixtape22', bgColor: '#6b2a2a' },
  { id: 'labyrinth', title: 'NTS - Labyrinth', description: 'Atmospheric breaks and cerebral electronics', genre: 'Electronic', streamType: 'mixtape', streamPath: 'mixtape31', bgColor: '#3a3a6b' },
  { id: 'sweat', title: 'NTS - Sweat', description: 'International party music', genre: 'World/Dance', streamType: 'mixtape', streamPath: 'mixtape24', bgColor: '#8b6b2a' },
  { id: 'otaku', title: 'NTS - Otaku', description: 'Video game and anime soundtracks', genre: 'Soundtrack', streamType: 'mixtape', streamPath: 'mixtape36', bgColor: '#5a2a7b' },
  { id: 'the-pit', title: 'NTS - The Pit', description: 'Metal', genre: 'Metal', streamType: 'mixtape', streamPath: 'mixtape34', bgColor: '#2a2a2a' },
  { id: 'field-recordings', title: 'NTS - Field Recordings', description: 'Natural ambience from around the world', genre: 'Ambient', streamType: 'mixtape', streamPath: 'mixtape23', bgColor: '#3a5a4a' },
];

export class NTSAdapter implements SourceAdapter {
  readonly source = 'nts' as const;
  readonly name = 'NTS Radio';
  readonly config: AdapterConfig;

  constructor(config: Partial<AdapterConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      pollInterval: config.pollInterval ?? 60000, // 60 seconds
      proxyBaseUrl: config.proxyBaseUrl ?? '/api/nts',
      apiBaseUrl: config.apiBaseUrl ?? 'https://www.nts.live',
    };
  }

  async fetchChannels(): Promise<Channel[]> {
    return NTS_CHANNELS.map(def => this.normalizeChannel(def));
  }

  async fetchNowPlaying(channelId: string): Promise<NowPlaying | null> {
    // Only live channels have now-playing info
    const def = NTS_CHANNELS.find(d => d.id === channelId);
    if (!def || def.streamType !== 'live') return null;

    try {
      const url = `${this.config.proxyBaseUrl}/nowplaying`;
      const response = await fetch(url);
      if (!response.ok) return null;

      const data: NTSLiveResponse = await response.json();
      const channelData = data.results?.find(r => r.channel_name === channelId);
      if (!channelData) return null;

      return this.parseNowPlaying(channelData);
    } catch {
      return null;
    }
  }

  private parseNowPlaying(data: NTSLiveResponse['results'][0]): NowPlaying | null {
    const title = data.now?.broadcast_title || null;
    const artist = data.now?.embeds?.details?.name || null;
    const coverUrl = data.now?.embeds?.details?.media?.picture_medium || null;

    return {
      track: title || 'Unknown Show',
      artist,
      title,
      album: null,
      coverUrl,
      duration: null,
    };
  }

  getStreamUrl(channel: Channel): string {
    const def = NTS_CHANNELS.find(d => d.id === channel.sourceId);
    if (!def) throw new Error(`Unknown NTS channel: ${channel.sourceId}`);

    if (def.streamType === 'live') {
      return `${this.config.proxyBaseUrl}/live/${def.streamPath}`;
    } else {
      return `${this.config.proxyBaseUrl}/mixtape/${def.streamPath}`;
    }
  }

  private normalizeChannel(def: NTSChannelDef): Channel {
    return {
      id: `nts:${def.id}`,
      sourceId: def.id,
      source: 'nts',
      title: def.title,
      description: def.description,
      genre: def.genre,
      dj: null,
      image: {
        small: NTS_LOGO,
        medium: NTS_LOGO,
        large: NTS_LOGO,
      },
      streams: this.getAvailableStreams(def),
      nowPlaying: null,
      listeners: null,
      homepage: def.streamType === 'live'
        ? `https://www.nts.live/${def.id}`
        : 'https://www.nts.live/infinite-mixtapes',
      bgColor: def.bgColor,
    };
  }

  private getAvailableStreams(def: NTSChannelDef): StreamQuality[] {
    const baseUrl = def.streamType === 'live'
      ? `https://stream-relay-geo.ntslive.net/${def.streamPath === '1' ? 'stream' : 'stream2'}`
      : `https://stream-mixtape-geo.ntslive.net/${def.streamPath}`;

    return [
      { id: 'mp3-128', format: 'mp3', bitrate: 128, label: 'MP3 128kbps', url: baseUrl },
    ];
  }
}
