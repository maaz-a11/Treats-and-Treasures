/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F2A7BB',
          light: '#FAD4E0',
          dark: '#D4728A',
        },
        accent: {
          DEFAULT: '#D4956A',
          light: '#EEC49E',
          dark: '#A8693E',
        },
        background: '#FDF6F0',
        surface: '#FFFAF7',
        espresso: '#2C1810',
        'espresso-light': '#5C3D2E',
        blush: '#FDE8EF',
        cream: '#FAF0E6',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'scroll-left': 'scrollLeft 30s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'drip': 'drip 1.2s ease-out infinite alternate',
      },
      keyframes: {
        scrollLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drip: {
          '0%': { height: '0px', opacity: '0' },
          '30%': { opacity: '1' },
          '100%': { height: '32px', opacity: '0.85' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(44,24,16,0.08)',
        'card': '0 2px 16px rgba(44,24,16,0.06)',
        'hover': '0 8px 40px rgba(44,24,16,0.14)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
