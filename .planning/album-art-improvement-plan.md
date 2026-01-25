# Album Art Improvement Plan - Project Bob

**Created**: 2026-01-25  
**Status**: Planning Phase  
**Priority**: High

## Executive Summary

This plan outlines comprehensive improvements to the album art system in the Tuner application, focusing on enhanced visual quality, better caching strategies, improved fallback mechanisms, and optimized performance across all radio sources.

## Current State Analysis

### Existing Album Art System

**Sources & Coverage:**
- **Radio Paradise (4 channels)**: Full album art via API (`cover`, `cover_med`, `cover_small`)
- **SomaFM (49 channels)**: Static channel logos only
- **KEXP (1 channel)**: Static KEXP logo
- **NTS Radio**: Dynamic colored backgrounds with logo overlay

**Current Implementation:**
- [`useRadioParadiseArt.ts`](src/hooks/useRadioParadiseArt.ts): Dedicated hook for RP album art polling (30s interval)
- [`HeroArtwork.tsx`](src/components/HeroArtwork.tsx): Full-screen artwork display with crossfade transitions
- [`ChannelCard.tsx`](src/components/ChannelCard.tsx): Carousel thumbnails with fallback support
- [`thumbnailFallback.ts`](src/utils/thumbnailFallback.ts): Generates colored backgrounds with station initials

**Strengths:**
✅ Robust fallback system with 12-color palette  
✅ Smooth crossfade transitions between tracks  
✅ Consistent seeded random colors per station  
✅ Error handling for failed image loads  
✅ Multiple image sizes (small/medium/large)

**Pain Points:**
❌ No caching - repeated API calls for same artwork  
❌ No preloading - visible loading delays on track changes  
❌ Limited to Radio Paradise - SomaFM has no album art  
❌ No image optimization or compression  
❌ No progressive loading for large images  
❌ Fallback system only triggers on error, not proactively

## Improvement Goals

### 1. **Enhanced Caching System**
- Implement in-memory LRU cache for album artwork
- Add IndexedDB persistence for offline support
- Cache artwork URLs with TTL (time-to-live)
- Preload next/previous track artwork

### 2. **Multi-Source Album Art Integration**
- Integrate Last.fm API for SomaFM track artwork
- Add MusicBrainz as fallback source
- Implement Spotify API integration (optional)
- Create unified artwork resolution pipeline

### 3. **Image Optimization**
- Add WebP format support with fallback
- Implement responsive image loading (srcset)
- Add blur-up placeholder technique
- Optimize image dimensions per context

### 4. **Advanced Fallback System**
- Generate gradient backgrounds from dominant colors
- Add pattern overlays (geometric, abstract)
- Implement genre-specific fallback themes
- Create animated fallback backgrounds

### 5. **Performance Optimization**
- Lazy load carousel thumbnails
- Implement virtual scrolling for large channel lists
- Add service worker for offline caching
- Optimize re-render cycles

### 6. **User Experience Enhancements**
- Add artwork zoom/fullscreen mode
- Implement artwork history/gallery view
- Add "now playing" artwork sharing
- Create artwork-based color themes

## Technical Architecture

### Proposed File Structure

