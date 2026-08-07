/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
        '3xl': '1920px', // Ultrawide support
      },
      colors: {
        // Soft & Elegant Accents
        coral:    { 500: '#FF6B6B', 400: '#FF8585', 100: '#FFE5E5' },
        gold:     { 500: '#FFB703', 400: '#FFC533', 100: '#FFF4D6' },
        sky:      { 500: '#8ECAE6', 100: '#E6F4FA' },
        mint:     { 500: '#A8DADC', 100: '#EAF5F5' },
        lavender: { 500: '#CDB4DB', 100: '#F3EBF6' },
        
        // Brand maps to Coral for primary actions
        brand: {
          400: '#FF8585',
          500: '#FF6B6B', 
          600: '#E55A5A',
        },

        // Surface system
        surface: {
          0:    '#FFFDF8', // Warm white background
          1:    '#FFFFFF', // Cards
          2:    '#F9F7F1', // Hover states
          border: '#F0EBE1', // Soft borders
          muted:  '#E0DCD3',
        },
        
        // Text system
        ink: {
          primary:   '#2D2D2D', // Soft dark gray
          secondary: '#666666',
          tertiary:  '#999999',
          inverse:   '#FFFFFF',
        },
        
        // Semantic (Mapped to soft colors)
        signal: {
          info:    '#8ECAE6',
          warning: '#FFB703',
          danger:  '#FF6B6B',
          success: '#A8DADC',
        },
      },
      fontFamily: {
        sans:    ['"Nunito Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        'fluid-sm': 'clamp(0.875rem, 0.8vw + 0.6rem, 1rem)',
        'fluid-base': 'clamp(1rem, 1vw + 0.75rem, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1.5vw + 0.75rem, 1.5rem)',
        'fluid-xl': 'clamp(1.25rem, 2vw + 1rem, 1.75rem)',
        'fluid-2xl': 'clamp(1.5rem, 2.5vw + 1rem, 2rem)',
        'fluid-3xl': 'clamp(1.875rem, 3.5vw + 1rem, 2.5rem)',
        'fluid-4xl': 'clamp(2.25rem, 4.5vw + 1rem, 3.5rem)',
        'fluid-5xl': 'clamp(3rem, 6vw + 1rem, 4.5rem)',
      },
      spacing: {
        'fluid-sm': 'clamp(0.5rem, 1vw + 0.25rem, 1rem)',
        'fluid-md': 'clamp(1rem, 2vw + 0.5rem, 2rem)',
        'fluid-lg': 'clamp(2rem, 4vw + 1rem, 4rem)',
        'fluid-xl': 'clamp(4rem, 8vw + 2rem, 8rem)',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0,0,0,0.04)',
        'lift': '0 15px 35px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        '3xl': '1.5rem', // 24px
      },
      animation: {
        'fade-in':    'fadeIn 0.6s ease-out both',
        'slide-up':   'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'float-slow': 'float 6s infinite ease-in-out',
        'float-med':  'float 4s infinite ease-in-out',
        'float-fast': 'float 3s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
