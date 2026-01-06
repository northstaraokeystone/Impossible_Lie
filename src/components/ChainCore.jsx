/**
 * ChainCore - LEDGER
 * Stealth Bomber aesthetic - "Healthy = Invisible. Problems = RED."
 *
 * CHANGES:
 * - Header: Just "LEDGER" (one word)
 * - NO "THE ENGINE", NO "Unbreakable Chain Core", NO "BUILDING" badge
 * - Full hash display (32+ chars)
 * - Static display, instant updates (no animations)
 * - All grey except alerts (red)
 */

import React from 'react'
import { useSaaSGuard } from '../hooks/useSaaSGuard'

// Receipt formatting - off-white text, alert = red only
function formatReceipt(receipt) {
  const isAlert = ['BLOCKED', 'REJECTED', 'DENIED'].includes(receipt.result)
  return {
    isAlert,
    textClass: isAlert ? 'text-[#ef4444] font-medium' : 'text-[#E2E8F0]'
  }
}

// Block component - clean, static, full hashes
function Block({ block, isCurrentBlock }) {
  if (!block) return null

  // Group receipts by source
  const receiptsBySource = {}
  block.receipts.forEach(r => {
    if (!receiptsBySource[r.source]) {
      receiptsBySource[r.source] = []
    }
    receiptsBySource[r.source].push(r)
  })

  return (
    <div className="bg-[#09090b] p-6">
      {/* Block header - number + timestamp on same line */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-[#E2E8F0] font-medium text-sm">BLOCK {block.number}</span>
        <span className="text-[10px] text-[#94a3b8]">{block.timestamp}</span>
      </div>

      {/* Hash values - FULL display, left-aligned, generous spacing */}
      <div className="space-y-4 mb-6">
        <div className="flex gap-4">
          <span className="text-[10px] text-[#94a3b8] w-24 shrink-0">MERKLE ROOT</span>
          <span className="text-[#E2E8F0] font-hash text-[10px]">{block.merkleRoot}</span>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] text-[#94a3b8] w-24 shrink-0">PREV BLOCK</span>
          <span className="text-[#94a3b8] font-hash text-[10px]">{block.prevBlock}</span>
        </div>
      </div>

      {/* Divider - subtle */}
      <div className="h-px bg-[#1f1f23] my-6" />

      {/* Receipts in block - clear table format */}
      {Object.keys(receiptsBySource).length > 0 && (
        <div>
          <div className="text-[10px] text-[#94a3b8] mb-4">RECEIPTS IN BLOCK</div>
          <div className="space-y-2">
            {Object.entries(receiptsBySource).map(([source, receipts]) => {
              return receipts.map((r, i) => {
                const { isAlert, textClass } = formatReceipt(r)
                return (
                  <div key={`${source}-${i}`} className="flex items-center gap-4 text-[10px]">
                    <span className="text-[#94a3b8] w-24 shrink-0">{source}</span>
                    <span className={textClass}>{r.result}</span>
                    <span className="text-[#94a3b8]">{r.event}</span>
                  </div>
                )
              })
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ChainCore() {
  const {
    receipts,
    blocks,
    currentBlock,
    chainIntegrity,
    chainRoot,
    gaps,
    blockCount
  } = useSaaSGuard()

  // Show either the current building block or the last finalized block
  const displayBlock = currentBlock || (blocks.length > 0 ? blocks[blocks.length - 1] : null)

  // Check if there are any problems
  const hasGaps = gaps > 0
  const integrityIssue = chainIntegrity < 100

  return (
    <div className="h-full flex flex-col bg-[#111111] overflow-hidden">
      {/* Header - Just "LEDGER", brighter for visibility */}
      <div className="px-6 py-4 flex items-center justify-between">
        <span className="text-xs text-[#F8FAFC] font-medium tracking-widest">LEDGER</span>

        {/* Chain root - full display */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#94a3b8]">ROOT</span>
          <span className="text-[#E2E8F0] font-hash text-[10px]">{chainRoot}</span>
        </div>
      </div>

      {/* Block display area */}
      <div className="flex-1 overflow-hidden">
        {!displayBlock && receipts.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <span className="text-[10px] text-[#64748b]">Awaiting receipts...</span>
          </div>
        ) : (
          <Block block={displayBlock} isCurrentBlock={currentBlock !== null} />
        )}
      </div>

      {/* Footer stats row - brighter text, problems = RED */}
      <div className="px-6 py-4 bg-[#09090b] flex items-center justify-between">
        <div className="flex items-center gap-12">
          <div className="text-center">
            <span className="text-[10px] text-[#94a3b8] block">BLOCKS</span>
            <span className="text-sm text-[#E2E8F0]">{blockCount}</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-[#94a3b8] block">RECEIPTS</span>
            <span className="text-sm text-[#E2E8F0]">{receipts.length}</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-[#94a3b8] block">INTEGRITY</span>
            <span className={`text-sm ${integrityIssue ? 'text-[#ef4444]' : 'text-[#64748b]'}`}>
              {chainIntegrity}%
            </span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-[#94a3b8] block">GAPS</span>
            <span className={`text-sm ${hasGaps ? 'text-[#ef4444]' : 'text-[#64748b]'}`}>
              {gaps}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
