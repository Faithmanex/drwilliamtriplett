/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      colors: {
        brand: {
          dark: '#0B1120',
          primary: '#1E3A8A',
          secondary: '#64748B',
          accent: '#CA8A04',
          light: '#F8FAFC',
          surface: '#FFFFFF',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 40px -10px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 20px rgba(202, 138, 4, 0.3)',
      }
    }
  },
  plugins: [],
}
