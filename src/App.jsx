/**
 * App - Main demo orchestration
 * Uses useDemo hook for state management
 */

import React, { useEffect, useCallback, useState } from 'react'
import { useDemo, STATES } from './hooks/useDemo'
import MerkleStructure from './components/MerkleStructure'
import EntropyGauge from './components/EntropyGauge'
import CompressionGauge from './components/CompressionGauge'
import EventLog from './components/EventLog'
import ModifyPanel from './components/ModifyPanel'
import RejectionDisplay from './components/RejectionDisplay'
import ComparisonView from './components/ComparisonView'
import CloseScreen from './components/CloseScreen'

export default function App() {
  const demo = useDemo()
  const [rejectCanContinue, setRejectCanContinue] = useState(false)

  // Initialize on mount
  useEffect(() => {
    demo.init()
  }, [])

  // Reset rejection pause when entering reject state
  useEffect(() => {
    if (demo.state === STATES.REJECT) {
      setRejectCanContinue(false)
    }
  }, [demo.state])

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      // Block during rejection pause
      if (demo.state === STATES.REJECT && !rejectCanContinue) return
      demo.nextState()
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault()
      demo.restart()
    }
  }, [demo.state, rejectCanContinue])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Render based on current state
  const renderContent = () => {
    switch (demo.state) {
      case STATES.INTRO:
        return <IntroScreen onContinue={demo.nextState} />

      case STATES.BUILD:
        return (
          <BuildScreen
            events={demo.events}
            tree={demo.tree}
            entropy={demo.entropy}
            compression={demo.compression}
          />
        )

      case STATES.PROMPT:
        return (
          <PromptScreen
            events={demo.events}
            tree={demo.tree}
            entropy={demo.entropy}
            compression={demo.compression}
            onContinue={demo.nextState}
          />
        )

      case STATES.MODIFY:
        return (
          <ModifyScreen
            events={demo.events}
            tree={demo.tree}
            entropy={demo.entropy}
            compression={demo.compression}
            selectedEvent={demo.selectedEvent}
            tamperedIndex={demo.tamperedIndex}
            onSelectEvent={demo.selectEvent}
            onSubmit={demo.attemptModify}
          />
        )

      case STATES.REJECT:
        return (
          <RejectScreen
            events={demo.events}
            tree={demo.tree}
            tamperedIndex={demo.tamperedIndex}
            tamperResult={demo.tamperResult}
            canContinue={rejectCanContinue}
            onCanContinue={() => setRejectCanContinue(true)}
            onContinue={() => {
              if (rejectCanContinue) demo.nextState()
            }}
          />
        )

      case STATES.COMPARISON:
        return (
          <div className="screen-container bg-[#0a0a0a]" onClick={demo.nextState}>
            <div className="content-wrapper">
              <ComparisonView events={demo.events} />
            </div>
          </div>
        )

      case STATES.CLOSE:
        return <CloseScreen merkleRoot={demo.getMerkleRoot()} />

      default:
        return <IntroScreen onContinue={demo.nextState} />
    }
  }

  return (
    <div className="min-h-screen bg-background text-white">
      {renderContent()}
    </div>
  )
}

// Intro Screen - Larger, more commanding presence
function IntroScreen({ onContinue }) {
  // Auto-advance after 3 seconds
  useEffect(() => {
    const timer = setTimeout(onContinue, 3000)
    return () => clearTimeout(timer)
  }, [onContinue])

  return (
    <div
      className="screen-container cursor-pointer bg-[#0a0a0a]"
      onClick={onContinue}
    >
      <div className="text-center max-w-4xl">
        <div className="text-red-500 font-mono text-lg tracking-widest font-semibold mb-8 animate-pulse">
          SECURITY INCIDENT DETECTED
        </div>

        <h1 className="text-7xl md:text-8xl font-bold mb-10">
          The Impossible Lie
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 mb-12 leading-loose max-w-3xl mx-auto">
          A third-party integration just exfiltrated 4,942 customer records.
          Watch how receipts-native logging makes tampering mathematically impossible.
        </p>

        <div className="text-gray-500 text-lg">
          Click or press Space to begin
        </div>
      </div>
    </div>
  )
}

