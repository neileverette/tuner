/**
 * Generated Artwork Component
 * Renders procedurally generated artwork for stations with poor/missing images.
 * Uses canvas-based generation with gradient meshes, patterns, and bold typography.
 */

import { useState, useEffect, useMemo } from 'react'
import { getArtworkDataUrl } from '../utils/generateArtwork'

interface GeneratedArtworkProps {
  stationId: string
  stationName: string
  size: 'thumbnail' | 'hero'
  className?: string
}

const SIZES = {
  thumbnail: { width: 200, height: 200 }, // 2x for retina
  hero: { width: 1920, height: 1080 },
}

function GeneratedArtwork({
  stationId,
  stationName,
  size,
  className = ''
}: GeneratedArtworkProps) {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  const dimensions = SIZES[size]

  // Generate artwork on mount or when props change
  useEffect(() => {
    setIsLoading(true)

    // Use requestIdleCallback for non-blocking generation
    const generate = () => {
      const url = getArtworkDataUrl({
        width: dimensions.width,
        height: dimensions.height,
        stationId,
        stationName,
      })
      setImageUrl(url)
      setIsLoading(false)
    }

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(generate, { timeout: 100 })
      return () => window.cancelIdleCallback(id)
    } else {
      // Fallback for Safari
      const id = setTimeout(generate, 0)
      return () => clearTimeout(id)
    }
  }, [stationId, stationName, dimensions.width, dimensions.height])

  // Memoize the placeholder style
  const placeholderStyle = useMemo(() => ({
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  }), [])

  if (isLoading || !imageUrl) {
    return (
      <div
        className={`generated-artwork generated-artwork-loading ${className}`}
        style={placeholderStyle}
      />
    )
  }

  return (
    <img
      src={imageUrl}
      alt={stationName}
      className={`generated-artwork ${className}`}
      loading="lazy"
    />
  )
}

export default GeneratedArtwork
