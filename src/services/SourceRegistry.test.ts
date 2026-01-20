import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SourceRegistry } from './SourceRegistry';
import type { SourceAdapter, Channel, SourceType } from '../types';

// Mock channel factory
function createMockChannel(source: SourceType, sourceId: string, title: string): Channel {
  const prefix = source === 'somafm' ? 'somafm' : 'rp';
  return {
    id: `${prefix}:${sourceId}`,
    sourceId,
    source,
    title,
    description: `${title} description`,
    genre: 'Test',
    dj: null,
    image: { small: '', medium: '', large: '' },
    streams: [],
    nowPlaying: null,
    listeners: null,
    homepage: null,
  };
}

// Mock adapter factory
function createMockAdapter(
  source: SourceType,
  channels: Channel[],
  shouldFail = false
): SourceAdapter {
  return {
    source,
    name: source === 'somafm' ? 'SomaFM' : 'Radio Paradise',
    config: { enabled: true, pollInterval: 10000, proxyBaseUrl: '/api/stream' },
    fetchChannels: shouldFail
      ? vi.fn().mockRejectedValue(new Error('Fetch failed'))
      : vi.fn().mockResolvedValue(channels),
    fetchNowPlaying: vi.fn().mockResolvedValue({
      track: 'Test Artist - Test Song',
      artist: 'Test Artist',
      title: 'Test Song',
      album: 'Test Album',
      coverUrl: null,
      duration: null,
    }),
    getStreamUrl: vi.fn().mockReturnValue('/api/stream/test'),
  };
}

