import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'

interface Channel {
  id: string
  title: string
  description: string
  dj: string
  genre: string
  image: string
  largeimage: string
  xlimage: string
  playlists: { url: string; format: string; quality: string }[]
  lastPlaying: string
  listeners: number
}

function App() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState('')
  const [currentImage, setCurrentImage] = useState('')
  const [prevImage, setPrevImage] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playTimeoutRef = useRef<number | null>(null)

  // Fetch channels from SomaFM
  useEffect(() => {
    fetch('https://api.somafm.com/channels.json')
      .then(res => res.json())
      .then(data => {
        setChannels(data.channels)
      })
      .catch(err => console.error('Failed to fetch channels:', err))
  }, [])

  // Play channel with debounced audio loading
  const playChannel = useCallback((index: number) => {
    if (!channels[index]) return

    // Update selection immediately
    setSelectedIndex(index)
    setCurrentTrack(channels[index].lastPlaying || '')

    // Trigger image transition
    const newImage = channels[index].xlimage
    if (newImage !== currentImage) {
      setPrevImage(currentImage)
      setCurrentImage(newImage)
      setIsTransitioning(true)
      setTimeout(() => setIsTransitioning(false), 600)
    }

    // Cancel any pending audio load
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current)
    }

    // Debounce the actual audio loading - wait for user to stop pressing keys
    playTimeoutRef.current = window.setTimeout(() => {
      if (audioRef.current) {
        const proxyUrl = `http://localhost:3001/api/stream/${channels[index].id}`
        console.log('Playing:', proxyUrl)
        audioRef.current.src = proxyUrl
        audioRef.current.volume = 1.0
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Playback started')
              setIsPlaying(true)
            })
            .catch(err => {
              console.error('Playback error:', err)
              setIsPlaying(false)
            })
        }
      }
    }, 300)
  }, [channels])

  // Control functions
  const handlePlayPause = useCallback(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      if (!audioRef.current.src && channels[selectedIndex]) {
        playChannel(selectedIndex)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }, [isPlaying, channels, selectedIndex, playChannel])

  // Navigate channels
  const handleChannelPrev = useCallback(() => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : channels.length - 1
    playChannel(newIndex)
  }, [selectedIndex, channels.length, playChannel])

  const handleChannelNext = useCallback(() => {
    const newIndex = selectedIndex < channels.length - 1 ? selectedIndex + 1 : 0
    playChannel(newIndex)
  }, [selectedIndex, channels.length, playChannel])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          handleChannelPrev()
          break
        case 'ArrowRight':
          e.preventDefault()
          handleChannelNext()
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
  }, [handleChannelPrev, handleChannelNext, handlePlayPause])

  // Poll for current track info
  useEffect(() => {
    const interval = setInterval(() => {
      if (channels[selectedIndex]) {
        fetch('https://api.somafm.com/channels.json')
          .then(res => res.json())
          .then(data => {
            const channel = data.channels.find((c: Channel) => c.id === channels[selectedIndex].id)
            if (channel) {
              setCurrentTrack(channel.lastPlaying || '')
            }
          })
          .catch(() => {})
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [channels, selectedIndex])

  const currentChannel = channels[selectedIndex]

  return (
    <div className="tuner">
      {/* Audio element */}
      <audio ref={audioRef} preload="none" />

      {/* Hero Channel Art with Crossfade */}
      <div className="hero-artwork">
        {prevImage && (
          <img
            src={prevImage}
            alt=""
            className={`hero-image hero-image-prev ${isTransitioning ? 'transitioning' : ''}`}
          />
        )}
        {currentImage && (
          <img
            src={currentImage}
            alt={currentChannel?.title || 'Channel art'}
            className={`hero-image hero-image-current ${isTransitioning ? 'transitioning' : ''}`}
          />
        )}
      </div>

      {/* Channel Carousel */}
      <div className="carousel">
        {channels.slice(0, 16).map((channel, index) => (
          <div
            key={channel.id}
            className={`carousel-item ${index === selectedIndex ? 'selected' : ''}`}
            onClick={() => playChannel(index)}
          >
            <img src={channel.largeimage} alt={channel.title} />
          </div>
        ))}
      </div>

      {/* Bottom Controls */}
      <div className="controls">
        <div className="track-info">
          <span className="playlist-name">{currentChannel?.title || 'Select Station'}</span>
          <span className="song-name">{currentTrack || 'No track info'}</span>
          <span className="artist">{currentChannel?.genre || ''}</span>
        </div>

        <div className="playback-controls">
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
        </div>

        <div className="listeners-info">
          <span>{currentChannel?.listeners || 0} listeners</span>
        </div>
      </div>
    </div>
  )
}

export default App
