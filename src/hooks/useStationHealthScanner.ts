/**
 * Station Health Scanner
 * Periodically scans stations to detect dead/offline streams.
 * Removes broken stations from the available list.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Channel } from '../types/channel'

interface StationHealth {
  stationId: string
  lastChecked: number
  isHealthy: boolean
  failureCount: number
  lastError?: string
}

interface UseStationHealthScannerOptions {
  /** Interval between full scans in milliseconds (default: 5 minutes) */
  scanInterval?: number
  /** Timeout for each stream check in milliseconds (default: 8 seconds) */
  checkTimeout?: number
  /** Number of concurrent checks (default: 5) */
  concurrency?: number
  /** Enable scanner (default: true) */
  enabled?: boolean
}

const DEFAULT_SCAN_INTERVAL = 5 * 60 * 1000 // 5 minutes
const DEFAULT_CHECK_TIMEOUT = 8000 // 8 seconds
const DEFAULT_CONCURRENCY = 5

/**
 * Check if a stream URL is reachable
 */
async function checkStreamHealth(
  streamUrl: string,
  timeout: number
): Promise<{ healthy: boolean; error?: string }> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    // Use HEAD request first (faster), fall back to GET with range
    await fetch(streamUrl, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors', // Streams often don't have CORS headers
    })

    clearTimeout(timeoutId)

    // With no-cors, we can't read status, but if fetch completes without error,
    // the server responded (opaque response)
    return { healthy: true }
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { healthy: false, error: 'Timeout' }
      }
      return { healthy: false, error: error.message }
    }
    return { healthy: false, error: 'Unknown error' }
  }
}

/**
 * Process items in batches with concurrency limit
 */
async function processInBatches<T, R>(
  items: T[],
  concurrency: number,
  processor: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency)
    const batchResults = await Promise.all(batch.map(processor))
    results.push(...batchResults)
  }

  return results
}

export function useStationHealthScanner(
  channels: Channel[],
  getStreamUrl: (channel: Channel) => string,
  options: UseStationHealthScannerOptions = {}
) {
  const {
    scanInterval = DEFAULT_SCAN_INTERVAL,
    checkTimeout = DEFAULT_CHECK_TIMEOUT,
    concurrency = DEFAULT_CONCURRENCY,
    enabled = true,
  } = options

  const [healthyChannels, setHealthyChannels] = useState<Channel[]>(channels)
  const [unhealthyIds, setUnhealthyIds] = useState<Set<string>>(new Set())
  const [isScanning, setIsScanning] = useState(false)
  const [lastScanTime, setLastScanTime] = useState<number | null>(null)
  const [scanProgress, setScanProgress] = useState({ checked: 0, total: 0 })

  const healthMapRef = useRef<Map<string, StationHealth>>(new Map())
  const scanIntervalRef = useRef<number | null>(null)

  // Scan a single channel
  const scanChannel = useCallback(
    async (channel: Channel): Promise<StationHealth> => {
      const streamUrl = getStreamUrl(channel)
      const existingHealth = healthMapRef.current.get(channel.id)

      const result = await checkStreamHealth(streamUrl, checkTimeout)

      const health: StationHealth = {
        stationId: channel.id,
        lastChecked: Date.now(),
        isHealthy: result.healthy,
        failureCount: result.healthy
          ? 0
          : (existingHealth?.failureCount ?? 0) + 1,
        lastError: result.error,
      }

      healthMapRef.current.set(channel.id, health)
      return health
    },
    [getStreamUrl, checkTimeout]
  )

  // Run a full scan of all channels
  const runScan = useCallback(async () => {
    if (!enabled || channels.length === 0) return

    setIsScanning(true)
    setScanProgress({ checked: 0, total: channels.length })

    console.log(`[HealthScanner] Starting scan of ${channels.length} stations...`)

    let checkedCount = 0
    const newUnhealthyIds = new Set<string>()

    await processInBatches(channels, concurrency, async (channel) => {
      const health = await scanChannel(channel)
      checkedCount++
      setScanProgress({ checked: checkedCount, total: channels.length })

      if (!health.isHealthy) {
        newUnhealthyIds.add(channel.id)
        console.warn(
          `[HealthScanner] Station unhealthy: ${channel.title} (${channel.id}) - ${health.lastError}`
        )
      }

      return health
    })

    // Update state with scan results
    setUnhealthyIds(newUnhealthyIds)
    setHealthyChannels(channels.filter((ch) => !newUnhealthyIds.has(ch.id)))
    setLastScanTime(Date.now())
    setIsScanning(false)

    console.log(
      `[HealthScanner] Scan complete. ${newUnhealthyIds.size} unhealthy stations removed.`
    )
  }, [channels, enabled, concurrency, scanChannel])

  // Run initial scan when channels change
  useEffect(() => {
    if (channels.length > 0 && enabled) {
      // Small delay to let the UI settle first
      const initialScanTimeout = setTimeout(() => {
        runScan()
      }, 1000)

      return () => clearTimeout(initialScanTimeout)
    }
  }, [channels.length, enabled]) // Only re-run when channel count changes

  // Set up periodic scanning
  useEffect(() => {
    if (!enabled) {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
        scanIntervalRef.current = null
      }
      return
    }

    scanIntervalRef.current = window.setInterval(() => {
      runScan()
    }, scanInterval)

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
        scanIntervalRef.current = null
      }
    }
  }, [enabled, scanInterval, runScan])

  // When channels prop changes, filter out known unhealthy ones
  useEffect(() => {
    if (unhealthyIds.size > 0) {
      setHealthyChannels(channels.filter((ch) => !unhealthyIds.has(ch.id)))
    } else {
      setHealthyChannels(channels)
    }
  }, [channels, unhealthyIds])

  // Manual trigger for re-scan
  const triggerScan = useCallback(() => {
    if (!isScanning) {
      runScan()
    }
  }, [isScanning, runScan])

  // Get health status for a specific station
  const getStationHealth = useCallback((stationId: string): StationHealth | null => {
    return healthMapRef.current.get(stationId) ?? null
  }, [])

  // Clear unhealthy status for a station (e.g., after manual retry)
  const clearUnhealthyStatus = useCallback((stationId: string) => {
    healthMapRef.current.delete(stationId)
    setUnhealthyIds((prev) => {
      const next = new Set(prev)
      next.delete(stationId)
      return next
    })
  }, [])

  return {
    /** Channels filtered to only healthy ones */
    healthyChannels,
    /** Set of station IDs that failed health checks */
    unhealthyIds,
    /** Whether a scan is currently in progress */
    isScanning,
    /** Timestamp of last completed scan */
    lastScanTime,
    /** Progress of current scan */
    scanProgress,
    /** Manually trigger a scan */
    triggerScan,
    /** Get health status for a specific station */
    getStationHealth,
    /** Clear unhealthy status for a station */
    clearUnhealthyStatus,
    /** Number of unhealthy stations */
    unhealthyCount: unhealthyIds.size,
  }
}
