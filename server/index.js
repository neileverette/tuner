import express from 'express';
import cors from 'cors';
import http from 'http';
import https from 'https';
import { Resend } from 'resend';

// Import compiled TypeScript config (ESM modules)
import { aggregateByGenre, aggregateBySource } from '../dist/config/aggregation.js';

// Email alerting setup
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ALERT_EMAIL = process.env.ALERT_EMAIL || 'alert@example.com';

// Rate limiting: track last alert time per station (max 1 email per station per hour)
const alertCooldowns = new Map(); // stationId -> timestamp
const ALERT_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

async function sendStreamAlert(stationName, stationId, errorType, details) {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured - skipping email alert');
    return;
  }

  // Check rate limit
  const lastAlert = alertCooldowns.get(stationId);
  const now = Date.now();
  if (lastAlert && (now - lastAlert) < ALERT_COOLDOWN_MS) {
    console.log(`Alert for ${stationId} suppressed (cooldown: ${Math.round((ALERT_COOLDOWN_MS - (now - lastAlert)) / 60000)}min remaining)`);
    return;
  }

  try {
    await resend.emails.send({
      from: 'Tuner Alerts <onboarding@resend.dev>',
      to: ALERT_EMAIL,
      subject: `🔴 Stream Failed: ${stationName}`,
      html: `
        <h2>Stream Failure Alert</h2>
        <p><strong>Station:</strong> ${stationName}</p>
        <p><strong>Station ID:</strong> ${stationId}</p>
        <p><strong>Error Type:</strong> ${errorType}</p>
        <p><strong>Details:</strong> ${details}</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">This alert is rate-limited to 1 per station per hour.</p>
      `
    });
    alertCooldowns.set(stationId, now);
    console.log(`Alert sent for ${stationName} (${stationId})`);
  } catch (err) {
    console.error('Failed to send alert email:', err);
  }
}

/**
 * Tuner Proxy Server
 *
 * Proxies audio streams and API calls to bypass CORS restrictions.
 *
 * ROUTES:
 *
 * SomaFM:
 *   GET /api/stream/:channelId
 *   - Proxies SomaFM MP3 streams
 *   - Example: /api/stream/groovesalad
 *
 * Radio Paradise:
 *   GET /api/stream/rp/:channel/:quality
 *   - Proxies RP audio streams with quality selection
 *   - channel: main, mellow, rock, global
 *   - quality: flac, aac-320, mp3-128
 *   - Example: /api/stream/rp/main/flac
 *
 *   GET /api/rp/nowplaying/:chan
 *   - Proxies RP now-playing API
 *   - chan: 0 (main), 1 (mellow), 2 (rock), 3 (global)
 *
 * NTS Radio:
 *   GET /api/nts/live/:channel
 *   - Proxies NTS live streams (channel 1 or 2)
 *   - Example: /api/nts/live/1
 *
 *   GET /api/nts/mixtape/:mixtapeId
 *   - Proxies NTS Infinite Mixtape streams
 *   - Example: /api/nts/mixtape/mixtape4 (Poolside)
 *
 *   GET /api/nts/nowplaying
 *   - Proxies NTS live API for current show info
 */

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint for frontend to report stream failures
app.post('/api/stream-failure', async (req, res) => {
  const { stationName, stationId, errorType, details } = req.body;

  if (!stationId) {
    return res.status(400).json({ error: 'stationId required' });
  }

  console.log(`Stream failure reported: ${stationName} (${stationId}) - ${errorType}: ${details}`);

  await sendStreamAlert(
    stationName || stationId,
    stationId,
    errorType || 'Unknown',
    details || 'No details provided'
  );

  res.json({ success: true });
});

// Radio Paradise channel and quality mappings
// Note: Main uses different URL patterns than other channels
// Main: /aac-320, /flac, /mp3-128
// Others: /mellow-320, /mellow-flac, /mellow-128, etc.
const RP_CHANNELS = {
  main:   { prefix: '' },
  mellow: { prefix: 'mellow-' },
  rock:   { prefix: 'rock-' },
  global: { prefix: 'global-' }
};

// Quality suffixes differ for main vs other channels
const RP_QUALITIES = {
  'flac':    { main: 'flac',    other: 'flac', contentType: 'audio/flac' },
  'aac-320': { main: 'aac-320', other: '320',  contentType: 'audio/aac' },
  'mp3-192': { main: 'mp3-192', other: '192',  contentType: 'audio/mpeg' }
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
app.get('/api/stream/rp/:channel/:quality', (req, res) => {
  const { channel, quality } = req.params;

  // Validate channel and quality
  if (!RP_CHANNELS[channel]) {
    return res.status(400).json({ error: 'Invalid channel. Valid: main, mellow, rock, global' });
  }
  if (!RP_QUALITIES[quality]) {
    return res.status(400).json({ error: 'Invalid quality. Valid: flac, aac-320, mp3-192' });
  }

  // Build URL: main uses different suffix pattern than other channels
  const isMain = channel === 'main';
  const qualitySuffix = isMain ? RP_QUALITIES[quality].main : RP_QUALITIES[quality].other;
  const streamUrl = `http://stream.radioparadise.com/${RP_CHANNELS[channel].prefix}${qualitySuffix}`;

  console.log('Proxying Radio Paradise stream:', streamUrl);

  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
  };

  // Use http (not https) for Radio Paradise streams
  http.get(streamUrl, options, (streamRes) => {
    res.setHeader('Content-Type', RP_QUALITIES[quality].contentType);
    res.setHeader('Cache-Control', 'no-cache');
    streamRes.pipe(res);
  }).on('error', (err) => {
    console.error('Radio Paradise stream error:', err);
    res.status(500).json({ error: 'Stream error' });
  });
});

