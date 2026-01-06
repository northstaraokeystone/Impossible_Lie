/**
 * CloseScreen - Minimal, monochrome final screen
 * No QR code, no Schedule Call button, no colored elements
 */

import React from 'react'

export default function CloseScreen({ merkleRoot }) {
  const stats = {
    events: 6,
    fraudAttempts: 1,
    rejections: 1,
    ambiguity: 0
  }

  return (
    <div className="screen-container bg-[#0a0a0a]">

      {/* Stats - MONOCHROME ONLY */}
      <div className="flex gap-16 mb-12">
        <div className="text-center">
          <p className="text-5xl font-mono text-white">{stats.events}</p>
          <p className="text-gray-500 text-sm uppercase tracking-wider mt-2">Events</p>
        </div>
        <div className="text-center">
          <p className="text-5xl font-mono text-white">{stats.fraudAttempts}</p>
          <p className="text-gray-500 text-sm uppercase tracking-wider mt-2">Fraud Attempt</p>
        </div>
        <div className="text-center">
          <p className="text-5xl font-mono text-[#cc0000]">{stats.rejections}</p>
          <p className="text-gray-500 text-sm uppercase tracking-wider mt-2">Rejection</p>
        </div>
        <div className="text-center">
          <p className="text-5xl font-mono text-white">{stats.ambiguity}</p>
          <p className="text-gray-500 text-sm uppercase tracking-wider mt-2">Ambiguity</p>
        </div>
      </div>

      {/* Tagline - Updated copy per spec */}
      <h1 className="text-3xl md:text-4xl text-center mb-16">
        <span className="text-gray-300">Don't just detect tampering, </span>
        <span className="text-[#cc0000]">make tampering evident</span>
      </h1>

      {/* Simple restart hint - NO BUTTONS, NO QR, NO CTA */}
      <p className="text-gray-600 text-sm">
        Press R to restart demo
      </p>

    </div>
  )
}
