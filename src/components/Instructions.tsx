interface InstructionsProps {
  visible: boolean
  onDismiss: () => void
}

function Instructions({ visible, onDismiss }: InstructionsProps) {
  return (
    <div className={`instructions-inline ${visible ? 'visible' : ''}`}>
      <span>Use <strong>&larr; left</strong> and <strong>right &rarr;</strong> to tune. <strong>Spacebar &#x2423;</strong> to play/pause. Click station guide to search.</span>
      <button className="instructions-close" onClick={onDismiss}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </div>
  )
}

export default Instructions
