import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Colours resolve through CSS variables so a store can restyle the site from /admin/settings
      // without a rebuild. The `<alpha-value>` form keeps Tailwind's opacity modifiers working
      // (bg-accent/30). Defaults live in app/globals.css and match the palette this site shipped.
      colors: {
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        elevated: 'rgb(var(--c-elevated) / <alpha-value>)',
        'forest-deep': '#DFE3DF',
        accent: {
          DEFAULT: 'rgb(var(--c-accent) / <alpha-value>)',
          hover: 'color-mix(in srgb, rgb(var(--c-accent)) 88%, black)',
          dim: 'rgb(var(--c-accent) / 0.12)', // gold-tint — badge fills, button hover, ~12% per spec
        },
        amber: {
          DEFAULT: 'rgb(var(--c-amber) / <alpha-value>)',
          bright: 'color-mix(in srgb, rgb(var(--c-amber)) 88%, white)',
          dim: 'rgb(var(--c-amber) / 0.12)',
        },
        silver: {
          DEFAULT: 'rgb(var(--c-silver) / <alpha-value>)',
          bright: 'color-mix(in srgb, rgb(var(--c-silver)) 82%, white)',
          dim: 'rgb(var(--c-silver) / 0.14)',
        },
        lavender: {
          DEFAULT: 'rgb(var(--c-lavender) / <alpha-value>)',
          dim: 'rgb(var(--c-lavender) / 0.10)',
        },
        cream: {
          DEFAULT: 'rgb(var(--c-cream) / <alpha-value>)',
          muted: 'rgb(var(--c-muted) / <alpha-value>)',
        },
        'ds-border': 'rgb(var(--c-border) / <alpha-value>)',
        moss: '#3D6443',
        success: '#3D6E45',
        warning: '#9E6820',
        error: '#A8392A', // apagado, "brick" — solo estado (fallos/destructivo), nunca decorativo
      },
      fontFamily: {
        display:  ['var(--font-bebas)', 'sans-serif'], // prohibida, no usar en componentes nuevos
        heading:  ['var(--font-fraunces)', 'serif'], // titulares, nombres de producto, frases de una línea
        body:     ['var(--font-inter)', 'sans-serif'],
        accent:   ['var(--font-cormorant)', 'serif'], // prohibida, no usar en componentes nuevos
        mono:     ['var(--font-space-mono)', 'monospace'],
      },
      boxShadow: {
        card:           '0 2px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        'glow-moss':    '0 0 20px rgba(58,112,71,0.15), 0 0 50px rgba(58,112,71,0.05)',
        'glow-moss-sm': '0 0 10px rgba(58,112,71,0.12)',
        'glow-amber':   '0 0 20px rgba(158,104,32,0.20), 0 0 40px rgba(158,104,32,0.06)',
        'glow-amber-sm':'0 0 12px rgba(158,104,32,0.15)',
        'glow-silver':  '0 0 20px rgba(122,149,168,0.20), 0 0 50px rgba(122,149,168,0.06)',
        'glow-lavender':'0 0 20px rgba(99,80,160,0.15)',
        'glow-inset':   'inset 0 0 40px rgba(58,112,71,0.03)',
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
        'forest-radial': 'radial-gradient(ellipse at 50% 80%, rgba(58,112,71,0.06) 0%, transparent 65%)',
        'amber-radial':  'radial-gradient(ellipse at center, rgba(158,104,32,0.06) 0%, transparent 65%)',
        'silver-radial': 'radial-gradient(ellipse at center, rgba(122,149,168,0.08) 0%, transparent 65%)',
        'gradient-studio': 'linear-gradient(180deg, #F7F8F5 0%, #F2F4EF 50%, #F7F8F5 100%)',
        'shimmer-warm':  'linear-gradient(105deg, transparent 35%, rgba(158,104,32,0.25) 50%, transparent 65%)',
      },
    },
  },
  plugins: [],
}

export default config
