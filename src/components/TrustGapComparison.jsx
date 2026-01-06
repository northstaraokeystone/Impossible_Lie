/**
 * TrustGapComparison - The Competitive Kill Shot
 * "Logs are opinions. Hashes are facts. Don't just recover—prove it."
 *
 * Shows comparison table between incumbents (Spin.AI, Obsidian) and SaaSGuard
 * Appears AFTER the Affidavit modal to contextualize what was just demonstrated
 */

import React from 'react'

// Comparison data
const comparisonRows = [
  {
    label: 'DATA SOURCE',
    incumbent: 'Text Logs',
    incumbentSub: '(Mutable, Deletable)',
    saasguard: 'Cryptographic Ledger',
    saasguardSub: '(Immutable)'
  },
  {
    label: 'BACKUP STRATEGY',
    incumbent: '"Restore Fast"',
    incumbentSub: '(Hope it\'s clean)',
    saasguard: '"Verify First"',
    saasguardSub: '(Prove it\'s clean)'
  },
  {
    label: 'INSIDER THREAT',
    incumbent: 'Blind to Root Access',
    incumbentSub: '(DB Admin invisible)',
    saasguard: 'Captures Root Access',
    saasguardSub: '(Sidecar Audit)'
  },
  {
    label: 'END PRODUCT',
    incumbent: 'A Dashboard Screenshot',
    incumbentSub: null,
    saasguard: 'A Court-Admissible Affidavit',
    saasguardSub: null
  }
]

export default function TrustGapComparison({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#09090b]/95 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Comparison Card */}
      <div className="relative bg-[#0f0f0f] rounded max-w-3xl w-full mx-4 overflow-hidden border border-[#1f1f23]">
        {/* Header */}
        <div className="px-8 py-6 text-center">
          <h2 className="text-base font-bold text-[#F8FAFC] tracking-wide mb-2">
            THE TRUST GAP
          </h2>
          <p className="text-xs text-[#94a3b8]">
            Why "Detection" Isn't Enough
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#27272a] mx-8" />

        {/* Column Headers */}
        <div className="px-8 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div /> {/* Empty for row labels */}
            <div className="text-center">
              <span className="text-[11px] text-[#64748b] font-medium tracking-wide">
                THE INCUMBENTS
              </span>
              <div className="text-[10px] text-[#475569] mt-0.5">
                (Spin.AI, Obsidian)
              </div>
            </div>
            <div className="text-center">
              <span className="text-[11px] text-[#E2E8F0] font-medium tracking-wide">
                SAASGUARD
              </span>
              <div className="text-[10px] text-[#94a3b8] mt-0.5">
                (Unbreakable Chain)
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Rows */}
        <div className="px-8 pb-6 space-y-3">
          {comparisonRows.map((row, i) => (
            <div key={i} className="grid grid-cols-3 gap-4 py-3 border-t border-[#1f1f23]">
              {/* Row Label */}
              <div className="flex items-center">
                <span className="text-[11px] text-[#94a3b8] font-medium">
                  {row.label}
                </span>
              </div>

              {/* Incumbent Column - Dimmer */}
              <div className="text-center">
                <span className="text-[11px] text-[#64748b]">
                  {row.incumbent}
                </span>
                {row.incumbentSub && (
                  <div className="text-[10px] text-[#475569] mt-0.5">
                    {row.incumbentSub}
                  </div>
                )}
              </div>

              {/* SaaSGuard Column - Brighter */}
              <div className="text-center">
                <span className="text-[11px] text-[#E2E8F0] font-medium">
                  {row.saasguard}
                </span>
                {row.saasguardSub && (
                  <div className="text-[10px] text-[#94a3b8] mt-0.5">
                    {row.saasguardSub}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-[#27272a] mx-8" />

        {/* The Punchline - Serif, Italic */}
        <div className="px-8 py-8 text-center">
          <p className="text-sm text-[#F8FAFC] font-serif italic leading-relaxed">
            "Logs are opinions. Hashes are facts. Don't just recover—prove it."
          </p>
        </div>

        {/* Footer - RESTART SCENARIO button (wider, clear CTA for looped demo) */}
        <div className="px-8 py-4 flex items-center justify-center bg-[#111111]">
          <button
            onClick={onClose}
            className="px-8 py-2 min-w-[160px] bg-[#1f1f23] text-[#E2E8F0] text-xs rounded hover:bg-[#27272a] border border-[#27272a]"
          >
            RESTART SCENARIO
          </button>
        </div>

        {/* Restart hint */}
        <div className="px-8 py-2 text-center bg-[#09090b]">
          <p className="text-[#64748b] text-[10px]">Press R to restart demo</p>
        </div>
      </div>
    </div>
  )
}