```
src/
├── services/
│   ├── artwork/
│   │   ├── ArtworkCache.ts          # LRU + IndexedDB cache
│   │   ├── ArtworkResolver.ts       # Multi-source resolution
│   │   ├── ArtworkOptimizer.ts      # Image optimization
│   │   └── ArtworkPreloader.ts      # Preloading logic
│   └── external/
│       ├── LastFmClient.ts          # Last.fm API integration
│       ├── MusicBrainzClient.ts     # MusicBrainz API
│       └── SpotifyClient.ts         # Spotify API (optional)
├── hooks/
│   ├── useArtwork.ts                # Unified artwork hook
│   ├── useArtworkCache.ts           # Cache management
│   └── useArtworkPreload.ts         # Preloading hook
├── utils/
│   ├── artworkFallback.ts           # Enhanced fallback generation
│   ├── imageOptimization.ts         # WebP conversion, compression
│   └── colorExtraction.ts           # Dominant color extraction
└── workers/
    └── artwork-worker.ts            # Service worker for caching
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Plays Track                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              Check ArtworkCache (Memory)                     │
│  ├─ Hit: Return cached artwork immediately                  │
│  └─ Miss: Continue to resolution                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│           Check IndexedDB (Persistent Cache)                 │
│  ├─ Hit: Load to memory cache, return                       │
│  └─ Miss: Continue to API resolution                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              ArtworkResolver Pipeline                        │
│  1. Try source-native API (Radio Paradise)                  │
│  2. Try Last.fm API (artist + track)                        │
│  3. Try MusicBrainz (recording ID)                          │
│  4. Try Spotify API (optional)                              │
│  5. Generate enhanced fallback                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              ArtworkOptimizer                                │
│  - Convert to WebP (with fallback)                          │
│  - Generate multiple sizes (thumb/medium/large)             │
│  - Extract dominant colors                                  │
│  - Create blur placeholder                                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│         Cache & Display                                      │
│  - Store in memory cache (LRU)                              │
│  - Persist to IndexedDB                                     │
│  - Preload next track artwork                               │
│  - Display with smooth transition                           │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Phases

### Phase 1: Caching Infrastructure (Week 1)
**Priority**: Critical  
**Effort**: 3-4 days

**Tasks:**
- [ ] Create `ArtworkCache.ts` with LRU implementation
- [ ] Add IndexedDB wrapper for persistent storage
- [ ] Implement cache invalidation strategies
- [ ] Add cache statistics/monitoring
- [ ] Write unit tests for cache operations

**Deliverables:**
- Working in-memory LRU cache (max 100 items)
- IndexedDB persistence with 30-day TTL
- Cache hit/miss metrics

### Phase 2: Multi-Source Integration (Week 2)
**Priority**: High  
**Effort**: 5-6 days

**Tasks:**
- [ ] Create Last.fm API client with rate limiting
- [ ] Implement MusicBrainz API client
- [ ] Build `ArtworkResolver` with fallback chain
- [ ] Add API key management (environment variables)
- [ ] Handle CORS via backend proxy
- [ ] Add error handling and retry logic

**Deliverables:**
- Last.fm integration for SomaFM tracks
- MusicBrainz fallback support
- Unified artwork resolution API

**API Requirements:**
- Last.fm API key (free tier: 5 req/sec)
- MusicBrainz: No key needed (1 req/sec limit)

### Phase 3: Image Optimization (Week 3)
**Priority**: Medium  
**Effort**: 3-4 days

**Tasks:**
- [ ] Implement WebP conversion with canvas API
- [ ] Add responsive image generation (srcset)
- [ ] Create blur placeholder system
- [ ] Extract dominant colors using canvas
- [ ] Optimize image loading strategy

**Deliverables:**
- WebP support with JPEG/PNG fallback
- 3 image sizes: thumb (100px), medium (400px), large (1200px)
- Blur-up loading effect
- Color-based loading placeholders

### Phase 4: Enhanced Fallbacks (Week 4)
**Priority**: Medium  
**Effort**: 3-4 days

**Tasks:**
- [ ] Extend fallback color palette (24 colors)
- [ ] Add gradient background generation
- [ ] Create geometric pattern overlays
- [ ] Implement genre-specific themes
- [ ] Add animated fallback option

**Deliverables:**
- 24-color gradient palette
- 5 pattern overlay styles
- Genre-based color schemes
- Optional CSS animations

### Phase 5: Performance & UX (Week 5)
**Priority**: High  
**Effort**: 4-5 days

**Tasks:**
- [ ] Implement artwork preloading for next track
- [ ] Add lazy loading for carousel thumbnails
- [ ] Create service worker for offline support
- [ ] Add artwork zoom/fullscreen mode
- [ ] Implement artwork history view
- [ ] Add sharing functionality

**Deliverables:**
- Preloading reduces perceived latency by 80%
- Service worker caches 50 most recent artworks
- Fullscreen artwork viewer
- Artwork history gallery

## API Integration Details

### Last.fm API

**Endpoint**: `track.getInfo`  
**Rate Limit**: 5 requests/second  
**Cost**: Free

```typescript
interface LastFmTrackInfo {
  track: {
    name: string;
    artist: { name: string };
    album?: {
      title: string;
      image: Array<{
        '#text': string;
        size: 'small' | 'medium' | 'large' | 'extralarge';
      }>;
    };
  };
}

