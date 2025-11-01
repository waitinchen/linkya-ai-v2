/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft-pink': {
          50: '#fff9fb',
          100: '#ffeef3',
          200: '#ffe6ee',
          300: '#ffd1dc',
          400: '#ffcedb',
          500: '#ff88a3',
          600: '#ff6b95',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

