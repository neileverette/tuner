# Station Artwork Audit

**Date**: 2026-01-25  
**Total Stations**: 72 stations across 4 sources

## Current Artwork Status by Source

### 1. SomaFM (49 channels)
**Artwork Type**: Static channel logos (120px, 240px, 512px PNG files)  
**Quality**: Small logos that look pixelated when enlarged  
**Issue**: These are station branding logos, NOT album art

| Channel ID | Title | Image URL Pattern |
|------------|-------|-------------------|
| groovesalad | Groove Salad | `https://somafm.com/img/groovesalad{120,240,512}.png` |
| gsclassic | Groove Salad Classic | `https://somafm.com/img/gsclassic{120,240,512}.png` |
| dronezone | Drone Zone | `https://somafm.com/img/dronezone{120,240,512}.png` |
| deepspaceone | Deep Space One | `https://somafm.com/img/deepspaceone{120,240,512}.png` |
| darkzone | Dark Zone | `https://somafm.com/img/darkzone{120,240,512}.png` |
| synphaera | Synphaera | `https://somafm.com/img/synphaera{120,240,512}.png` |
| missioncontrol | Mission Control | `https://somafm.com/img/missioncontrol{120,240,512}.png` |
| doomed | Doomed | `https://somafm.com/img/doomed{120,240,512}.png` |
| chillits | Chill Its | `https://somafm.com/img/chillits{120,240,512}.png` |
| beatblender | Beat Blender | `https://somafm.com/img/beatblender{120,240,512}.png` |
| cliqhop | Cliq Hop | `https://somafm.com/img/cliqhop{120,240,512}.png` |
| dubstep | Dub Step | `https://somafm.com/img/dubstep{120,240,512}.png` |
| fluid | Fluid | `https://somafm.com/img/fluid{120,240,512}.png` |
| lush | Lush | `https://somafm.com/img/lush{120,240,512}.png` |
| spacestation | Space Station | `https://somafm.com/img/spacestation{120,240,512}.png` |
| thetrip | The Trip | `https://somafm.com/img/thetrip{120,240,512}.png` |
| vaporwaves | Vaporwaves | `https://somafm.com/img/vaporwaves{120,240,512}.png` |
| defcon | DEF CON | `https://somafm.com/img/defcon{120,240,512}.png` |
| indiepop | Indie Pop | `https://somafm.com/img/indiepop{120,240,512}.png` |
| poptron | PopTron | `https://somafm.com/img/poptron{120,240,512}.png` |
| digitalis | Digitalis | `https://somafm.com/img/digitalis{120,240,512}.png` |
| u80s | Underground 80s | `https://somafm.com/img/u80s{120,240,512}.png` |
| folkfwd | Folk Forward | `https://somafm.com/img/folkfwd{120,240,512}.png` |
| metal | Metal | `https://somafm.com/img/metal{120,240,512}.png` |
| seventies | Seventies | `https://somafm.com/img/seventies{120,240,512}.png` |
| suburbsofgoa | Suburbs of Goa | `https://somafm.com/img/suburbsofgoa{120,240,512}.png` |
| thistle | Thistle | `https://somafm.com/img/thistle{120,240,512}.png` |
| tikitime | Tiki Time | `https://somafm.com/img/tikitime{120,240,512}.png` |
| bossa | Bossa | `https://somafm.com/img/bossa{120,240,512}.png` |
| reggae | Reggae | `https://somafm.com/img/reggae{120,240,512}.png` |
| sonicuniverse | Sonic Universe | `https://somafm.com/img/sonicuniverse{120,240,512}.png` |
| 7soul | Seven Soul | `https://somafm.com/img/7soul{120,240,512}.png` |
| insound | In Sound | `https://somafm.com/img/insound{120,240,512}.png` |
| illstreet | Illinois Street | `https://somafm.com/img/illstreet{120,240,512}.png` |
| secretagent | Secret Agent | `https://somafm.com/img/secretagent{120,240,512}.png` |
| brfm | Black Rock FM | `https://somafm.com/img/brfm{120,240,512}.png` |
| covers | Covers | `https://somafm.com/img/covers{120,240,512}.png` |
| bootliquor | Boot Liquor | `https://somafm.com/img/bootliquor{120,240,512}.png` |
| live | Live | `https://somafm.com/img/live{120,240,512}.png` |
| scanner | Scanner | `https://somafm.com/img/scanner{120,240,512}.png` |
| specials | Specials | `https://somafm.com/img/specials{120,240,512}.png` |
| sfinsf | SF in SF | `https://somafm.com/img/sfinsf{120,240,512}.png` |
| christmas | Christmas | `https://somafm.com/img/christmas{120,240,512}.png` |
| jollysoul | Jolly Soul | `https://somafm.com/img/jollysoul{120,240,512}.png` |
| xmasinfrisko | Xmas in Frisko | `https://somafm.com/img/xmasinfrisko{120,240,512}.png` |
| xmasrocks | Xmas Rocks | `https://somafm.com/img/xmasrocks{120,240,512}.png` |
| deptstore | Dept Store | `https://somafm.com/img/deptstore{120,240,512}.png` |
| sf1033 | SF 10-33 | `https://somafm.com/img/sf1033{120,240,512}.png` |
| n5md | N5MD | `https://somafm.com/img/n5md{120,240,512}.png` |

