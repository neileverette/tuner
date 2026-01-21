const NTS_LOGO = 'https://media.ntslive.co.uk/crop/770x770/d0a1a0e6-a19a-48f4-884a-c3b72e76dd45_1551974400.png'

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
            <img src={NTS_LOGO} alt="" className="hero-nts-blur" />
            <img src={NTS_LOGO} alt="NTS" className="hero-nts-main" />
          </div>
        )}
        <div
          className={`hero-nts-logo hero-nts-current ${isTransitioning ? `transitioning ${transitionDirection}` : ''}`}
          style={{ backgroundColor: ntsBgColor }}
        >
          <img src={NTS_LOGO} alt="" className="hero-nts-blur" />
          <img src={NTS_LOGO} alt="NTS" className="hero-nts-main" />
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
