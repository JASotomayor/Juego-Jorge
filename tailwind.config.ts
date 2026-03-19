import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
        },
        secondary: {
          400: '#facc15',
          500: '#eab308',
        },
        accent: {
          400: '#f472b6',
          500: '#ec4899',
        },
        game: {
          card: '#6d28d9',
          cardHover: '#7c3aed',
          matched: '#10b981',
          bg: '#fdf4ff',
        },
      },
      fontFamily: {
        display: ['var(--font-nunito)', 'sans-serif'],
      },
      animation: {
        'flip-in': 'flipIn 0.3s ease-in-out',
        'bounce-in': 'bounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'pulse-match': 'pulseMatch 0.6s ease-in-out',
        'shake': 'shake 0.4s ease-in-out',
      },
      keyframes: {
        flipIn: {
          '0%': { transform: 'rotateY(90deg)', opacity: '0' },
          '100%': { transform: 'rotateY(0deg)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8)' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        pulseMatch: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
      perspective: {
        '1000': '1000px',
      },
    },
  },
  plugins: [],
}

export default config
