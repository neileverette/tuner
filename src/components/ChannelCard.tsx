import type { Channel } from '../types'

interface ChannelCardProps {
  channel: Channel
  index: number
  isSelected: boolean
  onSelect: (index: number) => void
}

function getSourceFromId(id: string): 'somafm' | 'rp' | null {
  if (id.startsWith('somafm:')) return 'somafm'
  if (id.startsWith('rp:')) return 'rp'
  return null
}

function ChannelCard({ channel, index, isSelected, onSelect }: ChannelCardProps) {
  const source = getSourceFromId(channel.id)

  return (
    <div
      className={`carousel-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(index)}
    >
      <div className="carousel-item-image-wrapper">
        <img src={channel.image.medium} alt={channel.title} />
        {source && <span className={`source-badge source-${source}`}>{source === 'rp' ? 'RP' : 'SF'}</span>}
      </div>
      <span className="carousel-item-title">{channel.title}</span>
    </div>
  )
}

export default ChannelCard
