import { useState, useEffect, useCallback } from 'react';
import { defaultRegistry } from '../services';
import type { Channel, SourceType } from '../types';

export interface UseChannelsResult {
  channels: Channel[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  getStreamUrl: (channel: Channel, preferredFormat?: 'mp3' | 'aac' | 'flac') => string;
}

export function useChannels(options?: { source?: SourceType }): UseChannelsResult {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchChannels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = options?.source
        ? await defaultRegistry.getChannelsBySource(options.source)
        : await defaultRegistry.getAllChannels();
      setChannels(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch channels'));
    } finally {
      setIsLoading(false);
    }
  }, [options?.source]);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  const getStreamUrl = useCallback(
    (channel: Channel, preferredFormat?: 'mp3' | 'aac' | 'flac') => {
      return defaultRegistry.getStreamUrl(channel, preferredFormat);
    },
    []
  );

  return {
    channels,
    isLoading,
    error,
    refetch: fetchChannels,
    getStreamUrl,
  };
}
