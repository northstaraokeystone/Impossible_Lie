/**
 * BackupProof - Backup Integrity Module
 * Enterprise War Room styling - "Boring enough to trust, scary enough to buy"
 *
 * SPECIFIC LANGUAGE:
 * - "WRITE REJECTED: HASH MISMATCH" not "BACKUP PERIMETER HELD"
 * - Shows WHAT, WHY, WHERE for every alert
 */

import React from 'react'
import { useSaaSGuard, PHASES } from '../hooks/useSaaSGuard'

// Visual chain of backup blocks
function BackupChain({ backupChain, accessAttempted }) {
  return (
    <div className="flex items-center justify-center py-3 px-2">
      {backupChain.map((block, i) => (
        <React.Fragment key={block.id}>
          {/* Block */}
          <div
            className={`w-7 h-7 rounded flex items-center justify-center transition-all duration-300 ${
              block.status === 'attempted'
                ? 'bg-[#c53030] glow-red'
                : block.status === 'verified'
                ? 'bg-[#d69e2e]/80'
                : 'bg-[#4a5568]'
            }`}
          >
            <span className="text-[9px] font-medium text-[#1a1a1a]">
              {(i + 1).toString().padStart(2, '0')}
            </span>
          </div>
          {/* Connector */}
          {i < backupChain.length - 1 && (
            <div className={`w-3 h-0.5 ${
              block.status === 'attempted' ? 'bg-[#c53030]' : 'bg-[#d69e2e]/40'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default function BackupProof() {
  const {
    phase,
    backupSets,
    integrity,
    backupChain,
    verificationLog,
    accessAttempted,
    accessDenied
  } = useSaaSGuard()

  const isAttackPhase = [PHASES.PIVOT_ATTEMPT, PHASES.BACKUP_HELD].includes(phase) ||
    (accessDenied && phase !== PHASES.INTRO && phase !== PHASES.NORMAL_OPS)

  const showBadge = accessDenied

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] rounded-lg overflow-hidden">
      {/* Header - no border, use whitespace */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#d69e2e] tracking-wide">BACKUPPROOF</h3>
            <p className="text-xs text-[#718096] mt-0.5">Backup Integrity</p>
          </div>
          <div className={`px-2.5 py-1 rounded text-xs font-medium ${
            accessAttempted && !accessDenied
              ? 'bg-[#c53030]/15 text-[#c53030]'
              : 'bg-[#d69e2e]/10 text-[#d69e2e]'
          }`}>
            {accessAttempted && !accessDenied ? 'THREAT' : 'VERIFIED'}
          </div>
        </div>
      </div>

      {/* Stats - generous padding, no border */}
      <div className="px-5 py-4 bg-[#1a1a1a] grid grid-cols-2 gap-6">
        <div>
          <p className="text-[10px] text-[#718096] mb-1 font-medium">BACKUP SETS</p>
          <p className="text-lg font-medium text-[#e2e8f0]">{backupSets}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#718096] mb-1 font-medium">INTEGRITY</p>
          <p className="text-lg font-medium text-[#2f855a]">{integrity}%</p>
        </div>
      </div>

      {/* Backup Chain Visualization */}
      <div className="px-5 py-3 bg-[#1a1a1a]">
        <p className="text-[10px] text-[#718096] mb-1 font-medium">BACKUP CHAIN</p>
        <BackupChain backupChain={backupChain} accessAttempted={accessAttempted} />
        <div className="flex justify-between text-[9px] text-[#718096] mt-1">
          <span>Latest: 2024-01-18 02:00</span>
          <span className="font-hash">Root: 0x9a2f...</span>
        </div>
      </div>

      {/* Verification Log */}
      <div className="flex-1 flex flex-col min-h-0 px-5 py-4">
        <p className="text-[10px] text-[#718096] mb-3 font-medium">VERIFICATION LOG</p>

        <div className="flex-1 overflow-y-auto space-y-2 text-xs">
          {verificationLog.length === 0 ? (
            <div className="text-[#718096] italic">
              <p>Last check: 2 min ago</p>
              <p className="mt-1 text-[#2f855a]">All backups verified</p>
            </div>
          ) : (
            verificationLog.map((log, i) => (
              <div
                key={i}
                className={`py-2 px-2.5 rounded ${
                  log.status === 'denied' ? 'bg-[#c53030]/10' : 'bg-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#718096] font-hash">{log.time}</span>
                  <span className={`${
                    log.status === 'denied' ? 'text-[#c53030]' : 'text-[#2f855a]'
                  }`}>
                    {log.status === 'denied' ? 'DENIED' : 'OK'}
                  </span>
                </div>
                <div className={`text-[10px] mt-1 ${
                  log.status === 'denied' ? 'text-[#c53030]' : 'text-[#718096]'
                }`}>
                  {log.action}
                  {log.target && (
                    <span className="ml-2 text-[#718096]">
                      TARGET: {log.target}
                    </span>
                  )}
                </div>
                {log.detail && (
                  <div className="text-[10px] mt-0.5 text-[#718096]">
                    {log.detail}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Badge - SPECIFIC language: "WRITE REJECTED: HASH MISMATCH" */}
        {showBadge && (
          <div className="mt-3 py-2.5 px-3 bg-[#2f855a]/10 rounded text-center">
            <span className="text-[#2f855a] text-xs font-medium">
              WRITE REJECTED: HASH MISMATCH
            </span>
            <p className="text-[#2f855a]/70 text-[10px] mt-1">
              Backup_DB_04 integrity verified • Account suspended
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
