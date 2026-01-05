/**
 * ModifyPanel - Interface for investor to attempt modification
 * Now includes attacker role selection (External vs Insider)
 */

import React, { useState } from 'react'
import { formatEvent, getEventTypeColor } from '../lib/events'

export default function ModifyPanel({ event, onSubmit, attackerRole, onRoleChange }) {
  const [modifiedValue, setModifiedValue] = useState('')

  if (!event) {
    return (
      <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
        <p className="text-gray-400 text-center">Select an event to modify</p>
      </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(modifiedValue || '0')
  }

  // Get the primary modifiable field based on event type
  const getModifiableField = () => {
    switch (event.type) {
      case 'DATA_EXPORT':
        return { key: 'records', value: event.details.records, label: 'Records exported' }
      case 'DATA_ACCESS':
        return { key: 'records', value: event.details.records, label: 'Records accessed' }
      case 'TOKEN_REVOKE':
        return { key: 'reason', value: event.details.reason, label: 'Revoke reason' }
      case 'TOKEN_GRANT':
        return { key: 'permissions', value: event.details.permissions.join(', '), label: 'Permissions' }
      default:
        return { key: 'value', value: JSON.stringify(event.details), label: 'Value' }
    }
  }

  const field = getModifiableField()

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-bold mb-5 text-white">Simulate Attack</h3>

      {/* Attacker Role Selector */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-3 uppercase tracking-wider">
          Select Attacker Profile
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onRoleChange('external')}
            className={`p-4 rounded-lg border transition-all duration-200 text-left ${
              attackerRole === 'external'
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${attackerRole === 'external' ? 'bg-amber-500' : 'bg-gray-600'}`} />
              <span className={`font-bold ${attackerRole === 'external' ? 'text-amber-400' : 'text-gray-400'}`}>
                External Attacker
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Standard perimeter defense scenario
            </p>
          </button>

          <button
            type="button"
            onClick={() => onRoleChange('insider')}
            className={`p-4 rounded-lg border transition-all duration-200 text-left ${
              attackerRole === 'insider'
                ? 'border-red-500 bg-red-500/10'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${attackerRole === 'insider' ? 'bg-red-500' : 'bg-gray-600'}`} />
              <span className={`font-bold ${attackerRole === 'insider' ? 'text-red-400' : 'text-gray-400'}`}>
                Insider with Admin Access
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Direct database access - the key differentiator
            </p>
          </button>
        </div>
        {attackerRole === 'insider' && (
          <div className="mt-3 p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-sm text-red-300">
              Even with full database access, cryptographic signatures cannot be forged.
            </p>
          </div>
        )}
      </div>

      {/* Original event display */}
      <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-red-900/50">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-3 h-3 rounded-full bg-red-500"
          />
          <span className="font-mono text-gray-400">{event.timestamp}</span>
          <span className="font-bold font-mono text-amber-500">
            {event.type}
          </span>
        </div>

        <div className="font-mono text-sm">
          {Object.entries(event.details).map(([key, value]) => (
            <div key={key} className="flex gap-2 mb-1">
              <span className="text-gray-400">{key}:</span>
              <span className="text-white">{Array.isArray(value) ? `[${value.join(', ')}]` : String(value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modification form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-base text-gray-400 mb-2">
            Change "{field.label}" from <span className="text-white font-mono">{field.value}</span> to:
          </label>
          <input
            type="text"
            value={modifiedValue}
            onChange={(e) => setModifiedValue(e.target.value)}
            placeholder={event.type === 'DATA_EXPORT' ? '0' : 'user_request'}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                       font-mono text-white focus:outline-none focus:border-red-500
                       placeholder-gray-400"
          />
        </div>

        <div className="text-sm text-gray-300">
          {event.type === 'DATA_EXPORT' && (
            <p>Try changing the export count to 0 to hide the data exfiltration.</p>
          )}
          {event.type === 'TOKEN_REVOKE' && (
            <p>Try changing the reason to "user_request" to hide the abuse detection.</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-white/10 border border-red-500 text-red-400 font-bold py-3 px-4
                     rounded-lg transition-colors duration-[600ms] text-lg hover:bg-red-500/20"
        >
          Attempt Modification {attackerRole === 'insider' ? '(as Admin)' : ''}
        </button>
      </form>
    </div>
  )
}
