# Contributing to Tuner

This guide explains how to add new streaming sources to Tuner.

## Architecture Overview

Tuner uses an **adapter pattern** to support multiple streaming sources. Each source has:

1. **Adapter** - Implements the `SourceAdapter` interface to fetch channels and now-playing data
2. **Proxy Routes** - Server-side routes to handle CORS and stream proxying
3. **Type Definition** - Source type added to the `SourceType` union
4. **Registry Entry** - Adapter registered in the `SourceRegistry`

## Adding a New Source

### Step 1: Add Source Type

Edit `src/types/channel.ts` to add your source to the `SourceType` union:

```typescript
export type SourceType = 'somafm' | 'radioparadise' | 'newsource';
```

### Step 2: Create the Adapter

Create a new file `src/adapters/NewSourceAdapter.ts`:

```typescript
import type { SourceAdapter, AdapterConfig } from '../types/adapter';
import type { Channel, NowPlaying, SourceType } from '../types/channel';

const config: AdapterConfig = {
  enabled: true,
  pollInterval: 15000,  // Now-playing poll interval in ms
  proxyBaseUrl: '/api/newsource',
  apiBaseUrl: 'https://api.newsource.com',
};

export class NewSourceAdapter implements SourceAdapter {
  readonly source: SourceType = 'newsource';
  readonly name = 'New Source';
  readonly config = config;

  async fetchChannels(): Promise<Channel[]> {
    // Fetch channel list from API or return static list
    // Return normalized Channel objects
  }

  async fetchNowPlaying(channelId: string): Promise<NowPlaying | null> {
    // Fetch current track for the given channel
    // channelId is the ID without source prefix (e.g., 'main' not 'newsource:main')
  }

  getStreamUrl(channel: Channel, preferredFormat?: 'mp3' | 'aac' | 'flac'): string {
    // Return the proxy URL for streaming
    // Example: `/api/newsource/stream/${channel.sourceId}`
  }
}
```

### Step 3: Add Proxy Routes

Edit `server/index.js` to add routes for your source:

```javascript
// New Source stream proxy
app.get('/api/newsource/stream/:channelId', async (req, res) => {
  const { channelId } = req.params;
  const streamUrl = `https://stream.newsource.com/${channelId}`;

  try {
    const response = await fetch(streamUrl);
    res.set('Content-Type', response.headers.get('content-type'));
    response.body.pipe(res);
  } catch (error) {
    res.status(500).send('Stream error');
  }
});

// New Source now-playing API proxy
app.get('/api/newsource/now-playing/:channelId', async (req, res) => {
  const { channelId } = req.params;
  const apiUrl = `https://api.newsource.com/now-playing/${channelId}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'API error' });
  }
});
```

### Step 4: Register the Adapter

Edit `src/services/SourceRegistry.ts` to register your adapter:

```typescript
import { NewSourceAdapter } from '../adapters/NewSourceAdapter';

export function createDefaultRegistry(): SourceRegistry {
  const registry = new SourceRegistry();
  registry.registerAdapter(new SomaFMAdapter());
  registry.registerAdapter(new RadioParadiseAdapter());
  registry.registerAdapter(new NewSourceAdapter());  // Add this
  return registry;
}
```

### Step 5: Update Poll Intervals (Optional)

If your source has rate limits, update `src/hooks/useNowPlaying.ts`:

```typescript
const POLL_INTERVALS: Record<SourceType, number> = {
  somafm: 10000,
  radioparadise: 30000,
  newsource: 20000,  // Add your source's interval
};
```

## Channel ID Convention

Channel IDs must be prefixed with the source identifier:

- SomaFM: `somafm:groovesalad`, `somafm:defcon`
- Radio Paradise: `rp:main`, `rp:mellow`
- Your source: `newsource:channelname`

The prefix is used to route requests to the correct adapter.

## Testing Requirements

Create tests for your adapter in `src/adapters/NewSourceAdapter.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { NewSourceAdapter } from './NewSourceAdapter';

describe('NewSourceAdapter', () => {
  it('should have correct source type', () => {
    const adapter = new NewSourceAdapter();
    expect(adapter.source).toBe('newsource');
  });

  it('should fetch channels', async () => {
    const adapter = new NewSourceAdapter();
    const channels = await adapter.fetchChannels();
    expect(channels.length).toBeGreaterThan(0);
    expect(channels[0].source).toBe('newsource');
  });

  it('should return correct stream URL', () => {
    const adapter = new NewSourceAdapter();
    const channel = { sourceId: 'main', /* ... */ };
    const url = adapter.getStreamUrl(channel);
    expect(url).toContain('/api/newsource/stream/main');
  });
});
```

Run tests with:

```bash
npx vitest run
```

## Code Style

- Use TypeScript with strict mode
- Follow existing patterns in the codebase
- Document public interfaces with JSDoc comments
- Handle errors gracefully (return `null` for now-playing failures)
- Respect source API rate limits

## Checklist

Before submitting a PR for a new source:

- [ ] Added source type to `SourceType` union
- [ ] Created adapter implementing `SourceAdapter` interface
- [ ] Added proxy routes in `server/index.js`
- [ ] Registered adapter in `SourceRegistry`
- [ ] Updated poll intervals if source has rate limits
- [ ] Written tests for the adapter
- [ ] All tests pass (`npx vitest run`)
- [ ] Build succeeds (`npm run build`)
- [ ] Manual testing in browser works

## Questions?

Open an issue for discussion before starting work on a new source integration.
