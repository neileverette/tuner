interface SplashScreenProps {
  phase: 'visible' | 'fading' | 'hidden'
  backgroundImage: string
}

function SplashScreen({ phase, backgroundImage }: SplashScreenProps) {
  return (
    <div className={`splash-screen ${phase}`}>
      <div
        className="splash-blur-bg"
        style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined }}
      />
      <div className="splash-overlay" />
      <img src="/tuner-logo.svg" alt="Tuner" className="splash-logo" />
    </div>
  )
}

export default SplashScreen
