/**
 * ComparisonView - Raw Console vs Shield
 * Left: SQL terminal showing silent fraud acceptance
 * Right: Shield showing immutable defense
 */

import React, { useState, useEffect } from 'react'
import EventsProcessedCounter from './EventsProcessedCounter'

export default function ComparisonView({ events = [] }) {
  // Animation states
  const [leftPhase, setLeftPhase] = useState(0) // 0: empty, 1: typing command, 2: show response, 3: cursor blink
  const [rightPhase, setRightPhase] = useState(0) // 0: neutral, 1: detecting, 2: violation recorded
  const [showTagline, setShowTagline] = useState(false)
  const [typedCommand, setTypedCommand] = useState('')
  const [cursorVisible, setCursorVisible] = useState(true)

  const fullCommand = 'UPDATE exports SET records=0 WHERE id=4942'

  // Typing animation for command
  useEffect(() => {
    if (leftPhase !== 1) return

    let index = 0
    const typingInterval = setInterval(() => {
      if (index <= fullCommand.length) {
        setTypedCommand(fullCommand.slice(0, index))
        index++
      } else {
        clearInterval(typingInterval)
        // Move to response phase after typing
        setTimeout(() => setLeftPhase(2), 300)
      }
    }, 40)

    return () => clearInterval(typingInterval)
  }, [leftPhase])

  // Cursor blink
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorVisible(v => !v)
    }, 530)
    return () => clearInterval(blinkInterval)
  }, [])

  // Animation sequence
  useEffect(() => {
    const timers = []

    // LEFT: Start typing command
    timers.push(setTimeout(() => setLeftPhase(1), 500))

    // LEFT: Show "Query OK" response (after typing completes ~2s)
    timers.push(setTimeout(() => setLeftPhase(3), 2800))

    // THE UNCOMFORTABLE SILENCE - 2.5 seconds of nothing

    // RIGHT: Shield starts detecting
    timers.push(setTimeout(() => setRightPhase(1), 5300))

    // RIGHT: Violation recorded
    timers.push(setTimeout(() => setRightPhase(2), 6300))

    // Show tagline
    timers.push(setTimeout(() => setShowTagline(true), 8500))

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="space-y-8 relative">
      {/* Events counter */}
      <div className="absolute top-0 right-0">
        <EventsProcessedCounter />
      </div>

      {/* 50/50 Split Screen */}
      <div className="grid grid-cols-2 gap-8 pt-12">

        {/* LEFT PANEL - Raw SQL Console (The Lie) */}
        <div className="relative">
          {/* Terminal window chrome */}
          <div className="bg-[#1e1e1e] rounded-t-lg px-4 py-2 flex items-center gap-2 border-b border-gray-700">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            <span className="text-gray-500 text-xs ml-4 font-mono">postgres@db-prod</span>
          </div>

          {/* Terminal content */}
          <div
            className="bg-black p-6 font-mono text-sm rounded-b-lg border border-t-0 border-gray-700"
            style={{ minHeight: '280px' }}
          >
            {/* Prompt and command */}
            <div className="text-[#00ff00]">
              <span className="text-gray-500">db=#</span>{' '}
              <span>
                {leftPhase >= 1 ? typedCommand : ''}
                {leftPhase < 3 && cursorVisible && <span className="bg-[#00ff00] text-black">_</span>}
              </span>
            </div>

            {/* Response - Query OK */}
            {leftPhase >= 2 && (
              <div className="mt-4 text-[#00ff00]">
                <div>Query OK. 1 row affected.</div>
                <div className="mt-2 text-gray-500">db=#</div>
                {leftPhase >= 3 && cursorVisible && (
                  <span className="bg-[#00ff00] text-black inline-block ml-1">_</span>
                )}
              </div>
            )}

            {/* The silence - no alerts, no warnings */}
            {leftPhase >= 3 && (
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-gray-600 text-xs font-mono text-center tracking-wider">
                  No alerts. No warnings. Silence.
                </div>
              </div>
            )}
          </div>

          {/* Label */}
          <div className="mt-4 text-center">
            <span className="text-gray-500 text-xs font-mono tracking-widest uppercase">
              Standard Database
            </span>
          </div>
        </div>

        {/* RIGHT PANEL - Shield (The Truth) */}
        <div className="relative">
          <div
            className={`bg-[#0a0a0a] rounded-lg p-8 border transition-all duration-500 flex flex-col items-center justify-center ${
              rightPhase >= 2
                ? 'border-[#cc0000] shadow-[0_0_30px_rgba(204,0,0,0.3)]'
                : 'border-gray-800'
            }`}
            style={{ minHeight: '320px' }}
          >
            {/* Shield Icon */}
            <div className={`mb-6 transition-all duration-500 ${
              rightPhase === 1 ? 'scale-110' : 'scale-100'
            }`}>
              <svg
                className={`w-24 h-24 transition-colors duration-500 ${
                  rightPhase >= 2 ? 'text-[#cc0000]' : rightPhase === 1 ? 'text-yellow-500' : 'text-gray-600'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>

            {/* Status Text */}
            <div className="text-center">
              {rightPhase === 0 && (
                <div className="text-gray-500 font-mono">Monitoring...</div>
              )}
              {rightPhase === 1 && (
                <div className="text-yellow-500 font-mono animate-pulse">
                  HASH MISMATCH DETECTED
                </div>
              )}
              {rightPhase >= 2 && (
                <div>
                  <div className="text-[#cc0000] font-bold text-lg mb-2 font-mono">
                    LEDGER IMMUTABLE
                  </div>
                  <div className="text-white font-mono text-sm">
                    ATTACK RECORDED
                  </div>
                </div>
              )}
            </div>

            {/* Hash display on violation */}
            {rightPhase >= 2 && (
              <div className="mt-6 p-3 bg-black/50 rounded font-mono text-xs text-gray-400 text-center">
                <div className="text-gray-600 mb-1">Root Hash</div>
                <div className="text-[#cc0000]">0x7f3a...b2c1 ≠ 0x7f3a...d4e5</div>
              </div>
            )}
          </div>

          {/* Label */}
          <div className="mt-4 text-center">
            <span className="text-gray-400 text-xs font-mono tracking-widest uppercase">
              Cryptographic Ledger
            </span>
          </div>
        </div>
      </div>

      {/* THE TAGLINE */}
      <div className={`text-center transition-all duration-1000 ${
        showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <p className="text-2xl text-gray-300 font-medium mt-8">
          One accepts lies. <span className="text-[#cc0000]">One preserves truth.</span>
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
