import { useState, useCallback, useRef, useEffect } from 'react'

interface ShareButtonProps {
  stationName: string
  visible: boolean
  disabled?: boolean
}

interface ShareOption {
  name: string
  icon: string | JSX.Element
  color: string
  action: (text: string, url: string) => void
}

function ShareButton({ stationName, visible, disabled = false }: ShareButtonProps) {
  const [showCopied, setShowCopied] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const shareUrl = window.location.origin
  const shareText = stationName
    ? `Check out ${stationName} on tunr!`
    : 'Check out tunr!'

  // Debug logging
  useEffect(() => {
    console.log('🔴 ShareButton MOUNTED', { visible, disabled, stationName })
  }, [])

  useEffect(() => {
    console.log('🔴 ShareButton props changed:', { visible, disabled, stationName })
  }, [visible, disabled, stationName])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDropdown])

  // Close dropdown on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowDropdown(false)
    }
    if (showDropdown) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showDropdown])

  const shareOptions: ShareOption[] = [
    {
      name: 'X',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: '#000000',
      action: (text, url) => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          '_blank',
          'width=550,height=420'
        )
      }
    },
    {
      name: 'Facebook',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: '#1877F2',
      action: (text, url) => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
          '_blank',
          'width=550,height=420'
        )
      }
    },
    {
      name: 'Instagram',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      color: '#E4405F',
      action: async (text, url) => {
        try {
          await navigator.clipboard.writeText(`${text} ${url}`)
          alert('Link copied! Paste it in Instagram.')
        } catch {
          const textArea = document.createElement('textarea')
          textArea.value = `${text} ${url}`
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand('copy')
          document.body.removeChild(textArea)
          alert('Link copied! Paste it in Instagram.')
        }
      }
    },
    {
      name: 'TikTok',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      color: '#000000',
      action: async (text, url) => {
        try {
          await navigator.clipboard.writeText(`${text} ${url}`)
          alert('Link copied! Paste it in TikTok.')
        } catch {
          const textArea = document.createElement('textarea')
          textArea.value = `${text} ${url}`
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand('copy')
          document.body.removeChild(textArea)
          alert('Link copied! Paste it in TikTok.')
        }
      }
    },
  ]

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      setShowCopied(true)
      setShowDropdown(false)
      setTimeout(() => setShowCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = `${shareText} ${shareUrl}`
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setShowCopied(true)
      setShowDropdown(false)
      setTimeout(() => setShowCopied(false), 2000)
    }
  }, [shareText, shareUrl])

  const handleShareClick = (option: ShareOption) => {
    option.action(shareText, shareUrl)
    setShowDropdown(false)
  }

  return (
    <div
      className="share-button-container visible"
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        opacity: 1
      }}
    >
      <button
        ref={buttonRef}
        className="share-pill-button"
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={disabled}
        aria-label="Share station"
        aria-expanded={showDropdown}
      >
        <span className="share-label">Share</span>
        <span className="material-symbols-outlined">chevron_right</span>
      </button>

      {showDropdown && (
        <div ref={dropdownRef} className="share-dropdown">
          <div className="share-dropdown-header">Share to</div>
          <div className="share-dropdown-grid">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                className="share-dropdown-item"
                onClick={() => handleShareClick(option)}
              >
                {option.name}
              </button>
            ))}
            <button className="share-dropdown-item" onClick={handleCopyLink}>
              Copy link
            </button>
            <button className="share-dropdown-item" onClick={() => setShowDropdown(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {showCopied && (
        <div className="share-copied-toast">
          Link copied!
        </div>
      )}
    </div>
  )
}

export default ShareButton
