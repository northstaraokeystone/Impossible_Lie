/**
 * ChainCore - Unbreakable Chain Core Module
 * Enterprise War Room styling - "Boring enough to trust, scary enough to buy"
 *
 * KEY CHANGES:
 * - Shows BLOCK structure (not just scrolling hashes)
 * - Shows MERKLE ROOT labeled
 * - Shows PREV BLOCK with arrow linkage
 * - Shows RECEIPTS from each module listed by name
 * - Visual shows blocks LINKING to each other
 */

import React from 'react'
import { useSaaSGuard } from '../hooks/useSaaSGuard'

// Source color mapping - enterprise colors
const sourceColors = {
  TOKENTRACKER: { bg: 'bg-[#3182ce]/10', text: 'text-[#3182ce]' },
  BACKUPPROOF: { bg: 'bg-[#d69e2e]/10', text: 'text-[#d69e2e]' },
  DECISIONLOG: { bg: 'bg-[#2f855a]/10', text: 'text-[#2f855a]' }
}

// Result styling
const resultStyles = {
  VALID: { text: 'text-[#2f855a]' },
  VERIFIED: { text: 'text-[#2f855a]' },
  BLOCKED: { text: 'text-[#c53030]' },
  LOGGED: { text: 'text-[#d69e2e]' },
  RECORDED: { text: 'text-[#2f855a]' }
}

// Block component showing blockchain structure
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
    <div className={`bg-[#1a1a1a] rounded-lg p-4 ${isCurrentBlock ? 'ring-1 ring-[#3182ce]/30' : ''}`}>
      {/* Block header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[#e2e8f0] font-medium text-sm">BLOCK #{block.number}</span>
          {isCurrentBlock && (
            <span className="text-[10px] px-1.5 py-0.5 bg-[#3182ce]/20 text-[#3182ce] rounded">
              BUILDING
            </span>
          )}
        </div>
        <span className="text-[10px] text-[#718096]">{block.timestamp}</span>
      </div>

      {/* Block metadata */}
      <div className="space-y-1.5 mb-3 text-[10px]">
        <div className="flex justify-between">
          <span className="text-[#718096]">MERKLE ROOT:</span>
          <span className="text-[#e2e8f0] font-hash">{block.merkleRoot.slice(0, 18)}...</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#718096]">PREV BLOCK:</span>
          <span className="text-[#718096] font-hash">{block.prevBlock.slice(0, 18)}...</span>
        </div>
      </div>

      {/* Receipts in block */}
      <div className="text-[10px]">
        <div className="text-[#718096] mb-2 font-medium">RECEIPTS IN BLOCK:</div>
        <div className="space-y-1">
          {Object.entries(receiptsBySource).map(([source, receipts]) => {
            const colors = sourceColors[source] || sourceColors.TOKENTRACKER
            return (
              <div key={source} className={`flex items-start gap-2 py-1 px-2 rounded ${colors.bg}`}>
                <span className={`${colors.text} font-medium w-24 shrink-0`}>{source}:</span>
                <div className="flex-1">
                  {receipts.map((r, i) => {
                    const style = resultStyles[r.result] || resultStyles.VALID
                    return (
                      <div key={i} className="text-[#e2e8f0]">
                        <span className={style.text}>{r.result}</span>
                        <span className="text-[#718096] ml-1">({r.event})</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Chain linkage arrow
function ChainLink() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center gap-1 text-[#718096]">
        <div className="w-8 h-0.5 bg-[#718096]/30" />
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
        <span className="text-[9px]">LINKED</span>
      </div>
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
  const previousBlock = blocks.length > 0 ? blocks[blocks.length - 1] : null

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#e2e8f0] tracking-wide">IMMUTABLE LEDGER</h3>
            <p className="text-xs text-[#718096] mt-0.5">Unbreakable Chain Core</p>
          </div>
          <div className="px-2 py-1 bg-[#1a1a1a] rounded text-[10px] text-[#718096]">
            THE ENGINE
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-[10px] text-[#718096]">BLOCKS</p>
            <p className="text-sm font-medium text-[#e2e8f0]">{blockCount}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-[#718096]">RECEIPTS</p>
            <p className="text-sm font-medium text-[#e2e8f0]">{receipts.length}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-[#718096]">INTEGRITY</p>
            <p className="text-sm font-medium text-[#2f855a]">{chainIntegrity}%</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-[#718096]">GAPS</p>
            <p className="text-sm font-medium text-[#2f855a]">{gaps}</p>
          </div>
        </div>
      </div>

      {/* Block display area */}
      <div className="flex-1 overflow-hidden px-5 py-3">
        {!displayBlock && receipts.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-[#718096]">
              <p className="text-sm">Awaiting receipts from modules...</p>
              <p className="text-[10px] mt-1">Blocks will appear as events are anchored</p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            {/* Current/Building Block */}
            {displayBlock && (
              <Block
                block={displayBlock}
                isCurrentBlock={currentBlock !== null}
              />
            )}

            {/* Chain link to previous block */}
            {previousBlock && currentBlock && (
              <>
                <ChainLink />
                <div className="bg-[#1a1a1a] rounded-lg p-3 opacity-60">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#718096]">BLOCK #{previousBlock.number}</span>
                    <span className="text-[#718096] font-hash">{previousBlock.merkleRoot.slice(0, 18)}...</span>
                  </div>
                  <div className="text-[10px] text-[#718096] mt-1">
                    (Previous block - linked)
                  </div>
                </div>
              </>
            )}

            {/* Show finalized blocks if no current block */}
            {!currentBlock && blocks.length > 1 && (
              <>
                <ChainLink />
                <div className="bg-[#1a1a1a] rounded-lg p-3 opacity-60">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#718096]">BLOCK #{blocks[blocks.length - 2]?.number}</span>
                    <span className="text-[#718096] font-hash">
                      {blocks[blocks.length - 2]?.merkleRoot.slice(0, 18)}...
                    </span>
                  </div>
                  <div className="text-[10px] text-[#718096] mt-1">
                    (Previous block - linked)
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer with root hash */}
      <div className="px-5 py-2 bg-[#1a1a1a] text-[10px] flex items-center justify-between">
        <span className="text-[#718096]">CHAIN ROOT:</span>
        <span className="text-[#e2e8f0] font-hash">{chainRoot}</span>
      </div>
    </div>
  )
}
