/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        roof: {
          50: '#FCF5F0',
          100: '#F7EBDD',
          200: '#EECBAA',
          300: '#E3AC8E',
          400: '#D68461',
          500: '#CD6542',
          600: '#BF5037',
          700: '#9F3E2F',
          800: '#80342C',
          900: '#682D26',
          950: '#371513',
        },
      },
    },
  },
  plugins: [],
};