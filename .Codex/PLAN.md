# Startup Artwork Flash Bug - Plan

## Goal
Prevent the red play-button graphic from flashing on initial load. Keep the ability to remember the last station/cover, but default to a dark background until a safe image is ready.

## Current Cause
- `currentImage` is loaded from localStorage (`tuner-current-image`) before channels are ready.
- `SplashScreen` and `HeroArtwork` immediately render that image.
- If the saved image is a low-quality favicon (common in radio-browser sources), it renders full-screen and looks awful.

## Option Selected
Option 1: Remember last cover, but gate rendering until the image is validated and the selected channel is loaded.

## Plan
1) Define a “safe image” rule
   - Block favicon-style URLs (e.g., contains `favicon`, ends in `.ico`, known favicon hosts).
   - Optionally ensure it matches the selected channel’s artwork.
2) Gate initial rendering
   - Start with a dark background (no splash background image) until a safe image is available.
   - Only allow `currentImage` to render after `selectedChannel` is loaded and the image passes validation.
3) Keep persistence but avoid bad flash
   - Continue saving `tuner-selected-channel-id`.
   - Continue saving `tuner-current-image`, but do not use it until it passes the safety check.

## Likely Code Touchpoints (no edits yet)
- `src/App.tsx` (initial `currentImage` state, splash/hero rendering, channel load effect)
- `src/components/SplashScreen.tsx` (backgroundImage behavior when empty)
- `src/components/HeroArtwork.tsx` (render gating if no safe image)
- Optional: `src/utils/thumbnailFallback.ts` or new helper for image validation

## Open Decisions
- Safe image rule: block any URL containing `favicon` or `.ico` vs. allowlist of trusted domains.
- Should the last cover only render if it belongs to the saved station ID?

## Minimal Test Checklist
- Cold load with empty localStorage → dark background, no red flash.
- Reload with stored image → only renders if valid.
- Stations with known low-quality icons do not flash full-screen.