describe('SourceRegistry', () => {
  let registry: SourceRegistry;

  beforeEach(() => {
    registry = new SourceRegistry();
  });

  describe('registration', () => {
    it('should register an adapter and retrieve it with getAdapter', () => {
      const adapter = createMockAdapter('somafm', []);
      registry.register(adapter);

      expect(registry.getAdapter('somafm')).toBe(adapter);
    });

    it('should return undefined for unregistered source', () => {
      expect(registry.getAdapter('somafm')).toBeUndefined();
    });

    it('should unregister an adapter', () => {
      const adapter = createMockAdapter('somafm', []);
      registry.register(adapter);
      registry.unregister('somafm');

      expect(registry.getAdapter('somafm')).toBeUndefined();
    });
  });

  describe('getAllChannels - happy path', () => {
    it('should return combined channels from all adapters', async () => {
      const somaChannels = [
        createMockChannel('somafm', 'groovesalad', 'Groove Salad'),
        createMockChannel('somafm', 'dronezone', 'Drone Zone'),
      ];
      const rpChannels = [
        createMockChannel('radioparadise', 'main', 'Main Mix'),
        createMockChannel('radioparadise', 'mellow', 'Mellow Mix'),
      ];

      const somaAdapter = createMockAdapter('somafm', somaChannels);
      const rpAdapter = createMockAdapter('radioparadise', rpChannels);

      registry.register(somaAdapter);
      registry.register(rpAdapter);

      const result = await registry.getAllChannels();

      expect(result).toHaveLength(4);
      expect(somaAdapter.fetchChannels).toHaveBeenCalledOnce();
      expect(rpAdapter.fetchChannels).toHaveBeenCalledOnce();
    });

    it('should sort channels by source then by title', async () => {
      const somaChannels = [
        createMockChannel('somafm', 'dronezone', 'Drone Zone'),
        createMockChannel('somafm', 'groovesalad', 'Groove Salad'),
      ];
      const rpChannels = [
        createMockChannel('radioparadise', 'mellow', 'Mellow Mix'),
        createMockChannel('radioparadise', 'main', 'Main Mix'),
      ];

      registry.register(createMockAdapter('radioparadise', rpChannels));
      registry.register(createMockAdapter('somafm', somaChannels));

      const result = await registry.getAllChannels();

      expect(result.map(c => c.id)).toEqual([
        'rp:main',
        'rp:mellow',
        'somafm:dronezone',
        'somafm:groovesalad',
      ]);
    });

    it('should return empty array when no adapters registered', async () => {
      const result = await registry.getAllChannels();
      expect(result).toEqual([]);
    });
  });

  describe('getAllChannels - error isolation', () => {
    it('should return channels from working adapter when one fails', async () => {
      const somaChannels = [createMockChannel('somafm', 'groovesalad', 'Groove Salad')];
      const workingAdapter = createMockAdapter('somafm', somaChannels);
      const failingAdapter = createMockAdapter('radioparadise', [], true);

      // Suppress console.warn during test
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      registry.register(workingAdapter);
      registry.register(failingAdapter);

      const result = await registry.getAllChannels();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('somafm:groovesalad');
      expect(warnSpy).toHaveBeenCalled();

      warnSpy.mockRestore();
    });

    it('should not throw when all adapters fail', async () => {
      const failingAdapter1 = createMockAdapter('somafm', [], true);
      const failingAdapter2 = createMockAdapter('radioparadise', [], true);

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      registry.register(failingAdapter1);
      registry.register(failingAdapter2);

      const result = await registry.getAllChannels();

      expect(result).toEqual([]);
      expect(warnSpy).toHaveBeenCalledTimes(2);

      warnSpy.mockRestore();
    });
  });

  describe('getChannel from cache', () => {
    it('should return channel from cache after getAllChannels', async () => {
      const channel = createMockChannel('somafm', 'groovesalad', 'Groove Salad');
      registry.register(createMockAdapter('somafm', [channel]));

      await registry.getAllChannels();
      const cached = registry.getChannel('somafm:groovesalad');

      expect(cached).toEqual(channel);
    });

    it('should return undefined for unknown channel ID', async () => {
      registry.register(createMockAdapter('somafm', []));
      await registry.getAllChannels();

      expect(registry.getChannel('somafm:unknown')).toBeUndefined();
    });

    it('should return undefined before any fetch', () => {
      expect(registry.getChannel('somafm:groovesalad')).toBeUndefined();
    });
  });

  describe('getChannelsBySource', () => {
    it('should fetch channels from specific source only', async () => {
      const somaChannels = [createMockChannel('somafm', 'groovesalad', 'Groove Salad')];
      const rpChannels = [createMockChannel('radioparadise', 'main', 'Main Mix')];

      const somaAdapter = createMockAdapter('somafm', somaChannels);
      const rpAdapter = createMockAdapter('radioparadise', rpChannels);

      registry.register(somaAdapter);
      registry.register(rpAdapter);

      const result = await registry.getChannelsBySource('somafm');

      expect(result).toHaveLength(1);
      expect(result[0].source).toBe('somafm');
      expect(somaAdapter.fetchChannels).toHaveBeenCalledOnce();
      expect(rpAdapter.fetchChannels).not.toHaveBeenCalled();
    });

    it('should return empty array for unregistered source', async () => {
      const result = await registry.getChannelsBySource('somafm');
      expect(result).toEqual([]);
    });
  });

  describe('getStreamUrl delegation', () => {
    it('should delegate to correct adapter based on channel source', () => {
      const channel = createMockChannel('somafm', 'groovesalad', 'Groove Salad');
      const adapter = createMockAdapter('somafm', [channel]);

      registry.register(adapter);
      registry.getStreamUrl(channel, 'mp3');

      expect(adapter.getStreamUrl).toHaveBeenCalledWith(channel, 'mp3');
    });

    it('should throw for unknown source', () => {
      const channel = createMockChannel('somafm', 'groovesalad', 'Groove Salad');

      expect(() => registry.getStreamUrl(channel)).toThrow(
        'No adapter registered for source: somafm'
      );
    });
  });

  describe('fetchNowPlaying delegation', () => {
    it('should parse source from channelId and delegate to adapter', async () => {
      const adapter = createMockAdapter('somafm', []);
      registry.register(adapter);

      const result = await registry.fetchNowPlaying('somafm:groovesalad');

      expect(adapter.fetchNowPlaying).toHaveBeenCalledWith('groovesalad');
      expect(result).toMatchObject({
        artist: 'Test Artist',
        title: 'Test Song',
      });
    });

    it('should handle rp: prefix for Radio Paradise', async () => {
      const adapter = createMockAdapter('radioparadise', []);
      registry.register(adapter);

      await registry.fetchNowPlaying('rp:main');

      expect(adapter.fetchNowPlaying).toHaveBeenCalledWith('main');
    });

    it('should return null for unknown source prefix', async () => {
      const result = await registry.fetchNowPlaying('unknown:channel');
      expect(result).toBeNull();
    });

    it('should return null for channelId without colon', async () => {
      const result = await registry.fetchNowPlaying('invalid');
      expect(result).toBeNull();
    });

    it('should return null for unregistered adapter', async () => {
      const result = await registry.fetchNowPlaying('somafm:groovesalad');
      expect(result).toBeNull();
    });
  });
});
