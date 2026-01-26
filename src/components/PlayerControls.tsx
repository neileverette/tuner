import { useState, useEffect, useRef } from 'react'
import type { Channel } from '../types/channel'

interface PlayerControlsProps {
  currentChannel: Channel | undefined
  currentTrack: string
  isPlaying: boolean
  onPlayPause: () => void
  onPrev: () => void
  onNext: () => void
  onOpenStationPicker: () => void
  visible: boolean
}

function PlayerControls({
  currentChannel,
  currentTrack,
  isPlaying,
  onPlayPause,
  onPrev,
  onNext,
  onOpenStationPicker: _onOpenStationPicker,
  visible
}: PlayerControlsProps) {
  void _onOpenStationPicker // Preserved for future use
  const [displayedChannel, setDisplayedChannel] = useState(currentChannel)
  const [displayedTrack, setDisplayedTrack] = useState(currentTrack)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const prevChannelId = useRef(currentChannel?.id)

  useEffect(() => {
    // Only animate when channel changes, not on initial load or track updates
    if (currentChannel?.id !== prevChannelId.current && prevChannelId.current !== undefined) {
      setIsTransitioning(true)

      // After fade out, update content and fade in
      const timeout = setTimeout(() => {
        setDisplayedChannel(currentChannel)
        setDisplayedTrack(currentTrack)
        setIsTransitioning(false)
      }, 150)

      return () => clearTimeout(timeout)
    } else {
      // No animation for track updates on same channel
      setDisplayedChannel(currentChannel)
      setDisplayedTrack(currentTrack)
    }
    prevChannelId.current = currentChannel?.id
  }, [currentChannel, currentTrack])

  const trackText = displayedTrack && displayedTrack !== 'No track info' ? displayedTrack : 'Grooving tune unknown'

  return (
    <div className={`controls ${visible ? 'visible' : ''}`}>
      <div className="track-info">
        <span className={`playlist-name ${isTransitioning ? 'transitioning' : ''}`}>
          {displayedChannel?.title || 'Select Station'}
        </span>
        <span className={`song-name ${isTransitioning ? 'transitioning' : ''}`}>{trackText}</span>
        <span className={`artist ${isTransitioning ? 'transitioning' : ''}`}>{displayedChannel?.genre || ''}</span>
      </div>

      {/* Fixed right: transport controls with listeners below */}
      <div className="play-section">
        <div className="transport-controls">
          <button className="control-btn chevron-btn" onClick={onPrev}>
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className={`control-btn play-btn ${isPlaying ? 'playing' : ''}`} onClick={onPlayPause}>
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
          <button className="control-btn chevron-btn" onClick={onNext}>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
        <span className="listeners-count">
          {currentChannel?.listeners != null && currentChannel.listeners > 0
            ? `${currentChannel.listeners.toLocaleString()} listeners`
            : 'Lots of listeners'}
        </span>
      </div>
    </div>
  )
}

export default PlayerControls
