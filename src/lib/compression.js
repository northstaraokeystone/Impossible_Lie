/**
 * Compression ratio calculation using zlib (pako)
 * Real compression measurement for detecting data structure integrity
 */

import pako from 'pako'

/**
 * Calculate compression ratio of data
 * @param {Uint8Array|string} data - Data to compress and analyze
 * @returns {number} Compression ratio (0-1), higher = more compressible = more structured
 */
export function compressionRatio(data) {
  // Convert string to bytes if needed
  const bytes = typeof data === 'string'
    ? new TextEncoder().encode(data)
    : data

  if (bytes.length === 0) return 0

  try {
    // Compress using zlib (deflate)
    const compressed = pako.deflate(bytes)

    // Calculate ratio: 1 - (compressed / original)
    // Higher ratio = more compressible = more structured = more legitimate
    const ratio = 1 - (compressed.length / bytes.length)

    // Clamp to 0-1 range (compression can sometimes be larger than original)
    return Math.max(0, Math.min(1, ratio))
  } catch (e) {
    console.error('Compression error:', e)
    return 0
  }
}

/**
 * Check if compression ratio indicates legitimate data
 * @param {number} ratio - Compression ratio (0-1)
 * @returns {boolean} True if ratio > 0.70 (legitimate/structured)
 */
export function isLegitimate(ratio) {
  return ratio > 0.70
}

/**
 * Get compression classification
 * @param {number} ratio - Compression ratio (0-1)
 * @returns {'legitimate'|'suspicious'|'fraudulent'}
 */
export function classifyCompression(ratio) {
  if (ratio > 0.70) return 'legitimate'
  if (ratio > 0.50) return 'suspicious'
  return 'fraudulent'
}

/**
 * Get color for compression ratio
 * @param {number} ratio - Compression ratio (0-1)
 * @returns {string} Hex color code
 */
export function getCompressionColor(ratio) {
  if (ratio > 0.70) return '#00aa66' // muted emerald - legitimate
  if (ratio > 0.50) return '#cc9900' // muted amber - suspicious
  return '#cc0000' // muted crimson - fraudulent
}

/**
 * Threshold for legitimate compression
 */
export const COMPRESSION_THRESHOLD = 0.70
