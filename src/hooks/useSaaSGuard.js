/**
 * SaaSGuard Security Operations Center State Management
 * Orchestrates the Midnight Blizzard attack scenario demo
 *
 * ENTERPRISE WAR ROOM: Sequential Kill Chain
 * - TokenTracker lights up FIRST (alone)
 * - THE PAUSE (2 seconds of nothing)
 * - BackupProof lights up SECOND (alone)
 * - DecisionLog summarizes LAST
 */

import { create } from 'zustand'

// Demo phases
export const PHASES = {
  INTRO: 'INTRO',
  NORMAL_OPS: 'NORMAL_OPS',
  ATTACK_DETECTED: 'ATTACK_DETECTED',
  TOKEN_BLOCKED: 'TOKEN_BLOCKED',
  THE_PAUSE: 'THE_PAUSE',           // New: 2-second pause
  PIVOT_ATTEMPT: 'PIVOT_ATTEMPT',
  BACKUP_HELD: 'BACKUP_HELD',
  AI_TRIAGE: 'AI_TRIAGE',
  FREEZE: 'FREEZE',
  MODAL: 'MODAL',
  TRUST_GAP: 'TRUST_GAP'            // Competitive comparison screen
}

// Active panel for sequential highlighting
export const ACTIVE_PANEL = {
  NONE: 'NONE',
  ALL: 'ALL',
  TOKEN_TRACKER: 'TOKEN_TRACKER',
  BACKUP_PROOF: 'BACKUP_PROOF',
  DECISION_LOG: 'DECISION_LOG'
}

// Generate a random hash fragment
const randomHash = () => {
  const chars = '0123456789abcdef'
  return '0x' + Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * 16)]).join('')
}

// Generate full hash for Merkle root
const fullHash = () => {
  const chars = '0123456789abcdef'
  return '0x' + Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * 16)]).join('')
}

