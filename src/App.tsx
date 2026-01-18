import { useState, useEffect, useCallback } from 'react'
import './App.css'

const API_URL = 'http://localhost:3001/api'

interface TrackInfo {
  name: string
  artist: string
  album: string
  artwork: string
  duration: number
  position: number
  isPlaying: boolean
}

interface Playlist {
  id: string
  name: string
}

function App() {
  const [track, setTrack] = useState<TrackInfo | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Fetch playlists
  useEffect(() => {
    fetch(`${API_URL}/playlists`)
      .then(res => res.json())
      .then(data => setPlaylists(data))
      .catch(err => console.error('Failed to fetch playlists:', err))
  }, [])

  // Fetch current track info
  const fetchCurrentTrack = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/current`)
      const data = await res.json()
      setTrack(data)
      setIsPlaying(data.isPlaying)
      if (data.duration > 0) {
        setProgress((data.position * 1000 / data.duration) * 100)
      }
    } catch (error) {
      console.error('Failed to fetch track:', error)
    }
  }, [])

  // Play playlist
  const playPlaylist = useCallback(async (index: number) => {
    if (playlists[index]) {
      setSelectedIndex(index)
      await fetch(`${API_URL}/playlist/${playlists[index].id}`, { method: 'POST' })
      setTimeout(fetchCurrentTrack, 500)
    }
  }, [playlists, fetchCurrentTrack])

  // Control functions
  const handlePrevious = useCallback(async () => {
    await fetch(`${API_URL}/previous`, { method: 'POST' })
    setTimeout(fetchCurrentTrack, 300)
  }, [fetchCurrentTrack])

  const handleNext = useCallback(async () => {
    await fetch(`${API_URL}/next`, { method: 'POST' })
    setTimeout(fetchCurrentTrack, 300)
  }, [fetchCurrentTrack])

  const handlePlayPause = useCallback(async () => {
    await fetch(`${API_URL}/playpause`, { method: 'POST' })
    setIsPlaying(prev => !prev)
    setTimeout(fetchCurrentTrack, 300)
  }, [fetchCurrentTrack])

  // Navigate playlists
  const handlePlaylistPrev = useCallback(() => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : playlists.length - 1
    playPlaylist(newIndex)
  }, [selectedIndex, playlists.length, playPlaylist])

  const handlePlaylistNext = useCallback(() => {
    const newIndex = selectedIndex < playlists.length - 1 ? selectedIndex + 1 : 0
    playPlaylist(newIndex)
  }, [selectedIndex, playlists.length, playPlaylist])

  // Initial fetch and polling
  useEffect(() => {
    fetchCurrentTrack()
    const interval = setInterval(fetchCurrentTrack, 1000)
    return () => clearInterval(interval)
  }, [fetchCurrentTrack])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          handlePlaylistPrev()
          break
        case 'ArrowRight':
          e.preventDefault()
          handlePlaylistNext()
          break
        case 'ArrowUp':
          handlePrevious()
          break
        case 'ArrowDown':
          handleNext()
          break
        case ' ':
        case 'Enter':
          e.preventDefault()
          handlePlayPause()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePrevious, handleNext, handlePlayPause, handlePlaylistPrev, handlePlaylistNext])

  const currentPlaylist = playlists[selectedIndex]

  return (
    <div className="tuner">
      {/* Hero Album Art */}
      <div className="hero-artwork">
        {track?.artwork && (
          <img src={track.artwork} alt={track.name || 'Album art'} />
        )}
      </div>

      {/* Playlist Carousel */}
      <div className="carousel">
        {playlists.map((playlist, index) => (
          <div
            key={playlist.id}
            className={`carousel-item ${index === selectedIndex ? 'selected' : ''}`}
            onClick={() => playPlaylist(index)}
          >
            <span className="carousel-number">{index + 1}</span>
          </div>
        ))}
      </div>

      {/* Bottom Controls */}
      <div className="controls">
        <div className="track-info">
          <span className="playlist-name">{currentPlaylist?.name || 'Select Playlist'}</span>
          <span className="song-name">{track?.name || 'No track'}</span>
          <span className="artist">{track?.artist || 'Unknown artist'}</span>
        </div>

        <div className="playback-controls">
          <button className="control-btn" onClick={handlePrevious}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>
          <button className="control-btn play-btn" onClick={handlePlayPause}>
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button className="control-btn" onClick={handleNext}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
