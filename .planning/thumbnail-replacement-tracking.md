# Thumbnail Replacement Tracking

**Purpose**: Track stations that need system-generated fallback thumbnails instead of their current artwork.

**Date Started**: 2026-01-25

## Instructions
- Review each station in the carousel
- Mark stations that need fallback thumbnails (poor quality, generic icons, etc.)
- Add station ID and reason to the list below
- Update `src/config/artwork-overrides.ts` with approved stations

## Stations Marked for Replacement

### ✅ Already Configured
1. **rb-rautemusik-lounge** - "__LOUNGE__ by RAUTEMUSIK"
   - Reason: Tiny favicon (16x16px), red play button
   - Status: ✅ Configured with magenta gradient, initials "RL"

2. **rb-rautemusik-techno** - "__TECHNO__ by RAUTEMUSIK"  
   - Reason: Tiny favicon (16x16px), red play button
   - Status: ✅ Configured with red gradient, initials "RT"

3. **rb-0-n-chillout** - "0 N - Chillout on Radio"
   - Reason: Generic play button thumbnail
   - Status: ✅ Configured with purple gradient, initials "0C"

4. **rb-0-n-lounge** - "0 N - Lounge on Radio"
   - Reason: Generic play button thumbnail  
   - Status: ✅ Configured with green gradient, initials "0L"

### 🔍 Under Review
(Stations currently being evaluated)

### ❌ Rejected
(Stations that were reviewed but artwork is acceptable)

---

## Current Progress
- **Total Stations**: 112
- **Reviewed**: 4
- **Marked for Replacement**: 4
- **Configured**: 4
- **Remaining**: 108

## Next Steps
1. Continue reviewing stations in carousel
2. Click through each station to see artwork quality
3. Mark stations with poor thumbnails
4. Batch update artwork-overrides.ts when we have 5-10 stations

---

**Last Updated**: 2026-01-25