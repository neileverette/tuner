# Project State

## Project Reference

See: .planning/PROJECT.md (Genre Organizer)

**Core value:** Multi-source radio aggregator with unified genre classification
**Current focus:** Phase 8 - Genre Filtering (on filtering branch)

## Current Position

Phase: 8 of 8 (Genre Filtering & Persistence) - IN PROGRESS
Plan: 08-01-PLAN.md created
Status: Starting genre filtering implementation (skipping Phases 6-7 as not required)
Last activity: 2026-01-20 - Created 08-01-PLAN.md
Branch: filtering

Progress: [######    ] 62.5%

## Phase Summary

| Phase | Description | Status | Dependencies |
|-------|-------------|--------|--------------|
| 1 | Genre Registry & Taxonomy | **Complete** | - |
| 2 | Source Registry System | **Complete** | Phase 1 |
| 3 | Radio Paradise Integration | **Complete** | Phase 2 |
| 4 | Backend API Organization | **Complete** | Phase 3 |
| 5 | UI Refactoring | **Complete** | - |
| 6 | Genre Panel Updates | Ready | Phase 4, 5 |
| 7 | View Mode Toggle | Not Started | Phase 6 |
| 8 | Genre Filtering & Persistence | **In Progress** | Phase 7 (soft) |

## Parallel Workstreams

**Stream A (Data/Backend):** Phase 1 (DONE) -> 2 (DONE) -> 3 (DONE) -> 4 (DONE)
**Stream B (Frontend):** Phase 5 (DONE)

Both streams converged. Phase 6 is now ready to begin.

## Research Required

- [x] **Phase 1**: SomaFM API genre analysis (01-RESEARCH.md complete)
- [x] **Phase 3**: Radio Paradise stream URLs and metadata API (Complete - Integration Guide available)

## Completed Work

- Phase 1 research (01-RESEARCH.md)
- Phase 1 plan (01-01-PLAN.md)
- Phase 1 implementation (01-01-SUMMARY.md)
  - src/config/types.ts (ChannelGenreMapping, SourceConfig)
  - src/config/genres.ts (8 categories)
  - src/config/sources/somafm.ts (49 channel mappings)
  - src/config/sources/radio-paradise.ts (4 channel mappings)
  - src/config/sources/index.ts
- Phase 2 plan (02-01-PLAN.md)
- Phase 2 implementation (02-01-SUMMARY.md)
  - Extended src/config/types.ts (StreamDefinition, ChannelDefinition, SourceApiConfig)
  - Updated src/config/sources/somafm.ts (49 channel definitions with streams)
  - Updated src/config/sources/radio-paradise.ts (4 channel definitions with streams)
  - Updated src/config/sources/index.ts (getChannelDefinition, getAllChannelDefinitions)
- Phase 3 plan (03-01-PLAN.md)
- Phase 3 implementation (03-01-SUMMARY.md)
  - Added Radio Paradise stream proxy: /api/rp/stream/:channelId/:format
  - Added Radio Paradise now-playing proxy: /api/rp/now-playing/:chan
  - Supports all 4 channels (Main, Mellow, Rock, Global) and 3 formats (AAC, FLAC, MP3)
- Phase 4 plan (04-01-PLAN.md)
- Phase 4 implementation (04-01-SUMMARY.md)
  - src/config/api-types.ts (ApiChannel, GenreGroup, SourceGroup, response types)
  - src/config/aggregation.ts (aggregateByGenre, aggregateBySource)
  - tsconfig.server.json (ESM build config)
  - GET /api/channels endpoint with ?view=genre|source
- Phase 5 plan 1 (05-01-PLAN.md)
- Phase 5 plan 1 implementation (05-01-SUMMARY.md)
  - src/components/ChannelCard.tsx (carousel item component)
  - src/components/ChannelCarousel.tsx (carousel with drag-to-scroll)
  - App.tsx reduced by 88 lines (452 -> 364)
- Phase 5 plan 3 (05-03-PLAN.md)
- Phase 5 plan 3 implementation (05-03-SUMMARY.md)
  - src/components/HeroArtwork.tsx (background image with crossfade)
  - src/components/SplashScreen.tsx (initial loading animation)
  - src/components/Instructions.tsx (keyboard hint banner)
  - App.tsx reduced to 316 lines (total reduction: 136 lines / 30%)

## Key Artifacts

| File | Purpose |
|------|---------|
| src/config/genres.ts | Genre taxonomy (8 categories, GenreId type) |
| src/config/types.ts | All config interfaces (ChannelDefinition, StreamDefinition, SourceApiConfig) |
| src/config/api-types.ts | API response types (ApiChannel, GenreGroup, SourceGroup) |
| src/config/aggregation.ts | Channel aggregation (aggregateByGenre, aggregateBySource) |
| src/config/sources/index.ts | Source registry (SOURCES, getAllChannelMappings, getAllChannelDefinitions) |
| src/components/ChannelCard.tsx | Individual channel thumbnail component |
| src/components/ChannelCarousel.tsx | Carousel container with drag-scroll |
| src/components/StationPicker.tsx | Modal station search/selection |
| src/components/PlayerControls.tsx | Bottom playback controls |
| src/components/HeroArtwork.tsx | Background image with crossfade |
| src/components/SplashScreen.tsx | Initial loading animation |
| src/components/Instructions.tsx | Keyboard hint banner |
| server/index.js | Express backend with proxies and /api/channels endpoint |
| tsconfig.server.json | Build config for server-consumable ESM modules |

## API Endpoints Available

| Endpoint | Description |
|----------|-------------|
| GET /api/channels | All channels by genre (default) |
| GET /api/channels?view=source | All channels by source, then genre |
| GET /api/stream/:channelId | SomaFM stream proxy |
| GET /api/rp/stream/:channelId/:format | Radio Paradise stream proxy |
| GET /api/rp/now-playing/:chan | Radio Paradise now-playing proxy |

## Session Continuity

Last session: 2026-01-19
Completed: Phase 5 (UI Refactoring) - all component extractions complete
Resume: Create Phase 6 plan for Genre Panel Updates

## Next Steps

1. **Milestone 3 - Phase 13:** NTS API Research
   - Fetch and analyze NTS Live API
   - Document all stream URLs (2 live + 15 Infinite Mixtapes)
   - Map NTS content to genre taxonomy
   - Create 13-RESEARCH.md

Note: Milestone 1 Phases 6-7 deferred. Phase 8 (filtering) on separate branch.

## Active Milestone

**Milestone 3: NTS Radio Integration** (feature/nts-radio-integration branch)
- Add NTS Radio as third source (London-based underground radio)
- 2 live channels + 15 Infinite Mixtapes
- Phases 13-16

## Phase 5 Summary

Three plans executed for Phase 5:
- **05-01-PLAN.md**: ChannelCard/ChannelCarousel extraction - **COMPLETE**
- **05-02 commits**: PlayerControls/StationPicker extraction - **COMPLETE**
- **05-03-PLAN.md**: HeroArtwork/SplashScreen/Instructions extraction - **COMPLETE**

**Result:** App.tsx reduced from 452 to 316 lines (30% reduction). Clean component architecture ready for Phase 6.

---
*Updated: 2026-01-19*
