/**
 * ComplianceFooter - WORM-compliance footer for investor assurance
 * Shows enterprise compliance keywords
 */

import React from 'react'

export default function ComplianceFooter() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 border-t border-gray-800 py-3 px-6 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-gray-400">
            System is <span className="text-green-400 font-semibold">WORM-compliant</span> and generates auditor-ready receipts instantly.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-gray-500 text-xs">
          <span className="px-2 py-1 bg-gray-800 rounded">Tamper-Evident</span>
          <span className="px-2 py-1 bg-gray-800 rounded">Cryptographically Verifiable</span>
          <span className="px-2 py-1 bg-gray-800 rounded">Audit-Ready</span>
        </div>
      </div>
    </div>
  )
}
