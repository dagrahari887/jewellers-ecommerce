export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bj-ivory': '#FAF9F6',
        'bj-charcoal': '#1A1A1A',
        'bj-charcoal-light': '#2A2A2A',
        'bj-gold': '#C5A059',
        'bj-gold-light': '#D4AF37',
        'bj-gold-dark': '#B38F4D',
        'bj-gold-pale': '#F5EDD8',
        'bj-champagne': '#F7E7CE',
        'bj-cream': '#FDF8F2',
        'bj-stone': '#8C7B6B',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xxs': ['0.625rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        'luxury': '0 4px 24px rgba(197, 160, 89, 0.15)',
        'luxury-sm': '0 2px 12px rgba(197, 160, 89, 0.10)',
        'luxury-lg': '0 8px 40px rgba(197, 160, 89, 0.20)',
        'card': '0 1px 8px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)',
      },
      animation: {
        'shimmer': 'shimmer 3s linear infinite',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(8px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #1A1A1A 0%, #2D2618 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D4AF37, #C5A059, #B38F4D)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [],
};