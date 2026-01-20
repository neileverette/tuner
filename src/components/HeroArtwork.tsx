interface HeroArtworkProps {
  currentImage: string
  prevImage: string
  isTransitioning: boolean
  transitionDirection: 'left' | 'right'
  altText: string
  isKexp?: boolean
}

function HeroArtwork({
  currentImage,
  prevImage,
  isTransitioning,
  transitionDirection,
  altText,
  isKexp = false
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
