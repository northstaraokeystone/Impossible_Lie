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
            className={`w-3 h-3 rounded-full ${isCompromised ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}
          />
          <span
            className={`font-bold text-lg ${isCompromised ? 'text-red-500' : 'text-green-500'}`}
          >
            {isCompromised ? 'COMPROMISED' : 'SECURE'}
          </span>
        </div>
      </div>
      <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
        <div className="flex items-center gap-3">
          <div className={`w-full h-3 rounded-full ${isCompromised ? 'bg-red-900' : 'bg-green-900'}`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${isCompromised ? 'bg-red-500 w-full' : 'bg-green-500 w-full'}`}
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
