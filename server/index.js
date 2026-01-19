import express from 'express';
import cors from 'cors';
import http from 'http';
import https from 'https';

const app = express();
app.use(cors());
app.use(express.json());

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
