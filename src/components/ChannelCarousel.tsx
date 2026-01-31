import { useRef, useEffect } from 'react'
import type { Channel } from '../types'
import ChannelCard from './ChannelCard'

interface ChannelCarouselProps {
  channels: Channel[]
  selectedIndex: number
  onSelectChannel: (index: number) => void
  visible: boolean
  getOverrideImage?: (channelId: string) => string | null
  isFavorite?: (channelId: string) => boolean
  onToggleFavorite?: (channelId: string) => void
}

function ChannelCarousel({
  channels,
  selectedIndex,
  onSelectChannel,
  visible,
  isFavorite,
  onToggleFavorite,
}: ChannelCarouselProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  // Scroll carousel to selected item
  useEffect(() => {
    if (!carouselRef.current || channels.length === 0) return
    const carousel = carouselRef.current
    const totalItems = channels.length
    const maxScroll = carousel.scrollWidth - carousel.clientWidth
    const progress = totalItems > 1 ? selectedIndex / (totalItems - 1) : 0
    const targetScroll = progress * maxScroll
    carousel.scrollTo({ left: targetScroll, behavior: 'smooth' })
  }, [selectedIndex, channels.length])

  // Drag handlers for carousel
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return
    isDragging.current = true
    startX.current = e.pageX - carouselRef.current.offsetLeft
    scrollLeft.current = carouselRef.current.scrollLeft
    carouselRef.current.style.cursor = 'grabbing'
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !carouselRef.current) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5
    carouselRef.current.scrollLeft = scrollLeft.current - walk
  }

  const handleMouseUp = () => {
    isDragging.current = false
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab'
    }
  }

  const handleMouseLeave = () => {
    isDragging.current = false
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab'
    }
  }

  return (
    <div
      className={`carousel ${visible ? 'visible' : ''}`}
      ref={carouselRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {channels.map((channel, index) => (
        <div key={channel.id} className="carousel-item-container">
          <ChannelCard
            channel={channel}
            index={index}
            isSelected={index === selectedIndex}
            onSelect={onSelectChannel}
            isFavorite={isFavorite?.(channel.id)}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      ))}
    </div>
  )
}

export default ChannelCarousel
