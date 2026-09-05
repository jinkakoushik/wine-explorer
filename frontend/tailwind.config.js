/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep, warm "cellar" neutrals
        ink: {
          50: '#f6f4f1',
          100: '#e8e4dd',
          200: '#d1c9bd',
          300: '#b0a394',
          400: '#8a7c6d',
          500: '#6b5f52',
          600: '#544a3f',
          700: '#413a32',
          800: '#2b2620',
          900: '#1c1814',
          950: '#120f0c',
        },
        // Burgundy / wine accents
        wine: {
          50: '#fdf2f4',
          100: '#fce4e8',
          200: '#facfd7',
          300: '#f5a8b8',
          400: '#ed7590',
          500: '#e04a6d',
          600: '#cc2a52',
          700: '#ab1b42',
          800: '#8f1a3d',
          900: '#7a193a',
          950: '#45091c',
        },
        // Champagne gold
        gold: {
          50: '#fbf9eb',
          100: '#f6f0cd',
          200: '#ecdf9d',
          300: '#e0c864',
          400: '#d4b13e',
          500: '#c29a2b',
          600: '#a27a20',
          700: '#7f5a1d',
          800: '#69481e',
          900: '#593c1e',
          950: '#331f0f',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        logo: ['Marcellus', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.25em',
      },
      boxShadow: {
        card: '0 10px 40px -12px rgba(0, 0, 0, 0.55)',
        'card-hover': '0 24px 60px -12px rgba(122, 25, 58, 0.35)',
        glow: '0 0 60px -12px rgba(204, 42, 82, 0.35)',
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(122,25,58,0.35), transparent 70%)',
        'wine-gradient': 'linear-gradient(135deg, #45091c 0%, #7a193a 50%, #45091c 100%)',
        'gold-gradient': 'linear-gradient(135deg, #a27a20 0%, #e0c864 50%, #a27a20 100%)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'fade-out': {
          from: { opacity: '1', transform: 'translate(var(--tw-translate-x), var(--tw-translate-y)) scale(1)' },
          to: { opacity: '0', transform: 'translate(var(--tw-translate-x), var(--tw-translate-y)) scale(0.4)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out both',
        'fade-up': 'fade-up 0.6s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
        float: 'float 5s ease-in-out infinite',
        'spin-slow': 'spin-slow 1.4s linear infinite',
        'fade-out': 'fade-out 0.55s ease-out forwards',
      },
    },
  },
  plugins: [],
};
