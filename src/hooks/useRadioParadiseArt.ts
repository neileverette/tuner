import { useState, useEffect, useRef } from 'react';

interface RPNowPlaying {
  cover: string;
  cover_med: string;
  cover_small: string;
  artist: string;
  title: string;
}

interface RPArtMap {
  [channelId: string]: {
    cover: string;
    coverMed: string;
    coverSmall: string;
  } | null;
}

const RP_CHANNELS = [
  { id: 'rp:main', chan: 0 },
  { id: 'rp:mellow', chan: 1 },
  { id: 'rp:rock', chan: 2 },
  { id: 'rp:global', chan: 3 },
];

const POLL_INTERVAL = 30000; // 30 seconds - RP rate limit

export function useRadioParadiseArt() {
  const [artMap, setArtMap] = useState<RPArtMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<number | null>(null);

  const fetchAllArt = async () => {
    const results: RPArtMap = {};

    await Promise.all(
      RP_CHANNELS.map(async ({ id, chan }) => {
        try {
          const response = await fetch(
            `https://api.radioparadise.com/api/now_playing?chan=${chan}`
          );
          if (response.ok) {
            const data: RPNowPlaying = await response.json();
            results[id] = {
              cover: data.cover,
              coverMed: data.cover_med,
              coverSmall: data.cover_small,
            };
          } else {
            results[id] = null;
          }
        } catch {
          results[id] = null;
        }
      })
    );

    setArtMap(results);
    setIsLoading(false);
  };

  useEffect(() => {
    // Initial fetch
    fetchAllArt();

    // Poll for updates
    intervalRef.current = window.setInterval(fetchAllArt, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getArt = (channelId: string, size: 'small' | 'medium' | 'large' = 'medium') => {
    const art = artMap[channelId];
    if (!art) return null;

    switch (size) {
      case 'small':
        return art.coverSmall;
      case 'large':
        return art.cover;
      default:
        return art.coverMed;
    }
  };

  return { artMap, isLoading, getArt };
}
