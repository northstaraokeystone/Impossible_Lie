/**
 * RejectionDisplay - Legal document style evidence display
 * Paper aesthetic with VERIFIED stamp - court-ready artifact
 */

import React from 'react'

export default function RejectionDisplay({ tamperResult, showContinue = true, tamperedIndex = 0 }) {
  if (!tamperResult) {
    return null
  }

  const blockNumber = tamperedIndex + 1
  const timestamp = new Date().toISOString()
  const incidentId = Date.now().toString(36).toUpperCase()

  return (
    <div className="flex justify-center">
      {/* Paper Document Container - Legal document aesthetic */}
      <div
        className="relative bg-[#fafafa] rounded-sm max-w-lg w-full"
        style={{
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 1px rgba(0, 0, 0, 0.2)',
          aspectRatio: '8.5 / 11',
          minHeight: '600px',
        }}
      >
        {/* Subtle paper texture overlay */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* VERIFIED Stamp Watermark */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{ transform: 'translate(-50%, -50%) rotate(-15deg)' }}
        >
          <div
            className="border-4 border-[#2d5a3d] rounded-lg px-8 py-3 opacity-20"
            style={{ borderStyle: 'double' }}
          >
            <span
              className="text-[#2d5a3d] text-5xl font-bold tracking-widest"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              VERIFIED
            </span>
          </div>
        </div>

        {/* Document Content */}
        <div className="relative z-10 p-8 h-full flex flex-col">
          {/* Document Header - Serif, centered, legal feel */}
          <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
            <h1
              className="text-2xl text-gray-900 mb-2 tracking-wide"
              style={{ fontFamily: 'Georgia, Times, serif' }}
            >
              IMMUTABLE LEDGER RECORD
            </h1>
            <p
              className="text-gray-600 text-sm"
              style={{ fontFamily: 'Georgia, Times, serif' }}
            >
              Chain of Custody Report
            </p>
          </div>

          {/* Document Body - Clean, formal */}
          <div className="flex-1 space-y-5 text-gray-800 text-sm">
            {/* Incident Reference */}
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-500">Incident Reference</span>
              <span className="font-mono text-gray-900">{incidentId}</span>
            </div>

            {/* Timestamp */}
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-500">Timestamp (UTC)</span>
              <span className="font-mono text-gray-900 text-xs">{timestamp}</span>
            </div>

            {/* Record ID */}
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-500">Record ID</span>
              <span className="font-mono text-gray-900">#{blockNumber.toString().padStart(4, '0')}</span>
            </div>

            {/* Original State */}
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-500">Original State</span>
              <span className="text-gray-900 font-medium">Preserved - Unaltered</span>
            </div>

            {/* Modification Attempt */}
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-500">Modification Attempt</span>
              <span className="text-red-700 font-medium">Rejected</span>
            </div>

            {/* Chain Integrity */}
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-500">Chain Integrity</span>
              <span className="text-green-700 font-medium">Intact</span>
            </div>

            {/* Legal Notice */}
            <div
              className="mt-4 p-4 bg-gray-100 rounded text-xs text-gray-600 leading-relaxed"
              style={{ fontFamily: 'Georgia, Times, serif' }}
            >
              This document certifies that the referenced record has been cryptographically
              secured and any tampering attempt has been logged to an immutable ledger.
              The original evidence remains court-admissible under applicable data integrity standards.
            </div>
          </div>

          {/* Download Button - INSIDE the document */}
          <div className="mt-auto pt-6">
            <button
              className="w-full bg-gray-900 text-white py-3 px-6 rounded
                         transition-colors duration-200 text-sm font-medium
                         hover:bg-gray-800 flex items-center justify-center gap-2"
              onClick={(e) => {
                e.stopPropagation()
                alert('Incident report generation would be triggered here.')
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              DOWNLOAD PDF
            </button>
          </div>
        </div>
      </div>

      {/* Continue message - outside document, conditionally shown */}
      {showContinue && (
        <div className="absolute bottom-4 left-0 right-0 text-center text-gray-400 text-sm">
          Click or press Space to continue
        </div>
      )}
    </div>
  )
}
