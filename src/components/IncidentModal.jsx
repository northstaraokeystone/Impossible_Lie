/**
 * IncidentModal - Stealth Mode
 * "Healthy = Invisible. Problems = RED."
 *
 * CHANGES:
 * - NO green colors - all stealth grey
 * - Cleaner document styling
 * - Minimal visual noise
 */

import React from 'react'
import { useSaaSGuard } from '../hooks/useSaaSGuard'

export default function IncidentModal({ onClose }) {
  const {
    receipts,
    chainRoot,
    blockCount
  } = useSaaSGuard()

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#09090b]/95 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#111111] rounded max-w-2xl w-full mx-4 overflow-hidden">
        {/* Document Preview */}
        <div className="p-8">
          <div className="bg-[#fafafa] rounded p-8 text-[#09090b]">
            {/* Document header */}
            <div className="text-center border-b border-[#09090b] pb-4 mb-6">
              <h2 className="text-base font-medium tracking-wide">
                AFFIDAVIT OF SYSTEM INTEGRITY
              </h2>
            </div>

            {/* Document body */}
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[#71717a]">DATE:</span>
                <span>{currentDate}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#71717a]">INCIDENT:</span>
                <span>APT29 Token Reuse Attack</span>
              </div>

              <div className="my-6 py-4 border-y border-[#e4e4e7]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[#71717a]">CHAIN OF CUSTODY:</span>
                  <span className="font-medium">UNBROKEN</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[#71717a]">DATA LOSS:</span>
                  <span className="font-medium">0 RECORDS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#71717a]">ATTACKER:</span>
                  <span>APT29 (Midnight Blizzard)</span>
                </div>
              </div>

              {/* Actions taken */}
              <div>
                <p className="text-[#71717a] mb-2 text-xs">ACTIONS TAKEN:</p>
                <div className="space-y-1 text-sm text-[#09090b]">
                  <div>• Unauthorized token blocked</div>
                  <div>• Backup write attempt rejected</div>
                  <div>• Account suspended</div>
                  <div>• Token rotation initiated</div>
                </div>
              </div>

              {/* Cryptographic root */}
              <div className="mt-6 pt-4 border-t border-[#e4e4e7]">
                <p className="text-[#71717a] text-xs mb-1">CRYPTOGRAPHIC ROOT:</p>
                <p className="font-hash text-xs">{chainRoot}</p>
              </div>

              {/* Status */}
              <div className="mt-6 text-center">
                <span className="text-xs text-[#71717a]">
                  STATUS: ADMISSIBLE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Liability Avoided - minimal */}
        <div className="px-8 py-6 bg-[#09090b]">
          <p className="text-[#475569] text-[10px] mb-3">LIABILITY AVOIDED</p>

          <div className="space-y-1 text-[11px] mb-4">
            <div className="flex justify-between text-[#94a3b8]">
              <span>GDPR Article 32 Fine:</span>
              <span>$2,000,000</span>
            </div>
            <div className="flex justify-between text-[#94a3b8]">
              <span>Ransomware Recovery:</span>
              <span>$1,800,000</span>
            </div>
            <div className="flex justify-between text-[#94a3b8]">
              <span>Incident Response:</span>
              <span>$300,000</span>
            </div>
            <div className="flex justify-between text-[#94a3b8]">
              <span>Reputational Damage:</span>
              <span>$100,000</span>
            </div>
            <div className="flex justify-between text-[#94a3b8] pt-2 border-t border-[#1f1f23]">
              <span>TOTAL:</span>
              <span className="text-[#94a3b8]">$4,200,000</span>
            </div>
          </div>

          <p className="text-[9px] text-[#475569]">
            Source: IBM Cost of Data Breach Report 2024
          </p>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 flex items-center justify-between bg-[#111111]">
          <div className="text-[9px] text-[#475569]">
            <span>BLOCKS: {blockCount} | RECEIPTS: {receipts.length}</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1f1f23] text-[#94a3b8] text-xs rounded hover:bg-[#27272a]"
          >
            DOWNLOAD
          </button>
        </div>

        {/* Restart hint */}
        <div className="px-8 py-2 text-center bg-[#09090b]">
          <p className="text-[#475569] text-[10px]">Press R to restart</p>
        </div>
      </div>
    </div>
  )
}