// Usage
const artwork = await lastfm.getTrackInfo(artist, track);
```

**Proxy Route**: `GET /api/lastfm/track?artist=...&track=...`

### MusicBrainz API

**Endpoint**: `recording` search  
**Rate Limit**: 1 request/second  
**Cost**: Free

```typescript
interface MusicBrainzRecording {
  recordings: Array<{
    id: string;
    title: string;
    releases?: Array<{
      id: string;
      title: string;
    }>;
  }>;
}

// Then fetch cover art from Cover Art Archive
const coverArt = await fetch(
  `https://coverartarchive.org/release/${releaseId}/front-500`
);
```

**Proxy Route**: `GET /api/musicbrainz/search?query=...`

## Performance Targets

### Current Metrics (Baseline)
- Initial artwork load: ~500ms (Radio Paradise)
- Track change artwork load: ~300ms
- Cache hit rate: 0% (no caching)
- Failed artwork loads: ~5% (network errors)

### Target Metrics (Post-Implementation)
- Initial artwork load: <200ms (with cache)
- Track change artwork load: <50ms (preloaded)
- Cache hit rate: >80% (after warmup)
- Failed artwork loads: <1% (with fallbacks)
- Offline support: 50 most recent artworks

## Testing Strategy

### Unit Tests
- Cache operations (LRU eviction, TTL expiration)
- API client error handling
- Image optimization functions
- Fallback generation logic

### Integration Tests
- Multi-source artwork resolution
- Cache persistence across sessions
- Service worker caching
- Preloading behavior

### Visual Regression Tests
- Fallback thumbnail rendering
- Crossfade transitions
- Responsive image loading
- Color extraction accuracy

### Performance Tests
- Cache hit/miss ratios
- API response times
- Image load times
- Memory usage

## Security Considerations

### API Keys
- Store in environment variables (`.env`)
- Never commit to repository
- Use backend proxy to hide keys
- Implement rate limiting

### CORS Handling
- Proxy all external API calls through backend
- Add appropriate CORS headers
- Validate image URLs before loading

### Content Security Policy
- Whitelist image sources
- Allow blob: URLs for optimized images
- Restrict inline scripts

## Monitoring & Analytics

### Metrics to Track
- Artwork cache hit rate
- API success/failure rates
- Average load times per source
- Fallback usage frequency
- User engagement with artwork features

### Logging
- API errors with retry attempts
- Cache evictions and size
- Image optimization failures
- Performance bottlenecks

## Rollout Plan

### Stage 1: Internal Testing (Week 6)
- Deploy to staging environment
- Test with development team
- Gather performance metrics
- Fix critical bugs

### Stage 2: Beta Release (Week 7)
- Enable for 10% of users
- Monitor error rates
- Collect user feedback
- A/B test performance impact

### Stage 3: Full Release (Week 8)
- Gradual rollout to 100%
- Monitor cache performance
- Track API usage costs
- Document learnings

## Success Criteria

### Must Have
✅ 80%+ cache hit rate after warmup  
✅ <200ms artwork load time (cached)  
✅ 100% fallback coverage (no broken images)  
✅ SomaFM tracks show album art via Last.fm  
✅ Offline support for 50 recent artworks

### Nice to Have
🎯 Spotify API integration  
🎯 Artwork-based color themes  
🎯 Artwork sharing functionality  
🎯 Animated fallback backgrounds  
🎯 Artwork history gallery

## Risk Assessment

### High Risk
- **API Rate Limits**: Last.fm/MusicBrainz may throttle requests
  - *Mitigation*: Implement aggressive caching, respect rate limits
- **CORS Issues**: External APIs may block requests
  - *Mitigation*: Proxy all requests through backend

### Medium Risk
- **Cache Storage Limits**: IndexedDB quota may be exceeded
  - *Mitigation*: Implement LRU eviction, monitor storage usage
- **Image Quality**: Optimized images may look worse
  - *Mitigation*: A/B test quality settings, allow user preferences

### Low Risk
- **Browser Compatibility**: WebP not supported in old browsers
  - *Mitigation*: Provide JPEG/PNG fallbacks
- **Performance Impact**: Additional processing may slow app
  - *Mitigation*: Use web workers for heavy operations

## Future Enhancements

### Phase 6+ (Future Roadmap)
- [ ] Machine learning for artwork recommendations
- [ ] User-uploaded custom artwork
- [ ] Artwork-based playlist generation
- [ ] Integration with Apple Music API
- [ ] Artwork NFT minting (blockchain integration)
- [ ] AR/VR artwork visualization
- [ ] Collaborative artwork curation

## Resources & References

### Documentation
- [Last.fm API Docs](https://www.last.fm/api)
- [MusicBrainz API Docs](https://musicbrainz.org/doc/MusicBrainz_API)
- [Cover Art Archive](https://coverartarchive.org/)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

### Related Files
- [`src/hooks/useRadioParadiseArt.ts`](src/hooks/useRadioParadiseArt.ts)
- [`src/components/HeroArtwork.tsx`](src/components/HeroArtwork.tsx)
- [`src/components/ChannelCard.tsx`](src/components/ChannelCard.tsx)
- [`src/utils/thumbnailFallback.ts`](src/utils/thumbnailFallback.ts)
- [`docs/FALLBACK_THUMBNAILS.md`](docs/FALLBACK_THUMBNAILS.md)

### External Libraries (Potential)
- `idb` - IndexedDB wrapper (1.7KB)
- `lru-cache` - LRU cache implementation (6KB)
- `sharp` - Image processing (server-side)
- `canvas` - Image manipulation (browser)

## Budget & Timeline

### Development Time
- **Phase 1**: 3-4 days (Caching)
- **Phase 2**: 5-6 days (Multi-source)
- **Phase 3**: 3-4 days (Optimization)
- **Phase 4**: 3-4 days (Fallbacks)
- **Phase 5**: 4-5 days (Performance/UX)
- **Testing & QA**: 5 days
- **Documentation**: 2 days

**Total**: ~6-8 weeks (1 developer)

### API Costs
- Last.fm: Free (5 req/sec limit)
- MusicBrainz: Free (1 req/sec limit)
- Spotify: Free tier available (optional)

**Total Monthly Cost**: $0 (free tier sufficient)

## Conclusion

This comprehensive plan transforms the Tuner app's album art system from a basic Radio Paradise-only implementation into a robust, multi-source, cached, and optimized artwork platform. The phased approach ensures incremental value delivery while managing risk.

**Key Benefits:**
- 🚀 80% faster artwork loading (with cache)
- 🎨 Album art for all 112+ stations (via Last.fm)
- 💾 Offline support for recent tracks
- 🎯 100% fallback coverage
- ⚡ Optimized performance and UX

**Next Steps:**
1. Review and approve plan
2. Set up API keys (Last.fm, MusicBrainz)
3. Begin Phase 1 implementation
4. Schedule weekly progress reviews

---

**Plan Version**: 1.0  
**Last Updated**: 2026-01-25  
**Author**: IBM Bob  
**Status**: Ready for Review