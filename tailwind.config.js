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
          dark: '#0F172A', // Slate 900 - Deep, professional Apple/Urban Company tone
          darker: '#020617', // Slate 950
          light: '#1E293B', // Slate 800
          accent: '#2563EB', // Trust Blue - Industry-standard, ultra-clean
          'accent-hover': '#1D4ED8', // Blue 700
          'accent-light': '#EFF6FF', // Blue 50 wash
          bg: '#F8FAFC', // Ultra-clean Off-White Slate 50
          card: '#FFFFFF', // Pure White
          charcoal: '#0F172A', // Crisp primary text
          muted: '#64748B', // Slate 500 secondary text
          border: '#E2E8F0', // Hairline clean border
          subtle: '#F1F5F9', // Slate 100 soft fill
        },
        semantic: {
          success: '#10B981',
          'success-bg': '#ECFDF5',
          warning: '#F59E0B',
          'warning-bg': '#FFFBEB',
          error: '#EF4444',
          'error-bg': '#FEF2F2',
          info: '#2563EB',
          'info-bg': '#EFF6FF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'soft': '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'medium': '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
        'lifted': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
        'sheet': '0 -4px 16px rgba(15, 23, 42, 0.08)',
      }
    },
  },
  plugins: [],
}

