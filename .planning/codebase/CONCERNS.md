# Codebase Concerns

**Analysis Date:** 2026-01-19

## Tech Debt

**Monolithic App Component:**
- Issue: All UI logic in single 400-line `App.tsx` file
- Files: `src/App.tsx`
- Why: Rapid prototyping, small initial scope
- Impact: Harder to maintain, test, and extend as features grow
- Fix approach: Extract components (Carousel, StationPicker, Controls, HeroImage)

**Duplicate Server Code:**
- Issue: `index.js` and `production.js` have nearly identical stream proxy code
- Files: `server/index.js`, `server/production.js`
- Why: Production server added as separate file for static serving
- Impact: Bug fixes must be applied twice
- Fix approach: Extract shared proxy logic to `server/proxy.js`

**No Type Safety in Backend:**
- Issue: Server code is plain JavaScript, no TypeScript
- Files: `server/index.js`, `server/production.js`
- Why: Express server added quickly without frontend tooling
- Impact: No compile-time checks, potential runtime errors
- Fix approach: Convert to TypeScript or add JSDoc type annotations

## Known Bugs

**None detected** - Application appears functional based on code review.

## Security Considerations

**Hardcoded Instance ID in Workflow:**
- Risk: EC2 instance ID exposed in public repository (`i-040ac6026761030ac`)
- File: `.github/workflows/deploy.yml`
- Current mitigation: Instance is behind AWS IAM authentication
- Recommendations: Move instance ID to GitHub secret or use instance tags for lookup

**AWS Account ID in Workflow:**
- Risk: AWS account ID exposed (`070322435379`)
- File: `.github/workflows/deploy.yml`
- Current mitigation: Account ID alone is low risk
- Recommendations: Use `aws sts get-caller-identity` to derive dynamically

**Open Audio Proxy:**
- Risk: Server proxies any SomaFM channel ID without validation
- Files: `server/index.js`, `server/production.js`
- Current mitigation: Only proxies to SomaFM domain (hardcoded URL)
- Recommendations: Add allowlist of valid channel IDs if needed

## Performance Bottlenecks

**Polling Every 10 Seconds:**
- Problem: Track info refreshed by re-fetching entire channel list
- File: `src/App.tsx` (useEffect with setInterval)
- Measurement: Full channel.json fetch (~30KB) every 10s
- Cause: SomaFM API doesn't have per-channel endpoint
- Improvement path: Cache channel data, only poll for current channel

**No Image Preloading:**
- Problem: Channel images load only when selected
- File: `src/App.tsx`
- Measurement: Visual delay when switching channels
- Cause: Images fetched on-demand
- Improvement path: Preload adjacent channel images

## Fragile Areas

**Audio Playback State:**
- File: `src/App.tsx`
- Why fragile: Multiple refs and state variables track audio state
- Common failures: Race conditions with debounced playback
- Safe modification: Add comprehensive logging before changes
- Test coverage: None (manual testing only)

## Scaling Limits

**Single EC2 Instance:**
- Current capacity: Unknown (no load testing)
- Limit: Single container, no auto-scaling
- Symptoms at limit: Slow responses, stream interruptions
- Scaling path: Add load balancer, multiple containers, or use ECS/Fargate

**SomaFM API Dependency:**
- Current capacity: Relies on third-party API availability
- Limit: If SomaFM is down, app is non-functional
- Symptoms at limit: Blank channel list, no playback
- Scaling path: Add error states, offline mode, or alternative sources

## Dependencies at Risk

**None significant:**
- React 19.2 is current stable
- Express 4.18 is well-maintained
- Vite 7.2 is actively developed

## Missing Critical Features

**No Error States:**
- Problem: Silent failures when API or streams fail
- Current workaround: User refreshes page
- Blocks: Poor user experience on errors
- Implementation complexity: Low (add error state and UI)

**No Volume Control:**
- Problem: Audio is always at 100% volume
- Current workaround: User adjusts system volume
- Blocks: Standard media player expectations
- Implementation complexity: Low (add range input)

**No Offline Support:**
- Problem: App requires internet for everything
- Current workaround: None
- Blocks: Usage on poor connections
- Implementation complexity: Medium (service worker, cached channel list)

## Test Coverage Gaps

**No Tests:**
- What's not tested: Entire application
- Risk: Regressions go unnoticed
- Priority: Medium (small codebase, manual testing feasible)
- Difficulty to test: Medium (need to mock audio, fetch, localStorage)

---

*Concerns audit: 2026-01-19*
*Update as issues are fixed or new ones discovered*
