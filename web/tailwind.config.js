/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Orange-fire primary (from logo)
        primary: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea6c0a',
          700: '#c2550a',
          800: '#9a3d08',
          900: '#7c3206',
          950: '#431602',
        },
        // Dark charcoal (from logo background)
        dark: {
          50:  '#f5f5f4',
          100: '#e7e5e4',
          200: '#d6d3d1',
          300: '#a8a29e',
          400: '#78716c',
          500: '#57534e',
          600: '#44403c',
          700: '#292524',
          800: '#1c1917',
          900: '#141210',
          950: '#0d0b09',
        },
        // Neutral surface tones
        surface: {
          50:  '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        // Amber glow accent
        accent: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in':      'fadeIn 0.5s ease-in-out',
        'slide-up':     'slideUp 0.5s ease-out',
        'slide-down':   'slideDown 0.3s ease-out',
        'scale-in':     'scaleIn 0.3s ease-out',
        'glow-pulse':   'glowPulse 3s ease-in-out infinite',
        'float':        'float 6s ease-in-out infinite',
        'fire-flicker': 'fireFlicker 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:      { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:     { '0%': { transform: 'translateY(24px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideDown:   { '0%': { transform: 'translateY(-10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        scaleIn:     { '0%': { transform: 'scale(0.95)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(249,115,22,0.3), 0 0 60px rgba(249,115,22,0.1)' },
          '50%':      { boxShadow: '0 0 40px rgba(249,115,22,0.6), 0 0 100px rgba(249,115,22,0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        fireFlicker: {
          '0%, 100%': { opacity: '1',   transform: 'scaleY(1)' },
          '50%':      { opacity: '0.85', transform: 'scaleY(1.05)' },
        },
      },
      backgroundImage: {
        'orange-radial': 'radial-gradient(ellipse at center, rgba(249,115,22,0.15) 0%, transparent 70%)',
        'dark-grid':     'linear-gradient(rgba(249,115,22,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.03) 1px, transparent 1px)',
        'hero-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(249,115,22,0.3) 0%, transparent 60%)',
      },
      boxShadow: {
        'orange-glow':  '0 0 30px rgba(249,115,22,0.4)',
        'orange-glow-lg':'0 0 60px rgba(249,115,22,0.3)',
        'card-dark':    '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover':   '0 8px 40px rgba(249,115,22,0.2)',
      },
    },
  },
  plugins: [],
}
