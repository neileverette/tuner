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
