/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hc: {
          pink: '#d62959',
          pinkHover: '#b5224a',
          gray: '#a4a7a6',
          grayHover: '#8b8e8d',
          blue: '#64B5F6',
          bg: '#F5F5F5'
        }
      }
    },
  },
  plugins: [],
}
