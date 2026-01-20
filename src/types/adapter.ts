import type { Channel, NowPlaying, SourceType } from './channel';

/**
 * Configuration for a source adapter
 */
export type AdapterConfig = {
  enabled: boolean;
  pollInterval: number;  // milliseconds
  proxyBaseUrl: string;
  apiBaseUrl?: string;   // Optional - for sources with API endpoints
};

/**
 * Source adapter interface - contract for all music sources
 */
export interface SourceAdapter {
  readonly source: SourceType;
  readonly name: string;
  readonly config: AdapterConfig;

  /**
   * Fetch all channels from this source
   */
  fetchChannels(): Promise<Channel[]>;

  /**
   * Fetch current now playing info for a channel
   */
  fetchNowPlaying(channelId: string): Promise<NowPlaying | null>;

  /**
   * Get the stream URL for a channel (may go through proxy)
   */
  getStreamUrl(channel: Channel, preferredFormat?: 'mp3' | 'aac' | 'flac'): string;
}
