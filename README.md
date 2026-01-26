# Tuner

A modern internet radio player that aggregates streams from multiple sources into a unified, beautiful interface.

![React](https://img.shields.io/badge/React-19.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue) ![Vite](https://img.shields.io/badge/Vite-7.3-purple)

## Features

- **Multi-Source Streaming** — 50+ channels from SomaFM, Radio Paradise, and KEXP
- **Real-Time Now Playing** — Track info with album artwork from each source
- **Social Sharing** — Share stations with friends via Facebook, Twitter, WhatsApp, and 100+ platforms
- **Favorites** — Per-device favorites stored in localStorage
- **Keyboard Navigation** — Arrow keys to browse, spacebar to play/pause
- **Beautiful UI** — Full-screen album art with smooth crossfade transitions
- **Stream Proxy** — CORS-bypassing backend for reliable playback

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                           │
│  App.tsx → Hooks → Adapters → Registry → Components         │
└────────────────────────┬────────────────────────────────────┘
                         │ /api/*
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Express.js Backend                          │
│         Stream Proxying + API Proxying (CORS bypass)         │
└─────────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
   SomaFM API    Radio Paradise      KEXP API
   49 channels      4 channels       1 channel
```

## Adapter Pattern

Each music source implements a common `SourceAdapter` interface, making it easy to add new sources:

```typescript
interface SourceAdapter {
  readonly source: SourceType;
  fetchChannels(): Promise<Channel[]>;
  fetchNowPlaying(channelId: string): Promise<NowPlaying | null>;
  getStreamUrl(channel: Channel): string;
}
```

### Source Adapters

| Adapter | Channels | Stream Format | Now Playing |
|---------|----------|---------------|-------------|
| **SomaFMAdapter** | 49 | MP3 128kbps | Artist - Title from API |
| **RadioParadiseAdapter** | 4 | FLAC/AAC/MP3 | Full metadata + album art |
| **KEXPAdapter** | 1 | AAC 160kbps | Track info from plays API |

## Source Registry

The `SourceRegistry` orchestrates all adapters with error isolation:

```typescript
class SourceRegistry {
  register(adapter: SourceAdapter): void
  getAllChannels(): Promise<Channel[]>      // Parallel fetch via Promise.allSettled
  getStreamUrl(channel: Channel): string    // Delegates to correct adapter
  fetchNowPlaying(channelId: string): Promise<NowPlaying | null>
}
```

**Key Features:**
- `Promise.allSettled()` ensures one failing source doesn't block others
- In-memory channel cache for instant lookups
- Channel ID format: `source:channelId` (e.g., `somafm:groovesalad`, `rp:main`, `kexp:live`)

## Proxy Route Table

All streams and APIs are proxied through the Express backend to bypass CORS:

| Route | Purpose | Upstream |
|-------|---------|----------|
| `GET /api/stream/:channelId` | SomaFM streams | `ice1.somafm.com` |
| `GET /api/stream/rp/:channel/:quality` | Radio Paradise streams | `stream.radioparadise.com` |
| `GET /api/stream/kexp/:quality` | KEXP streams | `kexp.streamguys1.com` |
| `GET /api/rp/nowplaying/:chan` | Radio Paradise now-playing | `api.radioparadise.com` |
| `GET /api/kexp/nowplaying` | KEXP now-playing | `api.kexp.org` |

## React Hooks

| Hook | Purpose |
|------|---------|
| `useChannels()` | Fetches all channels from registry |
| `useNowPlaying(channelId)` | Polls for current track info |
| `useFavorites()` | Manages favorites in localStorage |
| `useRadioParadiseArt()` | Special handler for RP album art |

## Project Structure

```
src/
├── adapters/               # Source implementations
│   ├── SomaFMAdapter.ts
│   ├── RadioParadiseAdapter.ts
│   └── KEXPAdapter.ts
├── services/
│   └── SourceRegistry.ts   # Adapter orchestration
├── hooks/
│   ├── useChannels.ts
│   ├── useNowPlaying.ts
│   ├── useFavorites.ts
│   └── useRadioParadiseArt.ts
├── components/
│   ├── ChannelCarousel.tsx
│   ├── ChannelCard.tsx
│   ├── PlayerControls.tsx
│   ├── StationPicker.tsx
│   ├── HeroArtwork.tsx
│   ├── ShareButton.tsx     # Social sharing
│   └── SplashScreen.tsx
├── config/
│   ├── genres.ts
│   └── sources/
│       ├── somafm.ts
│       └── radio-paradise.ts
├── types/
│   ├── adapter.ts
│   └── channel.ts
└── App.tsx

server/
├── index.js                # Development server
└── production.js           # Production server

docs/
└── SHARE_FEATURE.md        # Share feature documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/neileverette/tuner.git
cd tuner
npm install
```

### Development

```bash
npm run dev
```

This starts:
- Vite dev server on `http://localhost:5173` (with HMR)
- Express proxy server on `http://localhost:3001`

### Production Build

```bash
npm run build
npm start
```

Serves the built app with integrated proxy on port 3001.

### Deployment

The app deploys automatically via GitHub Actions when pushing to `main`. The workflow builds the app and deploys to the production server.

## Adding a New Source

1. **Create adapter** in `src/adapters/`:

```typescript
export class NewSourceAdapter implements SourceAdapter {
  readonly source = 'newsource' as SourceType;
  readonly name = 'New Source';

  async fetchChannels(): Promise<Channel[]> {
    // Fetch and normalize channels
  }

  async fetchNowPlaying(channelId: string): Promise<NowPlaying | null> {
    // Fetch current track info
  }

  getStreamUrl(channel: Channel): string {
    return `/api/stream/newsource/${channel.id}`;
  }
}
```

2. **Register adapter** in `src/services/SourceRegistry.ts`:

```typescript
registry.register(new NewSourceAdapter());
```

3. **Add proxy routes** in `server/index.js` and `server/production.js`:

```javascript
app.get('/api/stream/newsource/:id', async (req, res) => {
  // Proxy the stream
});
```

4. **Update types** in `src/types/` if needed.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Backend:** Express.js, Node.js
- **Styling:** CSS with custom properties
- **Icons:** Material Symbols Outlined

## Testing

```bash
npx vitest run
```

## License

MIT
