import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SomaFMAdapter } from './SomaFMAdapter';

const mockSomaFMResponse = {
  channels: [
    {
      id: 'groovesalad',
      title: 'Groove Salad',
      description: 'A nicely chilled plate of ambient beats',
      dj: 'DJ Slaw',
      genre: 'Ambient',
      image: 'https://somafm.com/img/groovesalad120.png',
      largeimage: 'https://somafm.com/img/groovesalad256.png',
      xlimage: 'https://somafm.com/img/groovesalad512.png',
      playlists: [{ url: 'https://somafm.com/groovesalad.pls', format: 'mp3', quality: 'highest' }],
      lastPlaying: 'Tycho - Awake',
      listeners: 1234,
    },
    {
      id: 'dronezone',
      title: 'Drone Zone',
      description: 'Atmospheric music for floating',
      dj: '',
      genre: 'Ambient/Space',
      image: 'https://somafm.com/img/dronezone120.png',
      largeimage: 'https://somafm.com/img/dronezone256.png',
      xlimage: 'https://somafm.com/img/dronezone512.png',
      playlists: [],
      lastPlaying: 'Unknown Artist',
      listeners: 567,
    },
  ],
};

describe('SomaFMAdapter', () => {
  let adapter: SomaFMAdapter;

  beforeEach(() => {
    adapter = new SomaFMAdapter();
    vi.resetAllMocks();
  });

  describe('fetchChannels', () => {
    it('should fetch and normalize channels', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSomaFMResponse),
      });

      const channels = await adapter.fetchChannels();

      expect(channels).toHaveLength(2);
      expect(channels[0]).toMatchObject({
        id: 'somafm:groovesalad',
        sourceId: 'groovesalad',
        source: 'somafm',
        title: 'Groove Salad',
      });
    });

    it('should parse now-playing from lastPlaying string', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSomaFMResponse),
      });

      const channels = await adapter.fetchChannels();

      expect(channels[0].nowPlaying).toMatchObject({
        track: 'Tycho - Awake',
        artist: 'Tycho',
        title: 'Awake',
      });
    });

    it('should handle empty dj field as null', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSomaFMResponse),
      });

      const channels = await adapter.fetchChannels();
      expect(channels[1].dj).toBeNull();
    });

    it('should throw on API error', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(adapter.fetchChannels()).rejects.toThrow('SomaFM API error: 500');
    });
  });

  describe('getStreamUrl', () => {
    it('should return proxy URL for channel', () => {
      const channel = { sourceId: 'groovesalad' } as any;
      const url = adapter.getStreamUrl(channel);
      expect(url).toBe('/api/stream/groovesalad');
    });
  });

  describe('properties', () => {
    it('should have correct source identifier', () => {
      expect(adapter.source).toBe('somafm');
    });

    it('should have correct name', () => {
      expect(adapter.name).toBe('SomaFM');
    });
  });
});
