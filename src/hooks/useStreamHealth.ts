import { useRef, useCallback } from 'react'

const STREAM_TIMEOUT_MS = 8000 // 8 seconds to start playing

interface StreamFailure {
  stationName: string
  stationId: string
  errorType: string
  details: string
}

async function reportStreamFailure(failure: StreamFailure): Promise<void> {
  try {
    await fetch('/api/stream-failure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(failure)
    })
  } catch (err) {
    console.error('Failed to report stream failure:', err)
  }
}

export function useStreamHealth() {
  const timeoutRef = useRef<number | null>(null)
  const currentStationRef = useRef<{ id: string; name: string } | null>(null)

  const startTimeout = useCallback((stationId: string, stationName: string) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    currentStationRef.current = { id: stationId, name: stationName }

    // Set timeout for stream to start
    timeoutRef.current = window.setTimeout(() => {
      console.warn(`Stream timeout: ${stationName} (${stationId}) failed to start within ${STREAM_TIMEOUT_MS}ms`)

      reportStreamFailure({
        stationName,
        stationId,
        errorType: 'Timeout',
        details: `Stream did not start within ${STREAM_TIMEOUT_MS / 1000} seconds`
      })
    }, STREAM_TIMEOUT_MS)
  }, [])

  const cancelTimeout = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const reportError = useCallback((errorType: string, details: string) => {
    const station = currentStationRef.current
    if (station) {
      reportStreamFailure({
        stationName: station.name,
        stationId: station.id,
        errorType,
        details
      })
    }
  }, [])

  return {
    startTimeout,
    cancelTimeout,
    reportError
  }
}
