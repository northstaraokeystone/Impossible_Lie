/**
 * App - Main demo orchestration
 * Uses useDemo hook for state management
 */

import React, { useEffect, useCallback, useState } from 'react'
import { useDemo, STATES } from './hooks/useDemo'
import MerkleStructure from './components/MerkleStructure'
import ChainHealthIndicator from './components/ChainHealthIndicator'
import AuditReadinessIndicator from './components/AuditReadinessIndicator'
import EventsProcessedCounter from './components/EventsProcessedCounter'
import ComplianceFooter from './components/ComplianceFooter'
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

  // Determine if chain is compromised (only in REJECT state)
  const isCompromised = demo.state === STATES.REJECT

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
            isCompromised={false}
          />
        )

      case STATES.PROMPT:
        return (
          <PromptScreen
            events={demo.events}
            tree={demo.tree}
            isCompromised={false}
            onContinue={demo.nextState}
          />
        )

      case STATES.MODIFY:
        return (
          <ModifyScreen
            events={demo.events}
            tree={demo.tree}
            isCompromised={false}
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
          <div className="screen-container bg-[#0a0a0a] pb-20" onClick={demo.nextState}>
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

  // Show footer on most screens (not intro or close)
  const showFooter = demo.state !== STATES.INTRO && demo.state !== STATES.CLOSE

  return (
    <div className="min-h-screen bg-background text-white">
      {renderContent()}
      {showFooter && <ComplianceFooter />}
    </div>
  )
}

