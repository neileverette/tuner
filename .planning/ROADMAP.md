# Roadmap: Genre Organizer

## Overview

Transform Tuner from a single-source SomaFM player into a multi-source radio aggregator with unified genre classification. Users browse stations by genre (mixing sources) or by source (then genre), with persistent filter preferences.

## Domain Expertise

- React 19 + TypeScript + Vite frontend
- Express.js backend with CORS proxy
- REST API design (organization endpoints)
- Static config patterns (TypeScript-based registries)
- localStorage state persistence

## Phases

| # | Phase | Depends On | Research |
|---|-------|------------|----------|
| 1 | Genre Registry & Taxonomy | - | Yes |
| 2 | Source Registry System | Phase 1 | No |
| 3 | Radio Paradise Integration | Phase 2 | Yes |
| 4 | Backend API Organization | Phase 3 | No |
| 5 | UI Refactoring | - | No |
| 6 | Genre Panel Updates | Phase 4, 5 | No |
| 7 | View Mode Toggle | Phase 6 | No |
| 8 | Genre Filtering & Persistence | Phase 7 | No |

## Phase Details

### Phase 1: Genre Registry & Taxonomy
**Goal**: Analyze SomaFM genres and create a normalized taxonomy that can accommodate multiple sources
**Depends on**: Nothing (foundational work)
**Research**: Yes - need to analyze SomaFM API response to extract actual genre strings

Key work:
- Fetch and analyze SomaFM channel data to extract unique genre strings
- Design parent genre categories (target: 6-10 categories)
- Create `src/config/genres.ts` with taxonomy definitions
- Define TypeScript interfaces for genre registry
- Map each SomaFM channel to one or more normalized genres

Outputs:
- Genre taxonomy design document
- `src/config/genres.ts` with TypeScript definitions
- SomaFM genre mapping

---

### Phase 2: Source Registry System
**Goal**: Create extensible configuration structure for registering audio sources
**Depends on**: Phase 1 (genre taxonomy must exist for mappings)
**Research**: No

Key work:
- Design source registry interface (id, name, streams, genre mappings)
- Create `src/config/sources/` directory structure
- Implement `src/config/sources/somafm.ts` with channel definitions
- Create `src/config/index.ts` registry exports
- Ensure type safety across source configurations

Outputs:
- Source registry TypeScript interfaces
- SomaFM source configuration file
- Registry index with exports

---

### Phase 3: Radio Paradise Integration
**Goal**: Add Radio Paradise as second source with 4 channels: Main Mix, Mellow Mix, Rock Mix, Global Mix
**Depends on**: Phase 2 (source registry structure must exist)
**Research**: Yes - need to research Radio Paradise stream URLs and metadata API

Key work:
- Research Radio Paradise stream URLs and API documentation
- Create `src/config/sources/radio-paradise.ts` configuration
- Map Radio Paradise channels to normalized genre taxonomy
- Extend Express backend CORS proxy for Radio Paradise streams
- Test stream playback through proxy

Outputs:
- Radio Paradise source configuration
- Updated CORS proxy with Radio Paradise routes
- Verified stream playback

---

### Phase 4: Backend API Organization
**Goal**: Server returns channels organized by genre or by source with query parameter control
**Depends on**: Phase 3 (all sources must be configured)
**Research**: No

Key work:
- Create `/api/channels` endpoint in Express server
- Implement `?view=genre` response shape (channels grouped by genre)
- Implement `?view=source` response shape (channels grouped by source, then genre)
- Load and merge source configurations at server startup
- Add TypeScript types for API response shapes

Outputs:
- New `/api/channels` endpoint
- Genre-organized response format
- Source-organized response format

---

### Phase 5: UI Refactoring
**Goal**: Extract components from monolithic App.tsx (~400 lines) to enable genre features
**Depends on**: Nothing (can run in parallel with Phases 1-4)
**Research**: No

Key work:
- Analyze current App.tsx structure and identify extraction boundaries
- Extract `ChannelCard.tsx` component
- Extract `PlayerControls.tsx` component
- Extract `ChannelList.tsx` (or `ChannelGrid.tsx`) component
- Reduce App.tsx to orchestration layer
- Maintain all existing functionality during refactor

Outputs:
- Extracted UI components
- Simplified App.tsx
- No regression in playback features

---

### Phase 6: Genre Panel Updates
**Goal**: Genre panel groups channels by source with provider name display
**Depends on**: Phase 4 (API must return organized data), Phase 5 (components extracted)
**Research**: No

Key work:
- Create `GenrePanel.tsx` component
- Fetch organized channel data from `/api/channels` endpoint
- Display channels grouped by source within each genre
- Show source provider name (SomaFM, Radio Paradise) as group header
- Style genre panel for visual hierarchy

Outputs:
- `GenrePanel.tsx` component
- Source grouping within genres
- Provider name display

---

### Phase 7: View Mode Toggle
**Goal**: Toggle between "by genre (mixed sources)" and "by source then genre" views
**Depends on**: Phase 6 (genre panel must exist)
**Research**: No

Key work:
- Add view mode state to App.tsx (genre | source)
- Create toggle UI control in header or panel
- Pass view mode to API call as query parameter
- Update GenrePanel to render based on view mode
- Persist view mode preference to localStorage

Outputs:
- View mode toggle control
- Dynamic panel rendering based on mode
- Persisted view preference

---

### Phase 8: Genre Filtering & Persistence
**Goal**: Select/deselect genres with state persistence across sessions
**Depends on**: Phase 7 (view modes must work)
**Research**: No

Key work:
- Add genre filter state (Set of enabled genre IDs)
- Create filter UI in genre panel (checkboxes or toggle chips)
- Filter displayed channels based on selected genres
- Persist filter state to localStorage
- Restore filter state on app load
- Add "Select All" / "Clear All" convenience actions

Outputs:
- Genre filter UI controls
- Filtered channel display
- Persistent filter state

---

## Progress

| Phase | Plans | Status | Completed |
|-------|-------|--------|-----------|
| 1. Genre Registry & Taxonomy | 1/1 | Complete | 2026-01-19 |
| 2. Source Registry System | 1/1 | Complete | 2026-01-19 |
| 3. Radio Paradise Integration | 1/1 | Complete | 2026-01-19 |
| 4. Backend API Organization | 0/? | Ready | - |
| 5. UI Refactoring | 0/? | Ready (parallel) | - |
| 6. Genre Panel Updates | 0/? | Not Started | - |
| 7. View Mode Toggle | 0/? | Not Started | - |
| 8. Genre Filtering & Persistence | 0/? | Not Started | - |

**Overall Progress:** 37.5% (3 of 8 phases complete)

## Parallelization Notes

Phase 5 (UI Refactoring) has no dependencies on Phases 1-4 and can be executed in parallel. This allows for two parallel workstreams:

**Stream A (Data/Backend):** Phase 1 -> 2 -> 3 -> 4
**Stream B (Frontend):** Phase 5

Both streams converge at Phase 6, which requires outputs from both.

## Research Flags

- **Phase 1**: Requires SomaFM API analysis to extract genre strings
- **Phase 3**: Requires Radio Paradise stream URL and API research

---
*Created: 2026-01-19*
