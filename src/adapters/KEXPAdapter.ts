import type { SourceAdapter, AdapterConfig, Channel, NowPlaying, StreamQuality } from '../types';

interface KEXPPlayResponse {
  results: Array<{
    artist: string;
    song: string;
    album: string;
    image_uri: string;
    thumbnail_uri: string;
    play_type: string;
  }>;
}

export class KEXPAdapter implements SourceAdapter {
  readonly source = 'kexp' as const;
  readonly name = 'KEXP';
  readonly config: AdapterConfig;

  constructor(config: Partial<AdapterConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      pollInterval: config.pollInterval ?? 30000,
      proxyBaseUrl: config.proxyBaseUrl ?? '/api/stream/kexp',
      apiBaseUrl: config.apiBaseUrl ?? '/api/kexp',
    };
  }

  async fetchChannels(): Promise<Channel[]> {
    return [this.getChannel()];
  }

  async fetchNowPlaying(_channelId: string): Promise<NowPlaying | null> {
    try {
      const url = `${this.config.apiBaseUrl}/nowplaying`;
      const response = await fetch(url);
      if (!response.ok) return null;

      const data: KEXPPlayResponse = await response.json();
      return this.parseNowPlaying(data);
    } catch {
      return null;
    }
  }

  private parseNowPlaying(data: KEXPPlayResponse): NowPlaying | null {
    if (!data.results || data.results.length === 0) return null;

    // Find the most recent trackplay (skip airbreaks, etc.)
    const play = data.results.find(r => r.play_type === 'trackplay') || data.results[0];
    if (!play.artist || !play.song) return null;

    return {
      track: `${play.artist} - ${play.song}`,
      artist: play.artist || null,
      title: play.song || null,
      album: play.album || null,
      coverUrl: play.image_uri || play.thumbnail_uri || null,
      duration: null,
    };
  }

  getStreamUrl(_channel: Channel, _preferredFormat?: 'mp3' | 'aac' | 'flac'): string {
    // KEXP only offers AAC streams - use 160kbps for better quality
    return `${this.config.proxyBaseUrl}/160`;
  }

  private getChannel(): Channel {
    return {
      id: 'kexp:main',
      sourceId: 'main',
      source: 'kexp',
      title: 'KEXP 90.3 FM',
      description: 'Where the music matters. Seattle\'s legendary independent radio station.',
      genre: 'Eclectic/Indie',
      dj: null,
      image: {
        small: 'https://www.kexp.org/static/assets/img/kexp-logo.png',
        medium: 'https://www.kexp.org/static/assets/img/kexp-logo.png',
        large: 'https://www.kexp.org/static/assets/img/kexp-logo.png',
      },
      streams: this.getAvailableStreams(),
      nowPlaying: null,
      listeners: null,
      homepage: 'https://www.kexp.org',
    };
  }

  private getAvailableStreams(): StreamQuality[] {
    return [
      { id: 'aac-160', format: 'aac', bitrate: 160, label: 'AAC 160kbps', url: 'https://kexp.streamguys1.com/kexp160.aac' },
      { id: 'aac-64', format: 'aac', bitrate: 64, label: 'AAC 64kbps', url: 'https://kexp.streamguys1.com/kexp64.aac' },
    ];
  }
}
