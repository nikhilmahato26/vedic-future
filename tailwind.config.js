/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cosmic: {
          DEFAULT: '#0F172A',
          50: '#f0f3f9',
          100: '#dae0ee',
          200: '#b3c0dd',
          300: '#8094c2',
          400: '#4d63a0',
          500: '#2e3f6e',
          600: '#1e2a4d',
          700: '#16203b',
          800: '#101830',
          900: '#0F172A',
          950: '#080d1a',
        },
        gold: {
          DEFAULT: '#D4AF37',
          50: '#fbf8ed',
          100: '#f6efcf',
          200: '#eeda9b',
          300: '#e6c862',
          400: '#dfb748',
          500: '#D4AF37',
          600: '#b08e29',
          700: '#8a6c23',
          800: '#735823',
          900: '#624a22',
          950: '#392910',
        },
        ivory: {
          DEFAULT: '#F8F4EC',
          dark: '#ECE4D4',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Jost"', 'system-ui', 'sans-serif'],
        sanskrit: ['"Marcellus"', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F4D98B 0%, #D4AF37 45%, #A67C13 100%)',
        'gold-shine': 'linear-gradient(110deg, #A67C13 0%, #D4AF37 25%, #F8E8C0 50%, #D4AF37 75%, #A67C13 100%)',
        'cosmic-radial': 'radial-gradient(ellipse at top, #1e2a4d 0%, #0F172A 55%, #080d1a 100%)',
        'cosmic-veil': 'linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(15,23,42,0.85) 70%, #0F172A 100%)',
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(212,175,55,0.45)',
        'glow-lg': '0 0 80px -10px rgba(212,175,55,0.4)',
        'glass': '0 8px 32px 0 rgba(8,13,26,0.45)',
        'gold-inset': 'inset 0 1px 0 0 rgba(244,217,139,0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-22px) rotate(8deg)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.06)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.15' },
          '50%': { opacity: '0.9' },
        },
      },
      animation: {
        'float-slow': 'float-slow 9s ease-in-out infinite',
        'spin-slow': 'spin-slow 60s linear infinite',
        'spin-slower': 'spin-slow 120s linear infinite',
        'pulse-glow': 'pulse-glow 5s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
        twinkle: 'twinkle 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
