/**
 * Source type identifier for multi-source support
 */
export type SourceType = 'kexp' | 'somafm' | 'radioparadise' | 'nts' | 'radiobrowser';

/**
 * Artwork display mode for thumbnails and wallpapers.
 */
export type ArtworkMode = 'api-art' | 'station-logo' | 'auto-generated';

/**
 * Artwork configuration for a channel.
 */
export type ArtworkConfig = {
  thumbnail: ArtworkMode;
  wallpaper: ArtworkMode;
  backgroundColor?: string;
  displayText?: string;
};

/**
 * Stream quality option
 */
export type StreamQuality = {
  id: string;
  format: 'mp3' | 'aac' | 'flac';
  bitrate: number | null;
  label: string;
  url: string;
};

/**
 * Current track information
 */
export type NowPlaying = {
  track: string;
  artist: string | null;
  title: string | null;
  album: string | null;
  coverUrl: string | null;
  duration: number | null;
};

/**
 * Unified channel interface supporting multiple sources
 */
export type Channel = {
  id: string;
  sourceId: string;
  source: SourceType;
  title: string;
  description: string;
  genre: string;
  dj: string | null;
  image: {
    small: string;
    medium: string;
    large: string;
  };
  streams: StreamQuality[];
  nowPlaying: NowPlaying | null;
  listeners: number | null;
  homepage: string | null;
  bgColor?: string;
  artworkConfig?: ArtworkConfig;
};
