/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef5ff',
          100: '#fce7ff',
          200: '#f9d5ff',
          300: '#f5b8ff',
          400: '#ee8fff',
          500: '#e25afc',
          600: '#ca37e8',
          700: '#ac24c5',
          800: '#8d20a0',
          900: '#741f82',
        },
        pastel: {
          pink: '#FFB3D9',      // Rosa pastel suave
          lavender: '#E0BBE4',  // Lavanda pastel
          mint: '#B4E7CE',      // Menta pastel
          peach: '#FFDAB9',     // Durazno pastel
          blue: '#B4D7E7',      // Azul pastel
          yellow: '#FFF5BA',    // Amarillo pastel
        },
        glitter: {
          gold: '#FFD700',
          pink: '#FFB3D9',      // Rosa pastel más suave
          purple: '#D4A5D8',    // Púrpura pastel
          blue: '#B4D7E7',      // Azul pastel
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
