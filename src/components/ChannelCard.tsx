import type { Channel } from '../types'

interface ChannelCardProps {
  channel: Channel
  index: number
  isSelected: boolean
  onSelect: (index: number) => void
}

function ChannelCard({ channel, index, isSelected, onSelect }: ChannelCardProps) {
  return (
    <div
      className={`carousel-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(index)}
    >
      <img src={channel.image.medium} alt={channel.title} />
      <span className="carousel-item-title">{channel.title}</span>
    </div>
  )
}

export default ChannelCard
