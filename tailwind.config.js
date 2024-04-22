/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      fontSize:{
        'xxs': '0.625rem',
        'xxxs': '0.5rem',
      },
      zIndex: {
        60: 60,
        100: 100
      }
    }
  },
  plugins: [require('tailwindcss'), require('autoprefixer')]
}
