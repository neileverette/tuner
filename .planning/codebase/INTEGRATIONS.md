# External Integrations

**Analysis Date:** 2026-01-19

## APIs & External Services

**SomaFM API:**
- Service: SomaFM internet radio - Channel metadata
- Integration method: REST API via browser fetch
- URL: `https://api.somafm.com/channels.json`
- Auth: None required (public API)
- Used for: Channel list, track info, listener counts
- Location: `src/App.tsx` (fetch calls)

**SomaFM Streaming:**
- Service: SomaFM internet radio - Audio streams
- Integration method: HTTPS stream via Node.js proxy
- URL pattern: `https://ice1.somafm.com/{channelId}-128-mp3`
- Auth: None required
- Used for: MP3 audio streaming
- Location: `server/index.js`, `server/production.js`

## Data Storage

**Databases:**
- None (stateless application)

**File Storage:**
- None (no user uploads)

**Caching:**
- Browser localStorage for user preferences
- Keys:
  - `tuner-selected-index` - Last selected channel
  - `tuner-current-image` - Last channel artwork URL
  - `tuner-instructions-dismissed` - Instructions tooltip state
- Location: `src/App.tsx`

## Authentication & Identity

**Auth Provider:**
- None (no user authentication)

**OAuth Integrations:**
- None

## Monitoring & Observability

**Error Tracking:**
- None (console logging only)

**Analytics:**
- None

**Logs:**
- Console logging in development
- Docker stdout/stderr in production

## CI/CD & Deployment

**Hosting:**
- AWS EC2 - Docker container hosting
- Instance ID: `i-040ac6026761030ac`
- Region: `us-east-1`
- URL: `http://tuner.neil-everette.com:3001`

**Container Registry:**
- AWS ECR - Docker image storage
- Repository: `tuner`
- Registry: `070322435379.dkr.ecr.us-east-1.amazonaws.com`

**CI Pipeline:**
- GitHub Actions - Build and deploy
- Workflow: `.github/workflows/deploy.yml`
- Triggers: Push to main, manual dispatch
- Secrets required:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`

**Deployment Process:**
1. Build Docker image (multi-stage: frontend + server)
2. Push to ECR with commit SHA tag and `latest`
3. SSH to EC2 via Instance Connect
4. Pull and restart container

## Environment Configuration

**Development:**
- Frontend: `npm run dev` (Vite dev server, port 5173)
- Backend: `cd server && npm start` (Express, port 3001)
- Vite proxies `/api` to backend (`vite.config.ts`)
- No environment variables required

**Production:**
- PORT: Server port (default 3001)
- Configured in: Docker container, deployment script
- No secrets needed (external APIs are public)

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

---

*Integration audit: 2026-01-19*
*Update when adding/removing external services*
