/**
 * TokenTracker - Stealth Mode
 * "Healthy = Invisible. Problems = RED."
 *
 * CHANGES:
 * - NO blue color - all stealth grey
 * - NO "OAuth Sentinel" subtitle
 * - NO colored badges - red dot only for alerts
 * - NO ping animations
 * - Static display, instant updates
 */

import React from 'react'
import { useSaaSGuard, PHASES } from '../hooks/useSaaSGuard'

// Mini world map - stealth colors
function GeoMap({ tokenEvents, attackerDetected }) {
  const locations = {
    'NYC': { x: 25, y: 40 },
    'LONDON': { x: 48, y: 35 },
    'BERLIN': { x: 52, y: 35 },
    'SF': { x: 15, y: 42 },
    'ST. PETERSBURG': { x: 58, y: 32 }
  }

  const origins = [...new Set(tokenEvents.map(e => e.origin).filter(o => locations[o]))]
  const hasAttacker = origins.includes('ST. PETERSBURG')

  return (
    <div className="relative h-16 bg-[#09090b] overflow-hidden">
      {/* Simple world map outline - very dim */}
      <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full opacity-10">
        <path
          d="M10,35 Q20,30 30,32 T50,30 T70,35 T90,32 M15,45 Q25,50 40,48 T60,52 T80,48"
          stroke="#475569"
          strokeWidth="0.5"
          fill="none"
        />
        <ellipse cx="50" cy="35" rx="40" ry="20" stroke="#475569" strokeWidth="0.3" fill="none" />
      </svg>

      {/* Location dots - grey normally, RED for attacker only */}
      {origins.map((origin) => {
        const loc = locations[origin]
        if (!loc) return null
        const isAttacker = origin === 'ST. PETERSBURG'

        return (
          <div
            key={origin}
            className={`absolute w-1.5 h-1.5 rounded-full transform -translate-x-1 -translate-y-1 ${
              isAttacker ? 'bg-[#ef4444]' : 'bg-[#475569]'
            }`}
            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
          />
        )
      })}
    </div>
  )
}

export default function TokenTracker() {
  const {
    phase,
    activeSessions,
    anomalies,
    tokenEvents,
    attackerDetected,
    attackerBlocked
  } = useSaaSGuard()

  const isAlert = [PHASES.ATTACK_DETECTED, PHASES.TOKEN_BLOCKED].includes(phase) ||
    (phase !== PHASES.INTRO && phase !== PHASES.NORMAL_OPS && attackerBlocked)

  const showAlertBadge = attackerBlocked

  return (
    <div className="h-full flex flex-col bg-[#111111] overflow-hidden">
      {/* Header - minimal, red dot for alert only */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#475569] tracking-wide">TOKEN</span>
          {isAlert && <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />}
        </div>
      </div>

      {/* Stats - stealth grey, anomalies RED if > 0 */}
      <div className="px-5 py-4 bg-[#09090b] grid grid-cols-2 gap-6">
        <div>
          <span className="text-[10px] text-[#475569] block mb-1">SESSIONS</span>
          <span className="text-sm text-[#94a3b8]">{activeSessions.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-[10px] text-[#475569] block mb-1">ANOMALIES</span>
          <span className={`text-sm ${anomalies > 0 ? 'text-[#ef4444]' : 'text-[#475569]'}`}>
            {anomalies}
          </span>
        </div>
      </div>

      {/* Token Flow - static list, no animations */}
      <div className="flex-1 flex flex-col min-h-0 px-5 py-4">
        <div className="flex-1 overflow-y-auto space-y-1 text-[10px]">
          {tokenEvents.length === 0 ? (
            <span className="text-[#475569]">Idle</span>
          ) : (
            tokenEvents.map((event, i) => {
              const isBlocked = event.status === 'blocked'
              const isSuspicious = event.status === 'suspicious'

              return (
                <div
                  key={i}
                  className={`flex items-center justify-between py-1.5 px-2 ${
                    isBlocked ? 'bg-[#ef4444]/5' : 'bg-transparent'
                  }`}
                >
                  <span className="text-[#475569] w-12 font-hash">{event.time}</span>
                  <span className={`flex-1 truncate mx-2 ${
                    isBlocked ? 'text-[#ef4444]' : 'text-[#94a3b8]'
                  }`}>
                    {event.identity}
                  </span>
                  <span className={`w-20 text-right ${
                    event.origin === 'ST. PETERSBURG' ? 'text-[#ef4444]' : 'text-[#475569]'
                  }`}>
                    {event.origin}
                  </span>
                  <span className="w-4 text-right">
                    {isBlocked && <span className="text-[#ef4444]">×</span>}
                    {isSuspicious && <span className="text-[#ef4444]">!</span>}
                  </span>
                </div>
              )
            })
          )}
        </div>

        {/* Alert info - RED only, no badge styling */}
        {showAlertBadge && (
          <div className="mt-3 py-2 text-[10px] text-[#ef4444]">
            <div>APT29 TOKEN REUSE</div>
            <div className="text-[#ef4444]/60">svc_okta_sync blocked • ST. PETERSBURG</div>
          </div>
        )}
      </div>

      {/* Geographic Map - minimal */}
      <div className="px-5 pb-4">
        <GeoMap tokenEvents={tokenEvents} attackerDetected={attackerDetected} />
      </div>
    </div>
  )
}
