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
        'neon-start': '#00FFC6',
        'neon-end': '#4B00FF',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px #00FFC6, 0 0 10px #00FFC6, 0 0 15px #00FFC6, 0 0 20px #4B00FF, 0 0 30px #4B00FF, 0 0 40px #4B00FF, 0 0 55px #4B00FF, 0 0 75px #4B00FF' },
          '50%': { boxShadow: '0 0 10px #00FFC6, 0 0 15px #00FFC6, 0 0 20px #4B00FF, 0 0 30px #4B00FF, 0 0 40px #4B00FF, 0 0 50px #4B00FF, 0 0 60px #4B00FF, 0 0 70px #4B00FF' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.02)', opacity: 0.95 },
        }
      },
      animation: {
        glow: 'glow 4s ease-in-out infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