// Generate timestamp
const getTimestamp = (baseSeconds) => {
  const hours = 14
  const minutes = Math.floor(baseSeconds / 60) + 2
  const seconds = baseSeconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// Normal token authentications
const normalTokens = [
  { identity: 'admin@corp.io', origin: 'NYC', status: 'valid' },
  { identity: 'dev@corp.io', origin: 'LONDON', status: 'valid' },
  { identity: 'ops@corp.io', origin: 'BERLIN', status: 'valid' },
  { identity: 'security@corp.io', origin: 'NYC', status: 'valid' },
  { identity: 'analyst@corp.io', origin: 'SF', status: 'valid' },
]

// AI decisions for triage - more specific language
const aiDecisions = [
  {
    type: 'THREAT_CLASSIFY',
    output: 'NATION-STATE APT (CONFIDENCE: 0.94)',
    detail: 'APT29 TOKEN REUSE PATTERN',
    confidence: 0.94
  },
  {
    type: 'KILL_CHAIN_STAGE',
    output: 'PRIVILEGE ESCALATION DETECTED',
    detail: 'Lateral movement via compromised OAuth',
    confidence: 0.97
  },
  {
    type: 'AUTO_RESPONSE',
    output: 'TOKEN ROTATION + BACKUP LOCK',
    detail: 'Automatic containment executed',
    confidence: 0.91
  },
]

// Create the store
const useSaaSGuardStore = create((set, get) => ({
  // Current phase
  phase: PHASES.INTRO,

  // Active panel for sequential highlighting
  activePanel: ACTIVE_PANEL.NONE,

  // Timing
  elapsedSeconds: 0,

  // TokenTracker state
  activeSessions: 1247,
  anomalies: 0,
  tokenEvents: [],
  attackerDetected: false,
  attackerBlocked: false,

  // BackupProof state
  backupSets: 47,
  integrity: 100,
  backupChain: Array.from({ length: 7 }, (_, i) => ({ id: i, status: 'verified' })),
  verificationLog: [],
  accessAttempted: false,
  accessDenied: false,

  // DecisionLog state
  aiActions: 0,
  compliance: true,
  decisions: [],

  // Chain Core state - Enhanced for block structure
  receipts: [],
  blocks: [],           // New: Array of blocks with receipts
  currentBlock: null,   // New: Current block being built
  chainIntegrity: 100,
  chainRoot: '0x0000000000000000',
  gaps: 0,
  blockCount: 46,       // Starting block number

  // Initialize demo
  init: () => {
    set({
      phase: PHASES.INTRO,
      activePanel: ACTIVE_PANEL.NONE,
      elapsedSeconds: 0,
      activeSessions: 1247,
      anomalies: 0,
      tokenEvents: [],
      attackerDetected: false,
      attackerBlocked: false,
      backupSets: 47,
      integrity: 100,
      backupChain: Array.from({ length: 7 }, (_, i) => ({ id: i, status: 'verified' })),
      verificationLog: [],
      accessAttempted: false,
      accessDenied: false,
      aiActions: 0,
      compliance: true,
      decisions: [],
      receipts: [],
      blocks: [],
      currentBlock: null,
      chainIntegrity: 100,
      chainRoot: '0x0000000000000000',
      gaps: 0,
      blockCount: 46
    })
  },

  // Create a new block
  createBlock: () => {
    const state = get()
    const blockNum = state.blockCount + 1
    const prevHash = state.blocks.length > 0
      ? state.blocks[state.blocks.length - 1].merkleRoot
      : fullHash()

    const newBlock = {
      number: blockNum,
      merkleRoot: fullHash(),
      prevBlock: prevHash,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      receipts: []
    }

    set({ currentBlock: newBlock, blockCount: blockNum })
    return newBlock
  },

  // Finalize current block and add to chain
  finalizeBlock: () => {
    const state = get()
    if (state.currentBlock && state.currentBlock.receipts.length > 0) {
      set(state => ({
        blocks: [...state.blocks, state.currentBlock],
        chainRoot: state.currentBlock.merkleRoot,
        currentBlock: null
      }))
    }
  },

  // Add receipt to current block
  addReceiptToBlock: (receipt) => {
    set(state => {
      let block = state.currentBlock
      if (!block) {
        // Create new block if none exists
        const blockNum = state.blockCount + 1
        const prevHash = state.blocks.length > 0
          ? state.blocks[state.blocks.length - 1].merkleRoot
          : fullHash()

        block = {
          number: blockNum,
          merkleRoot: fullHash(),
          prevBlock: prevHash,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          receipts: []
        }
      }

      return {
        currentBlock: {
          ...block,
          receipts: [...block.receipts, receipt],
          merkleRoot: fullHash() // Update merkle root with new receipt
        },
        blockCount: block.number,
        receipts: [...state.receipts, receipt],
        chainRoot: block.merkleRoot
      }
    })
  },

  // Start the demo
  start: async () => {
    const { phase } = get()
    if (phase !== PHASES.INTRO) return

    set({ phase: PHASES.NORMAL_OPS, activePanel: ACTIVE_PANEL.ALL })

    // Create initial block
    get().createBlock()

    // Phase 1: Normal operations (0-5s) - All panels calm, green, routine
    await get().runNormalOps()

    // Phase 2: TokenTracker lights up ALONE (5-10s)
    await get().runAttackDetection()

    // THE PAUSE (10-12s) - 2 seconds of nothing, tension builds
    set({ phase: PHASES.THE_PAUSE, activePanel: ACTIVE_PANEL.NONE })
    await new Promise(r => setTimeout(r, 2000))

    // Phase 3: BackupProof lights up ALONE (12-16s)
    await get().runPivotAttempt()

    // Phase 4: DecisionLog summarizes (16-22s)
    await get().runAiTriage()

    // Finalize block and show modal
    get().finalizeBlock()

    // Phase 5: Document generation (22-30s)
    await new Promise(r => setTimeout(r, 2000))
    set({ phase: PHASES.FREEZE, activePanel: ACTIVE_PANEL.NONE })

    await new Promise(r => setTimeout(r, 1000))
    set({ phase: PHASES.MODAL })
  },

  // Normal operations - routine token auths and backup checks
  runNormalOps: async () => {
    const delays = [800, 1000, 1200, 1000, 1000]

    for (let i = 0; i < normalTokens.length; i++) {
      await new Promise(r => setTimeout(r, delays[i]))

      const token = normalTokens[i]
      const timestamp = getTimestamp(i)
      const hash = randomHash()

      // Add token event
      const tokenEvent = {
        time: timestamp,
        identity: token.identity,
        origin: token.origin,
        status: 'valid',
        hash
      }

      set(state => ({
        tokenEvents: [...state.tokenEvents, tokenEvent],
        elapsedSeconds: i + 1
      }))

      // Add receipt to block
      const receipt = {
        time: timestamp,
        source: 'TOKENTRACKER',
        hash,
        event: 'TOKEN_AUTH',
        result: 'VALID',
        detail: `Authenticated: ${token.identity} from ${token.origin}`
      }

      get().addReceiptToBlock(receipt)

      // Add occasional backup verification
      if (i === 2) {
        const backupHash = randomHash()
        const backupLog = {
          time: timestamp,
          action: 'INTEGRITY_CHECK',
          status: 'verified',
          hash: backupHash,
          detail: 'All 47 backup sets verified'
        }

        set(state => ({
          verificationLog: [...state.verificationLog, backupLog]
        }))

        get().addReceiptToBlock({
          time: timestamp,
          source: 'BACKUPPROOF',
          hash: backupHash,
          event: 'INTEGRITY_CHECK',
          result: 'VERIFIED',
          detail: 'Hash chain intact'
        })
      }
    }
  },

  // Attack detection - stolen token from Moscow
  // TokenTracker lights up ALONE
  runAttackDetection: async () => {
    set({ phase: PHASES.ATTACK_DETECTED, activePanel: ACTIVE_PANEL.TOKEN_TRACKER })

    // Stolen token appears with specific language
    await new Promise(r => setTimeout(r, 1000))

    const timestamp = getTimestamp(5)
    const hash = randomHash()

    // Add suspicious token event - SPECIFIC: "ANOMALY: LOGIN FROM UNAUTHORIZED GEO"
    const suspiciousEvent = {
      time: timestamp,
      identity: 'svc_okta_sync',
      origin: '???',
      status: 'suspicious',
      hash,
      alert: 'ANOMALY: OAUTH TOKEN REUSE DETECTED'
    }

    set(state => ({
      tokenEvents: [...state.tokenEvents, suspiciousEvent],
      anomalies: 1,
      activeSessions: 1248,
      attackerDetected: true
    }))

    // Update to show Moscow origin with SPECIFIC language
    await new Promise(r => setTimeout(r, 800))

    set(state => {
      const events = [...state.tokenEvents]
      const lastIdx = events.length - 1
      events[lastIdx] = {
        ...events[lastIdx],
        origin: 'ST. PETERSBURG',
        status: 'blocked',
        alert: 'BLOCKED: LOGIN FROM UNAUTHORIZED GEO (ST. PETERSBURG)'
      }
      return {
        tokenEvents: events,
        attackerBlocked: true,
        phase: PHASES.TOKEN_BLOCKED
      }
    })

    // Add blocking receipt to block - SPECIFIC language
    const blockHash = randomHash()
    get().addReceiptToBlock({
      time: timestamp,
      source: 'TOKENTRACKER',
      hash: blockHash,
      event: 'TOKEN_BLOCKED',
      result: 'BLOCKED',
      detail: 'APT29 pattern: svc_okta_sync from ST. PETERSBURG'
    })

    await new Promise(r => setTimeout(r, 1500))
  },

  // Pivot attempt - attacker tries to access backups
  // BackupProof lights up ALONE
  runPivotAttempt: async () => {
    set({ phase: PHASES.PIVOT_ATTEMPT, activePanel: ACTIVE_PANEL.BACKUP_PROOF })

    await new Promise(r => setTimeout(r, 1000))

    const timestamp = getTimestamp(12)
    const hash = randomHash()

    // Mark backup access attempt
    set(state => {
      const chain = [...state.backupChain]
      chain[4] = { ...chain[4], status: 'attempted' }
      return {
        backupChain: chain,
        accessAttempted: true
      }
    })

    // Add access attempt to verification log - SPECIFIC language
    const attemptLog = {
      time: timestamp,
      action: 'UNAUTHORIZED WRITE ATTEMPT',
      status: 'denied',
      source: 'COMPROMISED_TOKEN',
      hash,
      target: 'Backup_DB_04',
      detail: 'WRITE REJECTED: HASH MISMATCH on Backup_DB_04'
    }

    set(state => ({
      verificationLog: [...state.verificationLog, attemptLog]
    }))

    // Block and restore chain
    await new Promise(r => setTimeout(r, 1200))

    set(state => {
      const chain = [...state.backupChain]
      chain[4] = { ...chain[4], status: 'verified' }
      return {
        backupChain: chain,
        accessDenied: true,
        phase: PHASES.BACKUP_HELD
      }
    })

    // Add receipt to block - SPECIFIC language
    get().addReceiptToBlock({
      time: timestamp,
      source: 'BACKUPPROOF',
      hash,
      event: 'WRITE_REJECTED',
      result: 'BLOCKED',
      detail: 'Hash mismatch: Backup_DB_04 integrity verified'
    })

    // Add account suspension
    await new Promise(r => setTimeout(r, 800))
    const suspendHash = randomHash()
    get().addReceiptToBlock({
      time: getTimestamp(14),
      source: 'BACKUPPROOF',
      hash: suspendHash,
      event: 'ACCOUNT_SUSPENDED',
      result: 'LOGGED',
      detail: 'Compromised token source suspended'
    })

    await new Promise(r => setTimeout(r, 700))
  },

  // AI-assisted triage
  // DecisionLog lights up ALONE
  runAiTriage: async () => {
    set({ phase: PHASES.AI_TRIAGE, activePanel: ACTIVE_PANEL.DECISION_LOG })

    for (let i = 0; i < aiDecisions.length; i++) {
      await new Promise(r => setTimeout(r, 1500))

      const decision = aiDecisions[i]
      const timestamp = getTimestamp(20 + i)
      const hash = randomHash()

      const decisionEntry = {
        time: timestamp,
        hash,
        type: decision.type,
        output: decision.output,
        detail: decision.detail,
        confidence: decision.confidence,
        status: 'logged'
      }

      set(state => ({
        decisions: [...state.decisions, decisionEntry],
        aiActions: state.aiActions + 1
      }))

      // Add receipt to block
      get().addReceiptToBlock({
        time: timestamp,
        source: 'DECISIONLOG',
        hash,
        event: decision.type,
        result: 'RECORDED',
        detail: decision.output
      })
    }
  },

  // Restart demo
  restart: () => {
    get().init()
  },

  // Close modal and show Trust Gap comparison
  closeModal: () => {
    set({ phase: PHASES.TRUST_GAP })
  },

  // Close Trust Gap and restart
  closeTrustGap: () => {
    get().init()
  }
}))

// Hook to use the store
export function useSaaSGuard() {
  return useSaaSGuardStore()
}

export { useSaaSGuardStore }
export default useSaaSGuard
