import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#040908',
        surface: '#08100A',
        elevated: '#0D1A0C',
        'forest-deep': '#060C05',
        accent: {
          DEFAULT: '#6BBF6A',   // musgo iluminado
          hover: '#5CAF5B',
          dim: 'rgba(107,191,106,0.12)',
        },
        amber: {
          DEFAULT: '#D4913A',   // hongo dorado / luciérnaga
          bright: '#E8A84A',
          dim: 'rgba(212,145,58,0.15)',
        },
        lavender: {
          DEFAULT: '#8B6BB5',   // crepúsculo
          dim: 'rgba(139,107,181,0.12)',
        },
        cream: {
          DEFAULT: '#E4EDDA',   // luz lunar
          muted: '#6B8A65',     // gris-verde bosque
        },
        'ds-border': '#162414',
        moss: '#3A6B3A',
        success: '#6BBF6A',
        warning: '#D4913A',
        error: '#C45E3A',
      },
      fontFamily: {
        display:  ['var(--font-bebas)', 'sans-serif'],
        heading:  ['var(--font-playfair)', 'serif'],
        body:     ['var(--font-inter)', 'sans-serif'],
        accent:   ['var(--font-cormorant)', 'serif'],
        mono:     ['var(--font-space-mono)', 'monospace'],
      },
      boxShadow: {
        card:           '0 4px 40px rgba(0,0,0,0.6)',
        'glow-moss':    '0 0 20px rgba(107,191,106,0.3), 0 0 60px rgba(107,191,106,0.1)',
        'glow-moss-sm': '0 0 10px rgba(107,191,106,0.25)',
        'glow-amber':   '0 0 20px rgba(212,145,58,0.4), 0 0 50px rgba(212,145,58,0.12)',
        'glow-amber-sm':'0 0 12px rgba(212,145,58,0.35)',
        'glow-lavender':'0 0 20px rgba(139,107,181,0.3)',
        'glow-inset':   'inset 0 0 40px rgba(107,191,106,0.04)',
      },
      animation: {
        'firefly':       'fireflyFloat var(--duration,12s) var(--delay,0s) infinite ease-in-out',
        'spore-rise':    'sporeRise var(--duration,10s) var(--delay,0s) infinite ease-in',
        'breathe':       'breathe 4s ease-in-out infinite',
        'sway':          'sway 6s ease-in-out infinite',
        'pulse-soft':    'pulseSoft 3s ease-in-out infinite',
        'fade-in':       'fadeIn 0.5s ease-out forwards',
        'slide-up':      'slideUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'drift-up':      'driftUp var(--duration,14s) var(--delay,0s) infinite linear',
        'marquee':       'marquee 30s linear infinite',
        'shimmer-warm':  'shimmerWarm 3s linear infinite',
        'float':         'floatY 7s ease-in-out infinite',
      },
      keyframes: {
        fireflyFloat: {
          '0%':   { transform: 'translate(0,0) scale(1)', opacity: '0' },
          '10%':  { opacity: '0.8' },
          '30%':  { transform: 'translate(var(--dx1,20px), -30px) scale(1.2)' },
          '50%':  { transform: 'translate(var(--dx2,-15px), -60px) scale(0.8)', opacity: '0.5' },
          '70%':  { transform: 'translate(var(--dx3,25px), -90px) scale(1.1)' },
          '90%':  { opacity: '0.2' },
          '100%': { transform: 'translate(var(--dx4,-10px), -130px) scale(0.5)', opacity: '0' },
        },
        sporeRise: {
          '0%':   { transform: 'translateY(0) translateX(0) scale(0.4)', opacity: '0' },
          '5%':   { opacity: '0.7' },
          '90%':  { opacity: '0.1' },
          '100%': { transform: 'translateY(-110vh) translateX(var(--drift,0px)) scale(0.2)', opacity: '0' },
        },
        breathe: {
          '0%,100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%':     { transform: 'scale(1.08)', opacity: '1' },
        },
        sway: {
          '0%,100%': { transform: 'rotate(-2deg)' },
          '50%':     { transform: 'rotate(2deg)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '0.6', boxShadow: '0 0 8px rgba(212,145,58,0.25)' },
          '50%':     { opacity: '1',   boxShadow: '0 0 30px rgba(212,145,58,0.5), 0 0 60px rgba(212,145,58,0.15)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        driftUp: {
          '0%':   { transform: 'translateY(100vh) translateX(var(--x-start,0px)) scale(0.3)', opacity: '0' },
          '8%':   { opacity: '0.6' },
          '92%':  { opacity: '0.15' },
          '100%': { transform: 'translateY(-10vh) translateX(var(--x-end,0px)) scale(0.1)', opacity: '0' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        shimmerWarm: {
          from: { backgroundPosition: '-200% center' },
          to:   { backgroundPosition: '200% center' },
        },
        floatY: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-14px)' },
        },
      },
      backgroundImage: {
        'forest-radial': 'radial-gradient(ellipse at 50% 80%, rgba(58,107,58,0.12) 0%, transparent 65%)',
        'amber-radial':  'radial-gradient(ellipse at center, rgba(212,145,58,0.1) 0%, transparent 65%)',
        'gradient-forest': 'linear-gradient(180deg, #040908 0%, #06110A 50%, #040908 100%)',
        'shimmer-warm':  'linear-gradient(105deg, transparent 35%, rgba(212,145,58,0.4) 50%, transparent 65%)',
      },
    },
  },
  plugins: [],
}

export default config
