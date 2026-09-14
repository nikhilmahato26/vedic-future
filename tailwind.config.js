/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep navy-blue - dark panels (footer, CTA band), headings, body text.
        navy: {
          DEFAULT: '#242B54',
          50: '#EEF0F8',
          100: '#D6DAEC',
          200: '#AEB5D8',
          300: '#7F89BE',
          400: '#565F9C',
          500: '#3B4278',
          600: '#2F3665',
          700: '#282E59',
          800: '#252B52',
          900: '#242B54',
          950: '#171B38',
        },
        // Warm cream - the site's base background.
        cream: {
          DEFAULT: '#F7EEDD',
          50: '#FEFCF8',
          100: '#FBF5E9',
          200: '#F7EEDD',
          300: '#F0E3C9',
          400: '#E7D3A9',
        },
        // Coral/salmon - the single accent color (replaces the old gold).
        coral: {
          DEFAULT: '#E67A5B',
          50: '#FDF1EC',
          100: '#FBE0D5',
          200: '#F5C0AC',
          300: '#EEA07F',
          400: '#EA8A64',
          500: '#E67A5B',
          600: '#D2603F',
          700: '#AD4B30',
          800: '#883B27',
          900: '#5F2A1D',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Jost"', 'system-ui', 'sans-serif'],
        sanskrit: ['"Marcellus"', 'serif'],
      },
      backgroundImage: {
        'coral-gradient': 'linear-gradient(135deg, #EA8A64 0%, #E67A5B 45%, #C4502F 100%)',
        'coral-shine': 'linear-gradient(110deg, #AD4B30 0%, #E67A5B 25%, #F5C0AC 50%, #E67A5B 75%, #AD4B30 100%)',
        'navy-radial': 'radial-gradient(ellipse at top, #2F3665 0%, #242B54 55%, #171B38 100%)',
        'navy-veil': 'linear-gradient(180deg, rgba(23,27,56,0) 0%, rgba(23,27,56,0.85) 70%, #171B38 100%)',
        'cream-radial': 'radial-gradient(ellipse at top, #FBF5E9 0%, #F7EEDD 55%, #F0E3C9 100%)',
        'cream-veil': 'linear-gradient(180deg, rgba(247,238,221,0) 0%, rgba(247,238,221,0.9) 70%, #F7EEDD 100%)',
      },
      boxShadow: {
        glow: '0 10px 40px -12px rgba(230,122,91,0.35)',
        'glow-lg': '0 20px 70px -15px rgba(230,122,91,0.32)',
        glass: '0 8px 32px 0 rgba(36,43,84,0.10)',
        'coral-inset': 'inset 0 1px 0 0 rgba(255,255,255,0.4)',
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
          '50%': { opacity: '0.7' },
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