// Build Screen - Events firing, structure growing
function BuildScreen({ events, tree, entropy, compression }) {
  return (
    <div className="screen-container bg-[#0a0a0a]">
      <div className="content-wrapper">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-300">
          Recording Security Events
        </h2>

        {/* Main content row - Event log beside Merkle tree */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left column - Event log */}
          <div className="min-w-0">
            <EventLog events={events} />
          </div>

          {/* Right column - Merkle structure */}
          <div className="min-w-0">
            <MerkleStructure tree={tree} />
          </div>
        </div>

        {/* Gauges row - below log and tree */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <EntropyGauge value={entropy} />
          <CompressionGauge value={compression} />
        </div>

        <div className="text-center text-gray-500 text-lg">
          Building cryptographic receipt chain...
        </div>
      </div>
    </div>
  )
}

// Prompt Screen - Challenge the user
function PromptScreen({ events, tree, entropy, compression, onContinue }) {
  return (
    <div className="screen-container bg-[#0a0a0a]">
      <div className="content-wrapper">
        {/* Main content row - Event log beside Merkle tree */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left column - Event log */}
          <div className="min-w-0">
            <EventLog events={events} />
          </div>

          {/* Right column - Merkle structure */}
          <div className="min-w-0">
            <MerkleStructure tree={tree} />
          </div>
        </div>

        {/* Gauges row - below log and tree */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <EntropyGauge value={entropy} />
          <CompressionGauge value={compression} />
        </div>

        {/* Challenge panel - centered, full width, reduced visual weight */}
        <div className="bg-gray-900/40 border border-gray-700 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-white mb-3">
            Try to change the past
          </h2>
          <p className="text-white/80 text-base mb-5">
            The breach has been recorded. Can you modify the logs to hide it?
          </p>
          <button
            onClick={onContinue}
            className="border border-white/60 text-white font-semibold
                       py-3 px-10 rounded-lg transition-colors duration-200 text-base
                       hover:bg-white/10 bg-transparent"
          >
            Modify Record
          </button>
        </div>
      </div>
    </div>
  )
}

// Modify Screen - User edits a record
function ModifyScreen({
  events,
  tree,
  entropy,
  compression,
  selectedEvent,
  tamperedIndex,
  onSelectEvent,
  onSubmit
}) {
  // Auto-select the DATA_EXPORT event if nothing selected
  useEffect(() => {
    if (!selectedEvent && events.length > 0) {
      const exportIndex = events.findIndex(e => e.type === 'DATA_EXPORT')
      if (exportIndex >= 0) {
        onSelectEvent(exportIndex)
      }
    }
  }, [events, selectedEvent, onSelectEvent])

  return (
    <div className="screen-container bg-[#0a0a0a]">
      <div className="content-wrapper">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-300">
          Select an event to modify
        </h2>

        {/* Main content row - Event log beside Merkle tree */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left column - Event log */}
          <div className="min-w-0">
            <EventLog
              events={events}
              tamperedIndex={tamperedIndex}
              onEventClick={onSelectEvent}
            />
          </div>

          {/* Right column - Merkle structure */}
          <div className="min-w-0">
            <MerkleStructure tree={tree} tamperedIndex={tamperedIndex} />
          </div>
        </div>

        {/* Gauges row - below log and tree */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <EntropyGauge value={entropy} />
          <CompressionGauge value={compression} />
        </div>

        {/* Modify panel - centered, full width */}
        <ModifyPanel event={selectedEvent} onSubmit={onSubmit} />
      </div>
    </div>
  )
}

// Reject Screen - Show rejection with math and 5-second pause
// LAYOUT MATCHES Events/Modify screens for visual consistency
function RejectScreen({ events, tree, tamperedIndex, tamperResult, canContinue, onCanContinue, onContinue }) {
  const [countdown, setCountdown] = useState(5)
  const [shakeClass, setShakeClass] = useState('shake-once')

  // 5-second countdown before allowing continue
  useEffect(() => {
    if (canContinue) return

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          onCanContinue()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [canContinue, onCanContinue])

  // Remove shake class after animation
  useEffect(() => {
    const timer = setTimeout(() => setShakeClass(''), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`screen-container bg-[#0a0a0a] ${shakeClass} ${canContinue ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      onClick={onContinue}
    >
      <div className="content-wrapper">
        {/* Giant REJECTED header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-red-500 animate-pulse">
            ⊘ REJECTED ⊘
          </h1>
        </div>

        {/* Main content row - Event log beside Merkle tree (SAME as other screens) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left column - Event log */}
          <div className="min-w-0">
            <EventLog events={events} tamperedIndex={tamperedIndex} />
          </div>

          {/* Right column - Merkle structure (beside log, not below) */}
          <div className="min-w-0">
            <MerkleStructure tree={tree} tamperedIndex={tamperedIndex} rejected />
          </div>
        </div>

        {/* Rejection details panel - full width below */}
        <div className="rejection-panel p-6">
          <RejectionDisplay tamperResult={tamperResult} showContinue={false} />
        </div>

        {/* Countdown or continue message */}
        <div className="mt-6 text-center">
          {!canContinue ? (
            <p className="text-gray-300 text-xl">
              Analyzing integrity violation... <span className="text-red-400 font-bold">{countdown}s</span>
            </p>
          ) : (
            <p className="text-gray-400 text-lg">
              Click or press Space to continue
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