**Status**: ❌ **ALL 49 CHANNELS NEED FALLBACK REPLACEMENT**  
**Reason**: Static logos look bad when enlarged to hero size

---

### 2. Radio Paradise (4 channels)
**Artwork Type**: Dynamic album art from API  
**Quality**: High quality (cover, cover_med, cover_small)  
**Issue**: None - these work perfectly

| Channel ID | Title | Image URL |
|------------|-------|-----------|
| rp:main | Radio Paradise - Main Mix | `https://img.radioparadise.com/assets/rp-logo.png` (static fallback) |
| rp:mellow | Radio Paradise - Mellow Mix | `https://img.radioparadise.com/assets/rp-logo.png` (static fallback) |
| rp:rock | Radio Paradise - Rock Mix | `https://img.radioparadise.com/assets/rp-logo.png` (static fallback) |
| rp:global | Radio Paradise - Global Mix | `https://img.radioparadise.com/assets/rp-logo.png` (static fallback) |

**Status**: ✅ **GOOD - Dynamic album art via API**  
**Note**: Static logo only used as fallback when no track playing

---

### 3. NTS Radio (18 channels)
**Artwork Type**: Static NTS logo with colored backgrounds  
**Quality**: Logo looks good with custom background colors  
**Issue**: None - custom implementation works well

| Channel ID | Title | Image URL |
|------------|-------|-----------|
| nts:1 | NTS 1 | `https://media.ntslive.co.uk/crop/770x770/...` |
| nts:2 | NTS 2 | `https://media.ntslive.co.uk/crop/770x770/...` |
| nts:poolside | NTS - Poolside | Same logo |
| nts:slow-focus | NTS - Slow Focus | Same logo |
| nts:low-key | NTS - Low Key | Same logo |
| nts:memory-lane | NTS - Memory Lane | Same logo |
| nts:4-to-the-floor | NTS - 4 To The Floor | Same logo |
| nts:island-time | NTS - Island Time | Same logo |
| nts:the-tube | NTS - The Tube | Same logo |
| nts:sheet-music | NTS - Sheet Music | Same logo |
| nts:feelings | NTS - Feelings | Same logo |
| nts:expansions | NTS - Expansions | Same logo |
| nts:rap-house | NTS - Rap House | Same logo |
| nts:labyrinth | NTS - Labyrinth | Same logo |
| nts:sweat | NTS - Sweat | Same logo |
| nts:otaku | NTS - Otaku | Same logo |
| nts:the-pit | NTS - The Pit | Same logo |
| nts:field-recordings | NTS - Field Recordings | Same logo |

**Status**: ✅ **GOOD - Custom colored backgrounds work well**  
**Note**: Already has special handling in HeroArtwork component

---

### 4. KEXP (1 channel)
**Artwork Type**: Static KEXP logo  
**Quality**: High quality SVG logo  
**Issue**: None - custom implementation works well

| Channel ID | Title | Image URL |
|------------|-------|-----------|
| kexp:main | KEXP 90.3 FM | `https://www.kexp.org/static/assets/img/kexp-logo.png` |

**Status**: ✅ **GOOD - Custom logo display works well**  
**Note**: Already has special handling in HeroArtwork component

---

## Summary

### Stations Needing Fallback Replacement

**Total**: 49 stations (all SomaFM channels)

**Problem**: SomaFM uses small station logos (max 512px) that look pixelated and unprofessional when displayed at hero size (full screen background).

**Solution**: Force these stations to use the generated fallback thumbnail system with:
- Colored backgrounds (from existing 12-color palette)
- Station initials (e.g., "GS" for Groove Salad)
- Optional: Enhanced gradients or patterns

### Stations That Are Fine

- **Radio Paradise (4)**: Dynamic album art ✅
- **NTS Radio (18)**: Custom colored backgrounds ✅
- **KEXP (1)**: Custom logo display ✅

---

## Recommended Implementation

### Option 1: Blacklist Approach (Recommended)
Create a list of station IDs that should ALWAYS use fallback thumbnails, regardless of whether they have image URLs.

```typescript
const FORCE_FALLBACK_STATIONS = [
  'somafm:groovesalad',
  'somafm:gsclassic',
  'somafm:dronezone',
  // ... all 49 SomaFM stations
];
```

### Option 2: Source-Based Approach
Force all stations from specific sources to use fallbacks:

```typescript
const FORCE_FALLBACK_SOURCES = ['somafm'];
```

### Option 3: Image Quality Detection
Detect small images (<512px) and force fallback for those.

---

## Next Steps

1. **Choose approach** (Option 2 recommended - simplest)
2. **Update fallback logic** in `thumbnailFallback.ts`
3. **Update components** (`HeroArtwork.tsx`, `ChannelCard.tsx`)
4. **Test visual appearance** of all 49 SomaFM stations
5. **Optional**: Enhance fallback colors/gradients for better aesthetics

---

**Created**: 2026-01-25  
**Status**: Ready for implementation