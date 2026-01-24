import { useState } from 'react'
import { generateFallbackThumbnail } from '../utils/thumbnailFallback'

interface HeroArtworkProps {
  currentImage: string
  prevImage: string
  isTransitioning: boolean
  transitionDirection: 'left' | 'right'
  altText: string
  isKexp?: boolean
  isNts?: boolean
  ntsBgColor?: string
  prevNtsBgColor?: string
  stationId?: string
  stationName?: string
}

function HeroArtwork({
  currentImage,
  prevImage,
  isTransitioning,
  transitionDirection,
  altText,
  isKexp = false,
  isNts = false,
  ntsBgColor,
  prevNtsBgColor,
  stationId,
  stationName
}: HeroArtworkProps) {
  const [imageError, setImageError] = useState(false)
  const [failedImage, setFailedImage] = useState<string>('')
  
  // Reset error state when image changes
  if (currentImage !== failedImage && imageError) {
    setImageError(false)
    setFailedImage('')
  }
  
  // Generate fallback thumbnail data - only use fallback if current image failed to load
  const fallback = stationId && stationName
    ? generateFallbackThumbnail(stationId, stationName, imageError ? '' : currentImage)
    : null

  const handleImageError = () => {
    setImageError(true)
    setFailedImage(currentImage)
  }
  if (isKexp) {
    return (
      <div className="hero-artwork">
        <div className="hero-kexp-logo">
          <img src="https://www.kexp.org/static/assets/img/logo-header.svg" alt="" className="hero-kexp-blur" />
          <img src="https://www.kexp.org/static/assets/img/logo-header.svg" alt="KEXP" className="hero-kexp-main" />
        </div>
      </div>
    )
  }

  const ntsLogoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/NTS_Radio_logo.svg/250px-NTS_Radio_logo.svg.png'

  if (isNts) {
    return (
      <div className="hero-artwork">
        {prevNtsBgColor && (
          <div
            className={`hero-nts-logo hero-nts-prev ${isTransitioning ? `transitioning ${transitionDirection}` : ''}`}
            style={{ backgroundColor: prevNtsBgColor }}
          >
            <img src={ntsLogoUrl} alt="" className="hero-nts-blur" />
            <img src={ntsLogoUrl} alt="NTS" className="hero-nts-main" />
          </div>
        )}
        <div
          className={`hero-nts-logo hero-nts-current ${isTransitioning ? `transitioning ${transitionDirection}` : ''}`}
          style={{ backgroundColor: ntsBgColor }}
        >
          <img src={ntsLogoUrl} alt="" className="hero-nts-blur" />
          <img src={ntsLogoUrl} alt="NTS" className="hero-nts-main" />
        </div>
      </div>
    )
  }

  return (
    <div className="hero-artwork">
      {prevImage && (
        <img
          src={prevImage}
          alt=""
          className={`hero-image hero-image-prev ${isTransitioning ? `transitioning ${transitionDirection}` : ''}`}
        />
      )}
      {fallback?.needsFallback ? (
        <div
          className={`hero-fallback hero-image-current ${isTransitioning ? `transitioning ${transitionDirection}` : ''}`}
          style={{ backgroundColor: fallback.backgroundColor }}
        >
          <span className="hero-fallback-initials">{fallback.initials}</span>
        </div>
      ) : currentImage ? (
        <img
          src={currentImage}
          alt={altText}
          className={`hero-image hero-image-current ${isTransitioning ? `transitioning ${transitionDirection}` : ''}`}
          onError={handleImageError}
        />
      ) : null}
    </div>
  )
}

export default HeroArtwork
