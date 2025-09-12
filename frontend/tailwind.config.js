/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kmrl: {
          primary: '#667eea',
          secondary: '#764ba2',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'pulse-border': 'pulseBorder 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseBorder: {
          '0%, 100%': { borderColor: '#3b82f6' },
          '50%': { borderColor: '#60a5fa' },
        }
      }
    },
  },
  plugins: [],
}

