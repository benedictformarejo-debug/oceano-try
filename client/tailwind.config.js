/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#f0fdff',
          100: '#ccf7fe',
          200: '#99effd',
          300: '#5ee2f9',
          400: '#2ccaee',
          500: '#12acd4',
          600: '#1289b2',
          700: '#166d90',
          800: '#1a5875',
          900: '#1a4963',
        },
        sand: {
          50: '#fdfbf7',
          100: '#f8f4ec',
          200: '#f0e7d6',
          300: '#e5d5b8',
          400: '#d7bd93',
          500: '#caa675',
          600: '#b88f5f',
          700: '#9a7650',
          800: '#7f6246',
          900: '#69513b',
        },
        coral: {
          50: '#fff5f3',
          100: '#ffe8e3',
          200: '#ffd5cc',
          300: '#ffb8a8',
          400: '#ff8e75',
          500: '#f8684a',
          600: '#e54a2a',
          700: '#c13d20',
          800: '#a0361e',
          900: '#843421',
        }
      },
      fontFamily: {
        'display': ['Inter', 'serif'],
        'body': ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
