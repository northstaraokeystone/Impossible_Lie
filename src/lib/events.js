/**
 * Demo event generation
 * Salesloft/Drift breach scenario for investor demo
 */

/**
 * Generate the breach scenario events
 * Deterministic - same events every time
 * @returns {Array} Array of 6 breach events
 */
export function generateBreachScenario() {
  return [
    {
      id: 1,
      timestamp: '14:00:00',
      type: 'TOKEN_GRANT',
      details: {
        app: 'Drift-Integration',
        user: 'admin@acme.com',
        permissions: ['read', 'write']
      }
    },
    {
      id: 2,
      timestamp: '14:05:23',
      type: 'DATA_ACCESS',
      details: {
        resource: 'contacts',
        records: 2847
      }
    },
    {
      id: 3,
      timestamp: '14:05:24',
      type: 'DATA_ACCESS',
      details: {
        resource: 'accounts',
        records: 1203
      }
    },
    {
      id: 4,
      timestamp: '14:05:25',
      type: 'DATA_ACCESS',
      details: {
        resource: 'deals',
        records: 892
      }
    },
    {
      id: 5,
      timestamp: '14:06:00',
      type: 'DATA_EXPORT',
      details: {
        resource: 'all',
        records: 4942,
        anomaly: true
      }
    },
    {
      id: 6,
      timestamp: '14:06:01',
      type: 'TOKEN_REVOKE',
      details: {
        reason: 'abuse_detected',
        by: 'system'
      }
    }
  ]
}

/**
 * Convert an event to bytes for entropy/compression calculation
 * @param {object} event - Event object
 * @returns {Uint8Array}
 */
export function eventToBytes(event) {
  const json = JSON.stringify(event)
  return new TextEncoder().encode(json)
}

/**
 * Format event for display
 * @param {object} event - Event object
 * @returns {string}
 */
export function formatEvent(event) {
  const detailsStr = Object.entries(event.details)
    .map(([k, v]) => {
      if (Array.isArray(v)) return `${k}: [${v.join(', ')}]`
      return `${k}: ${v}`
    })
    .join(', ')

  return `${event.timestamp} | ${event.type} | ${detailsStr}`
}

/**
 * Get event type color
 * @param {string} type - Event type
 * @returns {string} Hex color
 */
export function getEventTypeColor(type) {
  const colors = {
    TOKEN_GRANT: '#6b7280',    // muted gray (neutral)
    DATA_ACCESS: '#6b7280',     // gray
    DATA_EXPORT: '#cc9900',     // muted amber (warning)
    TOKEN_REVOKE: '#cc0000'     // muted crimson (error)
  }
  return colors[type] || '#cccccc'
}

/**
 * Create a tampered version of an event for demo
 * @param {object} event - Original event
 * @param {string} tamperedValue - New value to inject
 * @returns {object} Tampered event
 */
export function createTamperedEvent(event, tamperedValue) {
  // Create a copy and modify based on event type
  const tampered = JSON.parse(JSON.stringify(event))

  if (event.type === 'DATA_EXPORT') {
    // Change records count to hide the export
    tampered.details.records = parseInt(tamperedValue) || 0
    tampered.details.anomaly = false
  } else if (event.type === 'TOKEN_GRANT') {
    // Change permissions
    tampered.details.permissions = ['read']
  } else if (event.type === 'DATA_ACCESS') {
    // Change record count
    tampered.details.records = parseInt(tamperedValue) || 0
  } else if (event.type === 'TOKEN_REVOKE') {
    // Change reason
    tampered.details.reason = tamperedValue || 'user_request'
    tampered.details.by = 'user'
  }

  // Add random noise to increase entropy (simulating fraudulent edit)
  tampered._modified = Date.now()
  tampered._noise = Math.random().toString(36).substring(2, 15)

  return tampered
}
