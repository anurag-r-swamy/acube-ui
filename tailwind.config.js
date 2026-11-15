/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0A192F', // Deep Midnight Blue
          darker: '#050C1A',
          light: '#172554', // Rich Navy Slate
          accent: '#06B6D4', // Vibrant Cyan / Electric Teal
          'accent-hover': '#0891B2', // Deep Cyan
          'accent-light': '#ECFEFF', // Ultra-clean Cyan wash
          cyan: '#06B6D4',
          'cyan-dark': '#0891B2',
          'cyan-light': '#ECFEFF',
          'cyan-glow': 'rgba(6, 182, 212, 0.25)',
          bg: '#F8FAFC', // Ultra-clean Crisp Off-White Slate
          card: '#FFFFFF',
          charcoal: '#0F172A', // Slate 900
          muted: '#64748B', // Slate 500
          border: '#E2E8F0', // Slate 200
          subtle: '#F1F5F9', // Slate 100
        },
        semantic: {
          success: '#059669',
          'success-bg': '#ECFDF5',
          warning: '#D97706',
          'warning-bg': '#FFFBEB',
          error: '#E11D48',
          'error-bg': '#FFF1F2',
          info: '#0284C7',
          'info-bg': '#F0F9FF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(10, 25, 47, 0.04)',
        'medium': '0 8px 24px rgba(10, 25, 47, 0.07)',
        'lifted': '0 16px 36px rgba(10, 25, 47, 0.10)',
        'glow': '0 0 20px rgba(6, 182, 212, 0.20)',
        'sheet': '0 -4px 20px rgba(10, 25, 47, 0.08)',
      }
    },
  },
  plugins: [],
}

