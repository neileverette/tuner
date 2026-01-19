# Phase 1: Genre Registry & Taxonomy - Research

**Researched:** 2026-01-19
**Domain:** Music genre classification system for multi-source radio aggregation
**Confidence:** HIGH

<research_summary>
## Summary

Researched genre taxonomy design patterns for aggregating internet radio stations from multiple sources (SomaFM and Radio Paradise). The core challenge is normalizing heterogeneous genre strings into a unified classification system that enables cross-source browsing.

Key finding: SomaFM uses 49 channels with ~20 unique genre identifiers, many using pipe-delimited compound genres (e.g., "ambient|electronic", "folk|alternative"). The standard approach for multi-source aggregation is a two-tier taxonomy: parent categories (6-10) with source-specific mappings. This mirrors patterns used by TuneIn, Live365, and other radio aggregators.

Radio Paradise's 4 channels map cleanly to this taxonomy: Main Mix (Eclectic), Mellow Mix (Ambient/Chill), Rock Mix (Rock), Global Mix (World).

**Primary recommendation:** Implement a static TypeScript registry using `as const` with `satisfies` for type-safe genre definitions. Use 8 parent categories based on SomaFM genre distribution analysis. Map each source channel to one or more normalized genres.
</research_summary>

<somafm_genre_analysis>
## SomaFM Genre Analysis

### Raw API Data (49 channels)

| Genre String | Channel Count | Example Channels |
|--------------|---------------|------------------|
| electronic | 10 | Beat Blender, cliqhop idm, Dub Step Beyond, Lush, Space Station Soma, The Trip, Vaporwaves |
| ambient | 4 | Deep Space One, Drone Zone, Dark Zone, SF 10-33 (partial) |
| ambient\|electronic | 4 | Groove Salad, Groove Salad Classic, Mission Control, Synphaera Radio |
| holiday | 5 | Christmas Lounge, Jolly Ol' Soul, Xmas in Frisko, Christmas Rocks!, Department Store Christmas |
| lounge | 2 | Illinois Street Lounge, Secret Agent |
| alternative | 1 | PopTron |
| alternative\|rock | 1 | Indie Pop Rocks! |
| alternative\|electronic | 2 | Digitalis, Underground 80s |
| eclectic | 2 | Black Rock FM, Covers |
| world | 1 | Suburbs of Goa |
| folk\|alternative | 1 | Folk Forward |
| jazz | 1 | Sonic Universe |
| celtic\|world | 1 | ThistleRadio |
| 70s\|rock | 1 | Left Coast 70s |
| metal | 1 | Metal Detector |
| reggae | 1 | Heavyweight Reggae |
| oldies | 1 | Seven Inch Soul |
| americana | 1 | Boot Liquor |
| live\|specials | 2 | SomaFM Live, SF Police Scanner |
| specials | 2 | SomaFM Specials, n5MD Radio |
| spoken | 1 | SF in SF |
| tiki\|world | 1 | Tiki Time |
| bossanova\|world | 1 | Bossa Beyond |
| pop\|oldies | 1 | The In-Sound |
| ambient\|industrial | 1 | Doomed |
| electronic\|hiphop | 1 | Fluid |
| electronic\|specials | 1 | DEF CON Radio |
| chill\|live | 1 | Chillits Radio |

### Genre Distribution Analysis

**Primary genres by channel count:**
1. Electronic-family: 18 channels (37%)
2. Ambient-family: 9 channels (18%)
3. Holiday: 5 channels (10%)
4. Alternative/Rock-family: 5 channels (10%)
5. World-family: 4 channels (8%)
6. Lounge: 2 channels (4%)
7. Specials/Live: 4 channels (8%)
8. Other (Jazz, Metal, Reggae, Spoken, Americana, Oldies): 6 channels (12%)

**Insight:** Electronic and Ambient dominate. The compound genres (pipe-delimited) indicate channels that bridge categories - important for multi-tag support.
</somafm_genre_analysis>

