/**
 * ChainHealthIndicator - Business-focused chain status
 * Shows SECURE (green) or COMPROMISED (red) based on integrity state
 */

import React from 'react'

export default function ChainHealthIndicator({ isCompromised = false }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-base font-mono">
        <span className="text-gray-400">CHAIN HEALTH</span>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${isCompromised ? 'bg-[#cc0000] animate-pulse' : 'bg-[#00aa66]'}`}
          />
          <span
            className={`font-bold text-lg ${isCompromised ? 'text-[#cc0000]' : 'text-[#00aa66]'}`}
          >
            {isCompromised ? 'COMPROMISED' : 'SECURE'}
          </span>
        </div>
      </div>
      <div className="bg-[#111111] rounded-lg p-3 border border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-full h-3 rounded-full bg-gray-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isCompromised ? 'bg-[#cc0000] w-full' : 'bg-[#00aa66] w-full'}`}
            />
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500 font-mono">
          {isCompromised
            ? 'Integrity violation detected - chain tampered'
            : 'All signatures verified - chain intact'
          }
        </div>
      </div>
    </div>
  )
}
