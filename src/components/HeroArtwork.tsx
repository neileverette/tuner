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
  prevNtsBgColor
}: HeroArtworkProps) {
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

  if (isNts) {
    return (
      <div className="hero-artwork">
        {prevNtsBgColor && (
          <div
            className={`hero-nts-logo hero-nts-prev ${isTransitioning ? `transitioning ${transitionDirection}` : ''}`}
            style={{ backgroundColor: prevNtsBgColor }}
          >
            <span className="hero-nts-blur">NTS</span>
            <span className="hero-nts-main">NTS</span>
          </div>
        )}
        <div
          className={`hero-nts-logo hero-nts-current ${isTransitioning ? `transitioning ${transitionDirection}` : ''}`}
          style={{ backgroundColor: ntsBgColor }}
        >
          <span className="hero-nts-blur">NTS</span>
          <span className="hero-nts-main">NTS</span>
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
      {currentImage && (
        <img
          src={currentImage}
          alt={altText}
          className={`hero-image hero-image-current ${isTransitioning ? `transitioning ${transitionDirection}` : ''}`}
        />
      )}
    </div>
  )
}

export default HeroArtwork
