---
phase: 02-source-registry
plan: 01
subsystem: config
requires: [01-genre-taxonomy]
provides: [source-registry, channel-definitions, stream-urls]
affects: [03-radio-paradise, 04-backend-api]
tags: [typescript, static-config, data-layer]
tech-stack:
  added: []
  patterns: [factory-functions, type-narrowing]
key-decisions:
  - Separate ChannelDefinition from ChannelGenreMapping (different concerns)
  - Stream URLs defined statically, live metadata from API
  - proxyRequired flag for CORS handling
key-files: [src/config/types.ts, src/config/sources/index.ts]
---

# Phase 2 Plan 1: Source Registry System Summary

**Extended the source registry with full channel metadata including stream URLs, images, and API configuration for 53 channels across 2 sources.**

## Accomplishments

- Defined `StreamDefinition`, `ChannelDefinition`, and `SourceApiConfig` interfaces for complete channel metadata
- Added SomaFM channel definitions with factory function pattern (49 channels)
- Added Radio Paradise channel definitions with AAC 320k, FLAC, and MP3 streams (4 channels)
- Created registry utilities for looking up channel definitions across sources
- Both sources configured with `proxyRequired: true` for CORS handling

## Files Created/Modified

| File | Purpose |
|------|---------|
| `src/config/types.ts` | Extended with StreamDefinition, ChannelDefinition, SourceApiConfig interfaces |
| `src/config/sources/somafm.ts` | Added createSomaFMChannel() factory and 49 channel definitions |
| `src/config/sources/radio-paradise.ts` | Added 4 channel definitions with stream URLs, RP_CHANNEL_IDS |
| `src/config/sources/index.ts` | Added getChannelDefinition(), getAllChannelDefinitions() utilities |

## Commits

| Hash | Description |
|------|-------------|
| `4ae08e2` | feat(02-source-registry): extend config types with channel definitions and API config |
| `d590f14` | feat(02-source-registry): add SomaFM channel definitions with stream URLs |
| `a2376d7` | feat(02-source-registry): add Radio Paradise definitions and registry utilities |

## Verification Results

- TypeScript compilation: PASS (config files compile without errors)
- Build: Pre-existing errors in unrelated files (src/adapters/SomaFMAdapter.ts, src/types/adapter.ts)
- Channel count: 49 SomaFM + 4 Radio Paradise = 53 total

## Decisions Made

1. **Factory function for SomaFM**: Used `createSomaFMChannel()` to generate definitions from channel IDs, reducing boilerplate
2. **Static stream definitions**: Stream URLs defined statically rather than from API templates - simpler and more reliable
3. **Separate RP_CHANNEL_IDS export**: Radio Paradise API uses numeric chan IDs (0-3), exported separately for API integration
4. **Bitrate 0 for FLAC**: FLAC streams use bitrate 0 to indicate lossless/variable

## Issues Encountered

- Pre-existing build errors in `src/adapters/SomaFMAdapter.ts` and `src/types/adapter.ts` (verbatimModuleSyntax and unused variable)
- Not related to this plan, config files compile correctly

## Type System Summary

```typescript
// Stream quality and format
StreamDefinition: { quality, format, bitrate, url }

// Full channel metadata
ChannelDefinition: { id, title, description, dj, image, streams, homepage }

// API configuration
SourceApiConfig: { channelsEndpoint, nowPlayingEndpoint, streamUrlTemplate, proxyRequired }

// Extended source config
SourceConfig: { ...existing, api, channelDefinitions }
```

## Next Phase Readiness

Phase 2 complete. Phase 3 (Radio Paradise Integration) can proceed - stream URLs and API config provide the foundation for backend proxy setup.

---
*Executed: 2026-01-19*
