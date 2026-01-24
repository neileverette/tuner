import type { SourceAdapter, AdapterConfig, Channel, NowPlaying, StreamQuality } from '../types';
import { RADIO_BROWSER_CONFIG } from '../config/sources/radio-browser';

/**
 * Radio Browser adapter - serves curated internet radio stations
 * Uses static configuration from radio-browser.ts
 */
export class RadioBrowserAdapter implements SourceAdapter {
  readonly source = 'radiobrowser' as const;
  readonly name = 'Radio Browser';
  readonly config: AdapterConfig;

  constructor(config: Partial<AdapterConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      pollInterval: config.pollInterval ?? 30000,
      proxyBaseUrl: config.proxyBaseUrl ?? '/api/stream',
    };
  }

  async fetchChannels(): Promise<Channel[]> {
    // Convert ChannelDefinitions to Channel objects
    const channels: Channel[] = RADIO_BROWSER_CONFIG.channelDefinitions.map(def => {
      // Find genre mapping for this channel
      const mapping = RADIO_BROWSER_CONFIG.channels.find(m => m.channelId === def.id);
      const genre = mapping?.primaryGenre || 'eclectic';

      return {
        id: `radiobrowser:${def.id}`,
        sourceId: def.id,
        source: 'radiobrowser' as const,
        title: def.title,
        description: def.description,
        genre,
        dj: def.dj,
        image: {
          small: def.image.small,
          medium: def.image.medium,
          large: def.image.large,
        },
        streams: def.streams.map(stream => ({
          id: `${def.id}-${stream.quality}`,
          format: stream.format,
          bitrate: stream.bitrate,
          label: `${stream.quality} (${stream.bitrate}kbps ${stream.format.toUpperCase()})`,
          url: stream.url,
        })) as StreamQuality[],
        nowPlaying: null,
        listeners: null,
        homepage: def.homepage,
      };
    });

    return Promise.resolve(channels);
  }

  async fetchNowPlaying(_channelId: string): Promise<NowPlaying | null> {
    // Radio Browser stations don't provide now-playing info
    return null;
  }

  getStreamUrl(channel: Channel, preferredFormat?: 'mp3' | 'aac' | 'flac'): string {
    // Find stream matching preferred format, or fall back to first available
    let stream = channel.streams[0];
    
    if (preferredFormat) {
      const preferred = channel.streams.find(s => s.format === preferredFormat);
      if (preferred) stream = preferred;
    }
    
    return stream?.url || '';
  }
}

// Made with Bob
