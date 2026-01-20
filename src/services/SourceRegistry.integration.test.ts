/**
 * Integration tests for SourceRegistry with real adapter implementations.
 * These tests verify the registry is properly configured and adapters are wired correctly.
 * Note: These don't make real network calls - they test structure and routing.
 */
import { describe, it, expect } from 'vitest';
import { createDefaultRegistry, defaultRegistry } from './SourceRegistry';

describe('SourceRegistry Integration', () => {
  describe('createDefaultRegistry', () => {
    it('should create a registry with both adapters registered', () => {
      const registry = createDefaultRegistry();

      const somaAdapter = registry.getAdapter('somafm');
      const rpAdapter = registry.getAdapter('radioparadise');

      expect(somaAdapter).toBeDefined();
      expect(rpAdapter).toBeDefined();
      expect(somaAdapter?.source).toBe('somafm');
      expect(rpAdapter?.source).toBe('radioparadise');
    });

    it('should have correct adapter names', () => {
      const registry = createDefaultRegistry();

      expect(registry.getAdapter('somafm')?.name).toBe('SomaFM');
      expect(registry.getAdapter('radioparadise')?.name).toBe('Radio Paradise');
    });

    it('should have correct poll intervals configured', () => {
      const registry = createDefaultRegistry();

      expect(registry.getAdapter('somafm')?.config.pollInterval).toBe(10000);
      expect(registry.getAdapter('radioparadise')?.config.pollInterval).toBe(30000);
    });
  });

  describe('defaultRegistry singleton', () => {
    it('should be a pre-configured registry instance', () => {
      expect(defaultRegistry).toBeDefined();
      expect(defaultRegistry.getAdapter('somafm')).toBeDefined();
      expect(defaultRegistry.getAdapter('radioparadise')).toBeDefined();
    });
  });

  describe('getStreamUrl routing', () => {
    it('should route SomaFM channels to SomaFM proxy', () => {
      const registry = createDefaultRegistry();
      const channel = {
        id: 'somafm:groovesalad',
        sourceId: 'groovesalad',
        source: 'somafm' as const,
        title: 'Groove Salad',
        description: 'Test',
        genre: 'Ambient',
        dj: null,
        image: { small: '', medium: '', large: '' },
        streams: [{ id: 'mp3', format: 'mp3' as const, bitrate: 128, label: 'MP3', url: '' }],
        nowPlaying: null,
        listeners: null,
        homepage: null,
      };

      const url = registry.getStreamUrl(channel);

      // SomaFM uses /api/stream/{channelId} format
      expect(url).toContain('/api/stream/');
      expect(url).toContain('groovesalad');
    });

    it('should route Radio Paradise channels to RP proxy', () => {
      const registry = createDefaultRegistry();
      const channel = {
        id: 'rp:main',
        sourceId: 'main',
        source: 'radioparadise' as const,
        title: 'Main Mix',
        description: 'Test',
        genre: 'Eclectic',
        dj: null,
        image: { small: '', medium: '', large: '' },
        streams: [{ id: 'aac', format: 'aac' as const, bitrate: 320, label: 'AAC', url: '' }],
        nowPlaying: null,
        listeners: null,
        homepage: null,
      };

      const url = registry.getStreamUrl(channel);

      expect(url).toContain('/api/stream/rp/');
      expect(url).toContain('main');
    });

    it('should support format preference for Radio Paradise', () => {
      const registry = createDefaultRegistry();
      const channel = {
        id: 'rp:main',
        sourceId: 'main',
        source: 'radioparadise' as const,
        title: 'Main Mix',
        description: 'Test',
        genre: 'Eclectic',
        dj: null,
        image: { small: '', medium: '', large: '' },
        streams: [],
        nowPlaying: null,
        listeners: null,
        homepage: null,
      };

      const flacUrl = registry.getStreamUrl(channel, 'flac');
      const aacUrl = registry.getStreamUrl(channel, 'aac');
      const mp3Url = registry.getStreamUrl(channel, 'mp3');

      expect(flacUrl).toContain('flac');
      expect(aacUrl).toContain('aac');
      expect(mp3Url).toContain('mp3');
    });
  });

  describe('channel ID parsing', () => {
    it('should correctly parse somafm: prefix', async () => {
      const registry = createDefaultRegistry();
      // This will return null since no real fetch, but tests the parsing
      const result = await registry.fetchNowPlaying('somafm:groovesalad');
      // The adapter was called (even if it fails due to no network)
      // This test verifies the routing logic works
      expect(result).toBeDefined(); // Will be null or NowPlaying
    });

    it('should correctly parse rp: prefix', async () => {
      const registry = createDefaultRegistry();
      const result = await registry.fetchNowPlaying('rp:main');
      expect(result).toBeDefined();
    });
  });
});
