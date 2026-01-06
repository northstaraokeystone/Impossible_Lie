/**
 * Shannon entropy calculation
 * Real entropy measurement for detecting legitimate vs fraudulent data
 */

/**
 * Calculate Shannon entropy of data
 * @param {Uint8Array|string} data - Data to analyze
 * @returns {number} Normalized entropy (0-1)
 */
export function shannonEntropy(data) {
  // Convert string to bytes if needed
  const bytes = typeof data === 'string'
    ? new TextEncoder().encode(data)
    : data

  if (bytes.length === 0) return 0

  // Count frequency of each byte value (0-255)
  const frequency = new Array(256).fill(0)
  for (let i = 0; i < bytes.length; i++) {
    frequency[bytes[i]]++
  }

  // Calculate Shannon entropy: H = -Σ p(x) * log2(p(x))
  let entropy = 0
  const length = bytes.length

  for (let i = 0; i < 256; i++) {
    if (frequency[i] > 0) {
      const probability = frequency[i] / length
      entropy -= probability * Math.log2(probability)
    }
  }

  // Normalize to 0-1 by dividing by max possible entropy (8 bits per byte)
  return entropy / 8
}

/**
 * Check if entropy indicates legitimate data
 * @param {number} entropy - Normalized entropy value (0-1)
 * @returns {boolean} True if entropy < 0.40 (legitimate)
 */
export function isLegitimate(entropy) {
  return entropy < 0.40
}

/**
 * Get entropy classification
 * @param {number} entropy - Normalized entropy value (0-1)
 * @returns {'legitimate'|'suspicious'|'fraudulent'}
 */
export function classifyEntropy(entropy) {
  if (entropy < 0.40) return 'legitimate'
  if (entropy < 0.60) return 'suspicious'
  return 'fraudulent'
}

/**
 * Get color for entropy value
 * @param {number} entropy - Normalized entropy value (0-1)
 * @returns {string} Hex color code
 */
export function getEntropyColor(entropy) {
  if (entropy < 0.40) return '#00aa66' // muted emerald - legitimate
  if (entropy < 0.60) return '#cc9900' // muted amber - suspicious
  return '#cc0000' // muted crimson - fraudulent
}

/**
 * Threshold for legitimate entropy
 */
export const ENTROPY_THRESHOLD = 0.40
