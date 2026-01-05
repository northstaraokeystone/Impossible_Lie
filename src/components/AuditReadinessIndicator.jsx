/**
 * AuditReadinessIndicator - Business-focused audit compliance status
 * Shows percentage readiness for audit (100% unless integrity violation)
 */

import React from 'react'

export default function AuditReadinessIndicator({ isCompromised = false }) {
  const percentage = isCompromised ? 0 : 100

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-base font-mono">
        <span className="text-gray-400">AUDIT READINESS</span>
        <span
          className={`font-bold text-lg ${isCompromised ? 'text-red-500' : 'text-green-500'}`}
        >
          {percentage}%
        </span>
      </div>
      <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-full h-3 rounded-full bg-gray-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isCompromised ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500 font-mono">
          {isCompromised
            ? 'Audit blocked - integrity must be restored'
            : 'Ready for compliance audit'
          }
        </div>
      </div>
    </div>
  )
}
