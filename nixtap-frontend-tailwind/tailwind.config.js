/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      animation: {
        'ticker-vertical': 'ticker-vertical 25s linear infinite',
      },
      keyframes: {
        'ticker-vertical': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(-100%)' }
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
