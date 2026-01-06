/**
 * IncidentModal - Affidavit Document as Hero
 * Enterprise War Room styling - "Boring enough to trust, scary enough to buy"
 *
 * KEY CHANGES:
 * - Document preview as modal centerpiece (not stats grid)
 * - Affidavit that looks like a legal filing
 * - "CHAIN OF CUSTODY: UNBROKEN" prominent
 * - "ADMISSIBLE IN COURT" status
 * - "DOWNLOAD AFFIDAVIT" button
 * - Liability breakdown as FOOTNOTE with line-items and source citation
 */

import React from 'react'
import { useSaaSGuard } from '../hooks/useSaaSGuard'

export default function IncidentModal({ onClose }) {
  const {
    anomalies,
    integrity,
    aiActions,
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
        className="absolute inset-0 bg-[#1a1a1a]/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1e1e1e] rounded-lg max-w-2xl w-full mx-4 overflow-hidden shadow-2xl document-animate">
        {/* Document Preview - THE HERO */}
        <div className="p-8">
          <div className="bg-[#faf9f7] rounded-lg p-8 text-[#1a1a1a] shadow-inner">
            {/* Document header */}
            <div className="text-center border-b-2 border-[#1a1a1a] pb-4 mb-6">
              <h2 className="text-lg font-bold tracking-wide mb-1">
                AFFIDAVIT OF SYSTEM INTEGRITY
              </h2>
              <div className="w-32 h-0.5 bg-[#1a1a1a] mx-auto mt-2" />
            </div>

            {/* Document body */}
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[#718096]">DATE:</span>
                <span className="font-medium">{currentDate}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#718096]">INCIDENT:</span>
                <span className="font-medium">APT29 Token Reuse Attack</span>
              </div>

              <div className="my-6 py-4 border-y border-[#e2e8f0]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[#718096]">CHAIN OF CUSTODY:</span>
                  <span className="font-bold text-[#2f855a]">UNBROKEN</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[#718096]">DATA LOSS:</span>
                  <span className="font-bold">0 RECORDS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#718096]">ATTACKER IDENTIFIED:</span>
                  <span className="font-medium">APT29 (Midnight Blizzard)</span>
                </div>
              </div>

              {/* Actions taken */}
              <div>
                <p className="text-[#718096] mb-2 text-xs font-medium">ACTIONS TAKEN:</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[#2f855a]">OK</span>
                    <span>Unauthorized token blocked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#2f855a]">OK</span>
                    <span>Backup write attempt rejected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#2f855a]">OK</span>
                    <span>Account suspended</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#2f855a]">OK</span>
                    <span>Token rotation initiated</span>
                  </div>
                </div>
              </div>

              {/* Cryptographic root */}
              <div className="mt-6 pt-4 border-t border-[#e2e8f0]">
                <p className="text-[#718096] text-xs mb-1">CRYPTOGRAPHIC ROOT:</p>
                <p className="font-hash text-xs text-[#1a1a1a]">{chainRoot}</p>
              </div>

              {/* Status badge */}
              <div className="mt-6 text-center">
                <div className="inline-block px-4 py-2 bg-[#2f855a]/10 rounded">
                  <span className="text-[#2f855a] font-bold text-sm">
                    STATUS: ADMISSIBLE IN COURT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liability Avoided - FOOTNOTE (not hero) with line-item breakdown */}
        <div className="px-8 py-6 bg-[#1a1a1a]">
          <p className="text-[#718096] text-xs mb-3 font-medium">ESTIMATED LIABILITY AVOIDED</p>

          {/* Line-item breakdown */}
          <div className="space-y-1.5 text-sm mb-4">
            <div className="flex justify-between text-[#e2e8f0]">
              <span>GDPR Article 32 Fine (Data breach):</span>
              <span className="font-medium">$2,000,000</span>
            </div>
            <div className="flex justify-between text-[#e2e8f0]">
              <span>Ransomware Recovery Cost (Backups):</span>
              <span className="font-medium">$1,800,000</span>
            </div>
            <div className="flex justify-between text-[#e2e8f0]">
              <span>Incident Response & Forensics:</span>
              <span className="font-medium">$300,000</span>
            </div>
            <div className="flex justify-between text-[#e2e8f0]">
              <span>Reputational Damage (est.):</span>
              <span className="font-medium">$100,000</span>
            </div>
            <div className="flex justify-between text-[#e2e8f0] pt-2 border-t border-[#333]">
              <span className="font-semibold">TOTAL AVOIDED:</span>
              <span className="font-semibold text-[#2f855a]">$4,200,000</span>
            </div>
          </div>

          {/* Source citation */}
          <p className="text-[10px] text-[#718096]">
            Source: IBM Cost of Data Breach Report 2024
          </p>
        </div>

        {/* Download button */}
        <div className="px-8 py-6 flex items-center justify-between">
          <div className="text-[10px] text-[#718096]">
            <p>POWERED BY: <span className="text-[#e2e8f0] font-medium">UNBREAKABLE CHAIN CORE</span></p>
            <p className="mt-0.5">BLOCKS: {blockCount} | RECEIPTS: {receipts.length}</p>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-3 bg-[#e2e8f0] text-[#1a1a1a] font-semibold rounded-lg hover:bg-white transition-colors"
          >
            DOWNLOAD AFFIDAVIT
          </button>
        </div>

        {/* Restart hint */}
        <div className="px-8 py-2 text-center bg-[#1a1a1a]">
          <p className="text-[#718096] text-xs">Press R to restart demo</p>
        </div>
      </div>
    </div>
  )
}