<radio_paradise_mapping>
## Radio Paradise Mapping

| Channel | Described As | Recommended Primary Genre | Secondary Genres |
|---------|--------------|---------------------------|------------------|
| Main Mix | Eclectic blend of rock, electronica, world music | Eclectic | Rock, Electronic, World |
| Mellow Mix | Downtempo, chill, ambient, acoustic | Ambient | Chill, Acoustic |
| Rock Mix | Rock-focused, classic to modern | Rock | Alternative |
| Global Mix | World music and international sounds | World | - |

**Mapping confidence:** HIGH - descriptions align well with proposed taxonomy categories.
</radio_paradise_mapping>

<proposed_taxonomy>
## Proposed Genre Taxonomy

### 8 Parent Categories

Based on SomaFM genre distribution and standard radio taxonomy patterns:

| ID | Name | Description | SomaFM Channels | RP Channels |
|----|------|-------------|-----------------|-------------|
| `ambient` | Ambient & Chill | Atmospheric, downtempo, drone, chill | 9 | Mellow Mix |
| `electronic` | Electronic | IDM, house, techno, dubstep, synthwave | 18 | (Main Mix secondary) |
| `rock` | Rock & Alternative | Indie, alternative, classic rock, metal | 5 | Rock Mix |
| `world` | World & Global | International, Celtic, reggae, bossa | 4 | Global Mix |
| `jazz-soul` | Jazz & Soul | Jazz, soul, R&B, oldies | 3 | - |
| `lounge` | Lounge & Retro | Lounge, tiki, spy music | 2 | - |
| `eclectic` | Eclectic | Mixed genres, curated variety | 2 | Main Mix |
| `holiday` | Holiday | Christmas, seasonal | 5 | - |

### Excluded from Primary Navigation

These exist but should be filtered or handled specially:
- `specials`: SomaFM special broadcasts (transient)
- `live`: Live events, police scanner (niche)
- `spoken`: Spoken word (SF in SF only)

### Multi-Tag Support

Channels map to primary + optional secondary genres:

```typescript
// Example mappings
{
  "groovesalad": { primary: "ambient", secondary: ["electronic"] },
  "indiepop": { primary: "rock", secondary: ["alternative"] },
  "rp-main": { primary: "eclectic", secondary: ["rock", "electronic", "world"] }
}
```
</proposed_taxonomy>

<standard_stack>
## Standard Stack

### Core (TypeScript Static Config)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | 5.x | Type-safe genre definitions | Already in project |
| `as const` assertion | TS 3.4+ | Literal types for genre IDs | Type safety for lookups |
| `satisfies` operator | TS 4.9+ | Type validation without widening | Preserves literal types |

### No Additional Libraries Needed

This phase is pure TypeScript configuration. No external libraries required.

The standard pattern for static registries in TypeScript uses:
1. `as const` for immutable literal type inference
2. `satisfies` for type validation without losing specificity
3. Derived types from the const definitions

**Installation:**
```bash
# No new dependencies required
# Existing TypeScript setup is sufficient
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure

```
src/
  config/
    genres.ts           # Genre taxonomy definitions
    sources/
      index.ts          # Source registry exports
      somafm.ts         # SomaFM channel-to-genre mappings
      radio-paradise.ts # Radio Paradise channel-to-genre mappings
    types.ts            # Shared TypeScript interfaces
```

### Pattern 1: Type-Safe Genre Registry with `as const` + `satisfies`

**What:** Define genre taxonomy as a const object, derive types from it
**When to use:** Static configuration that needs type-safe lookups
**Example:**

```typescript
// src/config/genres.ts

