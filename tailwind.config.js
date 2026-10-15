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
          50: '#fff0f8',
          100: '#ffd9ec',
          200: '#ffb9dc',
          300: '#ff91c6',
          400: '#fb69b3',
          500: '#f83fa5',
          600: '#d92988',
          700: '#ae1663',
          800: '#87114e',
          900: '#610b37',
        },
        pastel: {
          pink: '#ffd9ec',
          lavender: '#e9def8',
          mint: '#d3fbec',
          peach: '#FFDAB9',     // Durazno pastel
          blue: '#d3fbec',
          yellow: '#ffe468',
        },
        glitter: {
          gold: '#ffe468',
          pink: '#f83fa5',
          purple: '#ae1663',
          blue: '#d3fbec',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        display: ['var(--font-barlow-condensed)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
