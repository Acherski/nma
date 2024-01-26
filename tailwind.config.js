/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#5f6c9a',
          100: '#49578b',
          200: '#32427d',
          300: '#1b2d6e',
          400: '#182963',
          500: '#162458',
          600: '#131f4d',
          700: '#101b42',
          800: '#0e1737',
          900: '#0b122c',
        },
        secondary: {
          50: '#979ca0',
          100: '#939da6',
          200: '#718fab',
          300: '#3976af',
          400: '#1762a8',
          500: '#0056a7',
          600: '#004f98',
          700: '#004280',
          800: '#003b71',
          900: '#00284e',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}