/**
 * RejectionDisplay - Forensic preservation display
 * Legal-grade language, not technical explanations
 */

import React from 'react'

export default function RejectionDisplay({ tamperResult, showContinue = true, tamperedIndex = 0 }) {
  if (!tamperResult) {
    return null
  }

  const blockNumber = tamperedIndex + 1

  return (
    <div className="bg-gray-900/80 border border-red-700 rounded-lg p-8" style={{ boxShadow: '0 0 40px rgba(220, 38, 38, 0.2)' }}>
      {/* Header - Forensic Preservation Style */}
      <div className="border-b border-gray-700 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-1">[ FORENSIC PRESERVATION ]</div>
            <h2 className="text-2xl font-bold text-white mb-1">EVIDENCE PRESERVED</h2>
            <p className="text-amber-400 font-mono text-sm">AUDIT LOCK ENGAGED</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 font-mono">INCIDENT ID</div>
            <div className="text-gray-300 font-mono">{Date.now().toString(36).toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Forensic Evidence Details - Legal Language */}
      <div className="space-y-4 font-mono text-sm">
        {/* Attacker Context */}
        <div className="p-4 bg-amber-900/20 rounded-lg border-l-4 border-amber-500">
          <div className="text-amber-400 text-xs uppercase tracking-wider mb-2">Privileged Access Abuse Detected</div>
          <div className="text-white">
            ROOT user attempted unauthorized record modification with full administrative credentials
          </div>
        </div>

        {/* Detail Line 1: Original State */}
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="text-green-500 font-bold text-lg">01</div>
            <div>
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Original State</div>
              <div className="text-green-400 font-bold">LOCKED</div>
            </div>
          </div>
        </div>

        {/* Detail Line 2: Attempted Modification */}
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="text-red-500 font-bold text-lg">02</div>
            <div>
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Attempted Modification</div>
              <div className="text-red-400 font-bold">REJECTED</div>
            </div>
          </div>
        </div>

        {/* Detail Line 3: Incident Logged */}
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="text-amber-500 font-bold text-lg">03</div>
            <div>
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Incident Status</div>
              <div className="text-amber-400">Timestamped to Immutable Ledger</div>
            </div>
          </div>
        </div>

        {/* Detail Line 4: Chain of Custody */}
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="text-green-500 font-bold text-lg">04</div>
            <div>
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Chain of Custody</div>
              <div className="text-green-400 font-bold">INTACT</div>
            </div>
          </div>
        </div>

        {/* Forensic Summary */}
        <div className="p-4 bg-red-900/20 rounded-lg border border-red-800">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Forensic Summary</div>
          <div className="text-gray-300">
            Tampering attempt at Record #{blockNumber.toString().padStart(4, '0')} preserved for legal proceedings.
            Original evidence remains unaltered and court-admissible.
          </div>
        </div>
      </div>

      {/* Download Incident Report Button */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <button
          className="w-full bg-white/10 border border-white/40 text-white font-bold py-4 px-6
                     rounded-lg transition-colors duration-200 text-lg hover:bg-white/20
                     flex items-center justify-center gap-3"
          onClick={(e) => {
            e.stopPropagation()
            // Non-functional for demo - shows intent
            alert('Incident report generation would be triggered here.')
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          DOWNLOAD INCIDENT REPORT
        </button>
      </div>

      {/* Footer - Compliance Notice */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>This record is generated automatically and stored immutably.</span>
        <span className="font-mono">EVIDENCE_PRESERVED</span>
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
