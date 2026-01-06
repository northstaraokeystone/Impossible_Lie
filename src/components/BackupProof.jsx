/**
 * BackupProof - Stealth Mode
 * "Healthy = Invisible. Problems = RED."
 *
 * CHANGES:
 * - NO gold color - all stealth grey
 * - NO "Backup Integrity" subtitle
 * - NO colored badges - red dot only for alerts
 * - Backup chain: grey normally, RED for attempted only
 * - Static display, instant updates
 */

import React from 'react'
import { useSaaSGuard, PHASES } from '../hooks/useSaaSGuard'

// Visual chain of backup blocks - stealth grey, RED for attempted
function BackupChain({ backupChain }) {
  return (
    <div className="flex items-center justify-center py-2 px-2">
      {backupChain.map((block, i) => (
        <React.Fragment key={block.id}>
          {/* Block - grey normally, RED if attempted */}
          <div
            className={`w-5 h-5 rounded flex items-center justify-center ${
              block.status === 'attempted'
                ? 'bg-[#ef4444]'
                : 'bg-[#27272a]'
            }`}
          >
            <span className={`text-[8px] ${
              block.status === 'attempted' ? 'text-[#09090b]' : 'text-[#475569]'
            }`}>
              {(i + 1).toString().padStart(2, '0')}
            </span>
          </div>
          {/* Connector */}
          {i < backupChain.length - 1 && (
            <div className={`w-2 h-px ${
              block.status === 'attempted' ? 'bg-[#ef4444]' : 'bg-[#27272a]'
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

  const isAlert = [PHASES.PIVOT_ATTEMPT, PHASES.BACKUP_HELD].includes(phase) ||
    (accessDenied && phase !== PHASES.INTRO && phase !== PHASES.NORMAL_OPS)

  const showAlertInfo = accessDenied

  return (
    <div className="h-full flex flex-col bg-[#111111] overflow-hidden">
      {/* Header - minimal, red dot for alert only */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#475569] tracking-wide">BACKUP</span>
          {isAlert && <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />}
        </div>
      </div>

      {/* Stats - stealth grey, integrity issue = RED */}
      <div className="px-5 py-4 bg-[#09090b] grid grid-cols-2 gap-6">
        <div>
          <span className="text-[10px] text-[#475569] block mb-1">SETS</span>
          <span className="text-sm text-[#94a3b8]">{backupSets}</span>
        </div>
        <div>
          <span className="text-[10px] text-[#475569] block mb-1">INTEGRITY</span>
          <span className={`text-sm ${integrity < 100 ? 'text-[#ef4444]' : 'text-[#475569]'}`}>
            {integrity}%
          </span>
        </div>
      </div>

      {/* Backup Chain Visualization - minimal */}
      <div className="px-5 py-3 bg-[#09090b]">
        <BackupChain backupChain={backupChain} />
      </div>

      {/* Verification Log - static, minimal */}
      <div className="flex-1 flex flex-col min-h-0 px-5 py-4">
        <div className="flex-1 overflow-y-auto space-y-2 text-[10px]">
          {verificationLog.length === 0 ? (
            <span className="text-[#475569]">Idle</span>
          ) : (
            verificationLog.map((log, i) => {
              const isDenied = log.status === 'denied'

              return (
                <div
                  key={i}
                  className={`py-1.5 px-2 ${isDenied ? 'bg-[#ef4444]/5' : 'bg-transparent'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[#475569] font-hash">{log.time}</span>
                    <span className={isDenied ? 'text-[#ef4444]' : 'text-[#475569]'}>
                      {isDenied ? 'DENIED' : '—'}
                    </span>
                  </div>
                  <div className={`mt-1 ${isDenied ? 'text-[#ef4444]' : 'text-[#475569]'}`}>
                    {log.action}
                    {log.target && <span className="ml-2 text-[#475569]">{log.target}</span>}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Alert info - RED only, no badge styling */}
        {showAlertInfo && (
          <div className="mt-3 py-2 text-[10px] text-[#ef4444]">
            <div>WRITE REJECTED: HASH MISMATCH</div>
            <div className="text-[#ef4444]/60">Backup_DB_04 • Account suspended</div>
          </div>
        )}
      </div>
    </div>
  )
}
