/**
 * ComparisonView - The Silent Failure vs Active Defense
 * Split-screen comparison showing standard logging accepts lies while we preserve truth
 */

import React, { useState, useEffect } from 'react'
import EventsProcessedCounter from './EventsProcessedCounter'

export default function ComparisonView({ events = [] }) {
  // Animation states
  const [leftPhase, setLeftPhase] = useState(0) // 0: show original, 1: show attempt, 2: show modified, 3: show success
  const [rightPhase, setRightPhase] = useState(0) // 0: waiting, 1: show attempt, 2: flash red, 3: show violation
  const [showTagline, setShowTagline] = useState(false)
  const [silenceHold, setSilenceHold] = useState(false)

  // Find the DATA_EXPORT event
  const exportEvent = events.find(e => e.type === 'DATA_EXPORT')
  const originalValue = exportEvent?.details?.records || 4942
  const tamperedValue = 0

  // Animation sequence - INSTANT fraud on left, DELIBERATE detection on right
  useEffect(() => {
    const timers = []

    // LEFT PANEL: THE HORROR - Fraud happens INSTANTLY (< 0.5 seconds)
    // No "modifying..." phase - skip straight to changed value
    // Phase 2: Value already changed (100ms - barely perceptible)
    timers.push(setTimeout(() => setLeftPhase(2), 100))
    // Phase 3: Show UPDATE SUCCESSFUL (300ms total - disturbingly fast)
    timers.push(setTimeout(() => {
      setLeftPhase(3)
      setSilenceHold(true)
    }, 300))

    // THE UNCOMFORTABLE SILENCE - 2.5 seconds of green "success" with no alert
    timers.push(setTimeout(() => setSilenceHold(false), 2800))

    // RIGHT PANEL: DELIBERATE DEFENSE - Shows the system actually checking
    // Phase 1: Show "Processing..." (after silence ends)
    timers.push(setTimeout(() => setRightPhase(1), 2900))
    // Phase 2: Flash red "DETECTING..." (1 second of analysis)
    timers.push(setTimeout(() => setRightPhase(2), 3900))
    // Phase 3: Show INTEGRITY VIOLATION (1.5 seconds to detect)
    timers.push(setTimeout(() => setRightPhase(3), 5400))

    // Show tagline after violation holds for 3+ seconds
    timers.push(setTimeout(() => setShowTagline(true), 8500))

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="space-y-8 relative">
      {/* Events counter - always visible, always running */}
      <div className="absolute top-0 right-0">
        <EventsProcessedCounter />
      </div>

      {/* 50/50 Split Screen */}
      <div className="grid grid-cols-2 gap-8 pt-12">
        {/* LEFT PANEL - The Silent Failure */}
        <div className={`bg-gray-900 rounded-lg p-8 border border-gray-700 transition-all duration-500 ${
          leftPhase >= 3 ? 'border-green-500/50' : ''
        }`}>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-300 mb-1">STANDARD LOGGING</h3>
            <p className="text-sm text-gray-500 font-mono">(Splunk / Datadog / Traditional)</p>
          </div>

          {/* Record display */}
          <div className="bg-gray-800/50 rounded-lg p-6 mb-6 font-mono">
            <div className="text-gray-400 text-sm mb-2">DATA_EXPORT</div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">records:</span>
              <span className={`text-2xl font-bold transition-all duration-500 ${
                leftPhase >= 2 ? 'text-green-400' : 'text-white'
              }`}>
                {leftPhase >= 2 ? tamperedValue : originalValue}
              </span>
              {leftPhase === 1 && (
                <span className="text-amber-400 text-sm animate-pulse ml-2">← modifying...</span>
              )}
            </div>
          </div>

          {/* Status area */}
          <div className={`p-4 rounded-lg text-center transition-all duration-500 ${
            leftPhase >= 3
              ? 'bg-green-900/30 border border-green-500'
              : 'bg-gray-800/30 border border-gray-700'
          }`}>
            {leftPhase < 3 ? (
              <span className="text-gray-500">Awaiting operation...</span>
            ) : (
              <div>
                <div className="text-green-400 font-bold text-xl mb-1">UPDATE SUCCESSFUL</div>
                <div className="text-gray-500 text-sm">No alert. No warning. Nothing.</div>
              </div>
            )}
          </div>

          {/* The horror label */}
          {leftPhase >= 3 && (
            <div className="mt-4 text-center">
              <span className="text-red-400/60 text-xs font-mono tracking-wider">
                THE LIE BECOMES THE TRUTH
              </span>
            </div>
          )}
        </div>

        {/* RIGHT PANEL - Active Defense */}
        <div className={`bg-gray-900 rounded-lg p-8 border transition-all duration-300 ${
          rightPhase >= 2
            ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
            : 'border-gray-700'
        } ${rightPhase === 2 ? 'animate-pulse' : ''}`}>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-green-400 mb-1">RECEIPTS-NATIVE</h3>
            <p className="text-sm text-gray-500 font-mono">(Unbreakable Chain)</p>
          </div>

          {/* Record display */}
          <div className={`bg-gray-800/50 rounded-lg p-6 mb-6 font-mono transition-all duration-300 ${
            rightPhase >= 2 ? 'border border-red-500/50' : ''
          }`}>
            <div className="text-gray-400 text-sm mb-2">DATA_EXPORT</div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">records:</span>
              <span className="text-2xl font-bold text-white">
                {originalValue}
              </span>
              {rightPhase === 1 && (
                <span className="text-amber-400 text-sm animate-pulse ml-2">← modifying...</span>
              )}
              {rightPhase >= 2 && (
                <span className="text-red-500 text-sm ml-2 font-bold">PROTECTED</span>
              )}
            </div>
          </div>

          {/* Status area */}
          <div className={`p-4 rounded-lg text-center transition-all duration-300 ${
            rightPhase >= 3
              ? 'bg-red-900/30 border border-red-500'
              : rightPhase === 0
                ? 'bg-gray-800/30 border border-gray-700'
                : 'bg-gray-800/50 border border-gray-600'
          }`}>
            {rightPhase < 2 ? (
              <span className="text-gray-500">
                {rightPhase === 0 ? 'Awaiting operation...' : 'Analyzing cryptographic signatures...'}
              </span>
            ) : rightPhase === 2 ? (
              <div className="text-red-500 font-bold text-xl animate-pulse">
                ⚠ DETECTING...
              </div>
            ) : (
              <div>
                <div className="text-red-500 font-bold text-xl mb-1">INTEGRITY VIOLATION</div>
                <div className="text-amber-400 text-sm">INCIDENT LOGGED • ADMIN NOTIFIED</div>
              </div>
            )}
          </div>

          {/* The victory label */}
          {rightPhase >= 3 && (
            <div className="mt-4 text-center">
              <span className="text-green-400/80 text-xs font-mono tracking-wider">
                THE TRUTH IS PRESERVED
              </span>
            </div>
          )}
        </div>
      </div>

      {/* THE TAGLINE */}
      <div className={`text-center transition-all duration-1000 ${
        showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <p className="text-2xl text-gray-200 font-medium mt-8">
          Standard logs accept the lie. <span className="text-red-400">We preserve the truth.</span>
        </p>
      </div>

      {/* Continue hint */}
      {showTagline && (
        <div className="text-center mt-8">
          <p className="text-gray-500 text-lg">
            Click or press Space to continue
          </p>
        </div>
      )}
    </div>
  )
}
