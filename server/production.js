import express from 'express';
import cors from 'cors';
import http from 'http';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Resend } from 'resend';
import { Transform } from 'stream';

// =============================================================================
// SCALABLE STREAMING CONFIGURATION
// =============================================================================
// Connection pooling - reuse sockets instead of creating new ones per request
const httpAgent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 30000,
  maxSockets: 100,        // Max concurrent connections per host
  maxFreeSockets: 20,     // Keep idle sockets ready
  timeout: 30000
});

const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 30000,
  maxSockets: 100,
  maxFreeSockets: 20,
  timeout: 30000
});

// Stream timeouts
const UPSTREAM_TIMEOUT = 15000;   // 15s to connect to radio source
const STREAM_READ_TIMEOUT = 30000; // 30s max silence before dropping

// Buffer configuration for smooth playback
const BUFFER_HIGH_WATER_MARK = 256 * 1024; // 256KB buffer (2-3 seconds of audio)

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Email alerting setup
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ALERT_EMAIL = process.env.ALERT_EMAIL || 'alert@example.com';

// Rate limiting: track last alert time per station (max 1 email per station per hour)
const alertCooldowns = new Map();
const ALERT_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

async function sendStreamAlert(stationName, stationId, errorType, details) {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured - skipping email alert');
    return;
  }

  const lastAlert = alertCooldowns.get(stationId);
  const now = Date.now();
  if (lastAlert && (now - lastAlert) < ALERT_COOLDOWN_MS) {
    console.log(`Alert for ${stationId} suppressed (cooldown)`);
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
        <p style="color: #666; font-size: 12px;">Rate-limited to 1 per station per hour.</p>
      `
    });
    alertCooldowns.set(stationId, now);
    console.log(`Alert sent for ${stationName} (${stationId})`);
  } catch (err) {
    console.error('Failed to send alert email:', err);
  }
}

const app = express();
app.use(cors());
app.use(express.json());

// =============================================================================
// CLOUDFLARE-OPTIMIZED STREAM PROXY
// =============================================================================
// This helper handles all the buffering, timeouts, and error recovery
function proxyStream(streamUrl, contentType, res, stationName = 'unknown') {
  const isHttps = streamUrl.startsWith('https');
  const agent = isHttps ? httpsAgent : httpAgent;
  const protocol = isHttps ? https : http;

  const options = {
    agent,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Accept': '*/*',
      'Connection': 'keep-alive'
    },
    timeout: UPSTREAM_TIMEOUT
  };

  const upstream = protocol.get(streamUrl, options, (streamRes) => {
    // Handle redirects
    if (streamRes.statusCode >= 300 && streamRes.statusCode < 400 && streamRes.headers.location) {
      console.log(`[${stationName}] Following redirect to:`, streamRes.headers.location);
      return proxyStream(streamRes.headers.location, contentType, res, stationName);
    }

    if (streamRes.statusCode !== 200) {
      console.error(`[${stationName}] Upstream returned ${streamRes.statusCode}`);
      if (!res.headersSent) {
        res.status(502).json({ error: 'Upstream error', status: streamRes.statusCode });
      }
      return;
    }

    // Set response headers optimized for Cloudflare edge caching
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('X-Accel-Buffering', 'no');  // Disable nginx buffering if present
    res.setHeader('Transfer-Encoding', 'chunked');

    // Cloudflare headers for streaming
    res.setHeader('CF-Cache-Status', 'DYNAMIC');

    // Set read timeout on upstream
    streamRes.setTimeout(STREAM_READ_TIMEOUT, () => {
      console.error(`[${stationName}] Upstream read timeout - no data for ${STREAM_READ_TIMEOUT}ms`);
      upstream.destroy();
    });

    // Create a buffering transform stream for smooth delivery
    const buffer = new Transform({
      highWaterMark: BUFFER_HIGH_WATER_MARK,
      transform(chunk, encoding, callback) {
        callback(null, chunk);
      }
    });

    // Pipe with error handling: upstream -> buffer -> client
    streamRes
      .pipe(buffer)
      .pipe(res);

    // Handle upstream errors mid-stream
    streamRes.on('error', (err) => {
      console.error(`[${stationName}] Upstream stream error:`, err.message);
      buffer.destroy();
      if (!res.writableEnded) res.end();
    });

    // Handle client disconnect - clean up upstream
    res.on('close', () => {
      console.log(`[${stationName}] Client disconnected`);
      streamRes.destroy();
      buffer.destroy();
    });

  });

  // Handle connection timeout
  upstream.setTimeout(UPSTREAM_TIMEOUT, () => {
    console.error(`[${stationName}] Connection timeout after ${UPSTREAM_TIMEOUT}ms`);
    upstream.destroy();
    if (!res.headersSent) {
      res.status(504).json({ error: 'Connection timeout' });
    }
  });

  // Handle connection errors
  upstream.on('error', (err) => {
    console.error(`[${stationName}] Connection error:`, err.message);
    if (!res.headersSent) {
      res.status(502).json({ error: 'Connection failed', details: err.message });
    }
  });

  return upstream;
}

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

// Serve static files from the built frontend
app.use(express.static(join(__dirname, '..', 'dist')));

// Radio Paradise channel and quality mappings
const RP_CHANNELS = {
  main:     { prefix: '' },
  mellow:   { prefix: 'mellow-' },
  eclectic: { prefix: 'eclectic-' },
  global:   { prefix: 'global-' }
};

const RP_QUALITIES = {
  'flac':    { main: 'flac',    other: 'flac',  contentType: 'audio/flac' },
  'aac-320': { main: 'aac-320', other: '320',   contentType: 'audio/aac' },
  'mp3-128': { main: 'mp3-128', other: '128',   contentType: 'audio/mpeg' }
};

// Proxy Radio Paradise streams
app.get('/api/stream/rp/:channel/:quality', (req, res) => {
  const { channel, quality } = req.params;

  if (!RP_CHANNELS[channel]) {
    return res.status(400).json({ error: 'Invalid channel' });
  }
  if (!RP_QUALITIES[quality]) {
    return res.status(400).json({ error: 'Invalid quality' });
  }

  const isMain = channel === 'main';
  const qualitySuffix = isMain ? RP_QUALITIES[quality].main : RP_QUALITIES[quality].other;
  const streamUrl = `http://stream.radioparadise.com/${RP_CHANNELS[channel].prefix}${qualitySuffix}`;

  console.log('Proxying Radio Paradise stream:', streamUrl);
  proxyStream(streamUrl, RP_QUALITIES[quality].contentType, res, `RP-${channel}`);
});

// Proxy Radio Paradise now-playing API
app.get('/api/rp/nowplaying/:chan', (req, res) => {
  const chan = parseInt(req.params.chan, 10);

  if (isNaN(chan) || chan < 0 || chan > 3) {
    return res.status(400).json({ error: 'Invalid channel' });
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
    return res.status(400).json({ error: 'Invalid quality' });
  }

  const streamUrl = KEXP_QUALITIES[quality].url;
  console.log('Proxying KEXP stream:', streamUrl);
  proxyStream(streamUrl, KEXP_QUALITIES[quality].contentType, res, 'KEXP');
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
  proxyStream(streamUrl, 'audio/mpeg', res, `NTS-${channel}`);
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
  proxyStream(streamUrl, 'audio/mpeg', res, `NTS-${mixtapeId}`);
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

  console.log('Proxying SomaFM stream:', streamUrl);
  proxyStream(streamUrl, 'audio/mpeg', res, `SomaFM-${channelId}`);
});

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Tuner server running on http://0.0.0.0:${PORT}`);
});
