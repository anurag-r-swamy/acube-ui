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
          dark: '#183D35',
          darker: '#112C26',
          light: '#215248',
          accent: '#E9A23B',
          'accent-hover': '#D48E28',
          'accent-light': '#FDF6EC',
          bg: '#F7F8F5',
          card: '#FFFFFF',
          charcoal: '#202724',
          muted: '#667085',
          border: '#E4E7EC',
          subtle: '#EEF0EC',
        },
        semantic: {
          success: '#15803D',
          'success-bg': '#F0FDF4',
          warning: '#D97706',
          'warning-bg': '#FFFBEB',
          error: '#DC2626',
          'error-bg': '#FEF2F2',
          info: '#2563EB',
          'info-bg': '#EFF6FF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(24, 61, 53, 0.06)',
        'medium': '0 8px 24px rgba(24, 61, 53, 0.08)',
        'lifted': '0 16px 36px rgba(24, 61, 53, 0.12)',
        'sheet': '0 -4px 20px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}

