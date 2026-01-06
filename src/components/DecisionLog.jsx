/**
 * DecisionLog - AI Audit Trail Module
 * Enterprise War Room styling - "Boring enough to trust, scary enough to buy"
 *
 * SPECIFIC LANGUAGE:
 * - "THREAT CLASSIFICATION: NATION-STATE (CONFIDENCE: 0.94)" not "AI ANALYSIS"
 * - Shows clear confidence scores and actions
 */

import React from 'react'
import { useSaaSGuard, PHASES } from '../hooks/useSaaSGuard'

export default function DecisionLog() {
  const {
    phase,
    aiActions,
    compliance,
    decisions
  } = useSaaSGuard()

  const isActive = phase === PHASES.AI_TRIAGE || aiActions > 0

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] rounded-lg overflow-hidden">
      {/* Header - no border, use whitespace */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#2f855a] tracking-wide">DECISIONLOG</h3>
            <p className="text-xs text-[#718096] mt-0.5">AI Audit Trail</p>
          </div>
          <div className={`px-2.5 py-1 rounded text-xs font-medium ${
            isActive ? 'bg-[#2f855a]/15 text-[#2f855a]' : 'bg-[#1a1a1a] text-[#718096]'
          }`}>
            {isActive ? 'RECORDING' : 'STANDBY'}
          </div>
        </div>
      </div>

      {/* Stats - generous padding, no border */}
      <div className="px-5 py-4 bg-[#1a1a1a] grid grid-cols-2 gap-6">
        <div>
          <p className="text-[10px] text-[#718096] mb-1 font-medium">AI ACTIONS</p>
          <p className={`text-lg font-medium ${aiActions > 0 ? 'text-[#2f855a]' : 'text-[#718096]'}`}>
            {aiActions}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#718096] mb-1 font-medium">COMPLIANCE</p>
          <div className="flex items-center gap-2">
            <span className="text-[#2f855a] text-sm">OK</span>
            <span className="text-xs text-[#718096]">EU AI ACT</span>
          </div>
        </div>
      </div>

      {/* Decision Feed */}
      <div className="flex-1 flex flex-col min-h-0 px-5 py-4">
        <p className="text-[10px] text-[#718096] mb-3 font-medium">DECISION FEED</p>

        <div className="flex-1 overflow-y-auto space-y-2 text-xs">
          {decisions.length === 0 ? (
            <div className="text-[#718096] italic text-center py-6">
              <p>AI assistance idle</p>
              <p className="text-[10px] mt-1">Awaiting incident triage</p>
            </div>
          ) : (
            decisions.map((decision, i) => (
              <div
                key={i}
                className="py-2.5 px-3 rounded bg-[#2f855a]/5"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[#718096] text-[10px] font-hash">{decision.time}</span>
                  <span className="text-[#2f855a] text-[10px] font-hash">{decision.hash}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#2f855a] font-medium">{decision.type}</span>
                  <span className="text-[#e2e8f0] bg-[#2f855a]/20 px-2 py-0.5 rounded text-[10px] font-medium">
                    {decision.confidence.toFixed(2)}
                  </span>
                </div>
                <div className="mt-1.5 text-[#e2e8f0] text-[11px]">
                  {decision.output}
                </div>
                {decision.detail && (
                  <div className="mt-1 text-[#718096] text-[10px]">
                    {decision.detail}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Final badge when triage is complete */}
        {aiActions >= 3 && (
          <div className="mt-3 py-2.5 px-3 bg-[#2f855a]/10 rounded text-center">
            <span className="text-[#2f855a] text-xs font-medium">
              INCIDENT CONTAINED
            </span>
            <p className="text-[#2f855a]/70 text-[10px] mt-1">
              Auto-response executed • Chain sealed
            </p>
          </div>
        )}
      </div>

      {/* Provenance Chain */}
      <div className="px-5 py-4 bg-[#1a1a1a]">
        <p className="text-[10px] text-[#718096] mb-2 font-medium">PROVENANCE CHAIN</p>
        <div className="text-[10px] text-[#718096] space-y-1">
          <div className="flex justify-between">
            <span>Model ID:</span>
            <span className="text-[#e2e8f0]">gpt-4-turbo</span>
          </div>
          <div className="flex justify-between">
            <span>Model Hash:</span>
            <span className="text-[#e2e8f0] font-hash">0x7f8a9d...</span>
          </div>
          <div className="flex justify-between">
            <span>Human Approved:</span>
            <span className="text-[#2f855a]">YES</span>
          </div>
        </div>
      </div>
    </div>
  )
}