// Intro Screen - Larger, more commanding presence
function IntroScreen({ onContinue }) {
  // Auto-advance after 9 seconds
  useEffect(() => {
    const timer = setTimeout(onContinue, 9000)
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
          The Unbreakable Chain
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 mb-12 leading-loose max-w-3xl mx-auto">
          A third-party integration just exfiltrated 4,942 customer records.
          Watch how cryptographically verifiable logging makes tampering evident.
        </p>

        <div className="text-gray-500 text-lg">
          Click or press Space to begin
        </div>
      </div>
    </div>
  )
}

// Build Screen - Events firing, structure growing
function BuildScreen({ events, tree, isCompromised }) {
  return (
    <div className="screen-container bg-[#0a0a0a] pb-20">
      <div className="content-wrapper">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-300">
            Recording Security Events
          </h2>
          <EventsProcessedCounter />
        </div>

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

        {/* Business metrics row - below log and tree */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ChainHealthIndicator isCompromised={isCompromised} />
          <AuditReadinessIndicator isCompromised={isCompromised} />
        </div>

        <div className="text-center text-gray-500 text-lg">
          Building cryptographic receipt chain...
        </div>
      </div>
    </div>
  )
}

// Prompt Screen - Challenge the user
function PromptScreen({ events, tree, isCompromised, onContinue }) {
  return (
    <div className="screen-container bg-[#0a0a0a] pb-20">
      <div className="content-wrapper">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-300">
            Chain Complete
          </h2>
          <EventsProcessedCounter />
        </div>

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

        {/* Business metrics row - below log and tree */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ChainHealthIndicator isCompromised={isCompromised} />
          <AuditReadinessIndicator isCompromised={isCompromised} />
        </div>

        {/* Challenge panel - centered, full width, reduced visual weight */}
        <div className="bg-gray-900/40 border border-gray-700 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-white mb-3">
            The breach is recorded. What if someone tries to hide it?
          </h2>
          <p className="text-white/80 text-base mb-5">
            Watch what happens when a rogue admin attempts to modify the logs.
          </p>
          <button
            onClick={onContinue}
            className="border border-red-500/60 text-red-400 font-semibold
                       py-3 px-10 rounded-lg transition-colors duration-200 text-base
                       hover:bg-red-500/10 bg-transparent"
          >
            SIMULATE INSIDER ATTACK
          </button>
        </div>
      </div>
    </div>
  )
}

// Modify Screen - Automated attack simulation (no user interaction needed)
function ModifyScreen({
  events,
  tree,
  isCompromised,
  selectedEvent,
  tamperedIndex,
  onSelectEvent,
  onSubmit
}) {
  const [attackPhase, setAttackPhase] = useState(0) // 0: detecting, 1: targeting, 2: attempting

  // Find DATA_EXPORT event details
  const exportEvent = events.find(e => e.type === 'DATA_EXPORT')
  const recordCount = exportEvent?.details?.records || 4942

  // Auto-select DATA_EXPORT and run attack sequence automatically
  useEffect(() => {
    if (events.length === 0) return

    const exportIndex = events.findIndex(e => e.type === 'DATA_EXPORT')
    if (exportIndex >= 0 && !selectedEvent) {
      onSelectEvent(exportIndex)
    }

    // Automated attack sequence
    const timers = []

    // Phase 0: Show "ROGUE ADMIN DETECTED" (immediate)
    // Phase 1: Show "Targeting..." (after 1.5s)
    timers.push(setTimeout(() => setAttackPhase(1), 1500))

    // Phase 2: Show "Attempting modification..." (after 2.5s)
    timers.push(setTimeout(() => setAttackPhase(2), 2500))

    // Auto-submit the attack (after 3.5s)
    timers.push(setTimeout(() => {
      onSubmit('0') // Change records to 0 to hide the breach
    }, 3500))

    return () => timers.forEach(clearTimeout)
  }, [events, selectedEvent, onSelectEvent, onSubmit])

  return (
    <div className="screen-container bg-[#0a0a0a] pb-20">
      <div className="content-wrapper">
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <div className="text-red-500 font-mono text-sm tracking-widest mb-2 animate-pulse">
              [ SIMULATION IN PROGRESS ]
            </div>
            <h2 className="text-4xl font-bold text-amber-500">
              ROGUE ADMIN DETECTED
            </h2>
          </div>
          <EventsProcessedCounter />
        </div>

        {/* Main content row - Event log beside Merkle tree */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left column - Event log */}
          <div className="min-w-0">
            <EventLog
              events={events}
              tamperedIndex={tamperedIndex}
            />
          </div>

          {/* Right column - Merkle structure */}
          <div className="min-w-0">
            <MerkleStructure tree={tree} tamperedIndex={tamperedIndex} />
          </div>
        </div>

        {/* Business metrics row - below log and tree */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ChainHealthIndicator isCompromised={isCompromised} />
          <AuditReadinessIndicator isCompromised={isCompromised} />
        </div>

        {/* Attack simulation panel - replaces manual ModifyPanel */}
        <div className="bg-gray-900/80 border border-amber-600 rounded-lg p-8">
          {/* Attack header */}
          <div className="mb-6 p-4 bg-red-900/30 border border-red-600 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 font-mono font-bold tracking-wider">
                SIMULATION: ROGUE ADMIN DETECTED
              </span>
            </div>
            <p className="text-amber-200/70 text-sm font-mono">
              Attempting unauthorized modification...
            </p>
          </div>

          {/* Target display */}
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-amber-500/50">
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Target Identified</div>
            <div className="text-2xl font-bold text-amber-400 font-mono">
              TARGET: Data Export ({recordCount.toLocaleString()} records)
            </div>
          </div>

          {/* Attack progress */}
          <div className="space-y-3 font-mono text-sm">
            <div className={`flex items-center gap-3 ${attackPhase >= 0 ? 'text-amber-400' : 'text-gray-600'}`}>
              <span className={attackPhase === 0 ? 'animate-pulse' : ''}>●</span>
              <span>Privileged access confirmed (ROOT)</span>
              {attackPhase >= 1 && <span className="text-green-500 ml-auto">✓</span>}
            </div>
            <div className={`flex items-center gap-3 ${attackPhase >= 1 ? 'text-amber-400' : 'text-gray-600'}`}>
              <span className={attackPhase === 1 ? 'animate-pulse' : ''}>●</span>
              <span>Targeting DATA_EXPORT record...</span>
              {attackPhase >= 2 && <span className="text-green-500 ml-auto">✓</span>}
            </div>
            <div className={`flex items-center gap-3 ${attackPhase >= 2 ? 'text-red-400' : 'text-gray-600'}`}>
              <span className={attackPhase === 2 ? 'animate-pulse' : ''}>●</span>
              <span>Attempting to modify records: {recordCount.toLocaleString()} → 0</span>
            </div>
          </div>

          {/* Attack status */}
          <div className="mt-6 text-center text-gray-400 text-sm">
            {attackPhase < 2 ? (
              <span className="animate-pulse">Attack sequence in progress...</span>
            ) : (
              <span className="text-red-400 animate-pulse">Executing modification attempt...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Reject Screen - Show rejection with forensic preservation display
// 6-second hold for impact, then auto-advance to comparison
function RejectScreen({ events, tree, tamperedIndex, tamperResult, canContinue, onCanContinue, onContinue }) {
  const [countdown, setCountdown] = useState(6)
  const [shakeClass, setShakeClass] = useState('shake-once')

  // 6-second countdown before allowing continue (hold for impact)
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
    const timer = setTimeout(() => setShakeClass(''), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`screen-container bg-[#0a0a0a] pb-20 ${shakeClass} ${canContinue ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      onClick={onContinue}
    >
      <div className="content-wrapper">
        {/* Header with status indicators */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-red-500 animate-pulse">
              INTEGRITY VIOLATION
            </h1>
          </div>
          <EventsProcessedCounter />
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

        {/* Business metrics row - showing compromised state */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ChainHealthIndicator isCompromised={true} />
          <AuditReadinessIndicator isCompromised={true} />
        </div>

        {/* Rejection details panel - compliance report style */}
        <div className="rejection-panel">
          <RejectionDisplay
            tamperResult={tamperResult}
            showContinue={false}
            tamperedIndex={tamperedIndex}
          />
        </div>

        {/* Countdown or continue message */}
        <div className="mt-6 text-center">
          {!canContinue ? (
            <p className="text-gray-300 text-xl">
              Preserving forensic evidence... <span className="text-red-400 font-bold">{countdown}s</span>
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
