# Architecture

**Analysis Date:** 2026-01-19

## Pattern Overview

**Overall:** Full-Stack SPA with Backend Proxy

**Key Characteristics:**
- React single-page application (frontend)
- Express backend serves as stream proxy to bypass CORS
- Monolithic deployment (frontend + backend in single container)
- Stateless backend (no database, no sessions)
- Client-side state persistence via localStorage

## Layers

**Presentation Layer (Frontend):**
- Purpose: User interface and interaction handling
- Contains: React components, CSS styling, DOM event handlers
- Location: `src/App.tsx`, `src/App.css`, `src/index.css`
- Depends on: Browser APIs (Audio, localStorage), external SomaFM API
- Used by: End users via browser

**API Proxy Layer (Backend):**
- Purpose: Proxy audio streams to bypass CORS restrictions
- Contains: Express routes, HTTP stream proxying
- Location: `server/index.js` (dev), `server/production.js` (prod)
- Depends on: Node.js https module, SomaFM stream servers
- Used by: Frontend audio element

## Data Flow

**Audio Playback Flow:**

1. User selects channel in carousel or station picker
2. Frontend calls `playChannel(index)` function
3. Debounced (300ms) request sets audio `src` to `/api/stream/{channelId}`
4. Vite dev server (or production server) proxies to Express backend
5. Backend constructs SomaFM URL: `https://ice1.somafm.com/{channelId}-128-mp3`
6. Backend pipes stream response to frontend
7. HTML5 Audio element plays the MP3 stream

**Channel Data Flow:**

1. On mount, frontend fetches `https://api.somafm.com/channels.json`
2. Channel list stored in React state (`channels`)
3. Polling every 10 seconds refreshes current track info
4. Selected channel index persisted to localStorage

**State Management:**
- React useState for all UI state (channels, selectedIndex, isPlaying, etc.)
- localStorage for persistence (selectedIndex, currentImage, instructions dismissed)
- No external state management library (Redux, Zustand)

## Key Abstractions

**Channel:**
- Purpose: Represents a SomaFM radio station
- Location: TypeScript interface in `src/App.tsx`
- Properties: id, title, description, dj, genre, playlists, listeners, images

**Stream Proxy:**
- Purpose: Bypass CORS for audio streaming
- Location: `server/index.js`, `server/production.js`
- Pattern: HTTP pipe passthrough with custom User-Agent header

## Entry Points

**Frontend Entry:**
- Location: `src/main.tsx`
- Triggers: Browser loads `index.html`
- Responsibilities: Mount React app to DOM with StrictMode

**Backend Entry (Dev):**
- Location: `server/index.js`
- Triggers: `npm start` in server directory
- Responsibilities: Start Express server on port 3001

**Backend Entry (Production):**
- Location: `server/production.js`
- Triggers: Docker container starts
- Responsibilities: Serve static files from `dist/`, proxy streams, SPA fallback

## Error Handling

**Strategy:** Console logging, graceful fallbacks

**Patterns:**
- Fetch errors caught with `.catch()`, logged to console
- Audio playback errors caught, isPlaying set to false
- Stream proxy errors return HTTP 500 to client
- No user-facing error messages (silent failures)

## Cross-Cutting Concerns

**Logging:**
- `console.log` for debugging (stream URLs, playback status)
- `console.error` for errors (fetch failures, stream errors)
- No structured logging or log levels

**Validation:**
- TypeScript interfaces for type safety
- No runtime validation of API responses
- No input sanitization (not needed - read-only app)

**Caching:**
- No server-side caching
- Browser caching disabled for streams (`Cache-Control: no-cache`)
- localStorage for UI preferences only

---

*Architecture analysis: 2026-01-19*
*Update when major patterns change*
