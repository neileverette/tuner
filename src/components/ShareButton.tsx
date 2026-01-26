import { useState, useCallback, useRef, useEffect } from 'react'

interface ShareButtonProps {
  stationName: string
  visible: boolean
  disabled?: boolean
}

interface ShareOption {
  name: string
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
