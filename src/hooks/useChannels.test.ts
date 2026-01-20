import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useChannels } from './useChannels';

// Mock the services module
vi.mock('../services', () => ({
  defaultRegistry: {
    getAllChannels: vi.fn(),
    getChannelsBySource: vi.fn(),
    getStreamUrl: vi.fn().mockReturnValue('/api/stream/test'),
  },
}));

import { defaultRegistry } from '../services';

describe('useChannels', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches all channels on mount', async () => {
    const mockChannels = [{ id: 'somafm:test', title: 'Test' }];
    (defaultRegistry.getAllChannels as ReturnType<typeof vi.fn>).mockResolvedValue(mockChannels);

    const { result } = renderHook(() => useChannels());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.channels).toEqual(mockChannels);
    expect(result.current.error).toBeNull();
  });

  it('filters by source when option provided', async () => {
    const mockChannels = [{ id: 'somafm:test', title: 'Test' }];
    (defaultRegistry.getChannelsBySource as ReturnType<typeof vi.fn>).mockResolvedValue(mockChannels);

    const { result } = renderHook(() => useChannels({ source: 'somafm' }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(defaultRegistry.getChannelsBySource).toHaveBeenCalledWith('somafm');
  });

  it('sets error state on failure', async () => {
    (defaultRegistry.getAllChannels as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useChannels());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error?.message).toBe('Network error');
    expect(result.current.channels).toEqual([]);
  });

  it('provides getStreamUrl function that delegates to registry', async () => {
    const mockChannels = [{ id: 'somafm:test', title: 'Test', source: 'somafm' }];
    (defaultRegistry.getAllChannels as ReturnType<typeof vi.fn>).mockResolvedValue(mockChannels);

    const { result } = renderHook(() => useChannels());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const url = result.current.getStreamUrl(mockChannels[0] as any, 'mp3');

    expect(url).toBe('/api/stream/test');
    expect(defaultRegistry.getStreamUrl).toHaveBeenCalledWith(mockChannels[0], 'mp3');
  });
});
