# Technology Stack

**Analysis Date:** 2026-01-19

## Languages

**Primary:**
- TypeScript 5.9 - Frontend React application (`src/*.tsx`)

**Secondary:**
- JavaScript (ES Modules) - Backend server (`server/*.js`), configuration files

## Runtime

**Environment:**
- Node.js 20.x (specified in `Dockerfile`)
- Browser runtime (React SPA)

**Package Manager:**
- npm (frontend and server)
- Lockfiles: `package-lock.json` (root), `server/package-lock.json`

## Frameworks

**Core:**
- React 19.2 - UI framework (`src/App.tsx`)
- Express 4.18 - Backend HTTP server (`server/index.js`)

**Testing:**
- Not detected (no test framework installed)

**Build/Dev:**
- Vite 7.2 - Frontend build and dev server (`vite.config.ts`)
- TypeScript 5.9 - Type checking and compilation (`tsconfig.json`)

## Key Dependencies

**Critical:**
- react 19.2 - UI rendering (`src/App.tsx`)
- react-dom 19.2 - DOM rendering (`src/main.tsx`)
- express 4.18 - HTTP server for stream proxy (`server/index.js`)
- cors 2.8 - CORS middleware for API (`server/index.js`)

**Infrastructure:**
- @vitejs/plugin-react 5.1 - React plugin for Vite (`vite.config.ts`)

## Configuration

**Environment:**
- PORT environment variable for production server (`server/production.js`)
- No .env files detected
- No secrets required (external API is public)

**Build:**
- `vite.config.ts` - Vite configuration with API proxy
- `tsconfig.json` - TypeScript project references
- `tsconfig.app.json` - Frontend TypeScript config (strict mode)
- `eslint.config.js` - ESLint with TypeScript and React plugins

## Platform Requirements

**Development:**
- macOS/Linux/Windows (any platform with Node.js 20+)
- npm for package management
- Run frontend: `npm run dev` (port 5173)
- Run backend: `cd server && npm start` (port 3001)

**Production:**
- Docker container (Alpine-based Node.js 20)
- AWS EC2 deployment via ECR
- Single container serves both frontend and API
- Port 3001 exposed

---

*Stack analysis: 2026-01-19*
*Update after major dependency changes*
