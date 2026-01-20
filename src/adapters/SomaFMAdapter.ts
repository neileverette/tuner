import type { SourceAdapter, AdapterConfig, Channel, NowPlaying, StreamQuality } from '../types';

interface SomaFMChannel {
  id: string;
  title: string;
  description: string;
  dj: string;
  genre: string;
  image: string;
  largeimage: string;
  xlimage: string;
  playlists: { url: string; format: string; quality: string }[];
  lastPlaying: string;
  listeners: number;
}

interface SomaFMResponse {
  channels: SomaFMChannel[];
}

export class SomaFMAdapter implements SourceAdapter {
  readonly source = 'somafm' as const;
  readonly name = 'SomaFM';
  readonly config: AdapterConfig;

  private channelCache: Map<string, SomaFMChannel> = new Map();

  constructor(config: Partial<AdapterConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      pollInterval: config.pollInterval ?? 10000,
      proxyBaseUrl: config.proxyBaseUrl ?? '/api/stream',
    };
  }

  async fetchChannels(): Promise<Channel[]> {
    const response = await fetch('https://api.somafm.com/channels.json');
    if (!response.ok) {
      throw new Error(`SomaFM API error: ${response.status}`);
    }
    const data: SomaFMResponse = await response.json();

    this.channelCache.clear();
    data.channels.forEach(ch => this.channelCache.set(ch.id, ch));

    return data.channels.map(ch => this.normalizeChannel(ch));
  }

  async fetchNowPlaying(channelId: string): Promise<NowPlaying | null> {
    const response = await fetch('https://api.somafm.com/channels.json');
    if (!response.ok) return null;

    const data: SomaFMResponse = await response.json();
    const channel = data.channels.find(ch => ch.id === channelId);

    if (!channel?.lastPlaying) return null;
    return this.parseNowPlaying(channel.lastPlaying);
  }

  getStreamUrl(channel: Channel, _preferredFormat?: 'mp3' | 'aac' | 'flac'): string {
    // SomaFM only offers MP3 streams via proxy
    return `${this.config.proxyBaseUrl}/${channel.sourceId}`;
  }

  private normalizeChannel(raw: SomaFMChannel): Channel {
    return {
      id: `somafm:${raw.id}`,
      sourceId: raw.id,
      source: 'somafm',
      title: raw.title,
      description: raw.description,
      genre: raw.genre,
      dj: raw.dj || null,
      image: {
        small: raw.image,
        medium: raw.largeimage,
        large: raw.xlimage,
      },
      streams: this.parseStreams(raw),
      nowPlaying: raw.lastPlaying ? this.parseNowPlaying(raw.lastPlaying) : null,
      listeners: raw.listeners ?? null,
      homepage: `https://somafm.com/${raw.id}/`,
    };
  }

  private parseStreams(raw: SomaFMChannel): StreamQuality[] {
    return [{
      id: 'mp3-128',
      format: 'mp3',
      bitrate: 128,
      label: 'MP3 128kbps',
      url: `${this.config.proxyBaseUrl}/${raw.id}`,
    }];
  }

  private parseNowPlaying(lastPlaying: string): NowPlaying {
    const parts = lastPlaying.split(' - ');

    if (parts.length >= 2) {
      const [artist, ...titleParts] = parts;
      return {
        track: lastPlaying,
        artist,
        title: titleParts.join(' - '),
        album: null,
        coverUrl: null,
        duration: null,
      };
    }

    return {
      track: lastPlaying,
      artist: null,
      title: null,
      album: null,
      coverUrl: null,
      duration: null,
    };
  }
}
