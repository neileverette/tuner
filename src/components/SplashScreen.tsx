interface SplashScreenProps {
  phase: 'visible' | 'fading' | 'hidden'
  backgroundImage: string
}

import tunerLogo from '../assets/tuner-logo.svg'

function SplashScreen({ phase, backgroundImage }: SplashScreenProps) {
  return (
    <div className={`splash-screen ${phase}`}>
      <div
        className="splash-blur-bg"
        style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined }}
      />
      <div className="splash-overlay" />
      <img src={tunerLogo} alt="tunr" className="splash-logo" />
    </div>
  )
}

export default SplashScreen