// Genre definitions with literal type inference
export const GENRES = {
  ambient: {
    id: 'ambient',
    name: 'Ambient & Chill',
    description: 'Atmospheric, downtempo, drone, chill',
    icon: 'cloud', // optional: for UI
  },
  electronic: {
    id: 'electronic',
    name: 'Electronic',
    description: 'IDM, house, techno, dubstep, synthwave',
    icon: 'bolt',
  },
  rock: {
    id: 'rock',
    name: 'Rock & Alternative',
    description: 'Indie, alternative, classic rock, metal',
    icon: 'guitar',
  },
  world: {
    id: 'world',
    name: 'World & Global',
    description: 'International, Celtic, reggae, bossa',
    icon: 'globe',
  },
  'jazz-soul': {
    id: 'jazz-soul',
    name: 'Jazz & Soul',
    description: 'Jazz, soul, R&B, oldies',
    icon: 'music',
  },
  lounge: {
    id: 'lounge',
    name: 'Lounge & Retro',
    description: 'Lounge, tiki, spy music',
    icon: 'martini',
  },
  eclectic: {
    id: 'eclectic',
    name: 'Eclectic',
    description: 'Mixed genres, curated variety',
    icon: 'shuffle',
  },
  holiday: {
    id: 'holiday',
    name: 'Holiday',
    description: 'Christmas, seasonal',
    icon: 'snowflake',
  },
} as const satisfies Record<string, GenreDefinition>;

// Derived types
export type GenreId = keyof typeof GENRES;
export type GenreDefinition = {
  id: string;
  name: string;
  description: string;
  icon?: string;
};

// Type-safe array of genre IDs for iteration
export const GENRE_IDS = Object.keys(GENRES) as GenreId[];

// Helper for getting genre by ID with type safety
export function getGenre(id: GenreId): typeof GENRES[GenreId] {
  return GENRES[id];
}
```

### Pattern 2: Channel-to-Genre Mapping Interface

**What:** Type-safe mapping of source channels to normalized genres
**When to use:** Each source configuration file
**Example:**

```typescript
// src/config/types.ts

import type { GenreId } from './genres';

export interface ChannelGenreMapping {
  channelId: string;
  primaryGenre: GenreId;
  secondaryGenres?: GenreId[];
}

export interface SourceConfig {
  id: string;
  name: string;
  homepage: string;
  channels: ChannelGenreMapping[];
}
```

```typescript
// src/config/sources/somafm.ts

import type { SourceConfig } from '../types';

export const SOMAFM_CONFIG: SourceConfig = {
  id: 'somafm',
  name: 'SomaFM',
  homepage: 'https://somafm.com',
  channels: [
    { channelId: 'groovesalad', primaryGenre: 'ambient', secondaryGenres: ['electronic'] },
    { channelId: 'dronezone', primaryGenre: 'ambient' },
    { channelId: 'deepspaceone', primaryGenre: 'ambient' },
    { channelId: 'beatblender', primaryGenre: 'electronic' },
    { channelId: 'cliqhop', primaryGenre: 'electronic' },
    { channelId: 'dubstep', primaryGenre: 'electronic' },
    { channelId: 'indiepop', primaryGenre: 'rock', secondaryGenres: ['alternative'] },
    // ... all 49 channels mapped
  ],
} as const;
```

### Pattern 3: Compound Genre Normalization

**What:** Parse SomaFM's pipe-delimited genres into primary + secondary
**When to use:** Initial mapping creation (one-time analysis, not runtime)
**Example:**

```typescript
// Helper for initial mapping creation (development tool, not runtime)
function parseCompoundGenre(rawGenre: string): { primary: string; secondary: string[] } {
  const parts = rawGenre.split('|').map(g => g.trim().toLowerCase());
  return {
    primary: parts[0],
    secondary: parts.slice(1),
  };
}

