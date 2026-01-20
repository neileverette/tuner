import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RadioParadiseAdapter } from './RadioParadiseAdapter';

const mockRPGetBlockResponse = {
  image_base: 'https://img.radioparadise.com/',
  length: 284,
  song: [{
    artist: 'Radiohead',
    title: 'Everything In Its Right Place',
    album: 'Kid A',
    cover: 'covers/l/B000002TPK.jpg',
    duration: 284,
  }],
  refresh: 284,
};

describe('RadioParadiseAdapter', () => {
  let adapter: RadioParadiseAdapter;

  beforeEach(() => {
    adapter = new RadioParadiseAdapter();
  });

  describe('fetchChannels', () => {
    it('should return all 4 Radio Paradise channels', async () => {
      const channels = await adapter.fetchChannels();
      expect(channels).toHaveLength(4);
      expect(channels.map(c => c.sourceId)).toEqual(['main', 'mellow', 'rock', 'global']);
    });

    it('should prefix channel IDs with rp:', async () => {
      const channels = await adapter.fetchChannels();
      expect(channels.map(c => c.id)).toEqual(['rp:main', 'rp:mellow', 'rp:rock', 'rp:global']);
    });

    it('should set source to radioparadise', async () => {
      const channels = await adapter.fetchChannels();
      channels.forEach(channel => {
        expect(channel.source).toBe('radioparadise');
      });
    });

    it('should include correct image URLs', async () => {
      const channels = await adapter.fetchChannels();
      const main = channels[0];
      expect(main.image).toEqual({
        small: 'https://img.radioparadise.com/covers/l/main.jpg',
        medium: 'https://img.radioparadise.com/covers/m/main.jpg',
        large: 'https://img.radioparadise.com/covers/s/main.jpg',
      });
    });

    it('should include all three stream quality options', async () => {
      const channels = await adapter.fetchChannels();
      channels.forEach(channel => {
        expect(channel.streams).toHaveLength(3);
        expect(channel.streams.map(s => s.id)).toEqual(['flac', 'aac-320', 'mp3-128']);
      });
    });

    it('should have null values for dj and listeners', async () => {
      const channels = await adapter.fetchChannels();
      channels.forEach(channel => {
        expect(channel.dj).toBeNull();
        expect(channel.listeners).toBeNull();
      });
    });

    it('should have null nowPlaying initially', async () => {
      const channels = await adapter.fetchChannels();
      channels.forEach(channel => {
        expect(channel.nowPlaying).toBeNull();
      });
    });
  });

  describe('getStreamUrl', () => {
    it('should return proxy URL with default aac-320', async () => {
      const channels = await adapter.fetchChannels();
      const url = adapter.getStreamUrl(channels[0]);
      expect(url).toBe('/api/stream/rp/main/aac-320');
    });

    it('should use preferred format flac', async () => {
      const channels = await adapter.fetchChannels();
      expect(adapter.getStreamUrl(channels[0], 'flac')).toBe('/api/stream/rp/main/flac');
    });

    it('should use preferred format mp3', async () => {
      const channels = await adapter.fetchChannels();
      expect(adapter.getStreamUrl(channels[0], 'mp3')).toBe('/api/stream/rp/main/mp3-128');
    });

    it('should work for all channels', async () => {
      const channels = await adapter.fetchChannels();
      expect(adapter.getStreamUrl(channels[1], 'flac')).toBe('/api/stream/rp/mellow/flac');
      expect(adapter.getStreamUrl(channels[2], 'aac')).toBe('/api/stream/rp/rock/aac-320');
      expect(adapter.getStreamUrl(channels[3], 'mp3')).toBe('/api/stream/rp/global/mp3-128');
    });

    it('should use custom stream base URL from config', async () => {
      const customAdapter = new RadioParadiseAdapter({ proxyBaseUrl: '/custom/stream' });
      const channels = await customAdapter.fetchChannels();
      const url = customAdapter.getStreamUrl(channels[0], 'flac');
      expect(url).toBe('/custom/stream/main/flac');
    });
  });

  describe('getDirectStreamUrl', () => {
    it('should return direct Radio Paradise stream URL for main channel', () => {
      const url = adapter.getDirectStreamUrl('main', 'flac');
      expect(url).toBe('http://stream.radioparadise.com/flac');
    });

    it('should return correct URL for mellow channel', () => {
      expect(adapter.getDirectStreamUrl('mellow', 'flac')).toBe('http://stream.radioparadise.com/mellow-flac');
      expect(adapter.getDirectStreamUrl('mellow', 'aac-320')).toBe('http://stream.radioparadise.com/mellow-aac-320');
      expect(adapter.getDirectStreamUrl('mellow', 'mp3-128')).toBe('http://stream.radioparadise.com/mellow-mp3-128');
    });

    it('should return correct URL for rock channel', () => {
      expect(adapter.getDirectStreamUrl('rock', 'flac')).toBe('http://stream.radioparadise.com/rock-flac');
    });

    it('should return correct URL for global channel', () => {
      expect(adapter.getDirectStreamUrl('global', 'aac-320')).toBe('http://stream.radioparadise.com/global-aac-320');
    });

    it('should default to aac-320', () => {
      const url = adapter.getDirectStreamUrl('main');
      expect(url).toBe('http://stream.radioparadise.com/aac-320');
    });

    it('should throw for unknown channel', () => {
      expect(() => adapter.getDirectStreamUrl('invalid')).toThrow('Unknown Radio Paradise channel: invalid');
    });
  });

  describe('getChannelParam', () => {
    it('should return correct chan parameter for each channel', () => {
      expect(adapter.getChannelParam('main')).toBe(0);
      expect(adapter.getChannelParam('mellow')).toBe(1);
      expect(adapter.getChannelParam('rock')).toBe(2);
      expect(adapter.getChannelParam('global')).toBe(3);
    });

    it('should return null for unknown channel', () => {
      expect(adapter.getChannelParam('unknown')).toBeNull();
    });
  });

  describe('properties', () => {
    it('should have correct source identifier', () => {
      expect(adapter.source).toBe('radioparadise');
    });

    it('should have correct name', () => {
      expect(adapter.name).toBe('Radio Paradise');
    });

    it('should have 30 second poll interval', () => {
      expect(adapter.config.pollInterval).toBe(30000);
    });
  });

  describe('fetchNowPlaying', () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it('should fetch and parse now-playing data', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRPGetBlockResponse),
      });

      const nowPlaying = await adapter.fetchNowPlaying('main');

      expect(nowPlaying).toMatchObject({
        track: 'Radiohead - Everything In Its Right Place',
        artist: 'Radiohead',
        title: 'Everything In Its Right Place',
        album: 'Kid A',
        duration: 284,
      });
    });

    it('should construct cover URL with medium size', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRPGetBlockResponse),
      });

      const nowPlaying = await adapter.fetchNowPlaying('main');

      expect(nowPlaying?.coverUrl).toBe('https://img.radioparadise.com/covers/m/B000002TPK.jpg');
    });

    it('should use correct chan parameter for each channel', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRPGetBlockResponse),
      });

      await adapter.fetchNowPlaying('rock');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('chan=2')
      );
    });

    it('should return null for unknown channel', async () => {
      const nowPlaying = await adapter.fetchNowPlaying('unknown');

      expect(nowPlaying).toBeNull();
    });

    it('should return null when API returns empty song array', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockRPGetBlockResponse, song: [] }),
      });

      const nowPlaying = await adapter.fetchNowPlaying('main');

      expect(nowPlaying).toBeNull();
    });

    it('should return null on API error', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const nowPlaying = await adapter.fetchNowPlaying('main');

      expect(nowPlaying).toBeNull();
    });

    it('should return null on network failure', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

      const nowPlaying = await adapter.fetchNowPlaying('main');

      expect(nowPlaying).toBeNull();
    });
  });
});
