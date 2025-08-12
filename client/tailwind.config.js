/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kassa: {
          primary: '#FF385C',
          primaryDark: '#E11D48'
        }
      },
      boxShadow: {
        'soft': '0 6px 24px -12px rgba(0,0,0,0.25)'
      }
    },
  },
  plugins: [],
}

