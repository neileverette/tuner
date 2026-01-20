import express from 'express';
import cors from 'cors';
import http from 'http';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the built frontend
app.use(express.static(join(__dirname, '..', 'dist')));

// Radio Paradise channel and quality mappings
const RP_CHANNELS = {
  main:   { prefix: '' },
  mellow: { prefix: 'mellow-' },
  rock:   { prefix: 'rock-' },
  global: { prefix: 'global-' }
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

  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
  };

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

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Tuner server running on http://0.0.0.0:${PORT}`);
});
