/**
 * ComparisonView - Side-by-side standard logging vs receipts-native
 * Wider columns, cleaner design
 */

import React, { useState } from 'react'
import { formatEvent, getEventTypeColor } from '../lib/events'

export default function ComparisonView({ events = [] }) {
  const [standardModified, setStandardModified] = useState(false)
  const [modifiedEvent, setModifiedEvent] = useState(null)

  // Find the DATA_EXPORT event (index 4, 0-indexed)
  const exportEventIndex = events.findIndex(e => e.type === 'DATA_EXPORT')
  const exportEvent = events[exportEventIndex]

  const handleStandardModify = () => {
    if (exportEvent) {
      const modified = { ...exportEvent, details: { ...exportEvent.details, records: 0, anomaly: false } }
      setModifiedEvent(modified)
      setStandardModified(true)
    }
  }

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold text-center text-gray-300">
        Standard Logging vs Receipts-Native
      </h2>

      <div className="grid grid-cols-2 gap-12">
        {/* Standard Logging Column */}
        <div className="bg-gray-900 rounded-lg p-8 border-l-4 border-l-red-500 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-300">Standard Logging</h3>
            <span className="text-base bg-red-600 text-white px-4 py-2 rounded font-medium">
              MUTABLE
            </span>
          </div>

          <div className="space-y-3 font-mono text-base max-h-64 overflow-y-auto mb-6">
            {events.map((event, index) => {
              const isModified = standardModified && index === exportEventIndex
              const displayEvent = isModified ? modifiedEvent : event

              return (
                <div
                  key={event.id}
                  className={`p-3 rounded ${isModified ? 'bg-green-900/30 border border-green-500' : 'bg-gray-800/50'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{displayEvent.timestamp}</span>
                    <span style={{ color: getEventTypeColor(displayEvent.type) }}>
                      {displayEvent.type}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm mt-1">
                    {Object.entries(displayEvent.details).map(([k, v]) => (
                      <span key={k} className="mr-3">
                        {k}: {Array.isArray(v) ? `[${v.join(', ')}]` : String(v)}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {!standardModified ? (
            <button
              onClick={handleStandardModify}
              className="w-full bg-transparent border border-red-500 text-red-400 font-bold py-3 px-4
                         rounded-lg transition-colors duration-200 text-base hover:bg-red-500/20"
            >
              Modify Export Record
            </button>
          ) : (
            <div className="text-center space-y-2">
              <div className="text-green-400 font-bold text-lg">✓ Modified Successfully</div>
              <div className="text-gray-400 text-base">
                Records changed from 4942 to 0. No trace of tampering.
              </div>
            </div>
          )}
        </div>

        {/* Receipts-Native Column */}
        <div className="bg-gray-900 rounded-lg p-8 border-l-4 border-l-green-500 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-green-400">Receipts-Native</h3>
            <span className="text-base bg-green-600 text-white px-4 py-2 rounded font-medium">
              IMMUTABLE
            </span>
          </div>

          <div className="space-y-3 font-mono text-base max-h-64 overflow-y-auto mb-6">
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`p-3 rounded bg-gray-800/50 ${
                  index === exportEventIndex ? 'border border-gray-600' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">{event.timestamp}</span>
                  <span style={{ color: getEventTypeColor(event.type) }}>
                    {event.type}
                  </span>
                </div>
                <div className="text-gray-400 text-sm mt-1">
                  {Object.entries(event.details).map(([k, v]) => (
                    <span key={k} className="mr-3">
                      {k}: {Array.isArray(v) ? `[${v.join(', ')}]` : String(v)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full py-4 bg-gray-800 text-red-400 text-center rounded-lg border border-red-500 font-bold text-lg">
            ⊘ REJECTED
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-gray-400 text-lg">
          Standard logging allows silent modification.
          Receipts-native makes tampering mathematically impossible.
        </p>
        <p className="mt-6 text-gray-500 text-lg">
          Click or press Space to continue
        </p>
      </div>
    </div>
  )
}
