/**
 * RejectionDisplay - Compliance-report style integrity violation display
 * Professional audit-style formatting instead of error message style
 */

import React from 'react'

export default function RejectionDisplay({ tamperResult, showContinue = true, tamperedIndex = 0, attackerRole = 'external' }) {
  if (!tamperResult) {
    return null
  }

  const {
    brokenLinks,
    originalHash,
    tamperedHash
  } = tamperResult

  const blockNumber = tamperedIndex + 1

  return (
    <div className="bg-gray-900/80 border border-red-700 rounded-lg p-8" style={{ boxShadow: '0 0 40px rgba(220, 38, 38, 0.2)' }}>
      {/* Header - Compliance Report Style */}
      <div className="border-b border-gray-700 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-red-500 mb-1">INTEGRITY VIOLATION DETECTED</h2>
            <p className="text-gray-400 font-mono text-sm">Compliance Report #{Date.now().toString(36).toUpperCase()}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 font-mono">TIMESTAMP</div>
            <div className="text-gray-300 font-mono">{new Date().toISOString()}</div>
          </div>
        </div>
      </div>

      {/* Violation Details - Structured Report Format */}
      <div className="space-y-4 font-mono text-sm">
        {/* Attacker Context */}
        <div className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-red-500">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Attack Vector</div>
          <div className="text-white">
            {attackerRole === 'insider'
              ? 'Insider with Admin Access - Direct database modification attempted'
              : 'External Actor - Unauthorized record modification attempted'
            }
          </div>
        </div>

        {/* Detail Line 1: Hash mismatch location */}
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="text-red-500 font-bold text-lg">01</div>
            <div>
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Violation Location</div>
              <div className="text-white">Hash mismatch at Block #{blockNumber.toString().padStart(4, '0')}</div>
            </div>
          </div>
        </div>

        {/* Detail Line 2: Previous state preserved */}
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="text-green-500 font-bold text-lg">02</div>
            <div>
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Data Integrity</div>
              <div className="text-green-400">Previous state preserved - modification rejected</div>
            </div>
          </div>
        </div>

        {/* Detail Line 3: Alert sent */}
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="text-amber-500 font-bold text-lg">03</div>
            <div>
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Alert Status</div>
              <div className="text-amber-400">Alert sent to Admin - incident logged for audit trail</div>
            </div>
          </div>
        </div>

        {/* Hash Verification Section */}
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-3">Cryptographic Verification</div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-gray-500 w-24 flex-shrink-0">Expected:</span>
              <span className="text-green-400 break-all text-xs">{originalHash}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-500 w-24 flex-shrink-0">Received:</span>
              <span className="text-red-400 break-all text-xs">{tamperedHash}</span>
            </div>
          </div>
        </div>

        {/* Chain Impact */}
        <div className="p-4 bg-red-900/20 rounded-lg border border-red-800">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Chain Impact Analysis</div>
          <div className="text-gray-300">
            Modification would require recomputing{' '}
            <span className="text-red-400 font-bold">{brokenLinks.length}</span>{' '}
            cryptographic signatures up to root.{' '}
            <span className="text-gray-400">This tampering is mathematically verifiable.</span>
          </div>
        </div>
      </div>

      {/* Footer - Compliance Notice */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>This report is generated automatically and stored immutably.</span>
          <span className="font-mono">CHAIN_INTEGRITY_VIOLATION</span>
        </div>
      </div>

      {/* Continue message - conditionally shown */}
      {showContinue && (
        <div className="mt-6 text-center text-gray-400 text-sm">
          Click or press Space to continue
        </div>
      )}
    </div>
  )
}