// Proxy Radio Paradise now-playing API
app.get('/api/rp/nowplaying/:chan', (req, res) => {
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
      res.setHeader('Cache-Control', 'no-store');
      res.send(data);
    });
  }).on('error', (err) => {
    console.error('Radio Paradise API error:', err);
    res.status(500).json({ error: 'API error' });
  });
});

// KEXP stream qualities
const KEXP_QUALITIES = {
  '160': { url: 'https://kexp.streamguys1.com/kexp160.aac', contentType: 'audio/aac' },
  '64': { url: 'https://kexp.streamguys1.com/kexp64.aac', contentType: 'audio/aac' }
};

// Proxy KEXP streams
app.get('/api/stream/kexp/:quality', (req, res) => {
  const { quality } = req.params;

  if (!KEXP_QUALITIES[quality]) {
    return res.status(400).json({ error: 'Invalid quality. Valid: 160, 64' });
  }

  const streamUrl = KEXP_QUALITIES[quality].url;
  console.log('Proxying KEXP stream:', streamUrl);

  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
  };

  https.get(streamUrl, options, (streamRes) => {
    res.setHeader('Content-Type', KEXP_QUALITIES[quality].contentType);
    res.setHeader('Cache-Control', 'no-cache');
    streamRes.pipe(res);
  }).on('error', (err) => {
    console.error('KEXP stream error:', err);
    res.status(500).json({ error: 'Stream error' });
  });
});

// Proxy KEXP now-playing API
app.get('/api/kexp/nowplaying', (req, res) => {
  const apiUrl = 'https://api.kexp.org/v2/plays/?limit=1';

  console.log('Proxying KEXP now-playing:', apiUrl);

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
      res.setHeader('Cache-Control', 'no-store');
      res.send(data);
    });
  }).on('error', (err) => {
    console.error('KEXP API error:', err);
    res.status(500).json({ error: 'API error' });
  });
});

// NTS Radio live channel mapping
const NTS_LIVE_CHANNELS = {
  '1': 'stream',
  '2': 'stream2'
};

// NTS Infinite Mixtape IDs (validated set)
const NTS_VALID_MIXTAPES = new Set([
  'mixtape', 'mixtape2', 'mixtape3', 'mixtape4', 'mixtape5', 'mixtape6',
  'mixtape21', 'mixtape22', 'mixtape23', 'mixtape24', 'mixtape26', 'mixtape27',
  'mixtape31', 'mixtape34', 'mixtape35', 'mixtape36'
]);

// Proxy NTS live streams
app.get('/api/nts/live/:channel', (req, res) => {
  const { channel } = req.params;

  if (!NTS_LIVE_CHANNELS[channel]) {
    return res.status(400).json({ error: 'Invalid channel. Valid: 1, 2' });
  }

  const streamPath = NTS_LIVE_CHANNELS[channel];
  const streamUrl = `https://stream-relay-geo.ntslive.net/${streamPath}`;

  console.log('Proxying NTS live stream:', streamUrl);

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
    console.error('NTS live stream error:', err);
    res.status(500).json({ error: 'Stream error' });
  });
});

// Proxy NTS Infinite Mixtape streams
app.get('/api/nts/mixtape/:mixtapeId', (req, res) => {
  const { mixtapeId } = req.params;

  if (!NTS_VALID_MIXTAPES.has(mixtapeId)) {
    return res.status(400).json({
      error: 'Invalid mixtape ID',
      valid: Array.from(NTS_VALID_MIXTAPES)
    });
  }

  const streamUrl = `https://stream-mixtape-geo.ntslive.net/${mixtapeId}`;

  console.log('Proxying NTS mixtape stream:', streamUrl);

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
    console.error('NTS mixtape stream error:', err);
    res.status(500).json({ error: 'Stream error' });
  });
});

// Proxy NTS now-playing API (returns info for both live channels)
app.get('/api/nts/nowplaying', (req, res) => {
  const apiUrl = 'https://www.nts.live/api/v2/live';

  console.log('Proxying NTS now-playing:', apiUrl);

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
      res.setHeader('Cache-Control', 'no-store');
      res.send(data);
    });
  }).on('error', (err) => {
    console.error('NTS API error:', err);
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
