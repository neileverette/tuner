import { useState, useEffect, useCallback, useRef, useMemo, lazy, Suspense } from 'react'
import './App.css'
import ChannelCarousel from './components/ChannelCarousel'
import PlayerControls from './components/PlayerControls'
import SortDropdown from './components/SortDropdown'
import HeroArtwork from './components/HeroArtwork'
import SplashScreen from './components/SplashScreen'
import ShareButton from './components/ShareButton'
import { useChannels, useNowPlaying, useFavorites, useGenreFilter, useStreamHealth, useStationHealthScanner } from './hooks'
import type { SortOption } from './types'
import { sortChannels, filterChannelsByGenre } from './utils'
import GenreFilter from './components/GenreFilter'

// Lazy load modal components - these aren't needed on initial render
const StationPicker = lazy(() => import('./components/StationPicker'))
const WelcomeModal = lazy(() => import('./components/WelcomeModal'))

interface AppProps {
  isAnimationMode?: boolean
  showWelcomeOverride?: boolean
  onReady?: () => void
}

function App({ isAnimationMode = false, showWelcomeOverride = false, onReady }: AppProps) {
  const { channels, isLoading, error, refetch, getStreamUrl } = useChannels()

  // Scan stations for dead streams - filters out unhealthy ones automatically
  const { healthyChannels } = useStationHealthScanner(
    channels,
    getStreamUrl,
    { enabled: !isLoading && channels.length > 0 }
  )

  const { isFavorite, toggleFavorite } = useFavorites()
  const { startTimeout: startStreamTimeout, cancelTimeout: clearStreamTimeout, reportError: reportStreamError } = useStreamHealth()
  const {
    enabledGenres,
    enableGenre,
    disableGenre,
    enableAll,
    isFiltering,
    enabledCount,
  } = useGenreFilter()
  const [sortOption, setSortOption] = useState<SortOption>(() => {
    const saved = localStorage.getItem('tuner-sort-option')
    return (saved === 'station' || saved === 'genre' || saved === 'popularity') ? saved : 'station'
  })
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(() => {
    return localStorage.getItem('tuner-selected-channel-id')
  })
  const [isPlaying, setIsPlaying] = useState(false)

  // Filter channels by genre, then sort (using healthyChannels from scanner)
  const filteredChannels = useMemo(() => {
    return filterChannelsByGenre(healthyChannels, enabledGenres)
  }, [healthyChannels, enabledGenres])

  const sortedChannels = useMemo(() => {
    return sortChannels(filteredChannels, sortOption)
  }, [filteredChannels, sortOption])

  // Persist sort option changes
  useEffect(() => {
    localStorage.setItem('tuner-sort-option', sortOption)
  }, [sortOption])

  // Compute selected index from channel ID (stable across sort changes)
  const selectedIndex = useMemo(() => {
    if (!selectedChannelId) return 0
    const index = sortedChannels.findIndex(ch => ch.id === selectedChannelId)
    return index >= 0 ? index : 0
  }, [sortedChannels, selectedChannelId])

  // Get selected channel for now-playing polling
  const selectedChannel = sortedChannels[selectedIndex]
  const { nowPlaying } = useNowPlaying(selectedChannelId, { enabled: isPlaying })
  const [currentTrack, setCurrentTrack] = useState('')
  const [currentImage, setCurrentImage] = useState(() => {
    return localStorage.getItem('tuner-current-image') || ''
  })
  const [prevImage, setPrevImage] = useState('')
  const [ntsBgColor, setNtsBgColor] = useState('')
  const [prevNtsBgColor, setPrevNtsBgColor] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right'>('right')
  const [showStationPicker, setShowStationPicker] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)
  const [streamError, setStreamError] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(isAnimationMode ? showWelcomeOverride : true)
  const [showSplash, setShowSplash] = useState(!isAnimationMode)
  const [splashPhase, setSplashPhase] = useState<'visible' | 'fading' | 'hidden'>('visible')
  const [headerVisible, setHeaderVisible] = useState(isAnimationMode)
  const [contentVisible, setContentVisible] = useState(isAnimationMode)
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

  // Update favicon based on play/pause state
  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    if (favicon) {
      favicon.href = isPlaying ? '/favicon-pause.svg' : '/favicon-play.svg'
    }
  }, [isPlaying])

  // Restore initial state from channels when loaded
  // Handles migration from old index-based storage to channel ID
  useEffect(() => {
    if (sortedChannels.length === 0) return

    // If we don't have a selected channel ID, try to migrate from old index or default to first
    if (!selectedChannelId) {
      const savedIndex = localStorage.getItem('tuner-selected-index')
      const index = savedIndex ? parseInt(savedIndex, 10) : 0
      const validIndex = index >= 0 && index < sortedChannels.length ? index : 0
      const channel = sortedChannels[validIndex]
      if (channel) {
        setSelectedChannelId(channel.id)
        localStorage.setItem('tuner-selected-channel-id', channel.id)
      }
    }

    // Validate selected channel ID still exists
    const channelExists = sortedChannels.some(ch => ch.id === selectedChannelId)
    if (selectedChannelId && !channelExists) {
      const firstChannel = sortedChannels[0]
      setSelectedChannelId(firstChannel.id)
      localStorage.setItem('tuner-selected-channel-id', firstChannel.id)
    }

    // Set initial image if not set
    const channel = sortedChannels[selectedIndex]
    if (channel && !currentImage) {
      setCurrentImage(channel.image.large)
      localStorage.setItem('tuner-current-image', channel.image.large)
    }

    // Set initial NTS background color
    if (channel && channel.source === 'nts' && channel.bgColor && !ntsBgColor) {
      setNtsBgColor(channel.bgColor)
    }
  }, [sortedChannels, currentImage, selectedChannelId, selectedIndex, ntsBgColor])

  // Notify parent when ready (for Remotion animations)
  useEffect(() => {
    if (!isLoading && channels.length > 0 && onReady) {
      // Small delay to ensure images start loading
      const timer = setTimeout(() => {
        onReady()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isLoading, channels, onReady])

  // Play channel with debounced audio loading
  const playChannel = useCallback((index: number) => {
    const channel = sortedChannels[index]
    if (!channel) return

    // Determine direction based on previous index
    const direction = index > selectedIndex ? 'right' : 'left'
    setTransitionDirection(direction)

    // Update selection by channel ID (stable across sorts)
    setSelectedChannelId(channel.id)
    setCurrentTrack('')  // Will be populated by useNowPlaying

    // Save to localStorage
    localStorage.setItem('tuner-selected-channel-id', channel.id)
    localStorage.setItem('tuner-current-image', channel.image.large)

    // Trigger image transition
    const newImage = channel.image.large
    setCurrentImage((prevImage) => {
      if (newImage !== prevImage) {
        setPrevImage(prevImage)
        setIsTransitioning(true)
        setTimeout(() => setIsTransitioning(false), 600)
      }
      return newImage
    })

    // Handle NTS background color transitions
    if (channel.source === 'nts' && channel.bgColor) {
      setNtsBgColor((prev) => {
        if (channel.bgColor !== prev) {
          setPrevNtsBgColor(prev)
        }
        return channel.bgColor!
      })
    }

    // Cancel any pending audio load
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current)
    }

    // Clear any previous stream error
    setStreamError(null)

    // Debounce the actual audio loading - wait for user to stop pressing keys
    playTimeoutRef.current = window.setTimeout(() => {
      if (audioRef.current) {
        const proxyUrl = getStreamUrl(channel)
        console.log('Playing:', proxyUrl)
        audioRef.current.src = proxyUrl
        audioRef.current.volume = 1.0

        // Start health check timeout
        startStreamTimeout(channel.id, channel.title)

        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Playback started')
              clearStreamTimeout() // Stream started successfully
              setIsPlaying(true)
            })
            .catch(err => {
              // AbortError is expected when switching channels quickly - ignore it
              if (err.name === 'AbortError') {
                clearStreamTimeout()
                return
              }
              console.error('Playback error:', err)
              clearStreamTimeout()
              reportStreamError('PlaybackError', err.message || 'Unknown playback error')
              setIsPlaying(false)
              setStreamError('Failed to start playback')
            })
        }
      }
    }, 300)
  }, [sortedChannels, selectedIndex, getStreamUrl, startStreamTimeout, clearStreamTimeout, reportStreamError])

  // Control functions
  const handlePlayPause = useCallback(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      if (!audioRef.current.src && sortedChannels[selectedIndex]) {
        playChannel(selectedIndex)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }, [isPlaying, sortedChannels, selectedIndex, playChannel])

  // Navigate channels - stop at boundaries, no wrapping
  const handleChannelPrev = useCallback(() => {
    if (selectedIndex > 0) {
      playChannel(selectedIndex - 1)
    }
  }, [selectedIndex, playChannel])

  const handleChannelNext = useCallback(() => {
    if (selectedIndex < sortedChannels.length - 1) {
      playChannel(selectedIndex + 1)
    }
  }, [selectedIndex, sortedChannels.length, playChannel])

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
        case '?':
          // Toggle welcome modal with '?' key
          e.preventDefault()
          setShowWelcome(prev => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleChannelPrev, handleChannelNext, handlePlayPause])

  // Sync current track and cover art from now-playing hook
  useEffect(() => {
    if (nowPlaying?.track) {
      setCurrentTrack(nowPlaying.track)
    }
    // Update hero image with now-playing cover art when available
    if (nowPlaying?.coverUrl) {
      setCurrentImage((prevImage) => {
        if (nowPlaying.coverUrl !== prevImage) {
          setPrevImage(prevImage)
          setIsTransitioning(true)
          setTimeout(() => setIsTransitioning(false), 600)
        }
        return nowPlaying.coverUrl!
      })
    }
  }, [nowPlaying])

  return (
    <div className="tuner">
      {/* Audio element - preload="auto" enables browser buffering for seamless playback */}
      <audio
        ref={audioRef}
        preload="auto"
        onError={() => {
          clearStreamTimeout()
          reportStreamError('ConnectionError', 'Stream connection failed')
          setStreamError('Stream connection failed')
          setIsPlaying(false)
        }}
        onWaiting={() => console.warn('Audio buffering - waiting for data')}
        onStalled={() => console.warn('Audio stalled - network slowdown')}
      />

      {/* Header with logo - hidden while welcome banner is showing */}
      <header className={`app-header ${headerVisible && !showWelcome ? 'visible' : ''}`}>
        <img src="/tuner-logo.svg" alt="tunr" className="header-logo" />
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
        isKexp={selectedChannel?.id.startsWith('kexp:')}
        isNts={selectedChannel?.source === 'nts'}
        ntsBgColor={ntsBgColor || selectedChannel?.bgColor}
        prevNtsBgColor={prevNtsBgColor}
        stationId={selectedChannel?.id}
        stationName={selectedChannel?.title}
        artworkConfig={selectedChannel?.artworkConfig}
      />

      {/* Welcome Modal - lazy loaded */}
      {showWelcome && contentVisible && (
        <Suspense fallback={null}>
          <WelcomeModal
            visible={true}
            onDismiss={() => {
              setShowWelcome(false)
            }}
            onDismissPermanently={() => {
              setShowWelcome(false)
              localStorage.setItem('tuner-welcome-dismissed', 'true')
            }}
          />
        </Suspense>
      )}

      {/* Share Button - visible on home page */}
      <ShareButton
        stationName={selectedChannel?.title || ''}
        visible={contentVisible}
        disabled={!selectedChannel}
      />

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

      {/* Station Controls Group */}
      <div className="station-controls-group">
        {/* Station Count - left aligned */}
        <div
          className={`station-count ${contentVisible ? 'visible' : ''}`}
          onClick={() => setShowStationPicker(true)}
        >
          {isLoading ? 'Loading stations...' :
            sortedChannels.length > 0
              ? `${sortedChannels.length} stations${isFiltering ? ' (filtered)' : ''}`
              : enabledCount === 0
                ? 'No genres selected'
                : 'No stations available'}
          <span className="material-symbols-outlined menu-icon">menu_open</span>
        </div>

        {/* Genre Filter & Sort - above carousel */}
        {contentVisible && (
          <div className="genre-filter-row">
            <SortDropdown
              value={sortOption}
              onChange={setSortOption}
            />
            <GenreFilter
              enabledGenres={enabledGenres}
              onEnableGenre={enableGenre}
              onDisableGenre={disableGenre}
              onEnableAll={enableAll}
            />
          </div>
        )}

        {/* Channel Carousel */}
        <ChannelCarousel
          channels={sortedChannels}
          selectedIndex={selectedIndex}
          onSelectChannel={playChannel}
          visible={contentVisible}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
      </div>


      {/* Station Picker Dropdown - lazy loaded */}
      {showStationPicker && (
        <Suspense fallback={null}>
          <StationPicker
            channels={sortedChannels}
            selectedIndex={selectedIndex}
            onSelectChannel={(index) => {
              playChannel(index)
              setShowStationPicker(false)
            }}
            onClose={() => setShowStationPicker(false)}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        </Suspense>
      )}

      {/* Source Attribution */}
      <div className={`welcome-sources ${contentVisible ? 'visible' : ''}`}>
        <span className="welcome-sources-label">Streams from</span>
        <a href="https://somafm.com/support/donate.html" target="_blank" rel="noopener noreferrer">SomaFM</a>
        <a href="https://radioparadise.com/donate" target="_blank" rel="noopener noreferrer">Radio Paradise</a>
        <a href="https://www.nts.live/gift-supporters" target="_blank" rel="noopener noreferrer">NTS Radio</a>
        <a href="https://www.kexp.org/donate/" target="_blank" rel="noopener noreferrer">KEXP</a>
        <a href="https://buy.stripe.com/7sY28kbWc4EC75waWzgnK00" target="_blank" rel="noopener noreferrer">Like what you hear with tunr? Make a donation</a>
        <button
          className="copy-email-btn"
          onClick={() => {
            navigator.clipboard.writeText('neil.everette@gmail.com')
            setEmailCopied(true)
            setTimeout(() => setEmailCopied(false), 2000)
          }}
        >
          {emailCopied ? 'Copied!' : 'Contact tunr'}
        </button>
      </div>

      {/* Bottom Controls */}
      <PlayerControls
        currentChannel={selectedChannel}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onPrev={handleChannelPrev}
        onNext={handleChannelNext}
        onOpenStationPicker={() => setShowStationPicker(true)}
        visible={contentVisible}
      />
    </div>
  )
}

export default App
