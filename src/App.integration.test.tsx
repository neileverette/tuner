/**
 * Integration tests for App component.
 * Tests the app renders correctly with mocked channel data.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock scrollTo for jsdom
Element.prototype.scrollTo = vi.fn();

// Mock the hooks module
vi.mock('./hooks', () => ({
  useChannels: vi.fn(),
  useNowPlaying: vi.fn(),
}));

import { useChannels, useNowPlaying } from './hooks';

const mockChannels = [
  {
    id: 'somafm:groovesalad',
    sourceId: 'groovesalad',
    source: 'somafm',
    title: 'Groove Salad',
    description: 'A nicely chilled plate of ambient beats',
    genre: 'Ambient',
    dj: null,
    image: { small: '/gs-sm.jpg', medium: '/gs-md.jpg', large: '/gs-lg.jpg' },
    streams: [],
    nowPlaying: null,
    listeners: 1500,
    homepage: null,
  },
  {
    id: 'rp:main',
    sourceId: 'main',
    source: 'radioparadise',
    title: 'Main Mix',
    description: 'Eclectic mix of everything',
    genre: 'Eclectic',
    dj: null,
    image: { small: '/rp-sm.jpg', medium: '/rp-md.jpg', large: '/rp-lg.jpg' },
    streams: [],
    nowPlaying: null,
    listeners: null,
    homepage: null,
  },
];

describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Skip splash screen by simulating it's already hidden
    vi.useFakeTimers();

    // Default mock implementations
    (useChannels as ReturnType<typeof vi.fn>).mockReturnValue({
      channels: mockChannels,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      getStreamUrl: vi.fn().mockReturnValue('/api/stream/test'),
    });

    (useNowPlaying as ReturnType<typeof vi.fn>).mockReturnValue({
      nowPlaying: null,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial render', () => {
    it('renders without crashing', () => {
      const { container } = render(<App />);
      expect(container.querySelector('.tuner')).toBeTruthy();
    });

    it('renders station count after splash', async () => {
      render(<App />);

      // Fast-forward past splash screen
      vi.advanceTimersByTime(3000);

      const stationCount = screen.getByText('2 stations');
      expect(stationCount).toBeTruthy();
    });

    it('shows loading text when channels are loading', () => {
      (useChannels as ReturnType<typeof vi.fn>).mockReturnValue({
        channels: [],
        isLoading: true,
        error: null,
        refetch: vi.fn(),
        getStreamUrl: vi.fn(),
      });

      render(<App />);
      vi.advanceTimersByTime(3000);

      expect(screen.getByText('Loading stations...')).toBeTruthy();
    });

    it('shows error banner on fetch failure', () => {
      (useChannels as ReturnType<typeof vi.fn>).mockReturnValue({
        channels: [],
        isLoading: false,
        error: new Error('Network error'),
        refetch: vi.fn(),
        getStreamUrl: vi.fn(),
      });

      render(<App />);
      vi.advanceTimersByTime(3000);

      expect(screen.getByText('Failed to load stations')).toBeTruthy();
    });
  });

  describe('channel display', () => {
    it('displays channel titles', () => {
      render(<App />);
      vi.advanceTimersByTime(3000);

      // Titles appear multiple times (carousel + controls), so use getAllByText
      expect(screen.getAllByText('Groove Salad').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Main Mix').length).toBeGreaterThan(0);
    });
  });

  describe('now playing', () => {
    it('shows "No track info" when no now playing data', () => {
      render(<App />);
      vi.advanceTimersByTime(3000);

      expect(screen.getByText('No track info')).toBeTruthy();
    });

    it('displays current track when available', () => {
      (useNowPlaying as ReturnType<typeof vi.fn>).mockReturnValue({
        nowPlaying: {
          track: 'Test Artist - Test Song',
          artist: 'Test Artist',
          title: 'Test Song',
          album: null,
          coverUrl: null,
          duration: null,
        },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      render(<App />);
      vi.advanceTimersByTime(3000);

      expect(screen.getByText('Test Artist - Test Song')).toBeTruthy();
    });
  });

  describe('error handling', () => {
    it('calls refetch when retry button clicked', async () => {
      const mockRefetch = vi.fn();
      (useChannels as ReturnType<typeof vi.fn>).mockReturnValue({
        channels: [],
        isLoading: false,
        error: new Error('Network error'),
        refetch: mockRefetch,
        getStreamUrl: vi.fn(),
      });

      render(<App />);
      vi.advanceTimersByTime(3000);
      vi.useRealTimers(); // Need real timers for click events

      const retryButton = screen.getByText('Retry');
      fireEvent.click(retryButton);

      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('useChannels hook integration', () => {
    it('calls useChannels on mount', () => {
      render(<App />);
      expect(useChannels).toHaveBeenCalled();
    });

    it('calls useNowPlaying with selected channel id', () => {
      render(<App />);
      // First channel is selected by default
      expect(useNowPlaying).toHaveBeenCalledWith(
        'somafm:groovesalad',
        expect.objectContaining({ enabled: expect.any(Boolean) })
      );
    });
  });
});
