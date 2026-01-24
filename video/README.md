# Tuner Promo Video

Apple-style promotional video for Tuner, using Playwright to capture your live app and Remotion to add camera effects.

## How It Works

1. **Playwright** opens your app in a browser and captures frames while performing scripted interactions
2. **Remotion** stitches the frames into a video with smooth camera pans, zooms, and optional text overlays

## Quick Start

```bash
cd video
npm install
npx playwright install chromium
```

## Workflow

### 1. Start your app
In a separate terminal:
```bash
cd ..  # Back to Tuner root
npm run dev
```

### 2. Capture frames
```bash
npm run capture
```

This opens your app, runs through the scripted scenes, and saves frames to `public/frames/`.

### 3. Preview in Remotion Studio
```bash
npm run studio
```

Scrub through the timeline, adjust camera effects, preview at any frame.

### 4. Render final video
```bash
npm run build
```

Output: `out/tuner-promo.mp4`

## Customizing the Video

### Edit scenes (`src/capture.ts`)

Each scene defines what happens:

```typescript
{
  name: "carousel-browse",
  durationMs: 5000,  // How long to capture
  action: async (page, frameInScene) => {
    // Press arrow key every second
    if (frameInScene % 30 === 0) {
      await page.keyboard.press("ArrowRight");
    }
  },
}
```

**Common actions:**
- `page.keyboard.press("ArrowRight")` - Navigate
- `page.keyboard.press("Space")` - Play/pause
- `page.click(".station-count")` - Open station picker
- `page.fill('input', "jazz")` - Type in search
- `page.waitForTimeout(500)` - Pause

### Edit camera effects (`src/FrameSequence.tsx`)

Add smooth panning and zooming:

```typescript
{
  startFrame: 90,
  endFrame: 210,
  fromX: -30,      // Start 30px left
  toX: 30,         // End 30px right
  fromScale: 1.05, // Start zoomed in
  toScale: 1.0,    // End at normal
}
```

### Add text callouts

```tsx
<Sequence from={210} durationInFrames={90}>
  <Callout text="Browse 50+ stations" position="bottom" />
</Sequence>
```

## Iteration Workflow

1. Run `npm run capture`
2. Preview with `npm run studio`
3. Tell me what to change:
   - "Make the carousel browsing slower"
   - "Add a zoom into the play button"
   - "Hold longer on the station picker"
   - "Add a callout that says 'Keyboard first'"
4. I update the script
5. Repeat until you're happy!

## Compositions

| ID | Description |
|---|---|
| `TunerPromo` | Main 1920x1080 video |
| `TunerPromoWithCallouts` | With text overlays |
| `TunerPromoSquare` | 1080x1080 for social |

Render specific composition:
```bash
npx remotion render TunerPromoSquare out/tuner-square.mp4
```

## Tips

- Set `headless: false` in capture.ts to watch the browser during capture
- Increase `deviceScaleFactor` for higher quality (but larger files)
- Camera effects use spring physics - lower `damping` = more bounce
