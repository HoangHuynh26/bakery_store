/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bakery: {
          ivory: '#FFF9F2',
          espresso: '#38261F',
          caramel: '#C89963',
          'caramel-dark': '#A67945',
          blush: '#F3D8D4',
          cream: '#F7EBDD',
          sage: '#A8B5A0',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(56, 38, 31, 0.08)',
        'elevated': '0 12px 32px -4px rgba(56, 38, 31, 0.12)',
        'luxury': '0 20px 48px -8px rgba(56, 38, 31, 0.16)',
      },
      borderRadius: {
        'luxury': '16px',
        'pill': '9999px',
      },
    },
  },
  plugins: [],
}
