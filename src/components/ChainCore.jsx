/**
 * ChainCore - IMMUTABLE LEDGER
 * Terminal-style compact log layout - "Single scan per line"
 *
 * LAYOUT FIX v3.4:
 * - KILLED: justify-content: space-between (ping-pong eye scan)
 * - ADDED: justify-content: flex-start; gap: 2rem
 * - FORMAT: [BLOCK X] | TIME | EVENT | SOURCE | HASH
 * - All data grouped LEFT, readable at a glance
 */

import React from 'react'
import { useSaaSGuard } from '../hooks/useSaaSGuard'

// Event type color mapping
function getEventTypeClass(result) {
  if (['BLOCKED', 'REJECTED', 'DENIED'].includes(result)) {
    return 'text-[#ef4444] font-medium' // Red-500 for alerts
  }
  if (['AUTO_RESPONSE', 'RESPONSE'].includes(result)) {
    return 'text-[#E2E8F0]' // Slate-200
  }
  return 'text-[#94a3b8]' // Slate-400 default
}

// Format timestamp for terminal style (HH:MM:SS UTC)
function formatTime(timestamp) {
  if (!timestamp) return '--:--:-- UTC'
  // Extract time portion if full timestamp
  const timeMatch = timestamp.match(/\d{2}:\d{2}:\d{2}/)
  return timeMatch ? `${timeMatch[0]} UTC` : timestamp
}

// Truncate hash for display
function truncateHash(hash) {
  if (!hash) return '0x...'
  if (hash.length > 10) return `${hash.slice(0, 8)}...`
  return hash
}

// Terminal-style log entry component
function LedgerEntry({ blockNum, timestamp, eventType, source, hash }) {
  const eventClass = getEventTypeClass(eventType)

  return (
    <div className="flex items-center justify-start gap-3 py-1 font-mono text-[11px]">
      <span className="text-[#94a3b8]">[BLOCK {blockNum}]</span>
      <span className="text-[#475569]">|</span>
      <span className="text-[#E2E8F0]">{formatTime(timestamp)}</span>
      <span className="text-[#475569]">|</span>
      <span className={eventClass}>{eventType}</span>
      <span className="text-[#475569]">|</span>
      <span className="text-[#94a3b8]">{source}</span>
      <span className="text-[#475569]">|</span>
      <span className="text-[#64748b] font-mono">{truncateHash(hash)}</span>
    </div>
  )
}

// Build ledger entries from blocks
function buildLedgerEntries(blocks, currentBlock) {
  const entries = []

  // Add entries from finalized blocks
  blocks.forEach(block => {
    block.receipts.forEach(receipt => {
      entries.push({
        blockNum: block.number,
        timestamp: block.timestamp,
        eventType: receipt.result || receipt.event,
        source: receipt.source,
        hash: block.merkleRoot
      })
    })
  })

  // Add entries from current building block
  if (currentBlock) {
    currentBlock.receipts.forEach(receipt => {
      entries.push({
        blockNum: currentBlock.number,
        timestamp: currentBlock.timestamp,
        eventType: receipt.result || receipt.event,
        source: receipt.source,
        hash: currentBlock.merkleRoot
      })
    })
  }

  // Return most recent first, limit to last 6 entries
  return entries.reverse().slice(0, 6)
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

  // Build terminal-style ledger entries
  const ledgerEntries = buildLedgerEntries(blocks, currentBlock)

  // Check if there are any problems
  const hasGaps = gaps > 0
  const integrityIssue = chainIntegrity < 100

  return (
    <div className="h-full flex flex-col bg-[#111111] overflow-hidden">
      {/* Header - IMMUTABLE LEDGER, left-aligned (no justify-between) */}
      <div className="px-6 py-4 flex items-center justify-start gap-8">
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#F8FAFC] font-medium tracking-widest">IMMUTABLE LEDGER</span>
          <span className="text-[9px] text-[#64748b]">Unlike text logs, immutable</span>
        </div>

        {/* Chain root - grouped with header, not pushed right */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#94a3b8]">ROOT:</span>
          <span className="text-[#64748b] font-mono text-[10px]">{truncateHash(chainRoot)}</span>
        </div>
      </div>

      {/* Terminal-style ledger entries */}
      <div className="flex-1 overflow-hidden px-6 py-4 bg-[#09090b]">
        {ledgerEntries.length === 0 ? (
          <div className="h-full flex items-center">
            <span className="text-[10px] text-[#64748b]">Awaiting receipts...</span>
          </div>
        ) : (
          <div className="space-y-0">
            {ledgerEntries.map((entry, i) => (
              <LedgerEntry
                key={i}
                blockNum={entry.blockNum}
                timestamp={entry.timestamp}
                eventType={entry.eventType}
                source={entry.source}
                hash={entry.hash}
              />
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1a1a1a] mx-6" />

      {/* Footer stats row - LEFT-ALIGNED with consistent gap (NOT space-between) */}
      <div className="px-6 py-4 bg-[#09090b] flex items-center justify-start gap-12">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#94a3b8]">BLOCKS:</span>
          <span className="text-sm text-[#E2E8F0]">{blockCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#94a3b8]">RECEIPTS:</span>
          <span className="text-sm text-[#E2E8F0]">{receipts.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#94a3b8]">INTEGRITY:</span>
          <span className={`text-sm ${integrityIssue ? 'text-[#ef4444]' : 'text-[#64748b]'}`}>
            {chainIntegrity}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#94a3b8]">GAPS:</span>
          <span className={`text-sm ${hasGaps ? 'text-[#ef4444]' : 'text-[#64748b]'}`}>
            {gaps}
          </span>
        </div>
      </div>
    </div>
  )
}
