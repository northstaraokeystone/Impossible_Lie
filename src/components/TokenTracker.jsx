/**
 * TokenTracker - OAuth Sentinel Module
 * Enterprise War Room styling - "Boring enough to trust, scary enough to buy"
 *
 * SPECIFIC LANGUAGE:
 * - "ANOMALY: LOGIN FROM UNAUTHORIZED GEO" not "ANOMALY DETECTED"
 * - "PATTERN MATCH: APT29 TOKEN REUSE" not "MIDNIGHT BLIZZARD PATTERN"
 */

import React from 'react'
import { useSaaSGuard, PHASES } from '../hooks/useSaaSGuard'

// Mini world map with dots for auth origins
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
    <div className="relative h-20 bg-[#1e1e1e] rounded overflow-hidden">
      {/* Simple world map outline */}
      <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full opacity-20">
        <path
          d="M10,35 Q20,30 30,32 T50,30 T70,35 T90,32 M15,45 Q25,50 40,48 T60,52 T80,48"
          stroke="#4a5568"
          strokeWidth="0.5"
          fill="none"
        />
        <ellipse cx="50" cy="35" rx="40" ry="20" stroke="#4a5568" strokeWidth="0.3" fill="none" />
      </svg>

      {/* Location dots - enterprise colors */}
      {origins.map((origin, i) => {
        const loc = locations[origin]
        if (!loc) return null
        const isAttacker = origin === 'ST. PETERSBURG'

        return (
          <div
            key={origin}
            className={`absolute w-2 h-2 rounded-full transform -translate-x-1 -translate-y-1 ${
              isAttacker ? 'bg-[#c53030]' : 'bg-[#3182ce]'
            }`}
            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
          >
            {isAttacker && (
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#c53030] animate-ping opacity-75" />
            )}
          </div>
        )
      })}

      {/* Legend */}
      <div className="absolute bottom-1 right-2 text-[8px] text-[#718096]">
        AUTH ORIGINS
      </div>
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

  const isAttackPhase = [PHASES.ATTACK_DETECTED, PHASES.TOKEN_BLOCKED].includes(phase) ||
    (phase !== PHASES.INTRO && phase !== PHASES.NORMAL_OPS && attackerBlocked)

  const showBadge = attackerBlocked

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] rounded-lg overflow-hidden">
      {/* Header - no border, use whitespace */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#3182ce] tracking-wide">TOKENTRACKER</h3>
            <p className="text-xs text-[#718096] mt-0.5">OAuth Sentinel</p>
          </div>
          <div className={`px-2.5 py-1 rounded text-xs font-medium ${
            isAttackPhase ? 'bg-[#c53030]/15 text-[#c53030]' : 'bg-[#3182ce]/10 text-[#3182ce]'
          }`}>
            {isAttackPhase ? 'ALERT' : 'MONITORING'}
          </div>
        </div>
      </div>

      {/* Stats - generous padding, no border */}
      <div className="px-5 py-4 bg-[#1a1a1a] grid grid-cols-2 gap-6">
        <div>
          <p className="text-[10px] text-[#718096] mb-1 font-medium">ACTIVE SESSIONS</p>
          <p className={`text-lg font-medium ${anomalies > 0 ? 'text-[#d69e2e]' : 'text-[#2f855a]'}`}>
            {activeSessions.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#718096] mb-1 font-medium">ANOMALIES</p>
          <p className={`text-lg font-medium ${anomalies > 0 ? 'text-[#c53030]' : 'text-[#2f855a]'}`}>
            {anomalies}
          </p>
        </div>
      </div>

      {/* Token Flow Monitor */}
      <div className="flex-1 flex flex-col min-h-0 px-5 py-4">
        <p className="text-[10px] text-[#718096] mb-3 font-medium">TOKEN FLOW MONITOR</p>

        <div className="flex-1 overflow-y-auto space-y-1 text-xs">
          {tokenEvents.length === 0 ? (
            <p className="text-[#718096] italic">Awaiting token events...</p>
          ) : (
            tokenEvents.map((event, i) => (
              <div
                key={i}
                className={`flex items-center justify-between py-1.5 px-2.5 rounded ${
                  event.status === 'blocked' ? 'bg-[#c53030]/10' :
                  event.status === 'suspicious' ? 'bg-[#d69e2e]/10' :
                  'bg-transparent'
                }`}
              >
                <span className="text-[#718096] w-14 font-hash">{event.time}</span>
                <span className={`flex-1 truncate mx-2 ${
                  event.status === 'blocked' ? 'text-[#c53030]' : 'text-[#e2e8f0]'
                }`}>
                  {event.identity}
                </span>
                <span className={`w-24 text-right text-[10px] ${
                  event.origin === 'ST. PETERSBURG' ? 'text-[#c53030]' :
                  event.origin === '???' ? 'text-[#d69e2e]' :
                  'text-[#718096]'
                }`}>
                  {event.origin}
                </span>
                <span className="w-6 text-right">
                  {event.status === 'valid' && <span className="text-[#2f855a]">OK</span>}
                  {event.status === 'suspicious' && <span className="text-[#d69e2e]">!</span>}
                  {event.status === 'blocked' && <span className="text-[#c53030]">X</span>}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Badge - SPECIFIC language */}
        {showBadge && (
          <div className="mt-3 py-2.5 px-3 bg-[#c53030]/10 rounded text-center">
            <span className="text-[#c53030] text-xs font-medium">
              PATTERN MATCH: APT29 TOKEN REUSE
            </span>
            <p className="text-[#c53030]/70 text-[10px] mt-1">
              svc_okta_sync blocked from ST. PETERSBURG
            </p>
          </div>
        )}
      </div>

      {/* Geographic Map */}
      <div className="px-5 pb-4">
        <GeoMap tokenEvents={tokenEvents} attackerDetected={attackerDetected} />
      </div>
    </div>
  )
}
