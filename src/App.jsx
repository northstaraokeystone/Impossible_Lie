/**
 * SaaSGuard - Stealth Bomber Aesthetic
 * "If it works, invisible. If it breaks, RED screams."
 *
 * CHANGES:
 * - Background: #09090b (Zinc-950, near black)
 * - NO header gradient
 * - NO colored phase indicators (all grey)
 * - Panels in single container (no individual boxes)
 * - Screen nearly OFF by default
 */

import React, { useEffect, useCallback } from 'react'
import { useSaaSGuard, PHASES, ACTIVE_PANEL } from './hooks/useSaaSGuard'
import TokenTracker from './components/TokenTracker'
import BackupProof from './components/BackupProof'
import DecisionLog from './components/DecisionLog'
import ChainCore from './components/ChainCore'
import IncidentModal from './components/IncidentModal'

export default function App() {
  const demo = useSaaSGuard()

  // Initialize on mount
  useEffect(() => {
    demo.init()
  }, [])

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      if (demo.phase === PHASES.INTRO) {
        demo.start()
      }
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault()
      demo.restart()
    } else if (e.key === 'Escape') {
      if (demo.phase === PHASES.MODAL) {
        demo.closeModal()
      }
    }
  }, [demo.phase])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Render intro screen
  if (demo.phase === PHASES.INTRO) {
    return <IntroScreen onStart={demo.start} />
  }

  // Get panel opacity - minimal changes, no animations
  const getPanelClass = (panelType) => {
    const { activePanel, phase } = demo

    // During modal/freeze, dim
    if (phase === PHASES.MODAL || phase === PHASES.FREEZE) {
      return 'opacity-30'
    }

    // During the pause
    if (phase === PHASES.THE_PAUSE) {
      return 'opacity-60'
    }

    // All panels active during normal ops
    if (activePanel === ACTIVE_PANEL.ALL) {
      return 'opacity-100'
    }

    // Dim inactive panels
    if (activePanel === ACTIVE_PANEL.NONE) {
      return 'opacity-60'
    }

    const isActive = (
      (panelType === 'token' && activePanel === ACTIVE_PANEL.TOKEN_TRACKER) ||
      (panelType === 'backup' && activePanel === ACTIVE_PANEL.BACKUP_PROOF) ||
      (panelType === 'decision' && activePanel === ACTIVE_PANEL.DECISION_LOG)
    )

    return isActive ? 'opacity-100' : 'opacity-40'
  }

  // Main SOC layout - Stealth
  return (
    <div className="h-screen flex flex-col bg-[#09090b] overflow-hidden no-select">
      {/* Header - Minimal */}
      <header className="px-6 py-3 bg-[#111111]">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#475569] tracking-widest">SAASGUARD</span>
          <PhaseIndicator phase={demo.phase} />
        </div>
      </header>

      {/* Main content - whitespace separation only */}
      <div className="flex-1 flex flex-col min-h-0 p-3 gap-3 bg-[#09090b]">
        {/* Three panels in single container */}
        <div className="flex-[3] grid grid-cols-3 gap-3 min-h-0">
          <div className={getPanelClass('token')}>
            <TokenTracker />
          </div>
          <div className={getPanelClass('backup')}>
            <BackupProof />
          </div>
          <div className={getPanelClass('decision')}>
            <DecisionLog />
          </div>
        </div>

        {/* Chain Core at bottom */}
        <div className="flex-1 min-h-0">
          <ChainCore />
        </div>
      </div>

      {/* Modal overlay */}
      {demo.phase === PHASES.MODAL && (
        <IncidentModal onClose={demo.closeModal} />
      )}
    </div>
  )
}

// Phase indicator - all grey except ALERT states = red
function PhaseIndicator({ phase }) {
  const isAlert = [
    PHASES.ATTACK_DETECTED,
    PHASES.TOKEN_BLOCKED,
    PHASES.PIVOT_ATTEMPT
  ].includes(phase)

  const phaseLabels = {
    [PHASES.NORMAL_OPS]: 'NORMAL',
    [PHASES.ATTACK_DETECTED]: 'ALERT',
    [PHASES.TOKEN_BLOCKED]: 'BLOCKED',
    [PHASES.THE_PAUSE]: '...',
    [PHASES.PIVOT_ATTEMPT]: 'PIVOT',
    [PHASES.BACKUP_HELD]: 'HELD',
    [PHASES.AI_TRIAGE]: 'TRIAGE',
    [PHASES.FREEZE]: 'DONE',
    [PHASES.MODAL]: 'REPORT'
  }

  const label = phaseLabels[phase] || '...'

  return (
    <span className={`text-[10px] ${isAlert ? 'text-[#ef4444]' : 'text-[#475569]'}`}>
      {label}
    </span>
  )
}

// Intro screen - Stealth
function IntroScreen({ onStart }) {
  // Auto-start after 8 seconds
  useEffect(() => {
    const timer = setTimeout(onStart, 8000)
    return () => clearTimeout(timer)
  }, [onStart])

  return (
    <div className="intro-container cursor-pointer bg-[#09090b]" onClick={onStart}>
      <div className="text-center max-w-4xl">
        {/* Alert badge - dim red */}
        <div className="inline-block px-4 py-2 mb-8">
          <span className="text-[#ef4444]/60 text-xs tracking-widest">
            THREAT INTELLIGENCE
          </span>
        </div>

        {/* Main title */}
        <h1 className="text-4xl md:text-5xl font-medium mb-6 text-[#94a3b8]">
          Midnight Blizzard
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-[#475569] mb-4">
          APT29 | Nation-State | January 2024
        </p>

        {/* Description */}
        <p className="text-sm text-[#475569] mb-12 max-w-xl mx-auto leading-relaxed">
          What if Cloudflare had SaaSGuard during the Midnight Blizzard attack?
        </p>

        {/* Attack vector info - all grey */}
        <div className="flex justify-center gap-12 mb-12">
          <div className="text-center">
            <div className="text-lg text-[#94a3b8] mb-1">OKTA</div>
            <div className="text-[10px] text-[#475569]">Source</div>
          </div>
          <div className="text-center">
            <div className="text-lg text-[#94a3b8] mb-1">OAuth</div>
            <div className="text-[10px] text-[#475569]">Vector</div>
          </div>
          <div className="text-center">
            <div className="text-lg text-[#94a3b8] mb-1">APT29</div>
            <div className="text-[10px] text-[#475569]">Actor</div>
          </div>
        </div>

        {/* CTA - stealth button */}
        <button
          onClick={onStart}
          className="px-6 py-3 bg-[#111111] text-[#94a3b8] text-sm rounded hover:bg-[#1f1f23]"
        >
          LAUNCH
        </button>

        <p className="mt-6 text-[#475569] text-xs">
          Press Space to begin
        </p>

        {/* Module preview - very dim */}
        <div className="mt-16 flex justify-center gap-4">
          <span className="text-[10px] text-[#475569]">TOKEN</span>
          <span className="text-[10px] text-[#475569]">BACKUP</span>
          <span className="text-[10px] text-[#475569]">AI</span>
        </div>
      </div>
    </div>
  )
}
