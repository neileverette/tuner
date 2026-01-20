import type { Channel } from '../types'

interface ChannelCardProps {
  channel: Channel
  index: number
  isSelected: boolean
  onSelect: (index: number) => void
  overrideImage?: string | null
}

function getSourceFromId(id: string): 'kexp' | 'somafm' | 'rp' | null {
  if (id.startsWith('kexp:')) return 'kexp'
  if (id.startsWith('somafm:')) return 'somafm'
  if (id.startsWith('rp:')) return 'rp'
  return null
}

function getSourceBadgeLabel(source: 'kexp' | 'somafm' | 'rp'): string {
  switch (source) {
    case 'kexp': return 'KEXP'
    case 'rp': return 'RP'
    default: return 'SF'
  }
}

// Radio Paradise logo as fallback when no album art available
const RP_FALLBACK_IMAGE = 'https://img.radioparadise.com/logos/rp_logo_128.png'

function ChannelCard({ channel, index, isSelected, onSelect, overrideImage }: ChannelCardProps) {
  const source = getSourceFromId(channel.id)

  // Use override image if provided, otherwise channel default, with RP fallback
  const imageUrl = overrideImage
    ?? channel.image.medium
    ?? (source === 'rp' ? RP_FALLBACK_IMAGE : '')

  return (
    <div
      className={`carousel-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(index)}
    >
      <div className="carousel-item-image-wrapper">
        <img src={imageUrl} alt={channel.title} />
        {source && <span className={`source-badge source-${source}`}>{getSourceBadgeLabel(source)}</span>}
      </div>
      <span className="carousel-item-title">{channel.title}</span>
    </div>
  )
}

export default ChannelCard
