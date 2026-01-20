import type { Channel } from '../types/channel'

interface PlayerControlsProps {
  currentChannel: Channel | undefined
  currentTrack: string
  isPlaying: boolean
  onPlayPause: () => void
  onOpenStationPicker: () => void
  visible: boolean
}

function PlayerControls({
  currentChannel,
  currentTrack,
  isPlaying,
  onPlayPause,
  onOpenStationPicker,
  visible
}: PlayerControlsProps) {
  return (
    <div className={`controls ${visible ? 'visible' : ''}`}>
      <div className="track-info" onClick={onOpenStationPicker}>
        <span className="playlist-name">
          {currentChannel?.title || 'Select Station'}
        </span>
        <span className="song-name">{currentTrack || 'No track info'}</span>
        <span className="artist">{currentChannel?.genre || ''}</span>
      </div>

      <div className="playback-controls">
        <button className="control-btn play-btn" onClick={onPlayPause}>
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
        <span>{currentChannel?.listeners ?? 0} listeners</span>
      </div>
    </div>
  )
}

export default PlayerControls
