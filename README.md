# Tuner

A premium web-based internet radio player supporting multiple streaming sources, built with React, TypeScript, and Vite.

**Tuner** provides a unified listening experience across different internet radio services, starting with [SomaFM](https://somafm.com/) (~30 channels) and [Radio Paradise](https://radioparadise.com/) (4 mixes).

## Features

- **Multi-Source Support**: Stream from SomaFM and Radio Paradise in one unified interface
- **30+ Channels**: Access all SomaFM channels plus Radio Paradise's Main, Mellow, Rock, and Global mixes
- **Real-time Metadata**: Displays current artist, song, and cover art per source
- **Audio Quality Options**: FLAC, AAC, and MP3 support (quality options vary by source)
- **Source Filtering**: Filter channels by source in the station picker
- **Keyboard Navigation**: Arrow keys to browse, spacebar to play/pause
- **Modern UI**: Clean carousel interface with crossfade transitions

## Architecture

Tuner uses an adapter pattern to normalize different streaming services into a unified interface:

```
┌─────────────────────────────────────────────────────┐
│                    React App                         │
│  useChannels() ──► SourceRegistry ──► Adapters      │
└─────────────────────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
      ┌──────────────┐          ┌──────────────┐
      │ SomaFMAdapter │          │  RPAdapter   │
      │  ~30 channels │          │  4 channels  │
      │  10s polling  │          │  30s polling │
      └──────────────┘          └──────────────┘
```

### Key Components

- **Adapters** (`src/adapters/`): Source-specific API integration
- **SourceRegistry** (`src/services/`): Orchestrates multiple adapters
- **Hooks** (`src/hooks/`): React hooks for channel data and now-playing
- **Types** (`src/types/`): Shared interfaces (Channel, NowPlaying, SourceAdapter)
- **Server Proxy** (`server/`): CORS proxy for streaming and API calls

## Tech Stack

- **Framework**: [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Styling**: CSS (Custom Design)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tuner.git
   cd tuner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   This starts both the Vite frontend (port 5173) and the Express proxy server (port 3001).

4. Open http://localhost:5173 in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── adapters/          # Source-specific adapters
│   ├── SomaFMAdapter.ts
│   └── RadioParadiseAdapter.ts
├── components/        # React components
├── config/            # Channel definitions, genres
├── hooks/             # React hooks (useChannels, useNowPlaying)
├── services/          # SourceRegistry orchestration
├── types/             # TypeScript interfaces
└── App.tsx            # Main application

server/
└── index.js           # Express proxy server
```

## Testing

Run the test suite:

```bash
npx vitest run
```

Current coverage: 68 tests across adapters, services, and hooks.

## Adding New Sources

See [CONTRIBUTING.md](CONTRIBUTING.md) for a guide on adding new streaming sources.

## License

[MIT](LICENSE)
