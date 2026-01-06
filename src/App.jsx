/**
 * SaaSGuard Security Operations Center
 * Enterprise War Room - "Boring enough to trust, scary enough to buy"
 *
 * De-gamified from "Cyberpunk Casino" to "Swiss Boardroom"
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

  // Get panel opacity classes based on active panel
  const getPanelClass = (panelType) => {
    const { activePanel, phase } = demo

    // During modal/freeze, dim everything
    if (phase === PHASES.MODAL || phase === PHASES.FREEZE) {
      return 'opacity-40 transition-opacity duration-500'
    }

    // During the pause, all panels at 80%
    if (phase === PHASES.THE_PAUSE) {
      return 'opacity-80 transition-opacity duration-500'
    }

    // All panels active during normal ops
    if (activePanel === ACTIVE_PANEL.ALL) {
      return 'opacity-100 transition-opacity duration-500'
    }

    // Dim inactive panels, highlight active one
    if (activePanel === ACTIVE_PANEL.NONE) {
      return 'opacity-80 transition-opacity duration-500'
    }

    const isActive = (
      (panelType === 'token' && activePanel === ACTIVE_PANEL.TOKEN_TRACKER) ||
      (panelType === 'backup' && activePanel === ACTIVE_PANEL.BACKUP_PROOF) ||
      (panelType === 'decision' && activePanel === ACTIVE_PANEL.DECISION_LOG)
    )

    return isActive
      ? 'opacity-100 transition-opacity duration-500'
      : 'opacity-60 transition-opacity duration-500'
  }

  // Main SOC layout - Enterprise styling
  return (
    <div className="h-screen flex flex-col bg-[#1a1a1a] overflow-hidden no-select">
      {/* Header - Enterprise clean */}
      <header className="px-6 py-4 bg-[#1e1e1e]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-[#e2e8f0] tracking-wide">
              SAASGUARD SECURITY OPERATIONS CENTER
            </h1>
            <div className="h-0.5 w-64 mt-2 bg-gradient-to-r from-[#3182ce] via-[#d69e2e] to-[#2f855a]" />
          </div>
          <div className="flex items-center gap-4">
            <PhaseIndicator phase={demo.phase} />
            <div className="text-xs text-[#718096]">
              INCIDENT: MIDNIGHT BLIZZARD
            </div>
          </div>
        </div>
      </header>

      {/* Main content area - whitespace gaps instead of borders */}
      <div className="flex-1 flex flex-col min-h-0 p-3 gap-3 bg-[#1a1a1a]">
        {/* Three module columns */}
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

// Phase indicator component - Enterprise styling
function PhaseIndicator({ phase }) {
  const phaseLabels = {
    [PHASES.NORMAL_OPS]: { label: 'NORMAL OPS', color: 'text-[#2f855a]' },
    [PHASES.ATTACK_DETECTED]: { label: 'ATTACK DETECTED', color: 'text-[#d69e2e]' },
    [PHASES.TOKEN_BLOCKED]: { label: 'TOKEN BLOCKED', color: 'text-[#c53030]' },
    [PHASES.THE_PAUSE]: { label: 'ANALYZING', color: 'text-[#718096]' },
    [PHASES.PIVOT_ATTEMPT]: { label: 'PIVOT ATTEMPT', color: 'text-[#c53030]' },
    [PHASES.BACKUP_HELD]: { label: 'BACKUP SECURED', color: 'text-[#2f855a]' },
    [PHASES.AI_TRIAGE]: { label: 'AI TRIAGE', color: 'text-[#2f855a]' },
    [PHASES.FREEZE]: { label: 'ANALYSIS COMPLETE', color: 'text-[#e2e8f0]' },
    [PHASES.MODAL]: { label: 'REPORT READY', color: 'text-[#e2e8f0]' }
  }

  const current = phaseLabels[phase] || { label: 'INITIALIZING', color: 'text-[#718096]' }

  return (
    <div className={`px-3 py-1.5 rounded bg-[#1a1a1a] text-xs font-medium ${current.color}`}>
      {current.label}
    </div>
  )
}

// Intro screen component - Enterprise de-gamified
function IntroScreen({ onStart }) {
  // Auto-start after 8 seconds
  useEffect(() => {
    const timer = setTimeout(onStart, 8000)
    return () => clearTimeout(timer)
  }, [onStart])

  return (
    <div className="intro-container cursor-pointer bg-[#1a1a1a]" onClick={onStart}>
      <div className="text-center max-w-4xl">
        {/* Alert badge - muted enterprise red */}
        <div className="inline-block px-4 py-2 mb-8 bg-[#c53030]/10 rounded">
          <span className="text-[#c53030] text-sm tracking-widest font-medium">
            THREAT INTELLIGENCE ALERT
          </span>
        </div>

        {/* Main title - clean sans-serif */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#e2e8f0]">
          Midnight Blizzard
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-[#718096] mb-4">
          APT29 | Nation-State Actor | January 2024
        </p>

        {/* Description */}
        <p className="text-base text-[#718096] mb-12 max-w-2xl mx-auto leading-relaxed">
          What if Cloudflare had SaaSGuard during the Midnight Blizzard attack?
          Watch how the full suite would have detected, blocked, and documented
          the intrusion with cryptographic proof.
        </p>

        {/* Attack vector info - enterprise colors */}
        <div className="flex justify-center gap-12 mb-12">
          <div className="text-center">
            <div className="text-xl font-semibold text-[#c53030] mb-1">OKTA</div>
            <div className="text-xs text-[#718096]">Breach Source</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-[#d69e2e] mb-1">OAuth</div>
            <div className="text-xs text-[#718096]">Attack Vector</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-[#3182ce] mb-1">APT29</div>
            <div className="text-xs text-[#718096]">Threat Actor</div>
          </div>
        </div>

        {/* CTA - clean enterprise button */}
        <button
          onClick={onStart}
          className="px-8 py-4 bg-[#e2e8f0] text-[#1a1a1a] font-semibold rounded-lg hover:bg-white transition-colors"
        >
          LAUNCH SCENARIO
        </button>

        <p className="mt-6 text-[#718096] text-sm">
          Click or press Space to begin
        </p>

        {/* Suite preview - enterprise colors */}
        <div className="mt-16 flex justify-center gap-6">
          <ModulePreview name="TokenTracker" color="#3182ce" />
          <ModulePreview name="BackupProof" color="#d69e2e" />
          <ModulePreview name="DecisionLog" color="#2f855a" />
        </div>
      </div>
    </div>
  )
}

// Module preview badge for intro screen
function ModulePreview({ name, color }) {
  return (
    <div
      className="px-4 py-2 rounded bg-[#1e1e1e] opacity-70"
      style={{ color: color }}
    >
      <span className="text-xs font-medium">{name}</span>
    </div>
  )
}
