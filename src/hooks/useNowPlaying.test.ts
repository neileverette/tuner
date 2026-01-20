import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNowPlaying } from './useNowPlaying';

vi.mock('../services', () => ({
  defaultRegistry: {
    fetchNowPlaying: vi.fn(),
  },
}));

import { defaultRegistry } from '../services';

describe('useNowPlaying', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fetches immediately on mount with channelId', async () => {
    vi.useRealTimers(); // Use real timers for this test since it needs async resolution
    const mockNowPlaying = { track: 'Test - Song', artist: 'Test', title: 'Song' };
    (defaultRegistry.fetchNowPlaying as ReturnType<typeof vi.fn>).mockResolvedValue(mockNowPlaying);

    const { result, unmount } = renderHook(() => useNowPlaying('somafm:groovesalad'));

    // Wait for initial fetch to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.nowPlaying).toEqual(mockNowPlaying);
    expect(defaultRegistry.fetchNowPlaying).toHaveBeenCalledWith('somafm:groovesalad');
    unmount(); // Clean up to prevent polling
  });

  it('returns null nowPlaying when channelId is null', () => {
    const { result } = renderHook(() => useNowPlaying(null));

    expect(result.current.nowPlaying).toBeNull();
    expect(defaultRegistry.fetchNowPlaying).not.toHaveBeenCalled();
  });

  it('does not poll when enabled is false', async () => {
    renderHook(() => useNowPlaying('somafm:groovesalad', { enabled: false }));

    expect(defaultRegistry.fetchNowPlaying).not.toHaveBeenCalled();
  });

  it('uses correct poll interval for SomaFM (10s)', async () => {
    (defaultRegistry.fetchNowPlaying as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    renderHook(() => useNowPlaying('somafm:groovesalad'));

    // Initial fetch
    expect(defaultRegistry.fetchNowPlaying).toHaveBeenCalledTimes(1);

    // Advance 10 seconds (SomaFM interval)
    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    expect(defaultRegistry.fetchNowPlaying).toHaveBeenCalledTimes(2);
  });

  it('uses correct poll interval for Radio Paradise (30s)', async () => {
    (defaultRegistry.fetchNowPlaying as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    renderHook(() => useNowPlaying('rp:main'));

    // Initial fetch
    expect(defaultRegistry.fetchNowPlaying).toHaveBeenCalledTimes(1);

    // Advance 10 seconds - should NOT poll yet (RP is 30s)
    await act(async () => {
      vi.advanceTimersByTime(10000);
    });
    expect(defaultRegistry.fetchNowPlaying).toHaveBeenCalledTimes(1);

    // Advance to 30 seconds total
    await act(async () => {
      vi.advanceTimersByTime(20000);
    });
    expect(defaultRegistry.fetchNowPlaying).toHaveBeenCalledTimes(2);
  });

  it('clears interval on unmount', async () => {
    (defaultRegistry.fetchNowPlaying as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const { unmount } = renderHook(() => useNowPlaying('somafm:groovesalad'));

    expect(defaultRegistry.fetchNowPlaying).toHaveBeenCalledTimes(1);

    unmount();

    // Advance timers after unmount
    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    // Should still be 1 - no polling after unmount
    expect(defaultRegistry.fetchNowPlaying).toHaveBeenCalledTimes(1);
  });

  it('resets nowPlaying when channelId becomes null', async () => {
    vi.useRealTimers(); // Use real timers for this test since it needs async resolution
    const mockNowPlaying = { track: 'Test - Song', artist: 'Test', title: 'Song' };
    (defaultRegistry.fetchNowPlaying as ReturnType<typeof vi.fn>).mockResolvedValue(mockNowPlaying);

    const { result, rerender, unmount } = renderHook(
      ({ channelId }) => useNowPlaying(channelId),
      { initialProps: { channelId: 'somafm:groovesalad' as string | null } }
    );

    // Wait for initial fetch to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.nowPlaying).toEqual(mockNowPlaying);

    // Change to null
    rerender({ channelId: null });

    expect(result.current.nowPlaying).toBeNull();
    unmount(); // Clean up
  });
});