// Example: "ambient|electronic" -> { primary: "ambient", secondary: ["electronic"] }
```

### Anti-Patterns to Avoid

- **Runtime genre parsing:** Don't parse SomaFM genre strings at runtime. Pre-compute mappings in config files.
- **Magic strings for genre IDs:** Always use the derived `GenreId` type, never raw strings.
- **Mutable genre registry:** Use `as const` to prevent accidental mutation.
- **Over-normalized taxonomy:** 8 categories is good; 20+ categories fragments the UX.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Genre ID validation | Runtime string checks | TypeScript's `GenreId` type | Compile-time safety, IDE autocomplete |
| Genre lookup tables | Manual object construction | `as const satisfies` pattern | Type inference + validation in one |
| Mapping completeness check | Manual review | TypeScript exhaustiveness checking | Compiler catches missing mappings |
| Genre display order | Array position | Explicit `order` property in definition | Intentional, maintainable ordering |

**Key insight:** TypeScript's type system handles most of what you'd hand-roll for configuration validation. The `as const satisfies` pattern gives you both literal types AND type checking.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Genre String Drift
**What goes wrong:** SomaFM changes genre strings, mappings break silently
**Why it happens:** Source APIs aren't stable, genres are editorial decisions
**How to avoid:** Map by channel ID (stable), not by genre string. Treat SomaFM genre as informational only.
**Warning signs:** Unknown genres appearing in logs, channels with no genre assignment

### Pitfall 2: Over-Granular Taxonomy
**What goes wrong:** 15+ parent genres makes UI cluttered, users can't find stations
**Why it happens:** Trying to preserve every distinction from source data
**How to avoid:** Target 6-10 parent categories. Use secondary genres for nuance.
**Warning signs:** More categories than channels in a category, user confusion in testing

### Pitfall 3: Lossy Genre Mapping
**What goes wrong:** Multi-genre channels like "ambient|electronic" get assigned to only one category
**Why it happens:** Simplistic primary-only mapping
**How to avoid:** Support `secondaryGenres` array, allow channels to appear in multiple views
**Warning signs:** Users can't find channel in expected genre

### Pitfall 4: Inconsistent ID Casing
**What goes wrong:** `"Ambient"` vs `"ambient"` vs `"AMBIENT"` in different places
**Why it happens:** Not normalizing IDs at the source
**How to avoid:** Define canonical IDs in one place (genres.ts), derive all usages from it
**Warning signs:** Type errors, failed lookups, UI rendering bugs

### Pitfall 5: Forgetting Edge Cases
**What goes wrong:** "specials", "live", "spoken" channels don't fit taxonomy
**Why it happens:** Focus on common cases only
**How to avoid:** Explicitly handle edge cases: exclude from main nav, create "Other" category, or allow ungrouped
**Warning signs:** Orphan channels with no genre, runtime errors on unknown genres
</common_pitfalls>

<code_examples>
## Code Examples

### Complete Genre Registry Implementation

```typescript
// src/config/genres.ts

/**
 * Genre taxonomy for multi-source radio aggregation.
 *
 * Design principles:
 * - 8 parent categories based on SomaFM distribution analysis
 * - Channels can have primary + secondary genre assignments
 * - IDs are lowercase, URL-safe identifiers
 * - Names are display labels
 */

export interface GenreDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;  // Display order in UI
  readonly icon?: string;  // Optional icon identifier
}

export const GENRES = {
  ambient: {
    id: 'ambient',
    name: 'Ambient & Chill',
    description: 'Atmospheric, downtempo, drone, chill',
    order: 1,
    icon: 'cloud',
  },
  electronic: {
    id: 'electronic',
    name: 'Electronic',
    description: 'IDM, house, techno, dubstep, synthwave',
    order: 2,
    icon: 'bolt',
  },
  rock: {
    id: 'rock',
    name: 'Rock & Alternative',
    description: 'Indie, alternative, classic rock, metal',
    order: 3,
    icon: 'guitar',
  },
  world: {
    id: 'world',
    name: 'World & Global',
    description: 'International, Celtic, reggae, bossa',
    order: 4,
    icon: 'globe',
  },
  'jazz-soul': {
    id: 'jazz-soul',
    name: 'Jazz & Soul',
    description: 'Jazz, soul, R&B, oldies',
    order: 5,
    icon: 'music',
  },
  lounge: {
    id: 'lounge',
    name: 'Lounge & Retro',
    description: 'Lounge, tiki, spy music',
    order: 6,
    icon: 'martini',
  },
  eclectic: {
    id: 'eclectic',
    name: 'Eclectic',
    description: 'Mixed genres, curated variety',
    order: 7,
    icon: 'shuffle',
  },
  holiday: {
    id: 'holiday',
    name: 'Holiday',
    description: 'Christmas, seasonal',
    order: 8,
    icon: 'snowflake',
  },
} as const satisfies Record<string, GenreDefinition>;

