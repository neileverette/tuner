/**
 * Generative artwork system for stations with poor/missing thumbnails.
 * Creates unique, visually striking artwork with bold typography,
 * gradient meshes, geometric patterns, and textures.
 */

// Seeded random number generator (mulberry32)
function seededRandom(seed: string): () => number {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 2654435761)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2654435761)
    h = Math.imul(h ^ (h >>> 16), 2654435761)
    return (h >>> 0) / 4294967296
  }
}

// Color palettes - curated for visual impact
const COLOR_PALETTES = [
  // Deep ocean
  ['#0f0c29', '#302b63', '#24243e', '#1a1a2e'],
  // Sunset fire
  ['#d62828', '#f77f00', '#fcbf49', '#003049'],
  // Neon nights
  ['#7400b8', '#6930c3', '#5e60ce', '#4cc9f0'],
  // Forest mist
  ['#1b4332', '#2d6a4f', '#40916c', '#52b788'],
  // Midnight purple
  ['#10002b', '#240046', '#3c096c', '#5a189a'],
  // Electric blue
  ['#03045e', '#023e8a', '#0077b6', '#00b4d8'],
  // Warm coral
  ['#6d597a', '#b56576', '#e56b6f', '#eaac8b'],
  // Golden hour
  ['#582f0e', '#7f4f24', '#936639', '#c9a227'],
  // Arctic
  ['#caf0f8', '#90e0ef', '#00b4d8', '#0077b6'],
  // Noir
  ['#14213d', '#1d3557', '#457b9d', '#e9d8a6'],
]

interface ArtworkOptions {
  width: number
  height: number
  stationId: string
  stationName: string
}

/**
 * Generate artwork as a data URL
 */
export function generateArtworkDataUrl(options: ArtworkOptions): string {
  const canvas = document.createElement('canvas')
  canvas.width = options.width
  canvas.height = options.height
  const ctx = canvas.getContext('2d')

  if (!ctx) return ''

  const rand = seededRandom(options.stationId)

  // Select color palette
  const paletteIndex = Math.floor(rand() * COLOR_PALETTES.length)
  const palette = COLOR_PALETTES[paletteIndex]

  // Draw gradient mesh background
  drawGradientMesh(ctx, options.width, options.height, palette, rand)

  // Draw geometric patterns
  drawGeometricPatterns(ctx, options.width, options.height, palette, rand)

  // Add noise texture
  drawNoiseTexture(ctx, options.width, options.height, rand)

  // Draw bold typography
  drawTypography(ctx, options.width, options.height, options.stationName, palette, rand)

  // Add vignette
  drawVignette(ctx, options.width, options.height)

  return canvas.toDataURL('image/png')
}

/**
 * Draw multi-point gradient mesh
 */
function drawGradientMesh(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: string[],
  rand: () => number
) {
  // Base fill
  ctx.fillStyle = palette[0]
  ctx.fillRect(0, 0, width, height)

  // Create multiple overlapping radial gradients
  const numGradients = 3 + Math.floor(rand() * 3)

  for (let i = 0; i < numGradients; i++) {
    const x = rand() * width
    const y = rand() * height
    const radius = Math.max(width, height) * (0.3 + rand() * 0.7)
    const colorIndex = Math.floor(rand() * palette.length)

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, palette[colorIndex] + 'cc')
    gradient.addColorStop(0.5, palette[colorIndex] + '66')
    gradient.addColorStop(1, 'transparent')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }
}

/**
 * Draw geometric patterns
 */
function drawGeometricPatterns(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: string[],
  rand: () => number
) {
  const patternType = Math.floor(rand() * 4)

  ctx.globalCompositeOperation = 'soft-light'

  switch (patternType) {
    case 0:
      drawCirclePattern(ctx, width, height, palette, rand)
      break
    case 1:
      drawLinePattern(ctx, width, height, palette, rand)
      break
    case 2:
      drawWavePattern(ctx, width, height, palette, rand)
      break
    case 3:
      drawGridPattern(ctx, width, height, palette, rand)
      break
  }

  ctx.globalCompositeOperation = 'source-over'
}

function drawCirclePattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: string[],
  rand: () => number
) {
  const numCircles = 5 + Math.floor(rand() * 10)

  for (let i = 0; i < numCircles; i++) {
    const x = rand() * width
    const y = rand() * height
    const radius = 20 + rand() * Math.min(width, height) * 0.3
    const colorIndex = Math.floor(rand() * palette.length)

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.strokeStyle = palette[colorIndex] + '40'
    ctx.lineWidth = 2 + rand() * 8
    ctx.stroke()
  }
}

function drawLinePattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: string[],
  rand: () => number
) {
  const numLines = 10 + Math.floor(rand() * 20)
  const angle = rand() * Math.PI

  ctx.save()
  ctx.translate(width / 2, height / 2)
  ctx.rotate(angle)

  for (let i = 0; i < numLines; i++) {
    const offset = (i - numLines / 2) * (width / numLines) * 1.5
    const colorIndex = Math.floor(rand() * palette.length)

    ctx.beginPath()
    ctx.moveTo(offset, -height)
    ctx.lineTo(offset, height)
    ctx.strokeStyle = palette[colorIndex] + '30'
    ctx.lineWidth = 1 + rand() * 4
    ctx.stroke()
  }

  ctx.restore()
}

function drawWavePattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: string[],
  rand: () => number
) {
  const numWaves = 3 + Math.floor(rand() * 5)

  for (let w = 0; w < numWaves; w++) {
    const amplitude = 20 + rand() * 60
    const frequency = 0.01 + rand() * 0.03
    const phase = rand() * Math.PI * 2
    const yOffset = height * (0.2 + rand() * 0.6)
    const colorIndex = Math.floor(rand() * palette.length)

    ctx.beginPath()
    ctx.moveTo(0, yOffset)

    for (let x = 0; x <= width; x += 2) {
      const y = yOffset + Math.sin(x * frequency + phase) * amplitude
      ctx.lineTo(x, y)
    }

    ctx.strokeStyle = palette[colorIndex] + '40'
    ctx.lineWidth = 2 + rand() * 6
    ctx.stroke()
  }
}

function drawGridPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: string[],
  rand: () => number
) {
  const gridSize = 30 + Math.floor(rand() * 50)
  const colorIndex = Math.floor(rand() * palette.length)
  const dotSize = 2 + rand() * 4

  ctx.fillStyle = palette[colorIndex] + '25'

  for (let x = gridSize / 2; x < width; x += gridSize) {
    for (let y = gridSize / 2; y < height; y += gridSize) {
      // Add some randomness to positions
      const offsetX = (rand() - 0.5) * 10
      const offsetY = (rand() - 0.5) * 10

      ctx.beginPath()
      ctx.arc(x + offsetX, y + offsetY, dotSize, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

/**
 * Add noise texture for depth
 */
function drawNoiseTexture(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rand: () => number
) {
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  const noiseAmount = 15 + rand() * 20

  for (let i = 0; i < data.length; i += 4) {
    const noise = (rand() - 0.5) * noiseAmount
    data[i] = Math.min(255, Math.max(0, data[i] + noise))
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
  }

  ctx.putImageData(imageData, 0, 0)
}

/**
 * Draw bold typography
 */
function drawTypography(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  stationName: string,
  palette: string[],
  rand: () => number
) {
  // Clean the station name
  let displayName = stationName
    .replace(/^(radio|station|fm|am)\s+/i, '')
    .replace(/_/g, ' ')
    .trim()

  // Decide layout based on name length
  const isLongName = displayName.length > 12
  const useVertical = rand() > 0.7 && !isLongName

  // Calculate font size
  let fontSize: number
  if (useVertical) {
    fontSize = Math.min(width * 0.6, height / displayName.length * 0.9)
  } else if (isLongName) {
    // For long names, might need multiple lines
    fontSize = Math.min(width * 0.15, height * 0.2)
  } else {
    fontSize = Math.min(width * 0.25, height * 0.35)
  }

  // Font setup
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // Add text shadow/glow
  ctx.shadowColor = palette[0]
  ctx.shadowBlur = 30
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0

  if (useVertical) {
    // Vertical text layout
    ctx.font = `900 ${fontSize}px "SF Pro Display", "Helvetica Neue", system-ui, sans-serif`
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'

    const chars = displayName.toUpperCase().split('')
    const totalHeight = chars.length * fontSize * 0.85
    const startY = (height - totalHeight) / 2 + fontSize / 2

    chars.forEach((char, i) => {
      ctx.fillText(char, width / 2, startY + i * fontSize * 0.85)
    })
  } else if (isLongName) {
    // Multi-line layout for long names
    ctx.font = `900 ${fontSize}px "SF Pro Display", "Helvetica Neue", system-ui, sans-serif`
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'

    const words = displayName.toUpperCase().split(' ')
    const lines: string[] = []
    let currentLine = ''

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const metrics = ctx.measureText(testLine)

      if (metrics.width > width * 0.85 && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    })
    if (currentLine) lines.push(currentLine)

    const lineHeight = fontSize * 1.1
    const totalHeight = lines.length * lineHeight
    const startY = (height - totalHeight) / 2 + fontSize / 2

    lines.forEach((line, i) => {
      ctx.fillText(line, width / 2, startY + i * lineHeight)
    })
  } else {
    // Single line, centered
    ctx.font = `900 ${fontSize}px "SF Pro Display", "Helvetica Neue", system-ui, sans-serif`
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.fillText(displayName.toUpperCase(), width / 2, height / 2)
  }

  // Reset shadow
  ctx.shadowBlur = 0
}

/**
 * Add vignette effect
 */
function drawVignette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, Math.min(width, height) * 0.2,
    width / 2, height / 2, Math.max(width, height) * 0.8
  )
  gradient.addColorStop(0, 'transparent')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

/**
 * Cache for generated artwork URLs
 */
const artworkCache = new Map<string, string>()

/**
 * Get or generate artwork data URL with caching
 */
export function getArtworkDataUrl(options: ArtworkOptions): string {
  const cacheKey = `${options.stationId}-${options.width}x${options.height}`

  if (artworkCache.has(cacheKey)) {
    return artworkCache.get(cacheKey)!
  }

  const dataUrl = generateArtworkDataUrl(options)
  artworkCache.set(cacheKey, dataUrl)

  return dataUrl
}

/**
 * Clear the artwork cache (useful for memory management)
 */
export function clearArtworkCache(): void {
  artworkCache.clear()
}
