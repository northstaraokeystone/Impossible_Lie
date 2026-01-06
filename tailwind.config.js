/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Enterprise color palette - "Boring enough to trust, scary enough to buy"
        background: '#1a1a1a',        // Charcoal (not pure black)
        'background-panel': '#1e1e1e', // Lighter charcoal for panels

        // Text colors
        'text-primary': '#e2e8f0',     // Soft white
        'text-secondary': '#718096',    // Warm grey

        // Enterprise accent colors (muted, not neon)
        'enterprise-blue': '#3182ce',   // Primary accent / TokenTracker
        'enterprise-gold': '#d69e2e',   // Warning / BackupProof
        'enterprise-green': '#2f855a',  // Success / DecisionLog
        'enterprise-red': '#c53030',    // Error/Blocked (brick red)

        // Legacy mappings (for gradual migration)
        legitimate: '#3182ce',
        stable: '#718096',
        warning: '#d69e2e',
        rejection: '#c53030',
        success: '#2f855a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Inter', 'system-ui', 'sans-serif'], // Use Inter for everything, monospace only for hashes
      },
    },
  },
  plugins: [],
}