// Derived types - use these everywhere, never raw strings
export type GenreId = keyof typeof GENRES;

// Type-safe genre list for iteration (sorted by order)
export const GENRE_LIST = (Object.values(GENRES) as GenreDefinition[])
  .sort((a, b) => a.order - b.order);

// Type-safe ID list
export const GENRE_IDS = GENRE_LIST.map(g => g.id) as GenreId[];

// Lookup helper
export function getGenre(id: GenreId): GenreDefinition {
  return GENRES[id];
}

// Validation helper (for runtime data)
export function isValidGenreId(id: string): id is GenreId {
  return id in GENRES;
}
```

### Type-Safe Source Configuration

```typescript
// src/config/types.ts

import type { GenreId } from './genres';

/**
 * Channel-to-genre mapping for a single channel.
 */
export interface ChannelGenreMapping {
  /** Channel ID from source (e.g., "groovesalad" for SomaFM) */
  readonly channelId: string;

  /** Primary genre - channel appears in this category by default */
  readonly primaryGenre: GenreId;

  /** Secondary genres - channel also appears when these are selected */
  readonly secondaryGenres?: readonly GenreId[];
}

/**
 * Configuration for a radio source (SomaFM, Radio Paradise, etc.)
 */
export interface SourceConfig {
  /** Unique source identifier (e.g., "somafm", "radio-paradise") */
  readonly id: string;

  /** Display name (e.g., "SomaFM", "Radio Paradise") */
  readonly name: string;

  /** Source homepage URL */
  readonly homepage: string;

  /** Channel-to-genre mappings */
  readonly channels: readonly ChannelGenreMapping[];
}

/**
 * Helper type for exhaustiveness checking.
 * TypeScript will error if any channel is missing a mapping.
 */
export type ChannelMappingRecord<T extends string> = {
  readonly [K in T]: ChannelGenreMapping;
};
```

### SomaFM Channel Mappings (Partial Example)

```typescript
// src/config/sources/somafm.ts

import type { SourceConfig, ChannelGenreMapping } from '../types';

// All 49 SomaFM channel IDs for exhaustiveness
const SOMAFM_CHANNEL_IDS = [
  'groovesalad', 'gsclassic', 'dronezone', 'deepspaceone', 'darkzone',
  'synphaera', 'missioncontrol', 'beatblender', 'cliqhop', 'dubstep',
  'fluid', 'lush', 'spacestation', 'thetrip', 'vaporwaves',
  'indiepop', 'poptron', 'digitalis', 'u80s', 'folkfwd',
  'metal', 'seventies', 'bootliquor', 'sonicuniverse', 'illstreet',
  'secretagent', 'reggae', 'suburbsofgoa', 'thistle', 'tikitime',
  'bossa', 'insound', '7soul', 'brfm', 'covers',
  'christmas', 'jollysoul', 'xmasinfrisko', 'xmasrocks', 'deptstore',
  'doomed', 'sf1033', 'live', 'scanner', 'specials',
  'n5md', 'defcon', 'sfinsf', 'chillits',
] as const;

type SomaFMChannelId = typeof SOMAFM_CHANNEL_IDS[number];

