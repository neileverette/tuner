import { useState, useEffect, useCallback, useRef } from 'react';
import { defaultRegistry } from '../services';
import type { NowPlaying, SourceType } from '../types';

export interface UseNowPlayingResult {
  nowPlaying: NowPlaying | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Poll intervals per source (respecting rate limits)
const POLL_INTERVALS: Record<SourceType, number> = {
  somafm: 10000,        // 10 seconds
  radioparadise: 30000, // 30 seconds - API rate limit
};

function getSourceFromChannelId(channelId: string): SourceType | null {
  if (channelId.startsWith('somafm:')) return 'somafm';
  if (channelId.startsWith('rp:')) return 'radioparadise';
  return null;
}

export function useNowPlaying(
  channelId: string | null,
  options?: { enabled?: boolean }
): UseNowPlayingResult {
  const enabled = options?.enabled ?? true;
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const intervalRef = useRef<number | null>(null);

  const fetchNowPlaying = useCallback(async () => {
    if (!channelId) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await defaultRegistry.fetchNowPlaying(channelId);
      setNowPlaying(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch now playing'));
    } finally {
      setIsLoading(false);
    }
  }, [channelId]);

  // Initial fetch and polling setup
  useEffect(() => {
    if (!enabled || !channelId) {
      setNowPlaying(null);
      return;
    }

    // Fetch immediately
    fetchNowPlaying();

    // Determine poll interval based on source
    const source = getSourceFromChannelId(channelId);
    const pollInterval = source ? POLL_INTERVALS[source] : 15000; // Default 15s

    // Set up polling
    intervalRef.current = window.setInterval(fetchNowPlaying, pollInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [channelId, enabled, fetchNowPlaying]);

  return {
    nowPlaying,
    isLoading,
    error,
    refetch: fetchNowPlaying,
  };
}
