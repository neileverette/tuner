# Artwork Override System - Implementation Summary

**Date**: 2026-01-25  
**Status**: ✅ Implemented

## Overview

Created a flexible system to force specific stations to use generated fallback thumbnails instead of their poor-quality artwork (e.g., tiny favicons, small logos).

## What Was Built

### 1. Configuration System
**File**: [`src/config/artwork-overrides.ts`](src/config/artwork-overrides.ts)

- Central configuration for stations needing artwork overrides
- Separate control for thumbnail (carousel) vs cover (hero) artwork
- Support for custom colors, initials, and style variants
- Helper functions for easy integration

**Current Configured Stations**:
- ✅ `rb-rautemusik-lounge` - "__LOUNGE__ by rautemusik"
- ✅ `rb-rautemusik-techno` - "__TECHNO__ by rautemusik.fm"

Both using gradient style fallbacks (reason: tiny 16x16px favicon.ico)

### 2. Enhanced Fallback Utility
**File**: [`src/utils/thumbnailFallback.ts`](src/utils/thumbnailFallback.ts)

**Changes**:
- Integrated with artwork override system
- Added `isHeroView` parameter to distinguish thumbnail vs cover
- Support for custom colors and initials from config
- Added `style` property to FallbackThumbnail interface

**New Function Signature**:
```typescript
generateFallbackThumbnail(
  stationId: string,
  stationName: string,
  imageUrl: string | null | undefined,
  isHeroView: boolean = false  // NEW
): FallbackThumbnail
```

### 3. Component Updates

#### ChannelCard Component
**File**: [`src/components/ChannelCard.tsx`](src/components/ChannelCard.tsx)

- Updated to pass `isHeroView: false` for carousel thumbnails
- Automatically uses fallback for configured stations

#### HeroArtwork Component  
**File**: [`src/components/HeroArtwork.tsx`](src/components/HeroArtwork.tsx)

- Updated to pass `isHeroView: true` for hero artwork
- Added style class support (`hero-fallback-gradient`, `hero-fallback-pattern`)
- Dynamic CSS variables for gradient colors

### 4. CSS Styling
**File**: [`src/App.css`](src/App.css)

**New Styles**:
- `.hero-fallback-gradient` - Diagonal gradient background
- `.hero-fallback-pattern` - Subtle diagonal stripe pattern overlay
- CSS custom properties for dynamic gradient colors

## How It Works

### Flow Diagram

```
User selects station
        ↓
Component calls generateFallbackThumbnail()
        ↓
Check artwork-overrides.ts config
        ↓
Is station configured? ──NO──→ Use default behavior
        ↓ YES                    (show image or fallback on error)
        ↓
Force fallback = true
        ↓
Apply custom settings:
  - Custom color (if set)
  - Custom initials (if set)  
  - Style variant (solid/gradient/pattern)
        ↓
Render fallback thumbnail with style
```

## Adding New Stations

To add more stations with bad artwork, simply add to the array in [`artwork-overrides.ts`](src/config/artwork-overrides.ts):

```typescript
export const ARTWORK_OVERRIDES: ArtworkOverride[] = [
  // Existing stations...
  {
    stationId: 'somafm:groovesalad',  // Station ID
    forceFallbackThumbnail: true,      // Force in carousel
    forceFallbackCover: true,          // Force in hero view
    style: 'gradient',                 // Style variant
    customColor: '#1a5f3e',           // Optional: override color
    customInitials: 'GS',             // Optional: override initials
    reason: 'Small logo looks pixelated when enlarged',
  },
];
```

## Style Variants

### 1. Solid (default)
- Single solid background color
- Simple gradient overlay for depth
- Clean, minimal look

### 2. Gradient
- Diagonal gradient from base color to darker variant
- Enhanced overlay for more depth
- Modern, dynamic appearance

### 3. Pattern
- Solid background with subtle diagonal stripes
- Adds texture without being distracting
- Professional, sophisticated look

## Configuration Options

```typescript
interface ArtworkOverride {
  stationId: string;                    // Required: Station ID
  forceFallbackThumbnail: boolean;      // Force in carousel (100x100px)
  forceFallbackCover: boolean;          // Force in hero (full screen)
  customColor?: string;                 // Optional: hex color
  customInitials?: string;              // Optional: 2 letters
  style?: 'solid' | 'gradient' | 'pattern';  // Optional: style
  reason?: string;                      // Optional: documentation
}
```

## Testing

### Manual Testing Steps

1. **Start the app**:
   ```bash
   npm run dev
   ```

2. **Navigate to rautemusik stations**:
   - Find "__LOUNGE__ by rautemusik" in station list
   - Find "__TECHNO__ by rautemusik.fm" in station list

3. **Verify carousel thumbnails**:
   - Should show colored fallback with initials
   - Should NOT show tiny favicon
   - Should have gradient background

4. **Verify hero artwork**:
   - Select each station
   - Should show full-screen gradient fallback
   - Should display station initials in large text
   - Should have smooth gradient effect

### Expected Results

**Before**: Tiny 16x16px favicon.ico stretched and pixelated  
**After**: Beautiful gradient fallback with station initials

## Future Enhancements

### Easy Additions
- [ ] Add more rautemusik stations (they all use favicons)
- [ ] Add all 49 SomaFM stations (small logos)
- [ ] Create genre-specific color schemes
- [ ] Add animated gradient option

### Advanced Features
- [ ] Auto-detect small images (<100px) and force fallback
- [ ] Generate gradients from genre colors
- [ ] Add more pattern variants (dots, waves, geometric)
- [ ] User preference to override any station artwork

## Files Modified

1. ✅ Created: `src/config/artwork-overrides.ts` (99 lines)
2. ✅ Modified: `src/utils/thumbnailFallback.ts` (added override integration)
3. ✅ Modified: `src/components/ChannelCard.tsx` (added isHeroView param)
4. ✅ Modified: `src/components/HeroArtwork.tsx` (added style support)
5. ✅ Modified: `src/App.css` (added gradient/pattern styles)

## Benefits

✅ **Centralized Configuration** - All overrides in one file  
✅ **Flexible Control** - Separate thumbnail vs cover settings  
✅ **Easy to Extend** - Just add to array, no code changes  
✅ **Visual Consistency** - Professional fallbacks for all stations  
✅ **Better UX** - No more pixelated favicons or tiny logos  

## Next Steps

1. Test the implementation with the two rautemusik stations
2. Verify gradient style looks good in both carousel and hero views
3. Add more stations as needed (suggest starting with SomaFM)
4. Consider adding custom colors for specific stations/genres

---

**Implementation Complete**: 2026-01-25  
**Ready for Testing**: Yes  
**Breaking Changes**: None (backward compatible)