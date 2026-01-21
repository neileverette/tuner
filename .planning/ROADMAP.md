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
| 4. Backend API Organization | 1/1 | Complete | 2026-01-19 |
| 5. UI Refactoring | 3/3 | Complete | 2026-01-19 |
| 6. Genre Panel Updates | 0/? | Ready | - |
| 7. View Mode Toggle | 0/? | Not Started | - |
| 8. Genre Filtering & Persistence | 0/? | Not Started | - |

**Overall Progress:** 62.5% (5 of 8 phases complete)

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

---

# Milestone 2: Station Sorting

## Overview

Add sorting capabilities to both grid (carousel) and list (station picker) views. Users can sort stations by name, genre, or popularity via a dropdown control.

## Domain Expertise

- React state management for sort preferences
- Array sorting with multiple criteria
- CSS glassmorphism (backdrop-filter, rgba backgrounds)
- localStorage persistence patterns

## Phases

| # | Phase | Depends On | Research |
|---|-------|------------|----------|
| 9 | Sort State & Logic | - | No |
| 10 | Sort Dropdown UI | Phase 9 | No |
| 11 | Apply Sorting to Views | Phase 10 | No |
| 12 | Persistence & Polish | Phase 11 | No |

## Phase Details

### Phase 9: Sort State & Logic
**Goal**: Create sorting state management and sorting functions for all three sort modes
**Depends on**: Nothing
**Research**: No

Key work:
- Define `SortOption` type: `'station' | 'genre' | 'popularity'`
- Create `sortChannels()` utility function with logic for each mode:
  - Station: alphabetical by `title`
  - Genre: alphabetical by `genre`, then by `title`
  - Popularity: by `listeners` descending (null values sorted to top)
- Add sort state to App.tsx (default: 'station')
- Export sorting utilities from a new `src/utils/sorting.ts`

Outputs:
- `src/utils/sorting.ts` with sorting logic
- Sort state in App.tsx
- TypeScript types for sort options

---

### Phase 10: Sort Dropdown UI
**Goal**: Create glassmorphism dropdown component positioned right of station count
**Depends on**: Phase 9 (sort state must exist)
**Research**: No

Key work:
- Create `SortDropdown.tsx` component
- Style per spec:
  - Height: ~40px
  - Background: semi-transparent black with backdrop blur
  - Border-radius: rounded (20px for pill shape)
  - Position: inline-flex, right of station count
- Dropdown options: "Station", "Genre", "Popularity"
- Wire onChange to update sort state in App.tsx
- Add chevron/arrow icon indicator

Outputs:
- `src/components/SortDropdown.tsx`
- CSS styles in App.css
- Integrated into App.tsx header area

---

### Phase 11: Apply Sorting to Views
**Goal**: Apply selected sort order to both ChannelCarousel (grid) and StationPicker (list)
**Depends on**: Phase 10 (dropdown must be functional)
**Research**: No

Key work:
- Sort `channels` array before passing to ChannelCarousel
- Sort `channels` array before passing to StationPicker
- Ensure sorting respects current filter state (if any filters active)
- Maintain selected channel reference after re-sort (by ID, not index)
- Test all three sort modes in both views

Outputs:
- Sorted carousel view
- Sorted list view
- Stable selection after sort change

---

### Phase 12: Persistence & Polish
**Goal**: Persist sort preference and add finishing touches
**Depends on**: Phase 11 (sorting must work)
**Research**: No

Key work:
- Save sort preference to localStorage
- Restore sort preference on app load
- Add visual feedback for current sort selection
- Ensure dropdown works on mobile (touch-friendly)
- Test edge cases: empty states, single station, all null listeners

Outputs:
- Persistent sort preference
- Polished dropdown interactions
- Mobile-friendly implementation

---

## Progress

| Phase | Plans | Status | Completed |
|-------|-------|--------|-----------|
| 9. Sort State & Logic | 1/1 | Complete | 2026-01-20 |
| 10. Sort Dropdown UI | 1/1 | Complete | 2026-01-20 |
| 11. Apply Sorting to Views | 1/1 | Complete | 2026-01-20 |
| 12. Persistence & Polish | 1/1 | Complete | 2026-01-20 |

