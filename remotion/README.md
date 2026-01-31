# Remotion Project Organization

## Directory Structure

```
remotion/
├── assets/              # Source media files (gitignored)
├── output/              # Rendered videos (gitignored)
├── tunr-logo-animations/   # Logo reveal animations (landscape)
│   ├── components/      # Reusable logo animation components
│   └── Animation*.tsx   # Logo animation compositions
├── tunr-ui-animations/  # UI showcase animations (vertical)
│   └── Animation*.tsx   # UI animation compositions
├── Root.tsx             # Composition registry
└── index.ts             # Remotion entry point
```

## Audio Files

Audio files are stored in `public/` (Remotion convention) but gitignored to avoid bloating the repository.

**Current audio files:**
- `audio.mp3` - Main audio track (used by most animations)
- `animation1-audio.mp3` - UI Animation 1 specific audio

## Rendered Outputs

All rendered videos should be saved to `remotion/output/` (gitignored).

## Best Practices

1. **Never commit media files** - They bloat the git repository
2. **Use descriptive names** - Avoid UUID-style filenames
3. **Document audio sources** - Note where audio files came from
4. **Clean up unused assets** - Remove old media files regularly

## Compositions

### UI Animations (1080x1920 vertical)
- Animation1-4: App UI showcase with pan/zoom effects

### Logo Animations (1920x1080 landscape)
- Tunr-Template: Basic template
- Tunr-Logo: Logo display
- Tunr-Reveal: Animated logo reveal (16:9 and 4:3 variants)
- Tunr-CosmicConvergence: Cosmic-themed logo animation