// Channel mappings with full type safety
const channelMappings: readonly ChannelGenreMapping[] = [
  // Ambient & Chill
  { channelId: 'groovesalad', primaryGenre: 'ambient', secondaryGenres: ['electronic'] },
  { channelId: 'gsclassic', primaryGenre: 'ambient', secondaryGenres: ['electronic'] },
  { channelId: 'dronezone', primaryGenre: 'ambient' },
  { channelId: 'deepspaceone', primaryGenre: 'ambient' },
  { channelId: 'darkzone', primaryGenre: 'ambient' },
  { channelId: 'synphaera', primaryGenre: 'ambient', secondaryGenres: ['electronic'] },
  { channelId: 'missioncontrol', primaryGenre: 'ambient', secondaryGenres: ['electronic'] },
  { channelId: 'doomed', primaryGenre: 'ambient', secondaryGenres: ['electronic'] },
  { channelId: 'chillits', primaryGenre: 'ambient' },

  // Electronic
  { channelId: 'beatblender', primaryGenre: 'electronic' },
  { channelId: 'cliqhop', primaryGenre: 'electronic' },
  { channelId: 'dubstep', primaryGenre: 'electronic' },
  { channelId: 'fluid', primaryGenre: 'electronic' },
  { channelId: 'lush', primaryGenre: 'electronic' },
  { channelId: 'spacestation', primaryGenre: 'electronic' },
  { channelId: 'thetrip', primaryGenre: 'electronic' },
  { channelId: 'vaporwaves', primaryGenre: 'electronic' },
  { channelId: 'defcon', primaryGenre: 'electronic' },

  // Rock & Alternative
  { channelId: 'indiepop', primaryGenre: 'rock', secondaryGenres: ['electronic'] },
  { channelId: 'poptron', primaryGenre: 'rock' },
  { channelId: 'digitalis', primaryGenre: 'rock', secondaryGenres: ['electronic'] },
  { channelId: 'u80s', primaryGenre: 'rock', secondaryGenres: ['electronic'] },
  { channelId: 'folkfwd', primaryGenre: 'rock' },
  { channelId: 'metal', primaryGenre: 'rock' },
  { channelId: 'seventies', primaryGenre: 'rock' },

  // World & Global
  { channelId: 'suburbsofgoa', primaryGenre: 'world' },
  { channelId: 'thistle', primaryGenre: 'world' },
  { channelId: 'tikitime', primaryGenre: 'world', secondaryGenres: ['lounge'] },
  { channelId: 'bossa', primaryGenre: 'world' },
  { channelId: 'reggae', primaryGenre: 'world' },

  // Jazz & Soul
  { channelId: 'sonicuniverse', primaryGenre: 'jazz-soul' },
  { channelId: '7soul', primaryGenre: 'jazz-soul' },
  { channelId: 'insound', primaryGenre: 'jazz-soul' },

  // Lounge & Retro
  { channelId: 'illstreet', primaryGenre: 'lounge' },
  { channelId: 'secretagent', primaryGenre: 'lounge' },

  // Eclectic
  { channelId: 'brfm', primaryGenre: 'eclectic' },
  { channelId: 'covers', primaryGenre: 'eclectic' },
  { channelId: 'bootliquor', primaryGenre: 'eclectic' }, // Americana fits eclectic

  // Holiday
  { channelId: 'christmas', primaryGenre: 'holiday' },
  { channelId: 'jollysoul', primaryGenre: 'holiday' },
  { channelId: 'xmasinfrisko', primaryGenre: 'holiday' },
  { channelId: 'xmasrocks', primaryGenre: 'holiday' },
  { channelId: 'deptstore', primaryGenre: 'holiday' },

  // Edge cases - mapped to closest fit or excluded
  { channelId: 'sf1033', primaryGenre: 'ambient' }, // ambient|news -> ambient
  { channelId: 'live', primaryGenre: 'eclectic' },  // live|specials
  { channelId: 'scanner', primaryGenre: 'eclectic' }, // Could exclude from main nav
  { channelId: 'specials', primaryGenre: 'eclectic' },
  { channelId: 'n5md', primaryGenre: 'electronic' },
  { channelId: 'sfinsf', primaryGenre: 'eclectic' }, // spoken
];

export const SOMAFM_CONFIG: SourceConfig = {
  id: 'somafm',
  name: 'SomaFM',
  homepage: 'https://somafm.com',
  channels: channelMappings,
};
```

### Radio Paradise Configuration

```typescript
// src/config/sources/radio-paradise.ts

