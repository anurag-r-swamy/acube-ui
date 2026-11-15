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
          dark: '#11291D', // Deep Forest Pine
          darker: '#0A1C13', // Deepest Midnight Forest
          light: '#1B4332', // Rich Forest Green
          accent: '#1B4D3E', // Deep Forest Green Accent
          'accent-hover': '#133B2E', // Darker Forest
          'accent-vibrant': '#2D6A4F', // Vibrant Forest Green
          'accent-light': '#EBF5EE', // Soft Sage Tint
          bg: '#FBFBFA', // Warm Off-White Canvas (Apple/Aesop aesthetic)
          surface: '#F4F4F0', // Warm Secondary Container
          card: '#FFFFFF', // Pure Crisp White
          charcoal: '#1A1D1A', // Warm Forest Charcoal Text
          muted: '#666D64', // Warm Forest Grey Secondary Text
          border: '#E3E6DF', // Hairline Clean Border
          subtle: '#EEF0EA', // Soft Neutral Fill
        },
        forest: {
          50: '#F0F6F2',
          100: '#E0EDE5',
          200: '#C2DBCB',
          300: '#9BC3AC',
          400: '#6FA78A',
          500: '#4D8C6D',
          600: '#387355',
          700: '#2A5A42',
          800: '#1E4332',
          900: '#153225',
          950: '#0C1E16',
        },
        semantic: {
          success: '#2D6A4F',
          'success-bg': '#EBF5EE',
          warning: '#B46C13',
          'warning-bg': '#FDF7EB',
          error: '#BA3939',
          'error-bg': '#FDF2F2',
          info: '#1B4D3E',
          'info-bg': '#EBF5EE',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(20, 25, 22, 0.03)',
        'xs': '0 1px 2px 0 rgba(20, 25, 22, 0.05)',
        'soft': '0 1px 3px 0 rgba(20, 25, 22, 0.05), 0 1px 2px -1px rgba(20, 25, 22, 0.03)',
        'medium': '0 4px 6px -1px rgba(20, 25, 22, 0.07), 0 2px 4px -2px rgba(20, 25, 22, 0.03)',
        'lifted': '0 10px 15px -3px rgba(20, 25, 22, 0.07), 0 4px 6px -4px rgba(20, 25, 22, 0.03)',
        'sheet': '0 -4px 16px rgba(20, 25, 22, 0.06)',
      }
    },
  },
  plugins: [],
}

