# Genre Organizer

Multi-source radio station organization system for the Tuner app.

## Vision

Transform Tuner from a single-source SomaFM player into a multi-source radio aggregator with unified genre classification. Users browse stations by genre (mixing sources) or by source (then genre), with persistent filter preferences.

## Requirements

### Validated

- [x] SomaFM channel playback with CORS proxy — existing
- [x] Channel metadata display (title, description, genre, DJ) — existing
- [x] Stream proxy architecture (Express backend) — existing
- [x] localStorage state persistence — existing

### Active

- [ ] **Genre Registry** — Unified taxonomy that normalizes genres across sources
- [ ] **Source Registry** — Register new sources (Radio Paradise) with common classification
- [ ] **Radio Paradise Integration** — 4 channels: Main Mix, Mellow Mix, Rock Mix, Global Mix
- [ ] **CORS Proxy Extension** — Add Radio Paradise stream proxying to Express backend
- [ ] **Server-side Organization** — API returns channels organized by genre
- [ ] **UI View Modes** — Toggle between "by genre (mixed)" and "by source then genre"
- [ ] **Genre Filtering** — Select/deselect genres with state persistence
- [ ] **Genre Panel Updates** — Group by source, show provider name (SomaFM, Radio Paradise)

### Out of Scope

- Database storage (static config files only)
- User accounts / preferences sync
- Additional sources beyond SomaFM and Radio Paradise in v1
- Genre auto-detection from audio analysis
- Channel search functionality

## Architecture

### Data Storage Decision

**Static config files (JSON/TS) bundled with build — no database.**

Genre definitions, source configurations, and channel-to-genre mappings are part of the package. This keeps the architecture simple and stateless.

```
src/
  config/
    genres.ts          # Genre taxonomy definitions
    sources/
      somafm.ts        # SomaFM channel mappings
      radio-paradise.ts # Radio Paradise channel mappings
    index.ts           # Source registry exports
```

### Genre Taxonomy Design

**Challenge:** SomaFM has ~30+ channels with free-form genre strings (e.g., "Ambient", "Electronica", "World", "Alternative"). Radio Paradise has 4 channels with broad categories.

**Approach:**
1. Extract unique genres from SomaFM API
2. Normalize into parent categories (Ambient, Electronic, Rock, World, etc.)
3. Map Radio Paradise channels to matching categories
4. Allow channels to have multiple genre tags

**Open Question:** Need to analyze SomaFM's actual genre strings to finalize taxonomy.

### API Shape

```typescript
// Server endpoint
GET /api/channels
  ?view=genre      // Default: channels grouped by genre
  ?view=source     // Channels grouped by source, then genre

// Response shape (genre view)
{
  genres: [
    {
      id: "ambient",
      name: "Ambient",
      channels: [
        { id: "dronezone", source: "somafm", ... },
        { id: "mellow", source: "radio-paradise", ... }
      ]
    }
  ]
}
```

### Component Changes

| Component | Change |
|-----------|--------|
| `App.tsx` | Refactor from monolith, extract channel/genre components |
| `server/index.js` | Add Radio Paradise proxy, genre organization endpoint |
| New: `GenrePanel.tsx` | Genre filtering UI with source grouping |
| New: `ChannelGrid.tsx` | Display channels organized by genre or source |

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Static config over database | Simple, stateless, no infra overhead | Pending |
| Server-side organization | Frontend stays thin, single source of truth | Pending |
| Genre normalization | Unified UX across heterogeneous sources | Pending |
| Multi-tag genres | Channels can appear in multiple categories | Pending |

## Constraints

- Must work with existing React 19 + TypeScript + Vite setup
- Must work with existing Express backend architecture
- No additional databases or external services
- Radio Paradise streams require CORS proxy (same as SomaFM)
- Genre taxonomy must accommodate future sources
- App.tsx is currently ~400 lines monolithic — needs refactoring

## Assumptions

- Radio Paradise API/stream URLs are publicly documented
- SomaFM genre strings are consistent enough to normalize
- 4 Radio Paradise channels map cleanly to existing genre categories
- Users want to browse by genre more than by source

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| SomaFM genre strings inconsistent | High — breaks normalization | Manual mapping with fallback category |
| Radio Paradise API changes | Medium — breaks integration | Version-pinned config, monitor for changes |
| Genre taxonomy too broad/narrow | Medium — poor UX | User testing, iterate on categories |
| App.tsx refactor breaks features | High — regression | Incremental refactor, test each step |

## Success Metrics

- [ ] Both SomaFM and Radio Paradise channels playable
- [ ] All channels classified into genre taxonomy
- [ ] Genre filtering persists across sessions
- [ ] View mode toggle works (genre vs source)
- [ ] Genre panel shows source grouping
- [ ] No regression in existing playback functionality

## Open Questions

1. What are the exact stream URLs for Radio Paradise channels?
2. What genres does SomaFM currently return? (need API analysis)
3. How many top-level genre categories feel right? (5-8 likely)
4. Should "Eclectic" be its own genre or distributed across others?

---
*Last updated: 2026-01-19 after initialization*
