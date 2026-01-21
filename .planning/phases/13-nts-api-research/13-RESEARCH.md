# Phase 13: NTS API Research

## Summary

NTS Radio provides **2 live channels** and **16 Infinite Mixtapes** (endless curated loops). All streams require CORS proxy for browser playback.

## Live Channels

| Channel | Stream URL | API Endpoint |
|---------|-----------|--------------|
| NTS 1 | `https://stream-relay-geo.ntslive.net/stream` | `https://www.nts.live/api/v2/live` |
| NTS 2 | `https://stream-relay-geo.ntslive.net/stream2` | `https://www.nts.live/api/v2/live` |

### Live API Response Structure

```json
{
  "results": [
    {
      "channel_name": "1",
      "now": {
        "broadcast_title": "DAPHNI",
        "embeds": {
          "details": {
            "name": "Daphni",
            "description": "...",
            "location_long": "London",
            "media": {
              "background_large": "https://media2.ntslive.co.uk/resize/1600x1600/...",
              "background_medium_large": "https://media.ntslive.co.uk/resize/800x800/...",
              "picture_large": "https://media2.ntslive.co.uk/resize/1600x1600/...",
              "picture_medium": "https://media.ntslive.co.uk/resize/400x400/...",
              "picture_small": "https://media3.ntslive.co.uk/resize/100x100/..."
            }
          }
        },
        "start_timestamp": "2026-01-21T13:00:00Z",
        "end_timestamp": "2026-01-21T14:00:00Z"
      },
      "next": { /* next show info */ }
    }
  ]
}
```

### Now-Playing Metadata

The `/api/v2/live` endpoint returns current show info including:
- Show title and host name
- Show description
- Location (typically "London")
- Start/end timestamps
- Multiple artwork sizes (100x100, 400x400, 800x800, 1600x1600)
- Links to episode details and tracklist APIs

## Infinite Mixtapes

All 16 curated endless streams at `https://stream-mixtape-geo.ntslive.net/{stream-id}`:

| # | Mixtape | Stream ID | Full URL | Genre Description |
|---|---------|-----------|----------|-------------------|
| 1 | Poolside | `mixtape4` | `https://stream-mixtape-geo.ntslive.net/mixtape4` | Balearic, boogie, sophisti-pop |
| 2 | Slow Focus | `mixtape` | `https://stream-mixtape-geo.ntslive.net/mixtape` | Ambient, drone, ragas |
| 3 | Low Key | `mixtape2` | `https://stream-mixtape-geo.ntslive.net/mixtape2` | Lo-fi hip-hop, smooth R&B |
| 4 | Memory Lane | `mixtape6` | `https://stream-mixtape-geo.ntslive.net/mixtape6` | Psychedelic, turn on tune in |
| 5 | 4 To The Floor | `mixtape5` | `https://stream-mixtape-geo.ntslive.net/mixtape5` | House, techno |
| 6 | Island Time | `mixtape21` | `https://stream-mixtape-geo.ntslive.net/mixtape21` | Reggae, dub |
| 7 | The Tube | `mixtape26` | `https://stream-mixtape-geo.ntslive.net/mixtape26` | Post-punk, industrial, minimal wave |
| 8 | Sheet Music | `mixtape35` | `https://stream-mixtape-geo.ntslive.net/mixtape35` | Classical, contemporary composition |
| 9 | Feelings | `mixtape27` | `https://stream-mixtape-geo.ntslive.net/mixtape27` | Soul, gospel, boogie |
| 10 | Expansions | `mixtape3` | `https://stream-mixtape-geo.ntslive.net/mixtape3` | Jazz and variations |
| 11 | Rap House | `mixtape22` | `https://stream-mixtape-geo.ntslive.net/mixtape22` | Hip-hop, 808s |
| 12 | Labyrinth | `mixtape31` | `https://stream-mixtape-geo.ntslive.net/mixtape31` | Atmospheric breaks, cerebral electronics |
| 13 | Sweat | `mixtape24` | `https://stream-mixtape-geo.ntslive.net/mixtape24` | International party music |
| 14 | Otaku | `mixtape36` | `https://stream-mixtape-geo.ntslive.net/mixtape36` | Video game, anime soundtracks |
| 15 | The Pit | `mixtape34` | `https://stream-mixtape-geo.ntslive.net/mixtape34` | Metal |
| 16 | Field Recordings | `mixtape23` | `https://stream-mixtape-geo.ntslive.net/mixtape23` | Natural ambience, field recordings |

## Genre Mapping to Existing Taxonomy

Mapping NTS channels to Tuner's 8-category taxonomy:

| NTS Channel | Primary Genre | Secondary Genre | Rationale |
|-------------|---------------|-----------------|-----------|
| **NTS 1** | `eclectic` | - | Live broadcasts, mixed programming |
| **NTS 2** | `eclectic` | - | Live broadcasts, mixed programming |
| **Poolside** | `lounge` | `ambient` | Balearic/sophisti-pop fits lounge aesthetic |
| **Slow Focus** | `ambient` | - | Meditative, drone, ambient |
| **Low Key** | `jazz-soul` | - | Lo-fi hip-hop, R&B |
| **Memory Lane** | `rock` | `eclectic` | Psychedelic rock era |
| **4 To The Floor** | `electronic` | - | House, techno |
| **Island Time** | `world` | - | Reggae, dub |
| **The Tube** | `rock` | `electronic` | Post-punk, industrial |
| **Sheet Music** | `eclectic` | `ambient` | Classical (no classical genre) |
| **Feelings** | `jazz-soul` | - | Soul, gospel |
| **Expansions** | `jazz-soul` | - | Jazz |
| **Rap House** | `electronic` | `jazz-soul` | Hip-hop/electronic crossover |
| **Labyrinth** | `electronic` | `ambient` | Atmospheric electronics |
| **Sweat** | `electronic` | `world` | International dance music |
| **Otaku** | `eclectic` | - | Video game/anime (unique) |
| **The Pit** | `rock` | - | Metal |
| **Field Recordings** | `ambient` | - | Natural soundscapes |

## CORS Requirements

All NTS streams require CORS proxy:
- Stream URLs return `audio/mpeg` content
- No CORS headers on origin responses
- Proxy pattern: `/api/nts/live/:channel` and `/api/nts/mixtape/:mixtapeId`

## Stream Format

All streams are MP3/MPEG audio:
- Live: 128kbps MP3
- Mixtapes: 128kbps MP3
- No HLS/m3u8 variants needed

## Proxy Endpoint Design

```
GET /api/nts/live/1          → streams NTS 1 live
GET /api/nts/live/2          → streams NTS 2 live
GET /api/nts/mixtape/poolside → streams Poolside mixtape
GET /api/nts/now-playing     → proxies /api/v2/live for metadata
```

## Channel Count Summary

| Source | Live | Curated/Mixtape | Total |
|--------|------|-----------------|-------|
| NTS | 2 | 16 | **18** |
| SomaFM | 0 | 49 | 49 |
| Radio Paradise | 0 | 4 | 4 |
| **Total** | 2 | 69 | **71** |

---
*Research completed: 2026-01-21*
