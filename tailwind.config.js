/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-purple': '#6f42c1',
        'brand-dark': '#1a1a1a',
        'brand-light': '#f8f9fa',
      }
    },
  },
  plugins: [],
}