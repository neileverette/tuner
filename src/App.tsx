import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import ChannelCarousel from './components/ChannelCarousel'
import PlayerControls from './components/PlayerControls'
import { useChannels, useNowPlaying } from './hooks'

function App() {
  const { channels, isLoading, error, refetch, getStreamUrl } = useChannels()
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const saved = localStorage.getItem('tuner-selected-index')
    return saved ? parseInt(saved, 10) : 0
  })
  const [isPlaying, setIsPlaying] = useState(false)

  // Get selected channel for now-playing polling
  const selectedChannel = channels[selectedIndex]
  const selectedChannelId = selectedChannel?.id ?? null
  const { nowPlaying } = useNowPlaying(selectedChannelId, { enabled: isPlaying })
  const [currentTrack, setCurrentTrack] = useState('')
  const [currentImage, setCurrentImage] = useState(() => {
    return localStorage.getItem('tuner-current-image') || ''
  })
  const [prevImage, setPrevImage] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right'>('right')
  const [showStationPicker, setShowStationPicker] = useState(false)
  const [stationSearch, setStationSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'somafm' | 'radioparadise'>('all')
  const [streamError, setStreamError] = useState<string | null>(null)
  const [showInstructions, setShowInstructions] = useState(() => {
    return localStorage.getItem('tuner-instructions-dismissed') !== 'true'
  })
  const [showSplash, setShowSplash] = useState(true)
  const [splashPhase, setSplashPhase] = useState<'visible' | 'fading' | 'hidden'>('visible')
  const [headerVisible, setHeaderVisible] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playTimeoutRef = useRef<number | null>(null)

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

  // Restore initial state from channels when loaded
  // Also handles migration: if saved index is out of bounds (e.g., channel list changed), reset to 0
  useEffect(() => {
    if (channels.length === 0) return
    const savedIndex = localStorage.getItem('tuner-selected-index')
    const index = savedIndex ? parseInt(savedIndex, 10) : 0

    // Validate index is within bounds
    const validIndex = index >= 0 && index < channels.length ? index : 0
    if (validIndex !== selectedIndex) {
      setSelectedIndex(validIndex)
      localStorage.setItem('tuner-selected-index', validIndex.toString())
    }

    const channel = channels[validIndex]
    if (channel && !currentImage) {
      setCurrentImage(channel.image.large)
      localStorage.setItem('tuner-current-image', channel.image.large)
    }
  }, [channels, currentImage, selectedIndex])

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
    setCurrentTrack('')  // Will be populated by useNowPlaying

    // Save to localStorage
    localStorage.setItem('tuner-selected-index', index.toString())
    localStorage.setItem('tuner-current-image', channels[index].image.large)

    // Trigger image transition
    const newImage = channels[index].image.large
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

    // Clear any previous stream error
    setStreamError(null)

    // Debounce the actual audio loading - wait for user to stop pressing keys
    playTimeoutRef.current = window.setTimeout(() => {
      if (audioRef.current) {
        const proxyUrl = getStreamUrl(channels[index])
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
              setStreamError('Failed to start playback')
            })
        }
      }
    }, 300)
  }, [channels, getStreamUrl])

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

  // Sync current track from now-playing hook
  useEffect(() => {
    if (nowPlaying?.track) {
      setCurrentTrack(nowPlaying.track)
    }
  }, [nowPlaying])

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

  // Get source label from channel ID
  const getSourceLabel = (id: string): string | null => {
    if (id.startsWith('somafm:')) return 'SomaFM'
    if (id.startsWith('rp:')) return 'Radio Paradise'
    return null
  }

  return (
    <div className="tuner">
      {/* Audio element */}
      <audio
        ref={audioRef}
        preload="none"
        onError={() => {
          setStreamError('Stream connection failed')
          setIsPlaying(false)
        }}
      />

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
            alt={selectedChannel?.title || 'Channel art'}
            className={`hero-image hero-image-current ${isTransitioning ? `transitioning ${transitionDirection}` : ''}`}
          />
        )}
      </div>

      {/* Instructions */}
      {showInstructions && (
        <div className={`instructions-inline ${contentVisible ? 'visible' : ''}`}>
          <span>Use <strong>← left</strong> and <strong>right →</strong> to tune. <strong>Spacebar ␣</strong> to play/pause. Click station guide to search.</span>
          <button className="instructions-close" onClick={dismissInstructions}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      )}

      {/* Error Banner - Channel fetch error */}
      {error && (
        <div className={`error-banner ${contentVisible ? 'visible' : ''}`}>
          <span>Failed to load stations</span>
          <button onClick={() => refetch()}>Retry</button>
        </div>
      )}

      {/* Error Banner - Stream error */}
      {streamError && (
        <div className={`error-banner stream-error ${contentVisible ? 'visible' : ''}`}>
          <span>{streamError}</span>
          <button onClick={() => {
            setStreamError(null)
            if (selectedChannel) playChannel(selectedIndex)
          }}>Retry</button>
          <button onClick={() => setStreamError(null)}>Dismiss</button>
        </div>
      )}

      {/* Station Count - just above carousel */}
      <div className={`station-count ${contentVisible ? 'visible' : ''}`}>
        {isLoading ? 'Loading stations...' : channels.length > 0 ? `${channels.length} stations` : 'No stations available'}
      </div>

      {/* Channel Carousel */}
      <ChannelCarousel
        channels={channels}
        selectedIndex={selectedIndex}
        onSelectChannel={playChannel}
        visible={contentVisible}
      />


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
            <div className="station-picker-filters">
              <button
                className={`filter-chip ${sourceFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSourceFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-chip filter-somafm ${sourceFilter === 'somafm' ? 'active' : ''}`}
                onClick={() => setSourceFilter('somafm')}
              >
                SomaFM
              </button>
              <button
                className={`filter-chip filter-rp ${sourceFilter === 'radioparadise' ? 'active' : ''}`}
                onClick={() => setSourceFilter('radioparadise')}
              >
                Radio Paradise
              </button>
            </div>
            <div className="station-picker-list">
              {(() => {
                const filteredChannels = channels
                  .map((channel, index) => ({ channel, index }))
                  .filter(({ channel }) => {
                    // Source filter
                    if (sourceFilter === 'somafm' && !channel.id.startsWith('somafm:')) return false
                    if (sourceFilter === 'radioparadise' && !channel.id.startsWith('rp:')) return false
                    // Text search filter
                    if (stationSearch === '') return true
                    return (
                      channel.title.toLowerCase().includes(stationSearch.toLowerCase()) ||
                      channel.description.toLowerCase().includes(stationSearch.toLowerCase()) ||
                      channel.genre.toLowerCase().includes(stationSearch.toLowerCase())
                    )
                  })

                if (filteredChannels.length === 0) {
                  return (
                    <div className="station-picker-empty">
                      No matching stations
                    </div>
                  )
                }

                return filteredChannels.map(({ channel, index }) => (
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
                      <div className="station-item-header">
                        <span className="station-item-name">{highlightMatch(channel.title, stationSearch)}</span>
                        {getSourceLabel(channel.id) && (
                          <span className={`station-item-source ${channel.id.startsWith('rp:') ? 'source-rp' : 'source-somafm'}`}>
                            {getSourceLabel(channel.id)}
                          </span>
                        )}
                      </div>
                      <span className="station-item-meta">{highlightMatch(channel.description, stationSearch)}</span>
                      {channel.genre && <span className="station-item-genre">{highlightMatch(channel.genre, stationSearch)}</span>}
                    </div>
                    {channel.listeners != null && channel.listeners > 0 && (
                      <div className="station-item-right">
                        <span className="station-item-listeners-label">Listeners</span>
                        <span className="station-item-listeners">{channel.listeners.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                ))
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <PlayerControls
        currentChannel={selectedChannel}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onOpenStationPicker={() => setShowStationPicker(true)}
        visible={contentVisible}
      />
    </div>
  )
}

export default App
