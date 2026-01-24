import type { SourceType, Channel, NowPlaying, SourceAdapter } from '../types';
import { KEXPAdapter, SomaFMAdapter, RadioParadiseAdapter, NTSAdapter, RadioBrowserAdapter } from '../adapters';

/**
 * SourceRegistry orchestrates multiple source adapters, providing unified
 * channel access with parallel fetching and error isolation.
 */
export class SourceRegistry {
  private adapters: Map<SourceType, SourceAdapter> = new Map();
  private channelCache: Map<string, Channel> = new Map();

  /**
   * Register an adapter for a source type.
   */
  register(adapter: SourceAdapter): void {
    this.adapters.set(adapter.source, adapter);
  }

  /**
   * Unregister an adapter.
   */
  unregister(source: SourceType): void {
    this.adapters.delete(source);
  }

  /**
   * Get registered adapter by source type.
   */
  getAdapter(source: SourceType): SourceAdapter | undefined {
    return this.adapters.get(source);
  }

  /**
   * Fetch all channels from all registered adapters in parallel.
   * Uses Promise.allSettled for error isolation - one failing source
   * doesn't break the others.
   */
  async getAllChannels(): Promise<Channel[]> {
    const adapters = Array.from(this.adapters.values()).filter(a => a.config.enabled);

    if (adapters.length === 0) {
      return [];
    }

    const results = await Promise.allSettled(
      adapters.map(adapter => adapter.fetchChannels())
    );

    const channels: Channel[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        result.value.forEach(channel => {
          channels.push(channel);
          this.channelCache.set(channel.id, channel);
        });
      } else {
        const adapter = adapters[index];
        console.warn(`Failed to fetch channels from ${adapter.name}:`, result.reason);
      }
    });

    // Sort by source, then by title
    return channels.sort((a, b) => {
      if (a.source !== b.source) {
        return a.source.localeCompare(b.source);
      }
      return a.title.localeCompare(b.title);
    });
  }

  /**
   * Fetch channels from a specific source.
   */
  async getChannelsBySource(source: SourceType): Promise<Channel[]> {
    const adapter = this.adapters.get(source);
    if (!adapter || !adapter.config.enabled) {
      return [];
    }

    try {
      const channels = await adapter.fetchChannels();
      channels.forEach(channel => {
        this.channelCache.set(channel.id, channel);
      });
      return channels;
    } catch (error) {
      console.warn(`Failed to fetch channels from ${adapter.name}:`, error);
      return [];
    }
  }

  /**
   * Get a channel from cache by its full ID (e.g., 'somafm:groovesalad').
   * Returns undefined if not found. Relies on prior fetching.
   */
  getChannel(channelId: string): Channel | undefined {
    return this.channelCache.get(channelId);
  }

  /**
   * Get the stream URL for a channel, delegating to the appropriate adapter.
   */
  getStreamUrl(channel: Channel, preferredFormat?: 'mp3' | 'aac' | 'flac'): string {
    const adapter = this.adapters.get(channel.source);
    if (!adapter) {
      throw new Error(`No adapter registered for source: ${channel.source}`);
    }
    return adapter.getStreamUrl(channel, preferredFormat);
  }

  /**
   * Fetch now-playing info for a channel.
   * Parses source from channelId prefix and delegates to the appropriate adapter.
   */
  async fetchNowPlaying(channelId: string): Promise<NowPlaying | null> {
    // Parse source from channelId (e.g., 'somafm:groovesalad' -> 'somafm')
    const colonIndex = channelId.indexOf(':');
    if (colonIndex === -1) {
      return null;
    }

    const sourcePrefix = channelId.substring(0, colonIndex);
    const sourceId = channelId.substring(colonIndex + 1);

    // Map prefix to SourceType
    const sourceMap: Record<string, SourceType> = {
      'kexp': 'kexp',
      'somafm': 'somafm',
      'rp': 'radioparadise',
      'nts': 'nts',
      'radiobrowser': 'radiobrowser',
    };

    const source = sourceMap[sourcePrefix];
    if (!source) {
      return null;
    }

    const adapter = this.adapters.get(source);
    if (!adapter) {
      return null;
    }

    return adapter.fetchNowPlaying(sourceId);
  }
}

/**
 * Create a pre-configured registry with all known adapters.
 */
export function createDefaultRegistry(): SourceRegistry {
  const registry = new SourceRegistry();
  registry.register(new KEXPAdapter());
  registry.register(new SomaFMAdapter());
  registry.register(new RadioParadiseAdapter());
  registry.register(new NTSAdapter());
  registry.register(new RadioBrowserAdapter());
  return registry;
}

/**
 * Singleton instance for app-wide use.
 * Use createDefaultRegistry() if you need a fresh instance.
 */
export const defaultRegistry = createDefaultRegistry();
