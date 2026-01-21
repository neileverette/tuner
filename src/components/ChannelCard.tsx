import type { Channel } from '../types'

interface ChannelCardProps {
  channel: Channel
  index: number
  isSelected: boolean
  onSelect: (index: number) => void
  overrideImage?: string | null
  isFavorite?: boolean
  onToggleFavorite?: (channelId: string) => void
}

function getSourceFromId(id: string): 'kexp' | 'somafm' | 'rp' | 'nts' | null {
  if (id.startsWith('kexp:')) return 'kexp'
  if (id.startsWith('somafm:')) return 'somafm'
  if (id.startsWith('rp:')) return 'rp'
  if (id.startsWith('nts:')) return 'nts'
  return null
}

function getSourceBadgeLabel(source: 'kexp' | 'somafm' | 'rp' | 'nts'): string {
  switch (source) {
    case 'kexp': return 'KEXP'
    case 'rp': return 'RP'
    case 'nts': return 'NTS'
    default: return 'SF'
  }
}

// Radio Paradise logo as fallback when no album art available
const RP_FALLBACK_IMAGE = 'https://img.radioparadise.com/logos/rp_logo_128.png'

// Generate seeded random number from string
function seededRandom(seed: string, index: number): number {
  let hash = 0
  const str = seed + index
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash % 100) / 100
}

// Generate random circles for NTS thumbnails
function generateCircles(channelId: string): React.CSSProperties[] {
  const circles: React.CSSProperties[] = []
  const numCircles = 3 + Math.floor(seededRandom(channelId, 999) * 4) // 3-6 circles

  for (let i = 0; i < numCircles; i++) {
    const size = 20 + seededRandom(channelId, i * 10) * 60 // 20-80px
    const left = seededRandom(channelId, i * 10 + 1) * 100 // 0-100%
    const top = seededRandom(channelId, i * 10 + 2) * 100 // 0-100%
    const opacity = 0.08 + seededRandom(channelId, i * 10 + 3) * 0.15 // 0.08-0.23

    circles.push({
      position: 'absolute',
      width: `${size}%`,
      height: `${size}%`,
      left: `${left}%`,
      top: `${top}%`,
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, ' + opacity + ')',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
    })
  }
  return circles
}

function ChannelCard({ channel, index, isSelected, onSelect, overrideImage, isFavorite = false, onToggleFavorite }: ChannelCardProps) {
  const source = getSourceFromId(channel.id)
  const isKexp = source === 'kexp'
  const isNts = source === 'nts'

  // Use override image if provided, otherwise channel default, with RP fallback
  const imageUrl = overrideImage
    ?? channel.image.medium
    ?? (source === 'rp' ? RP_FALLBACK_IMAGE : '')

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite?.(channel.id)
  }

  return (
    <div
      className={`carousel-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(index)}
    >
      <div className="carousel-item-image-wrapper">
        {isKexp ? (
          <div className="kexp-logo-container">
            <img src="https://www.kexp.org/static/assets/img/logo-header.svg" alt="KEXP" />
          </div>
        ) : isNts ? (
          <div className="nts-logo-container" style={{ backgroundColor: channel.bgColor || '#1a1a1a' }}>
            {generateCircles(channel.id).map((style, i) => (
              <div key={i} style={style} />
            ))}
            <img src={channel.image.medium} alt="" className="nts-logo-blur" />
            <img src={channel.image.medium} alt="NTS" className="nts-logo-img" />
          </div>
        ) : (
          <img src={imageUrl} alt={channel.title} />
        )}
        {source && !isKexp && !isNts && <span className={`source-badge source-${source}`}>{getSourceBadgeLabel(source)}</span>}
        <button
          className={`favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <span className="material-symbols-outlined">favorite</span>
        </button>
      </div>
      <span className="carousel-item-title">{channel.title}</span>
    </div>
  )
}

export default ChannelCard