**Milestone 2 Progress:** 100% (4 of 4 phases complete) ✓

**Note:** Phase 11 was completed as part of Phase 9 - the `sortedChannels` array is already passed to both ChannelCarousel and StationPicker.

## Design Specifications

### Sort Dropdown
- **Height**: 40px
- **Background**: `rgba(0, 0, 0, 0.5)` or similar semi-transparent black
- **Backdrop filter**: `blur(10px)` for glassmorphism effect
- **Border-radius**: 20px (pill shape)
- **Position**: Right of station count, inline
- **Font**: Match existing UI (likely 14px, white text)

### Sort Options
| Option | Sort Logic |
|--------|-----------|
| Station | Alphabetical by `channel.title` |
| Genre | Alphabetical by `channel.genre`, then `channel.title` |
| Popularity | Descending by `channel.listeners` (null → top) |

---
*Created: 2026-01-20*

---

# Milestone 3: NTS Radio Integration

## Overview

Add NTS Radio as a third source with 2 live channels and 15 "Infinite Mixtapes" (curated endless loops). NTS is a London-based underground radio station known for exceptional curation of electronic, experimental, and global music.

## Domain Expertise

- NTS Live API (https://www.nts.live/api/v2/live)
- Stream URL patterns for live channels and mixtapes
- Express.js CORS proxy extension
- Source registry patterns (established in Phase 2)
- Genre mapping to existing taxonomy

## Source Details

**Live Channels (2):**
- NTS 1: Live broadcasts from London studio
- NTS 2: Live broadcasts from London studio

**Infinite Mixtapes (15):**
| Mixtape | Stream URL | Genre |
|---------|-----------|-------|
| Poolside | `stream-mixtape-geo.ntslive.net/mixtape` | Balearic/Downtempo |
| Slow Focus | `stream-mixtape-geo.ntslive.net/mixtape4` | Ambient/Drone |
| Low Key | `stream-mixtape-geo.ntslive.net/mixtape5` | Lo-fi Hip-Hop |
| Expansions | `stream-mixtape-geo.ntslive.net/mixtape3` | Psychedelic Electronic |
| + 11 more | Various | Various |

## Phases

| # | Phase | Depends On | Research |
|---|-------|------------|----------|
| 13 | NTS API Research | - | Yes |
| 14 | NTS Source Configuration | Phase 13 | No |
| 15 | NTS Backend Proxy | Phase 14 | No |
| 16 | NTS Integration Testing | Phase 15 | No |

## Phase Details

### Phase 13: NTS API Research
**Goal**: Research NTS Live API, discover all stream URLs, and document now-playing metadata
**Depends on**: Nothing
**Research**: Yes - need to explore NTS API responses and all 15 Infinite Mixtape URLs

Key work:
- Fetch and analyze https://www.nts.live/api/v2/live for live channel data
- Document live channel stream URLs and formats
- Discover all 15 Infinite Mixtape stream URLs
- Document now-playing/metadata endpoints if available
- Identify any CORS requirements or rate limits
- Map NTS content to existing genre taxonomy

Outputs:
- 13-RESEARCH.md with API documentation
- Complete list of all stream URLs
- Genre mapping recommendations

---

### Phase 14: NTS Source Configuration
**Goal**: Create NTS source configuration following established patterns
**Depends on**: Phase 13 (API research must be complete)
**Research**: No

Key work:
- Create `src/config/sources/nts.ts` with channel definitions
- Define 2 live channels with stream URLs
- Define 15 Infinite Mixtape channels with stream URLs
- Map each channel to normalized genre taxonomy
- Add NTS to source registry in `src/config/sources/index.ts`
- Define TypeScript types for NTS-specific metadata

Outputs:
- `src/config/sources/nts.ts` (17 channel definitions)
- Updated `src/config/sources/index.ts`
- Genre mappings for all NTS channels

---

### Phase 15: NTS Backend Proxy
**Goal**: Add NTS stream proxying to Express backend
**Depends on**: Phase 14 (source config must exist)
**Research**: No

Key work:
- Add NTS live stream proxy: `/api/nts/live/:channel`
- Add NTS mixtape proxy: `/api/nts/mixtape/:mixtapeId`
- Add NTS now-playing proxy if API available: `/api/nts/now-playing/:channel`
- Handle NTS-specific headers and CORS requirements
- Test all stream endpoints

Outputs:
- NTS proxy routes in `server/index.js`
- Verified stream proxying for all 17 channels

---

### Phase 16: NTS Integration Testing
**Goal**: Verify NTS channels work end-to-end in the app
**Depends on**: Phase 15 (proxy must be working)
**Research**: No

Key work:
- Verify NTS channels appear in `/api/channels` response
- Test live channel playback in app
- Test all 15 Infinite Mixtape playback
- Verify genre filtering includes NTS channels
- Verify source-view mode groups NTS correctly
- Test now-playing metadata display (if available)
- Performance testing with 17 new channels

Outputs:
- All NTS channels playable
- Integration with existing genre/source views
- No regression in SomaFM/Radio Paradise functionality

---

## Progress

| Phase | Plans | Status | Completed |
|-------|-------|--------|-----------|
| 13. NTS API Research | 1/1 | Complete | 2026-01-21 |
| 14. NTS Source Configuration | 1/1 | Complete | 2026-01-21 |
| 15. NTS Backend Proxy | 1/1 | Complete | 2026-01-21 |
| 16. NTS Integration Testing | 1/1 | Complete | 2026-01-21 |

**Milestone 3 Progress:** 100% (4 of 4 phases complete) ✓

## NTS Stream Reference (Complete)

```javascript
// Live Channels
const ntsLiveChannels = [
  { name: "NTS 1", url: "https://stream-relay-geo.ntslive.net/stream" },
  { name: "NTS 2", url: "https://stream-relay-geo.ntslive.net/stream2" }
];

// All 16 Infinite Mixtapes
const ntsInfiniteMixtapes = [
  { name: "Poolside", id: "mixtape4", genre: "lounge" },
  { name: "Slow Focus", id: "mixtape", genre: "ambient" },
  { name: "Low Key", id: "mixtape2", genre: "jazz-soul" },
  { name: "Memory Lane", id: "mixtape6", genre: "rock" },
  { name: "4 To The Floor", id: "mixtape5", genre: "electronic" },
  { name: "Island Time", id: "mixtape21", genre: "world" },
  { name: "The Tube", id: "mixtape26", genre: "rock" },
  { name: "Sheet Music", id: "mixtape35", genre: "eclectic" },
  { name: "Feelings", id: "mixtape27", genre: "jazz-soul" },
  { name: "Expansions", id: "mixtape3", genre: "jazz-soul" },
  { name: "Rap House", id: "mixtape22", genre: "electronic" },
  { name: "Labyrinth", id: "mixtape31", genre: "electronic" },
  { name: "Sweat", id: "mixtape24", genre: "electronic" },
  { name: "Otaku", id: "mixtape36", genre: "eclectic" },
  { name: "The Pit", id: "mixtape34", genre: "rock" },
  { name: "Field Recordings", id: "mixtape23", genre: "ambient" }
];
// Base URL: https://stream-mixtape-geo.ntslive.net/{id}
```

## Genre Mapping (Final)

| NTS Channel | Primary Genre | Notes |
|-------------|---------------|-------|
| NTS 1 | eclectic | Live broadcasts |
| NTS 2 | eclectic | Live broadcasts |
| Poolside | lounge | Balearic, sophisti-pop |
| Slow Focus | ambient | Drone, ragas |
| Low Key | jazz-soul | Lo-fi hip-hop, R&B |
| Memory Lane | rock | Psychedelic |
| 4 To The Floor | electronic | House, techno |
| Island Time | world | Reggae, dub |
| The Tube | rock | Post-punk, industrial |
| Sheet Music | eclectic | Classical |
| Feelings | jazz-soul | Soul, gospel |
| Expansions | jazz-soul | Jazz |
| Rap House | electronic | Hip-hop/electronic |
| Labyrinth | electronic | Atmospheric breaks |
| Sweat | electronic | International dance |
| Otaku | eclectic | Video game/anime |
| The Pit | rock | Metal |
| Field Recordings | ambient | Natural soundscapes |

**Total: 18 channels** (2 live + 16 mixtapes)

---
*Created: 2026-01-21*
