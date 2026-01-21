import type { SourceAdapter, AdapterConfig, Channel, NowPlaying, StreamQuality } from '../types';

interface RPChannelDef {
  id: string;
  chan: number;
  title: string;
  description: string;
  genre: string;
  streamPath: string;
}

interface RPGetBlockResponse {
  image_base: string;
  length: number;
  song: Array<{
    artist: string;
    title: string;
    album: string;
    cover: string;
    duration: number;
  }>;
  refresh: number;
}

const RP_CHANNELS: RPChannelDef[] = [
  { id: 'main', chan: 0, title: 'Main Mix', description: 'Eclectic mix of rock, world, electronic, and more', genre: 'Eclectic', streamPath: '' },
  { id: 'mellow', chan: 1, title: 'Mellow Mix', description: 'Relaxed, atmospheric, and chilled selections', genre: 'Ambient/Chillout', streamPath: 'mellow-' },
  { id: 'eclectic', chan: 2, title: 'Rock Mix', description: 'Guitar-driven rock and alternative', genre: 'Rock/Alternative', streamPath: 'eclectic-' },
  { id: 'global', chan: 3, title: 'Global Mix', description: 'World music and international sounds', genre: 'World', streamPath: 'global-' },
];

export class RadioParadiseAdapter implements SourceAdapter {
  readonly source = 'radioparadise' as const;
  readonly name = 'Radio Paradise';
  readonly config: AdapterConfig;

  constructor(config: Partial<AdapterConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      pollInterval: config.pollInterval ?? 30000, // 30 seconds - RP rate limit
      proxyBaseUrl: config.proxyBaseUrl ?? '/api/stream/rp',
      apiBaseUrl: config.apiBaseUrl ?? 'https://api.radioparadise.com',
    };
  }

  async fetchChannels(): Promise<Channel[]> {
    return RP_CHANNELS.map(def => this.normalizeChannel(def));
  }

  async fetchNowPlaying(channelId: string): Promise<NowPlaying | null> {
    const chanParam = this.getChannelParam(channelId);
    if (chanParam === null) return null;

    try {
      // Use proxy to avoid CORS issues
      const url = `/api/rp/nowplaying/${chanParam}`;
      const response = await fetch(url);
      if (!response.ok) return null;

      const data: RPGetBlockResponse = await response.json();
      return this.parseNowPlaying(data);
    } catch {
      return null;
    }
  }

  private parseNowPlaying(data: RPGetBlockResponse): NowPlaying | null {
    if (!data.song || data.song.length === 0) return null;

    const song = data.song[0];
    let coverUrl: string | null = null;
    if (data.image_base && song.cover) {
      const mediumCover = song.cover.replace('/l/', '/m/');
      coverUrl = `${data.image_base}${mediumCover}`;
    }

    return {
      track: `${song.artist} - ${song.title}`,
      artist: song.artist || null,
      title: song.title || null,
      album: song.album || null,
      coverUrl,
      duration: song.duration || null,
    };
  }

  getStreamUrl(channel: Channel, preferredFormat?: 'mp3' | 'aac' | 'flac'): string {
    // Default to MP3 for browser compatibility (AAC/ADTS not widely supported)
    const quality = preferredFormat === 'flac' ? 'flac'
      : preferredFormat === 'aac' ? 'aac-320'
      : 'mp3-128';
    return `${this.config.proxyBaseUrl}/${channel.sourceId}/${quality}`;
  }

  getDirectStreamUrl(channelId: string, quality: string = 'aac-320'): string {
    const def = RP_CHANNELS.find(d => d.id === channelId);
    if (!def) throw new Error(`Unknown Radio Paradise channel: ${channelId}`);
    return `http://stream.radioparadise.com/${def.streamPath}${quality}`;
  }

  getChannelParam(channelId: string): number | null {
    return RP_CHANNELS.find(d => d.id === channelId)?.chan ?? null;
  }

  private normalizeChannel(def: RPChannelDef): Channel {
    return {
      id: `rp:${def.id}`,
      sourceId: def.id,
      source: 'radioparadise',
      title: def.title,
      description: def.description,
      genre: def.genre,
      dj: null,
      image: {
        small: `https://img.radioparadise.com/channels/0/${def.chan}/banner_500x280/0.jpg`,
        medium: `https://img.radioparadise.com/channels/0/${def.chan}/banner_500x280/0.jpg`,
        large: `https://img.radioparadise.com/channels/0/${def.chan}/banner_500x280/0.jpg`,
      },
      streams: this.getAvailableStreams(def),
      nowPlaying: null,
      listeners: null,
      homepage: `https://radioparadise.com/${def.id === 'main' ? '' : def.id}`,
    };
  }

  private getAvailableStreams(def: RPChannelDef): StreamQuality[] {
    return [
      { id: 'flac', format: 'flac', bitrate: null, label: 'FLAC (Lossless)', url: `http://stream.radioparadise.com/${def.streamPath}flac` },
      { id: 'aac-320', format: 'aac', bitrate: 320, label: 'AAC 320kbps', url: `http://stream.radioparadise.com/${def.streamPath}aac-320` },
      { id: 'mp3-128', format: 'mp3', bitrate: 128, label: 'MP3 128kbps', url: `http://stream.radioparadise.com/${def.streamPath}mp3-128` },
    ];
  }
}
