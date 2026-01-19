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
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const saved = localStorage.getItem('tuner-selected-index')
    return saved ? parseInt(saved, 10) : 0
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState('')
  const [currentImage, setCurrentImage] = useState(() => {
    return localStorage.getItem('tuner-current-image') || ''
  })
  const [prevImage, setPrevImage] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right'>('right')
  const [showStationPicker, setShowStationPicker] = useState(false)
  const [stationSearch, setStationSearch] = useState('')
  const [showInstructions, setShowInstructions] = useState(() => {
    return localStorage.getItem('tuner-instructions-dismissed') !== 'true'
  })
  const [showSplash, setShowSplash] = useState(true)
  const [splashPhase, setSplashPhase] = useState<'visible' | 'fading' | 'hidden'>('visible')
  const [headerVisible, setHeaderVisible] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playTimeoutRef = useRef<number | null>(null)
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  // Splash screen animation sequence
  useEffect(() => {
    if (!showSplash) return

    // Wait 2 seconds, then start fade out
    const fadeTimer = setTimeout(() => {
      setSplashPhase('fading')
    }, 2000)

    // After fade animation (0.8s), hide splash and show header
    const hideTimer = setTimeout(() => {
      setSplashPhase('hidden')
      setShowSplash(false)
      // Slide in header and fade in content after splash is gone
      setTimeout(() => {
        setHeaderVisible(true)
        setContentVisible(true)
      }, 100)
    }, 2800)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [showSplash])

  // Fetch channels from SomaFM
  useEffect(() => {
    fetch('https://api.somafm.com/channels.json')
      .then(res => res.json())
      .then(data => {
        setChannels(data.channels)
        // Restore last played channel's info
        const savedIndex = localStorage.getItem('tuner-selected-index')
        if (savedIndex) {
          const index = parseInt(savedIndex, 10)
          if (data.channels[index]) {
            setCurrentTrack(data.channels[index].lastPlaying || '')
            if (!currentImage) {
              setCurrentImage(data.channels[index].xlimage)
            }
          }
        }
      })
      .catch(err => console.error('Failed to fetch channels:', err))
  }, [])

  // Play channel with debounced audio loading
  const playChannel = useCallback((index: number) => {
    if (!channels[index]) return

    // Update selection immediately
    setSelectedIndex((prevIndex) => {
      // Determine direction based on previous index
      const direction = index > prevIndex ? 'right' : 'left'
      setTransitionDirection(direction)
      return index
    })
    setCurrentTrack(channels[index].lastPlaying || '')

    // Save to localStorage
    localStorage.setItem('tuner-selected-index', index.toString())
    localStorage.setItem('tuner-current-image', channels[index].xlimage)

    // Trigger image transition
    const newImage = channels[index].xlimage
    setCurrentImage((prevImage) => {
      if (newImage !== prevImage) {
        setPrevImage(prevImage)
        setIsTransitioning(true)
        setTimeout(() => setIsTransitioning(false), 600)
      }
      return newImage
    })

    // Cancel any pending audio load
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current)
    }

    // Debounce the actual audio loading - wait for user to stop pressing keys
    playTimeoutRef.current = window.setTimeout(() => {
      if (audioRef.current) {
        const proxyUrl = `/api/stream/${channels[index].id}`
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

  // Navigate channels - stop at boundaries, no wrapping
  const handleChannelPrev = useCallback(() => {
    if (selectedIndex > 0) {
      playChannel(selectedIndex - 1)
    }
  }, [selectedIndex, playChannel])

  const handleChannelNext = useCallback(() => {
    if (selectedIndex < channels.length - 1) {
      playChannel(selectedIndex + 1)
    }
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

  // Scroll carousel to selected item
  useEffect(() => {
    if (!carouselRef.current || channels.length === 0) return
    const carousel = carouselRef.current
    const totalItems = channels.length
    const maxScroll = carousel.scrollWidth - carousel.clientWidth
    const progress = totalItems > 1 ? selectedIndex / (totalItems - 1) : 0
    const targetScroll = progress * maxScroll
    carousel.scrollTo({ left: targetScroll, behavior: 'smooth' })
  }, [selectedIndex, channels.length])

  // Dismiss instructions
  const dismissInstructions = () => {
    setShowInstructions(false)
    localStorage.setItem('tuner-instructions-dismissed', 'true')
  }

  // Highlight search matches
  const highlightMatch = (text: string, search: string) => {
    if (!search.trim()) return text
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i} className="search-highlight">{part}</mark> : part
    )
  }

  // Drag handlers for carousel
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return
    isDragging.current = true
    startX.current = e.pageX - carouselRef.current.offsetLeft
    scrollLeft.current = carouselRef.current.scrollLeft
    carouselRef.current.style.cursor = 'grabbing'
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !carouselRef.current) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5
    carouselRef.current.scrollLeft = scrollLeft.current - walk
  }

  const handleMouseUp = () => {
    isDragging.current = false
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab'
    }
  }

  const handleMouseLeave = () => {
    isDragging.current = false
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab'
    }
  }

  return (
    <div className="tuner">
      {/* Audio element */}
      <audio ref={audioRef} preload="none" />

      {/* Header with logo */}
      <header className={`app-header ${headerVisible ? 'visible' : ''}`}>
        <img src="/tuner-logo.svg" alt="Tuner" className="header-logo" />
      </header>

      {/* Splash Screen */}
      {showSplash && (
        <div className={`splash-screen ${splashPhase}`}>
          <div className="splash-blur-bg" style={{ backgroundImage: currentImage ? `url(${currentImage})` : undefined }} />
          <div className="splash-overlay" />
          <img src="/tuner-logo.svg" alt="Tuner" className="splash-logo" />
        </div>
      )}

      {/* Hero Channel Art with Crossfade */}
      <div className="hero-artwork">
        {prevImage && (
          <img
            src={prevImage}
            alt=""
            className={`hero-image hero-image-prev ${isTransitioning ? `transitioning ${transitionDirection}` : ''}`}
          />
        )}
        {currentImage && (
          <img
            src={currentImage}
            alt={currentChannel?.title || 'Channel art'}
            className={`hero-image hero-image-current ${isTransitioning ? `transitioning ${transitionDirection}` : ''}`}
          />
        )}
      </div>

      {/* Station Count */}
      <div className={`station-count ${contentVisible ? 'visible' : ''}`}>
        {channels.length > 0 ? `${channels.length} stations` : ''}
      </div>

      {/* Channel Carousel */}
      <div
        className={`carousel ${contentVisible ? 'visible' : ''}`}
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {channels.map((channel, index) => (
          <div
            key={channel.id}
            className={`carousel-item ${index === selectedIndex ? 'selected' : ''}`}
            onClick={() => playChannel(index)}
          >
            <img src={channel.largeimage} alt={channel.title} />
          </div>
        ))}
      </div>


      {/* Station Picker Dropdown */}
      {showStationPicker && (
        <div className="station-picker-overlay" onClick={() => setShowStationPicker(false)}>
          <div className="station-picker" onClick={(e) => e.stopPropagation()}>
            <div className="station-picker-header">
              <div className="station-picker-search">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search stations..."
                  value={stationSearch}
                  onChange={(e) => setStationSearch(e.target.value)}
                  autoFocus
                />
              </div>
              <button className="station-picker-close" onClick={() => setShowStationPicker(false)}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <div className="station-picker-list">
              {channels
                .map((channel, index) => ({ channel, index }))
                .filter(({ channel }) =>
                  stationSearch === '' ||
                  channel.title.toLowerCase().includes(stationSearch.toLowerCase()) ||
                  channel.description.toLowerCase().includes(stationSearch.toLowerCase()) ||
                  channel.genre.toLowerCase().includes(stationSearch.toLowerCase())
                )
                .map(({ channel, index }) => (
                  <div
                    key={channel.id}
                    className={`station-item ${index === selectedIndex ? 'selected' : ''}`}
                    onClick={() => {
                      playChannel(index)
                      setShowStationPicker(false)
                      setStationSearch('')
                    }}
                  >
                    <div className="station-item-left">
                      <span className="station-item-name">{highlightMatch(channel.title, stationSearch)}</span>
                      <span className="station-item-meta">{highlightMatch(channel.description, stationSearch)}</span>
                      {channel.genre && <span className="station-item-genre">{highlightMatch(channel.genre, stationSearch)}</span>}
                    </div>
                    {channel.listeners > 0 && (
                      <div className="station-item-right">
                        <span className="station-item-listeners-label">Listeners</span>
                        <span className="station-item-listeners">{channel.listeners.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className={`controls ${contentVisible ? 'visible' : ''}`}>
        <div className="track-info" onClick={() => setShowStationPicker(!showStationPicker)}>
          <span className="playlist-name">
            {currentChannel?.title || 'Select Station'}
            <span className="material-symbols-outlined menu-icon">menu_open</span>
          </span>
          <span className="song-name">{currentTrack || 'No track info'}</span>
          <span className="artist">{currentChannel?.genre || ''}</span>
        </div>

        {showInstructions && (
          <div className="instructions-inline">
            <span>Use left and right arrows to browse. Click on the station title to search.</span>
            <button className="instructions-close" onClick={dismissInstructions}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
        )}

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
