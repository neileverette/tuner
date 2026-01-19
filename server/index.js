import express from 'express';
import cors from 'cors';
import http from 'http';
import https from 'https';
import { createRequire } from 'module';

// Import compiled TypeScript config (CommonJS modules)
const require = createRequire(import.meta.url);
const { aggregateByGenre, aggregateBySource } = require('../dist/config/aggregation');

const app = express();
app.use(cors());
app.use(express.json());

// Radio Paradise stream URL mappings
const RP_STREAM_PATHS = {
  'rp-main': { aac: 'aac-320', flac: 'flac', mp3: 'mp3-128' },
  'rp-mellow': { aac: 'mellow-320', flac: 'mellow-flac', mp3: 'mellow-128' },
  'rp-rock': { aac: 'rock-320', flac: 'rock-flac', mp3: 'rock-128' },
  'rp-global': { aac: 'global-320', flac: 'global-flac', mp3: 'global-128' }
};

const RP_CONTENT_TYPES = {
  aac: 'audio/aac',
  flac: 'audio/flac',
  mp3: 'audio/mpeg'
};

/**
 * GET /api/channels
 *
 * Returns all channels organized by genre (default) or by source.
 *
 * Query parameters:
 *   view: 'genre' (default) | 'source'
 *
 * Response shapes:
 *   genre view: { view: 'genre', genres: [{ id, name, channels: [...] }] }
 *   source view: { view: 'source', sources: [{ id, name, genres: [...] }] }
 */
app.get('/api/channels', (req, res) => {
  const view = req.query.view || 'genre';

  try {
    if (view === 'source') {
      res.json(aggregateBySource());
    } else {
      res.json(aggregateByGenre());
    }
  } catch (err) {
    console.error('Channels API error:', err);
    res.status(500).json({ error: 'Failed to aggregate channels' });
  }
});

// Proxy Radio Paradise streams
app.get('/api/rp/stream/:channelId/:format', (req, res) => {
  const { channelId, format } = req.params;

  // Validate channel and format
  if (!RP_STREAM_PATHS[channelId]) {
    return res.status(400).json({ error: 'Invalid channel. Valid: rp-main, rp-mellow, rp-rock, rp-global' });
  }
  if (!RP_CONTENT_TYPES[format]) {
    return res.status(400).json({ error: 'Invalid format. Valid: aac, flac, mp3' });
  }

  const streamPath = RP_STREAM_PATHS[channelId][format];
  const streamUrl = `http://stream.radioparadise.com/${streamPath}`;

  console.log('Proxying Radio Paradise stream:', streamUrl);

  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
  };

  // Use http (not https) for Radio Paradise streams
  http.get(streamUrl, options, (streamRes) => {
    res.setHeader('Content-Type', RP_CONTENT_TYPES[format]);
    res.setHeader('Cache-Control', 'no-cache');
    streamRes.pipe(res);
  }).on('error', (err) => {
    console.error('Radio Paradise stream error:', err);
    res.status(500).json({ error: 'Stream error' });
  });
});

// Proxy Radio Paradise now-playing API
app.get('/api/rp/now-playing/:chan', (req, res) => {
  const chan = parseInt(req.params.chan, 10);

  // Validate channel number (0-3)
  if (isNaN(chan) || chan < 0 || chan > 3) {
    return res.status(400).json({ error: 'Invalid channel. Valid: 0 (main), 1 (mellow), 2 (rock), 3 (global)' });
  }

  const apiUrl = `https://api.radioparadise.com/api/get_block?bitrate=4&info=true&chan=${chan}`;

  console.log('Proxying Radio Paradise now-playing:', apiUrl);

  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
  };

  https.get(apiUrl, options, (apiRes) => {
    let data = '';
    apiRes.on('data', (chunk) => { data += chunk; });
    apiRes.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
    });
  }).on('error', (err) => {
    console.error('Radio Paradise API error:', err);
    res.status(500).json({ error: 'API error' });
  });
});

// Proxy SomaFM streams to avoid CORS/403 issues
app.get('/api/stream/:channelId', (req, res) => {
  const { channelId } = req.params;
  const streamUrl = `https://ice1.somafm.com/${channelId}-128-mp3`;

  console.log('Proxying stream:', streamUrl);

  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
  };

  https.get(streamUrl, options, (streamRes) => {
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-cache');
    streamRes.pipe(res);
  }).on('error', (err) => {
    console.error('Stream error:', err);
    res.status(500).send('Stream error');
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Tuner server running on http://localhost:${PORT}`);
});
