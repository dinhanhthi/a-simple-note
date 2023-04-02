/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './lib/config.ts'
  ],
  plugins: [require('@tailwindcss/typography')],
  theme: {
    extend: {
      colors: {
        primary: '#86efac', // green-300
        'primary-dark': 'rgb(22 163 74)' // green-600
      }
    }
  }
}
