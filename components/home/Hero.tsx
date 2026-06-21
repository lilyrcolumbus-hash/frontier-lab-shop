'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

const MyceliumScene = dynamic(
  () => import('@/components/three/MyceliumScene').then((m) => m.MyceliumScene),
  { ssr: false }
)

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
})

const FIREFLY_COUNT = 18

export function Hero() {
  const t = useTranslations('home.hero')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const flies = Array.from({ length: FIREFLY_COUNT }, (_, i) => {
      const el = document.createElement('div')
      const size = Math.random() * 4 + 2
      const duration = Math.random() * 10 + 8
      const delay = Math.random() * 14
      const type = i % 5 === 0 ? 'spore-moss' : i % 7 === 0 ? 'spore-lavender' : ''

      el.className = `spore ${type}`
      el.style.cssText = `
        width:${size}px;
        height:${size}px;
        left:${Math.random() * 100}%;
        --duration:${duration}s;
        --delay:${delay}s;
        --drift:${(Math.random() - 0.5) * 180}px;
        animation-delay:${delay}s;
      `
      container.appendChild(el)
      return el
    })
    return () => flies.forEach((f) => f.remove())
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-bg">
      {/* ── Forest depth layers ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Base forest gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020504] via-bg to-[#060C05]" />
        {/* Ground glow — warm amber from below */}
        <div className="absolute bottom-0 inset-x-0 h-[45%] bg-gradient-to-t from-[#1A0D04]/40 via-transparent to-transparent" />
        {/* Canopy — very subtle green tint at top */}
        <div className="absolute top-0 inset-x-0 h-[30%] bg-gradient-to-b from-[#030A04]/60 via-transparent to-transparent" />
        {/* Left ambient — moss green */}
        <div className="absolute left-0 top-1/4 w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-[120px]" />
        {/* Right ambient — lavender twilight */}
        <div className="absolute right-0 bottom-1/3 w-[400px] h-[400px] bg-lavender/[0.04] rounded-full blur-[100px]" />
        {/* Center warm — amber mushroom glow */}
        <div className="absolute left-1/2 bottom-1/4 -translate-x-1/2 w-[600px] h-[300px] bg-amber/[0.05] rounded-full blur-[120px]" />
      </div>

      {/* ── Video background (swap src with your mushroom timelapse) ── */}
      {/* <video className="absolute inset-0 w-full h-full object-cover opacity-20 z-0" autoPlay muted loop playsInline src="/video/mushroom-timelapse.mp4" /> */}

      {/* ── Firefly / spore Three.js scene ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <MyceliumScene className="absolute inset-0" />
      </div>

      {/* ── CSS spore particles ── */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-[2] pointer-events-none overflow-hidden"
        aria-hidden="true"
      />

      {/* ── Decorative tree silhouettes (pure CSS) ── */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Left tree trunk */}
        <div className="absolute left-[-30px] bottom-0 w-16 h-[70%] bg-[#04080400] border-r border-[#1A2A15]/40 rounded-tr-[60%]" />
        {/* Right tree trunk */}
        <div className="absolute right-[-30px] bottom-0 w-16 h-[60%] bg-[#04080400] border-l border-[#1A2A15]/40 rounded-tl-[60%]" />
        {/* Ground fog */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-bg/80 to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left column */}
          <div className="space-y-8">
            <motion.p
              {...fadeUp(0.15)}
              className="font-accent italic text-amber/80 text-lg tracking-wide"
            >
              Deep in the mycelium, magic grows.
            </motion.p>

            <div className="space-y-1 overflow-hidden">
              <motion.h1 {...fadeUp(0.25)}>
                <span className="block font-heading text-cream text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05]">
                  {t('headline1')}
                </span>
              </motion.h1>
              <motion.div {...fadeUp(0.4)}>
                <span className="block font-display text-[4.5rem] sm:text-[6rem] lg:text-[7.5rem] leading-none tracking-[0.02em] text-gradient-forest">
                  {t('headline2')}
                </span>
              </motion.div>
            </div>

            <motion.p {...fadeUp(0.55)} className="font-body text-cream-muted text-lg max-w-md leading-relaxed">
              {t('subtext')}
            </motion.p>

            <motion.div {...fadeUp(0.65)} className="flex flex-col sm:flex-row gap-4">
              <Link href="/quiz">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-amber text-bg font-semibold border-0 glow-amber transition-all duration-300 hover:scale-[1.03] hover:bg-amber-bright"
                >
                  🍄 {t('ctaPrimary')}
                </Button>
              </Link>
              <Link href="/shop">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-accent/30 text-accent hover:border-accent/60 hover:bg-accent/8 transition-all duration-300"
                >
                  {t('ctaSecondary')} →
                </Button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div {...fadeUp(0.78)} className="flex items-center gap-5 pt-1">
              <div className="flex -space-x-2">
                {['#1A0D04', '#0A1A08', '#100520', '#04120A', '#180E02'].map((bg, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-bg flex items-center justify-center text-sm"
                    style={{ backgroundColor: bg }}
                  >
                    🍄
                  </div>
                ))}
              </div>
              <p className="text-sm text-cream-muted">
                <span className="text-amber font-semibold glow-amber-text">350,000+</span>{' '}
                growers worldwide
              </p>
            </motion.div>
          </div>

          {/* Right column — enchanted mushroom */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.35, ease: EASE }}
            className="hidden lg:flex items-center justify-center relative"
          >
            <div className="relative w-full max-w-lg aspect-square">
              {/* Ambient ground glow */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-24 bg-amber/15 rounded-full blur-3xl animate-breathe" />

              {/* Outer rings — like a fairy circle */}
              <div className="absolute inset-0 rounded-full border border-accent/6 animate-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }} />
              <div className="absolute inset-8 rounded-full border border-amber/5 animate-pulse" style={{ animationDelay: '1s', animationDuration: '5s' }} />
              <div className="absolute inset-16 rounded-full border border-lavender/5 animate-pulse" style={{ animationDelay: '2s', animationDuration: '6s' }} />

              {/* Central mushroom — enchanted forest style */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  viewBox="0 0 300 340"
                  className="w-72 h-80"
                  style={{ filter: 'drop-shadow(0 0 25px rgba(212,145,58,0.2)) drop-shadow(0 0 60px rgba(212,145,58,0.08))' }}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Stem */}
                  <path
                    d="M122 202 Q140 258 150 302 Q160 258 178 202"
                    fill="#0A1408"
                    stroke="#162414"
                    strokeWidth="1.5"
                  />
                  {/* Veil / skirt */}
                  <path
                    d="M108 210 Q120 218 150 220 Q180 218 192 210"
                    fill="none"
                    stroke="rgba(212,145,58,0.3)"
                    strokeWidth="1"
                  />
                  {/* Cap base */}
                  <path
                    d="M80 208 Q95 200 122 200 L178 200 Q205 200 220 208"
                    fill="#0D1A0C"
                    stroke="rgba(212,145,58,0.4)"
                    strokeWidth="1.5"
                  />
                  {/* Main cap */}
                  <path
                    d="M60 200 Q64 98 150 58 Q236 98 240 200 Z"
                    fill="#08100A"
                    stroke="rgba(212,145,58,0.35)"
                    strokeWidth="1.5"
                  />
                  {/* Inner cap highlight */}
                  <path
                    d="M95 165 Q122 104 150 92 Q178 104 205 165"
                    stroke="rgba(212,145,58,0.12)"
                    strokeWidth="1"
                    fill="none"
                  />
                  {/* Bioluminescent inner glow */}
                  <ellipse cx="150" cy="145" rx="52" ry="62" fill="url(#forestGlow)" opacity="0.18" />
                  {/* Spots on cap */}
                  {[
                    { cx: 120, cy: 135, r: 7 },
                    { cx: 160, cy: 108, r: 9 },
                    { cx: 185, cy: 148, r: 6 },
                    { cx: 108, cy: 165, r: 5 },
                    { cx: 145, cy: 88, r: 8 },
                    { cx: 175, cy: 128, r: 5 },
                  ].map((spot, i) => (
                    <circle
                      key={i}
                      cx={spot.cx}
                      cy={spot.cy}
                      r={spot.r}
                      fill="rgba(212,145,58,0.12)"
                      stroke="rgba(212,145,58,0.25)"
                      strokeWidth="0.8"
                    />
                  ))}
                  {/* Gills */}
                  {[88, 106, 122, 138, 154, 170, 186, 204].map((x, i) => (
                    <path
                      key={i}
                      d={`M${x} 200 Q${x + 7} ${187 - i} ${x + 14} 200`}
                      stroke="rgba(107,191,106,0.2)"
                      strokeWidth="0.8"
                    />
                  ))}
                  {/* Small mushrooms at base */}
                  <path d="M70 260 Q78 235 86 260" fill="#08100A" stroke="rgba(107,191,106,0.2)" strokeWidth="1" />
                  <path d="M60 245 Q70 228 80 245 Z" fill="rgba(107,191,106,0.06)" stroke="rgba(107,191,106,0.15)" strokeWidth="1" />
                  <path d="M210 268 Q218 248 226 268" fill="#08100A" stroke="rgba(107,191,106,0.2)" strokeWidth="1" />
                  <path d="M202 255 Q212 235 222 255 Z" fill="rgba(107,191,106,0.06)" stroke="rgba(107,191,106,0.15)" strokeWidth="1" />
                  {/* Floating spore dots */}
                  {[
                    { cx: 45, cy: 110, r: 2, c: 'rgba(212,145,58,0.3)' },
                    { cx: 262, cy: 125, r: 1.5, c: 'rgba(107,191,106,0.4)' },
                    { cx: 35, cy: 165, r: 2.5, c: 'rgba(139,107,181,0.35)' },
                    { cx: 272, cy: 85, r: 2, c: 'rgba(212,145,58,0.25)' },
                    { cx: 50, cy: 200, r: 1.5, c: 'rgba(107,191,106,0.3)' },
                    { cx: 258, cy: 185, r: 1, c: 'rgba(139,107,181,0.3)' },
                  ].map((d, i) => (
                    <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={d.c} />
                  ))}
                  {/* Mycelium threads at base */}
                  <path d="M100 285 Q120 270 150 280 Q180 270 200 285" stroke="rgba(107,191,106,0.12)" strokeWidth="0.8" fill="none" />
                  <path d="M80 300 Q115 282 150 295 Q185 282 220 300" stroke="rgba(107,191,106,0.08)" strokeWidth="0.6" fill="none" />
                  <defs>
                    <radialGradient id="forestGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#D4913A" />
                      <stop offset="100%" stopColor="#D4913A" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>

              {/* Floating stat cards */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 1 }}
                className="absolute -left-8 top-12 glass-warm rounded-2xl p-4 shadow-card"
              >
                <p className="text-xs text-cream-muted/70 font-mono">Colonization</p>
                <p className="text-xl font-heading font-semibold text-cream mt-0.5">2–3 weeks</p>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-1 flex-1 rounded bg-amber/50" />
                  ))}
                  <div className="h-1 flex-1 rounded bg-ds-border" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 1.2 }}
                className="absolute -right-8 bottom-20 glass-warm rounded-2xl p-4 shadow-card"
              >
                <p className="text-xs text-cream-muted/70 font-mono">Beta-glucans</p>
                <p className="text-xl font-heading font-semibold text-amber glow-amber-text mt-0.5">High</p>
                <p className="text-xs text-cream-muted/60 mt-1">Immune support ✦</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="absolute right-2 top-6 glass-warm rounded-xl px-3 py-2"
              >
                <p className="text-xs text-amber/90 font-mono glow-amber-text">★ 4.9 / 5.0</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-bg to-transparent pointer-events-none z-10" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-cream-muted/40 text-xs font-mono tracking-[0.2em] uppercase">explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-amber/40 to-transparent animate-pulse" />
      </motion.div>
    </section>
  )
}
