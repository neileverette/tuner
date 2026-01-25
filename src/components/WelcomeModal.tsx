import { useState } from 'react'

interface WelcomeModalProps {
  visible: boolean
  onDismiss: () => void
  onDismissPermanently: () => void
}

function WelcomeModal({ visible, onDismiss, onDismissPermanently }: WelcomeModalProps) {
  const [showDonationPanel, setShowDonationPanel] = useState(false)

  if (!visible) return null

  return (
    <div className="welcome-overlay">
      <div className="welcome-banner">
      <div className="welcome-header">
        <img src="/tuner-logo.svg" alt="tunr" className="welcome-logo-img" />
        <button
          className="welcome-chevron-btn"
          onClick={() => setShowDonationPanel(true)}
          aria-label="Close options"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12l4 4 4-4" />
          </svg>
        </button>
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

      {/* Donation Panel */}
      {showDonationPanel && (
        <div className="donation-panel">
          <h3>Before you go, won't you make a donation to our sponsor for keeping music free</h3>

          <div className="donation-links">
            <a href="https://somafm.com/support/donate.html" target="_blank" rel="noopener noreferrer">SomaFM</a>
            <a href="https://radioparadise.com/donate" target="_blank" rel="noopener noreferrer">Radio Paradise</a>
            <a href="https://www.nts.live/gift-supporters" target="_blank" rel="noopener noreferrer">NTS Radio</a>
            <a href="https://www.kexp.org/donate/" target="_blank" rel="noopener noreferrer">KEXP</a>
          </div>

          <div className="donation-actions">
            <button onClick={onDismiss} className="donation-close-btn">Close for now</button>
            <button onClick={onDismissPermanently} className="donation-dont-show-btn">Don't show again</button>
          </div>
        </div>
      )}

      </div>
    </div>
  )
}

export default WelcomeModal
