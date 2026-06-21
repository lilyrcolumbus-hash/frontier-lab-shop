import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#03080A',
        surface: '#071210',
        elevated: '#0C1F1A',
        accent: {
          DEFAULT: '#00FFB8',
          hover: '#00E5A5',
          dim: 'rgba(0,255,184,0.15)',
        },
        violet: {
          DEFAULT: '#7C3AED',
          hover: '#6D28D9',
          dim: 'rgba(124,58,237,0.15)',
        },
        gold: {
          DEFAULT: '#FFAE00',
          dim: 'rgba(255,174,0,0.15)',
        },
        cream: {
          DEFAULT: '#E8FFF8',
          muted: '#7AADA0',
        },
        'ds-border': '#0D2E26',
        success: '#00FFB8',
        warning: '#FFAE00',
        error: '#FF4136',
        moss: '#00B88A',
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        heading: ['var(--font-playfair)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        accent: ['var(--font-cormorant)', 'serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        card: '0 4px 32px rgba(0,0,0,0.6)',
        'glow-cyan': '0 0 20px rgba(0,255,184,0.4), 0 0 60px rgba(0,255,184,0.15)',
        'glow-cyan-sm': '0 0 10px rgba(0,255,184,0.3)',
        'glow-violet': '0 0 20px rgba(124,58,237,0.4), 0 0 60px rgba(124,58,237,0.15)',
        'glow-gold': '0 0 20px rgba(255,174,0,0.4)',
        'glow-inset': 'inset 0 0 30px rgba(0,255,184,0.05)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'floatY 6s ease-in-out infinite',
        'float-slow': 'floatY 10s ease-in-out infinite',
        'spore-rise': 'sporeRise var(--duration, 8s) var(--delay, 0s) infinite ease-in',
        'shimmer': 'shimmer 2.5s infinite',
        'text-reveal': 'textReveal 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'border-spin': 'borderSpin 3s linear infinite',
        'cursor-glow': 'cursorGlow 0.15s ease-out',
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee 25s linear infinite reverse',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0,255,184,0.3)', opacity: '0.8' },
          '50%': { boxShadow: '0 0 40px rgba(0,255,184,0.7), 0 0 80px rgba(0,255,184,0.3)', opacity: '1' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        sporeRise: {
          '0%': { transform: 'translateY(100vh) translateX(0) scale(0)', opacity: '0' },
          '10%': { opacity: '0.6' },
          '90%': { opacity: '0.2' },
          '100%': { transform: 'translateY(-120px) translateX(var(--drift,0px)) scale(1.5)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        textReveal: {
          '0%': { opacity: '0', transform: 'translateY(30px) skewY(3deg)' },
          '100%': { opacity: '1', transform: 'translateY(0) skewY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        borderSpin: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'radial-glow-cyan': 'radial-gradient(ellipse at center, rgba(0,255,184,0.08) 0%, transparent 70%)',
        'radial-glow-violet': 'radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, transparent 70%)',
        'shimmer-line': 'linear-gradient(105deg, transparent 40%, rgba(0,255,184,0.6) 50%, transparent 60%)',
        'gradient-biolum': 'linear-gradient(135deg, #00FFB8 0%, #7C3AED 50%, #FFAE00 100%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}

export default config
