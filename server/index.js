import express from 'express';
import cors from 'cors';
import { execSync, exec } from 'child_process';

const app = express();
app.use(cors());
app.use(express.json());

// Playlists
const playlists = [
  { id: '37i9dQZF1DWYnwbYQ5HnZU', name: 'Chill Vibes' },
  { id: '2ssP5anNqokkD0HjKeHlCB', name: 'Playlist 2' },
  { id: '7HXhSISKCQP67MW7taQOpi', name: 'Playlist 3' },
  { id: '1OM6WLNotoRzcPp6YlmtdS', name: 'Playlist 4' },
  { id: '1tQrn93bdqdyn0HK5TZln3', name: 'Playlist 5' },
  { id: '37i9dQZF1DWXLSRKeL7KwM', name: 'Playlist 6' },
  { id: '5B3gb8HbvFm02ccQVH33IO', name: 'Playlist 7' },
  { id: '37i9dQZF1EVHGWrwldPRtj', name: 'Playlist 8' },
  { id: '37i9dQZF1E37J4CEwg2lta', name: 'Playlist 9' },
  { id: '37i9dQZF1E38JxIxggZpa5', name: 'Playlist 10' },
  { id: '37i9dQZF1E35QH02HIiIPv', name: 'Playlist 11' },
  { id: '37i9dQZF1E38YZYR3Lz2c3', name: 'Playlist 12' },
  { id: '37i9dQZF1E36GoFifHdzjg', name: 'Playlist 13' },
  { id: '37i9dQZF1EYkqdzj48dyYq', name: 'Playlist 14' },
  { id: '37i9dQZEVXcLAh3EZC6LH7', name: 'Playlist 15' },
  { id: '37i9dQZF1DWW7RgkOJG32Y', name: 'Playlist 16' },
];

// Helper to run AppleScript
function runAppleScript(script) {
  try {
    const result = execSync(`osascript -e '${script}'`, { encoding: 'utf-8' });
    return result.trim();
  } catch (error) {
    console.error('AppleScript error:', error.message);
    return null;
  }
}

// Get current track info
app.get('/api/current', (req, res) => {
  const name = runAppleScript('tell application "Spotify" to name of current track');
  const artist = runAppleScript('tell application "Spotify" to artist of current track');
  const album = runAppleScript('tell application "Spotify" to album of current track');
  const artwork = runAppleScript('tell application "Spotify" to artwork url of current track');
  const duration = runAppleScript('tell application "Spotify" to duration of current track');
  const position = runAppleScript('tell application "Spotify" to player position');
  const state = runAppleScript('tell application "Spotify" to player state as string');

  res.json({
    name,
    artist,
    album,
    artwork,
    duration: parseInt(duration) || 0,
    position: parseFloat(position) || 0,
    isPlaying: state === 'playing'
  });
});

// Play
app.post('/api/play', (req, res) => {
  runAppleScript('tell application "Spotify" to play');
  res.json({ success: true });
});

// Pause
app.post('/api/pause', (req, res) => {
  runAppleScript('tell application "Spotify" to pause');
  res.json({ success: true });
});

// Play/Pause toggle
app.post('/api/playpause', (req, res) => {
  runAppleScript('tell application "Spotify" to playpause');
  res.json({ success: true });
});

// Next track
app.post('/api/next', (req, res) => {
  runAppleScript('tell application "Spotify" to next track');
  res.json({ success: true });
});

// Previous track
app.post('/api/previous', (req, res) => {
  runAppleScript('tell application "Spotify" to previous track');
  res.json({ success: true });
});

// Get playlists
app.get('/api/playlists', (req, res) => {
  res.json(playlists);
});

// Play a specific playlist
app.post('/api/playlist/:id', (req, res) => {
  const { id } = req.params;
  const uri = `spotify:playlist:${id}`;
  runAppleScript(`tell application "Spotify" to play track "${uri}"`);
  res.json({ success: true, playlistId: id });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Tuner server running on http://localhost:${PORT}`);
});
