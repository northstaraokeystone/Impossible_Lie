/**
 * EventLog - Display event stream
 * Monospace font, timestamps, type-colored indicators
 */

import React, { useRef, useEffect } from 'react'
import { formatEvent, getEventTypeColor } from '../lib/events'

export default function EventLog({ events = [], tamperedIndex = null, onEventClick = null }) {
  const containerRef = useRef(null)

  // Auto-scroll to bottom when new events added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [events.length])

  return (
    <div
      ref={containerRef}
      className="bg-[#111111] rounded-lg p-6 font-mono text-sm overflow-y-auto min-h-[320px] max-h-[400px] border border-gray-800"
    >
      {events.length === 0 ? (
        <div className="text-gray-500 text-center py-4">
          Waiting for events...
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event, index) => {
            const isTampered = index === tamperedIndex
            const isLatest = index === events.length - 1 && tamperedIndex === null

            return (
              <div
                key={event.id}
                onClick={() => onEventClick && onEventClick(index)}
                className={`
                  p-3 rounded transition-all duration-[900ms]
                  ${isTampered ? 'bg-[#1a0a0a] border border-[#cc0000]' : ''}
                  ${isLatest ? 'bg-[#1a1a1a]' : ''}
                  ${onEventClick ? 'cursor-pointer hover:bg-gray-800/50' : ''}
                `}
              >
                {/* Top row: timestamp and type */}
                <div className="flex items-center gap-2 mb-1">
                  {/* Event type indicator */}
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getEventTypeColor(event.type) }}
                  />

                  {/* Timestamp */}
                  <span className="text-gray-500 flex-shrink-0">
                    {event.timestamp}
                  </span>

                  {/* Type */}
                  <span
                    className="font-bold flex-shrink-0"
                    style={{ color: getEventTypeColor(event.type) }}
                  >
                    {event.type}
                  </span>
                </div>

                {/* Bottom row: Details - on its own line to prevent wrapping issues */}
                <div className="text-gray-300 pl-4 text-sm whitespace-normal">
                  {Object.entries(event.details).map(([key, value], i) => (
                    <span key={key} className="mr-3">
                      <span className="text-gray-500">{key}:</span>{' '}
                      <span className="text-white">{Array.isArray(value) ? `[${value.join(', ')}]` : String(value)}</span>
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
