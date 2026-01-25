interface WelcomeModalProps {
  visible: boolean
  onDismiss: () => void
  onDismissPermanently: () => void
}

function WelcomeModal({ visible }: WelcomeModalProps) {
  if (!visible) return null

  return (
    <div className="welcome-overlay">
      <div className="welcome-banner">
      <div className="welcome-header">
        <img src="/tuner-logo.svg" alt="tunr" className="welcome-logo-img" />
      </div>

      <div className="welcome-content">
        <h1>Welcome to tunr</h1>

        <p className="welcome-tagline">
          Free, open music player inspired by radio.<br />
          tunr is about music discovery.<br />
          Designed for the keyboard — because flow matters.
        </p>

        <p className="welcome-description">
          You switch stations. We handle the rest.<br />
          No subscriptions. No music clones.
        </p>

        <div className="welcome-controls">
          <p>
            Use <strong>&larr; left</strong> and <strong>right &rarr;</strong> to tune. <strong>Spacebar ␣</strong> to play/pause.
          </p>
          <p className="welcome-hint">
            Click station guide to search.
          </p>
        </div>
      </div>

      </div>
    </div>
  )
}

export default WelcomeModal
