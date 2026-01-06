/**
 * DecisionLog - Stealth Mode
 * "Healthy = Invisible. Problems = RED."
 *
 * CHANGES:
 * - NO green color - all stealth grey
 * - NO "AI Audit Trail" subtitle
 * - NO colored badges - red dot when active
 * - NO provenance chain section (unnecessary fluff)
 * - Static display, instant updates
 */

import React from 'react'
import { useSaaSGuard, PHASES } from '../hooks/useSaaSGuard'

export default function DecisionLog() {
  const {
    phase,
    aiActions,
    decisions
  } = useSaaSGuard()

  const isActive = phase === PHASES.AI_TRIAGE || aiActions > 0

  return (
    <div className="h-full flex flex-col bg-[#111111] overflow-hidden">
      {/* Header - off-white for visibility, red dot when active */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#F8FAFC] font-medium tracking-wide">AI</span>
          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />}
        </div>
      </div>

      {/* Stats - off-white for readability */}
      <div className="px-5 py-4 bg-[#09090b] grid grid-cols-2 gap-6">
        <div>
          <span className="text-[10px] text-[#94a3b8] block mb-1">ACTIONS</span>
          <span className={`text-sm ${aiActions > 0 ? 'text-[#E2E8F0]' : 'text-[#64748b]'}`}>
            {aiActions}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[#94a3b8] block mb-1">COMPLIANCE</span>
          <span className="text-sm text-[#64748b]">OK</span>
        </div>
      </div>

      {/* Decision Feed - static, off-white text */}
      <div className="flex-1 flex flex-col min-h-0 px-5 py-4">
        <div className="flex-1 overflow-y-auto space-y-2 text-[10px]">
          {decisions.length === 0 ? (
            <span className="text-[#64748b]">Idle</span>
          ) : (
            decisions.map((decision, i) => (
              <div key={i} className="py-2 px-2 bg-[#09090b]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#94a3b8] font-hash">{decision.time}</span>
                  <span className="text-[#94a3b8] font-hash">{decision.hash}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#E2E8F0] font-medium">{decision.type}</span>
                  <span className="text-[#94a3b8]">{decision.confidence.toFixed(2)}</span>
                </div>
                <div className="mt-1 text-[#E2E8F0] font-medium">{decision.output}</div>
                {decision.detail && (
                  <div className="mt-1 text-[#94a3b8]">{decision.detail}</div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Completion indicator - off-white for readability */}
        {aiActions >= 3 && (
          <div className="mt-3 py-2 text-[10px] text-[#E2E8F0] font-medium">
            <div>CONTAINED</div>
            <div className="text-[#94a3b8] font-normal">Auto-response executed</div>
          </div>
        )}
      </div>
    </div>
  )
}
