/**
 * State machine for demo flow
 * Manages the entire investor demo experience
 */

import { create } from 'zustand'
import { generateBreachScenario, createTamperedEvent } from '../lib/events'
import { createTree, addEvent, simulateTamper, getTreeEntropy, getTreeCompression, getRoot } from '../lib/merkle'

// Demo states
export const STATES = {
  INTRO: 'INTRO',
  BUILD: 'BUILD',
  PROMPT: 'PROMPT',
  MODIFY: 'MODIFY',
  REJECT: 'REJECT',
  COMPARISON: 'COMPARISON',
  CLOSE: 'CLOSE'
}

// Create the store
const useDemoStore = create((set, get) => ({
  // Current state
  state: STATES.INTRO,

  // Events data
  events: [],
  allEvents: generateBreachScenario(),
  currentEventIndex: 0,

  // Merkle tree
  tree: null,

  // Computed metrics
  entropy: 0,
  compression: 0,

  // Tampering state
  tamperedIndex: null,
  tamperResult: null,
  selectedEvent: null,

  // Initialize the demo
  init: async () => {
    const tree = await createTree([])
    set({
      state: STATES.INTRO,
      events: [],
      currentEventIndex: 0,
      tree,
      entropy: 0,
      compression: 0,
      tamperedIndex: null,
      tamperResult: null,
      selectedEvent: null
    })
  },

  // Transition to next state
  nextState: () => {
    const { state } = get()

    switch (state) {
      case STATES.INTRO:
        set({ state: STATES.BUILD })
        get().startBuild()
        break
      case STATES.BUILD:
        // This happens automatically when all events are added
        break
      case STATES.PROMPT:
        set({ state: STATES.MODIFY })
        break
      case STATES.MODIFY:
        // Handled by attemptModify
        break
      case STATES.REJECT:
        set({ state: STATES.COMPARISON })
        break
      case STATES.COMPARISON:
        set({ state: STATES.CLOSE })
        break
      case STATES.CLOSE:
        // End state - can restart
        break
    }
  },

  // Start building the event stream
  startBuild: async () => {
    const { allEvents } = get()

    // Add events one by one with delay
    for (let i = 0; i < allEvents.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2400))

      const { tree } = get()
      const event = allEvents[i]
      const newTree = await addEvent(tree, event)

      const entropy = getTreeEntropy(newTree)
      const compression = getTreeCompression(newTree)

      set({
        tree: newTree,
        events: [...get().events, event],
        currentEventIndex: i + 1,
        entropy,
        compression
      })
    }

    // After all events added, transition to PROMPT
    await new Promise(resolve => setTimeout(resolve, 2000))
    set({ state: STATES.PROMPT })
  },

  // Select an event for modification
  selectEvent: (index) => {
    const { events } = get()
    if (index >= 0 && index < events.length) {
      set({
        selectedEvent: events[index],
        tamperedIndex: index
      })
    }
  },

  // Attempt to modify the selected event
  attemptModify: async (newValue) => {
    const { tree, tamperedIndex, selectedEvent } = get()

    if (tamperedIndex === null || !selectedEvent) return

    // Create tampered event
    const tamperedEvent = createTamperedEvent(selectedEvent, newValue)

    // Simulate the tampering
    const result = await simulateTamper(tree, tamperedIndex, tamperedEvent)

    set({
      tamperResult: result,
      state: STATES.REJECT
    })

    // Auto-advance after 6 seconds (hold for impact per spec)
    setTimeout(() => {
      const currentState = get().state
      if (currentState === STATES.REJECT) {
        set({ state: STATES.COMPARISON })
      }
    }, 6000)
  },

  // Restart the demo
  restart: () => {
    get().init()
  },

  // Get Merkle root for display
  getMerkleRoot: () => {
    const { tree } = get()
    return tree ? getRoot(tree) : null
  }
}))

// Hook to use the demo store
export function useDemo() {
  const store = useDemoStore()
  return store
}

// Export store for direct access if needed
export { useDemoStore }

export default useDemo
