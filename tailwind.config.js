/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display:  ['"Barlow Condensed"', 'system-ui', 'sans-serif'],
        heading:  ['"Barlow Condensed"', 'system-ui', 'sans-serif'],
        sans:     ['"DM Sans"',          'system-ui', 'sans-serif'],
        mono:     ['"IBM Plex Mono"',    'ui-monospace', 'monospace'],
      },
      colors: {
        /* TractorDB green scale */
        primary: {
          50:  '#F0F8EC',
          100: '#E6F2DD',
          200: '#C8E5B0',
          300: '#91C470',
          400: '#6DAF4C',
          500: '#4E8C2E',
          600: '#3A6E22',
          700: '#2D5A1B',
          800: '#1F3F12',
          900: '#1A2E10',
          950: '#0F1A09',
        },
        /* TractorDB amber */
        amber: {
          400: '#EBA840',
          500: '#D99428',
          600: '#C47A1E',
          700: '#A05E0A',
        },
        /* TractorDB neutrals */
        stone: {
          50:  '#F5F3EE',
          100: '#EEECE6',
          200: '#D8D5CD',
          300: '#C4C8BC',
          400: '#A8ADA0',
          500: '#8A8F82',
          600: '#6E7463',
          700: '#525A46',
          800: '#3A4030',
          900: '#2A2E20',
          950: '#1A1F14',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted:   '#F5F3EE',
          warm:    '#F5F3EE',
          subtle:  '#EEECE6',
        },
      },
      borderRadius: {
        input:  '4px',
        card:   '6px',
        modal:  '8px',
        button: '4px',
        pill:   '999px',
      },
      boxShadow: {
        sm:           '0 2px 8px rgba(0,0,0,0.07)',
        card:         '0 2px 8px rgba(0,0,0,0.07)',
        md:           '0 4px 16px rgba(0,0,0,0.10)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.10)',
        lg:           '0 8px 32px rgba(0,0,0,0.13)',
        'focus-ring': '0 0 0 3px rgba(45,90,27,0.12)',
      },
      fontSize: {
        'display-hero': ['64px', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'h1':  ['38px', { lineHeight: '1.1', fontWeight: '700' }],
        'h2':  ['30px', { lineHeight: '1.15', fontWeight: '700' }],
        'h3':  ['24px', { lineHeight: '1.2', fontWeight: '600' }],
        'h4':  ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'body':    ['15px', { lineHeight: '1.55' }],
        'body-sm': ['13px', { lineHeight: '1.5' }],
        'label':   ['11px', { lineHeight: '1', letterSpacing: '0.1em', fontWeight: '700' }],
        'spec':    ['13px', { lineHeight: '1.4', fontWeight: '500' }],
        'spec-hero': ['38px', { lineHeight: '1', fontWeight: '600' }],
      },
      maxWidth: {
        content: '1280px',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease-out forwards',
        'fade-in':    'fadeIn 0.5s ease-out forwards',
        'slide-right':'slideRight 0.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
