/**
 * EventsProcessedCounter - Scale indicator showing enterprise throughput
 * Counter ticks up FAST to demonstrate production scale - slight blur effect acceptable
 * CRITICAL: This counter NEVER stops - not during violations, not during comparisons
 */

import React, { useState, useEffect, useRef } from 'react'

export default function EventsProcessedCounter({ baseCount = 1240000 }) {
  const [count, setCount] = useState(baseCount)
  const intervalRef = useRef(null)

  useEffect(() => {
    // Tick up rapidly - fast enough to blur slightly, conveying enterprise scale
    // Interval: 80ms (was 800ms) - 10x faster
    // Increment: 150-350 per tick (was 12-59) - much larger jumps
    intervalRef.current = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 200) + 150)
    }, 80)

    // NEVER clear this interval - counter runs forever
    // This is intentional: the system doesn't pause for bad actors
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const formatNumber = (num) => {
    return num.toLocaleString()
  }

  return (
    <div className="bg-gray-900/50 rounded-lg px-4 py-2 border border-gray-800 inline-flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span className="text-gray-400 font-mono text-sm">Events Processed:</span>
      <span className="text-white font-mono font-bold text-lg tabular-nums counter-blur">
        {formatNumber(count)}+
      </span>
    </div>
  )
}
