interface WelcomeModalProps {
  visible: boolean
  onDismiss: () => void
  onDismissPermanently: () => void
}

function WelcomeModal({ visible, onDismiss, onDismissPermanently }: WelcomeModalProps) {
  if (!visible) return null

  return (
    <div className="welcome-overlay" onClick={onDismiss}>
      <div className="welcome-banner" onClick={(e) => e.stopPropagation()}>
      <button className="welcome-close" onClick={onDismiss} aria-label="Close">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>

      <div className="welcome-header">
        <img src="/tuner-logo.svg" alt="Tuner" className="welcome-logo-img" />
      </div>

      <div className="welcome-content">
        <h1>Welcome to Tuner</h1>

        <p className="welcome-tagline">
          Free, open music player inspired by radio.<br />
          Tuner is about music discovery.<br />
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
            Click station guide to search. <button className="welcome-dont-show" onClick={onDismissPermanently}>Don't show again</button>
          </p>
        </div>
      </div>

      </div>
    </div>
  )
}

export default WelcomeModal