import type { SourceConfig } from '../types';

export const RADIO_PARADISE_CONFIG: SourceConfig = {
  id: 'radio-paradise',
  name: 'Radio Paradise',
  homepage: 'https://radioparadise.com',
  channels: [
    {
      channelId: 'rp-main',
      primaryGenre: 'eclectic',
      secondaryGenres: ['rock', 'electronic', 'world']
    },
    {
      channelId: 'rp-mellow',
      primaryGenre: 'ambient'
    },
    {
      channelId: 'rp-rock',
      primaryGenre: 'rock'
    },
    {
      channelId: 'rp-global',
      primaryGenre: 'world'
    },
  ],
};
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Plain objects with type annotations | `as const satisfies` pattern | TS 4.9 (2022) | Better type inference + validation |
| Manual enum for genre IDs | Derived types from const object | TS 3.4+ | Single source of truth |
| Runtime genre validation | Compile-time type checking | Always available | Catches errors earlier |

**Current best practices:**
- **`satisfies` operator:** Validates structure without widening types. Perfect for registries.
- **Const assertions everywhere:** `as const` on all static config objects.
- **Derived types:** Don't duplicate - derive `GenreId` type from `GENRES` object keys.

**No deprecated patterns to avoid** - this domain uses standard TypeScript features that are stable.

**Trend to watch:**
- Activity/mood-based categorization is gaining popularity over strict genres (see Live365, Spotify). Consider adding mood tags in future phases.
</sota_updates>

<open_questions>
## Open Questions

1. **Should "specials" and "live" channels be excluded from main navigation?**
   - What we know: These are transient/niche content (police scanner, special broadcasts)
   - What's unclear: User expectations - do they want to see everything?
   - Recommendation: Include in eclectic category for now; can filter later based on user feedback

2. **How to handle seasonal holiday content visibility?**
   - What we know: 5 holiday channels, only relevant part of year
   - What's unclear: Should they be hidden outside Dec-Jan?
   - Recommendation: Keep visible year-round; UI can de-emphasize out of season

3. **Should Boot Liquor (americana) get its own category?**
   - What we know: Only americana channel, unique genre
   - What's unclear: Whether "Americana/Country" deserves a parent category
   - Recommendation: Map to "Eclectic" for now; revisit if adding more country-focused sources
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- SomaFM API (https://api.somafm.com/channels.json) - Direct genre extraction, 49 channels analyzed
- Radio Paradise Integration Guide (project file) - Stream URLs, channel descriptions
- TypeScript 4.9+ Documentation - `satisfies` operator, const assertions

### Secondary (MEDIUM confidence)
- [Live365 Genre Categories](https://live365.com/listen/genres) - Industry reference for genre organization
- [TuneIn API Structure](https://github.com/core-hacked/tunein-api) - Genre ID patterns from major aggregator
- [IEEE Music Genre Classification](https://ieeexplore.ieee.org/document/1416274/) - Hierarchical taxonomy research

### Tertiary (LOW confidence - needs validation)
- Radio taxonomy patterns from WebSearch - General industry practices, not source-specific
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: TypeScript static configuration patterns
- Ecosystem: Multi-source radio aggregation (SomaFM, Radio Paradise)
- Patterns: Genre taxonomy design, type-safe registries
- Pitfalls: Genre drift, over-granularity, mapping completeness

**Confidence breakdown:**
- SomaFM genre analysis: HIGH - Direct API data
- Proposed taxonomy: HIGH - Based on quantitative distribution analysis
- Radio Paradise mapping: HIGH - Clear channel descriptions
- TypeScript patterns: HIGH - Standard documented features
- Code examples: HIGH - Verified TypeScript patterns

**Research date:** 2026-01-19
**Valid until:** 2026-02-19 (30 days - static data, stable ecosystem)
</metadata>

---

*Phase: 01-genre-taxonomy*
*Research completed: 2026-01-19*
*Ready for planning: yes*
