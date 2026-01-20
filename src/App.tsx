import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import ChannelCarousel from './components/ChannelCarousel'
import PlayerControls from './components/PlayerControls'
import StationPicker from './components/StationPicker'
import HeroArtwork from './components/HeroArtwork'
import SplashScreen from './components/SplashScreen'
import Instructions from './components/Instructions'
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
        <SplashScreen
          phase={splashPhase}
          backgroundImage={currentImage}
        />
      )}

      {/* Hero Channel Art with Crossfade */}
      <HeroArtwork
        currentImage={currentImage}
        prevImage={prevImage}
        isTransitioning={isTransitioning}
        transitionDirection={transitionDirection}
        altText={selectedChannel?.title || 'Channel art'}
      />

      {/* Instructions */}
      {showInstructions && (
        <Instructions
          visible={contentVisible}
          onDismiss={() => {
            setShowInstructions(false)
            localStorage.setItem('tuner-instructions-dismissed', 'true')
          }}
        />
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
        <StationPicker
          channels={channels}
          selectedIndex={selectedIndex}
          onSelectChannel={(index) => {
            playChannel(index)
            setShowStationPicker(false)
          }}
          onClose={() => setShowStationPicker(false)}
        />
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
