/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5f0',
          100: '#f5ebe0',
          200: '#e6d1bb',
          300: '#d7b796',
          400: '#c89d71',
          500: '#b8834c',
          600: '#9a6d3d',
          700: '#7c572e',
          800: '#5e411f',
          900: '#402b10',
        },
        accent: {
          DEFAULT: '#d4a574',
          light: '#e6c9a8',
          dark: '#9a7552',
        },
        brown: {
          700: '#8B4513',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
