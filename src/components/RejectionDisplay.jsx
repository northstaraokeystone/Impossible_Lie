/**
 * RejectionDisplay - Show why modification was rejected
 * Clear, factual display of the math
 */

import React from 'react'
import { ENTROPY_THRESHOLD } from '../lib/entropy'
import { COMPRESSION_THRESHOLD } from '../lib/compression'

export default function RejectionDisplay({ tamperResult, showContinue = true }) {
  if (!tamperResult) {
    return null
  }

  const {
    entropyBefore,
    entropyAfter,
    compressionBefore,
    compressionAfter,
    brokenLinks,
    originalHash,
    tamperedHash
  } = tamperResult

  const entropyFailed = entropyAfter >= ENTROPY_THRESHOLD
  const compressionFailed = compressionAfter < COMPRESSION_THRESHOLD

  return (
    <div className="bg-red-900/20 border border-red-500 rounded-lg p-8" style={{ boxShadow: '0 0 40px rgba(220, 38, 38, 0.4)' }}>
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-5 h-5 bg-red-500 rounded-full animate-pulse" />
        <h2 className="text-3xl font-bold text-red-500">INTEGRITY VIOLATION</h2>
        <div className="w-5 h-5 bg-red-500 rounded-full animate-pulse" />
      </div>

      {/* Metrics */}
      <div className="space-y-4 font-mono text-base">
        {/* Entropy */}
        <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
          <span className="text-gray-400">Entropy:</span>
          <div className="flex items-center gap-2">
            <span className="text-green-400">{entropyBefore.toFixed(2)}</span>
            <span className="text-gray-500">→</span>
            <span className={entropyFailed ? 'text-red-400' : 'text-green-400'}>
              {entropyAfter.toFixed(2)}
            </span>
            <span className="text-gray-500">(threshold: {ENTROPY_THRESHOLD})</span>
            {entropyFailed && <span className="text-red-500 font-bold">FAIL</span>}
          </div>
        </div>

        {/* Compression */}
        <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
          <span className="text-gray-400">Compression:</span>
          <div className="flex items-center gap-2">
            <span className="text-green-400">{compressionBefore.toFixed(2)}</span>
            <span className="text-gray-500">→</span>
            <span className={compressionFailed ? 'text-red-400' : 'text-green-400'}>
              {compressionAfter.toFixed(2)}
            </span>
            <span className="text-gray-500">(threshold: {COMPRESSION_THRESHOLD})</span>
            {compressionFailed && <span className="text-red-500 font-bold">FAIL</span>}
          </div>
        </div>

        {/* Chain integrity - CRITICAL: FAILED must be RED */}
        <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
          <span className="text-gray-400">Chain integrity:</span>
          <span className="text-red-500 font-bold">FAILED</span>
        </div>

        {/* Hash comparison */}
        <div className="p-3 bg-gray-900/50 rounded-lg space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-gray-400 w-20 flex-shrink-0">Original:</span>
            <span className="text-green-400 break-all">{originalHash}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-400 w-20 flex-shrink-0">Tampered:</span>
            <span className="text-red-400 break-all">{tamperedHash}</span>
          </div>
        </div>

        {/* Broken links - highlight the number */}
        <div className="p-3 bg-gray-900/50 rounded-lg">
          <span className="text-gray-300">
            Modification requires recomputing{' '}
            <span className="text-red-500 font-bold text-lg">{brokenLinks.length}</span>{' '}
            nodes to root.
          </span>
        </div>
      </div>

      {/* Bottom message - conditionally shown */}
      {showContinue && (
        <div className="mt-6 text-center text-gray-400 text-sm">
          Click or press Space to continue
        </div>
      )}
    </div>
  )
}
