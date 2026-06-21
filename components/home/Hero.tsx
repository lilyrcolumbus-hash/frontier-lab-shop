'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

// Load Three.js scene client-only (no SSR)
const MyceliumScene = dynamic(
  () => import('@/components/three/MyceliumScene').then((m) => m.MyceliumScene),
  { ssr: false }
)

const SPORE_COUNT = 24

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE },
})

export function Hero() {
  const t = useTranslations('home.hero')
  const sporeContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = sporeContainerRef.current
    if (!container) return

    const spores = Array.from({ length: SPORE_COUNT }, (_, i) => {
      const el = document.createElement('div')
      const size = Math.random() * 5 + 1.5
      const duration = Math.random() * 14 + 7
      const delay = Math.random() * 12
      const drift = (Math.random() - 0.5) * 220
      const type = i % 5 === 0 ? 'spore-violet' : i % 7 === 0 ? 'spore-gold' : ''

      el.className = `spore ${type}`
      el.style.cssText = `
        width:${size}px;
        height:${size}px;
        left:${Math.random() * 100}%;
        --duration:${duration}s;
        --delay:${delay}s;
        --drift:${drift}px;
        animation-delay:${delay}s;
      `
      container.appendChild(el)
      return el
    })

    return () => spores.forEach((s) => s.remove())
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-bg">
      {/* ── Video background (swap src with your mushroom timelapse) ── */}
      <div className="absolute inset-0 z-0">
        {/* Placeholder gradient that looks great even without a video */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#010608] via-bg to-[#08021a]" />

        {/* Uncomment & set src when you have a video file */}
        {/* <video
          className="hero-video opacity-25"
          autoPlay muted loop playsInline
          src="/video/mushroom-timelapse.mp4"
        /> */}

        {/* Ambient glows */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-accent/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet/[0.05] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-1/3 w-[300px] h-[300px] bg-gold/[0.03] rounded-full blur-[80px] pointer-events-none" />
      </div>

      {/* ── Three.js mycelium network ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <MyceliumScene className="absolute inset-0" />
      </div>

      {/* ── Spore particles ── */}
      <div
        ref={sporeContainerRef}
        className="absolute inset-0 z-[2] pointer-events-none overflow-hidden"
        aria-hidden="true"
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left column */}
          <div className="space-y-8">
            <motion.div {...fadeUp(0.1)} className="space-y-1">
              <span className="inline-flex items-center gap-2 font-mono text-accent text-xs uppercase tracking-[0.25em]">
                <span className="w-5 h-px bg-accent" />
                {t('eyebrow')}
                <span className="w-5 h-px bg-accent" />
              </span>
            </motion.div>

            <div className="space-y-2 overflow-hidden">
              <motion.h1 {...fadeUp(0.2)} className="leading-[0.9]">
                <span className="block font-heading text-cream text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                  {t('headline1')}
                </span>
              </motion.h1>
              <motion.div {...fadeUp(0.35)}>
                <span className="block font-display text-[4.5rem] sm:text-[6rem] lg:text-[7.5rem] leading-none tracking-[0.02em] text-gradient-biolum">
                  {t('headline2')}
                </span>
              </motion.div>
            </div>

            <motion.p {...fadeUp(0.5)} className="font-body text-cream-muted text-lg sm:text-xl max-w-md leading-relaxed">
              {t('subtext')}
            </motion.p>

            <motion.div {...fadeUp(0.6)} className="flex flex-col sm:flex-row gap-4">
              <Link href="/quiz">
                <Button
                  size="lg"
                  className="relative text-base w-full sm:w-auto bg-accent text-bg font-bold hover:bg-accent-hover glow-cyan border-0 transition-all duration-300 hover:scale-[1.03]"
                >
                  🍄 {t('ctaPrimary')}
                </Button>
              </Link>
              <Link href="/shop">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base w-full sm:w-auto border-accent/30 text-accent hover:border-accent hover:bg-accent/10 transition-all duration-300"
                >
                  {t('ctaSecondary')} →
                </Button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div {...fadeUp(0.75)} className="flex items-center gap-6 pt-2">
              <div className="flex -space-x-2">
                {['#004D3A', '#1A0050', '#3D2000', '#001A12', '#2A0060'].map((bg, i) => (
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
                <span className="text-accent font-semibold glow-cyan-text">350,000+</span>{' '}
                growers worldwide
              </p>
            </motion.div>
          </div>

          {/* Right column — floating stats + glowing orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex items-center justify-center relative"
          >
            <div className="relative w-full max-w-md aspect-square">
              {/* Central glowing orb */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Outer rings */}
                  <div className="absolute inset-[-80px] rounded-full border border-accent/10 animate-pulse" />
                  <div className="absolute inset-[-50px] rounded-full border border-accent/8 animate-pulse" style={{ animationDelay: '0.6s' }} />
                  <div className="absolute inset-[-20px] rounded-full border border-accent/12" />

                  {/* Mushroom SVG — now bioluminescent */}
                  <svg
                    viewBox="0 0 300 340"
                    className="w-72 h-80"
                    style={{ filter: 'drop-shadow(0 0 30px rgba(0,255,184,0.25)) drop-shadow(0 0 60px rgba(0,255,184,0.1))' }}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Stem */}
                    <path
                      d="M120 200 Q138 255 150 300 Q162 255 180 200"
                      fill="#071210"
                      stroke="#0D2E26"
                      strokeWidth="2"
                    />
                    {/* Cap base (underside) */}
                    <path
                      d="M78 210 Q92 200 120 200 L180 200 Q208 200 222 210"
                      fill="#0C1F1A"
                      stroke="#00FFB8"
                      strokeWidth="1.5"
                      strokeOpacity="0.5"
                    />
                    {/* Main cap */}
                    <path
                      d="M58 198 Q62 95 150 55 Q238 95 242 198 Z"
                      fill="#071210"
                      stroke="#00FFB8"
                      strokeWidth="2"
                      strokeOpacity="0.6"
                    />
                    {/* Cap highlight */}
                    <path
                      d="M100 155 Q128 98 150 88 Q172 98 180 138"
                      stroke="#00FFB8"
                      strokeWidth="1.5"
                      opacity="0.35"
                    />
                    {/* Bioluminescent inner glow */}
                    <ellipse cx="150" cy="140" rx="55" ry="65" fill="url(#glowGrad)" opacity="0.12" />
                    {/* Gills */}
                    {[90, 108, 126, 144, 162, 180, 198, 212].map((x, i) => (
                      <path
                        key={i}
                        d={`M${x} 200 Q${x + 8} ${185 - i * 2} ${x + 16} 200`}
                        stroke="#00FFB8"
                        strokeWidth="0.8"
                        opacity="0.3"
                      />
                    ))}
                    {/* Glowing spore dots */}
                    {[
                      { cx: 128, cy: 125, r: 3, opacity: 0.7 },
                      { cx: 170, cy: 108, r: 2, opacity: 0.6 },
                      { cx: 150, cy: 88, r: 3.5, opacity: 0.8 },
                      { cx: 108, cy: 145, r: 1.5, opacity: 0.5 },
                      { cx: 192, cy: 138, r: 2, opacity: 0.55 },
                      { cx: 45, cy: 95, r: 3, opacity: 0.2 },
                      { cx: 265, cy: 115, r: 2, opacity: 0.2 },
                      { cx: 38, cy: 155, r: 2, opacity: 0.15 },
                    ].map((dot, i) => (
                      <circle
                        key={i}
                        cx={dot.cx}
                        cy={dot.cy}
                        r={dot.r}
                        fill="#00FFB8"
                        opacity={dot.opacity}
                      />
                    ))}
                    <defs>
                      <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#00FFB8" />
                        <stop offset="100%" stopColor="#00FFB8" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Floating stat cards */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="absolute -left-8 top-14 glass rounded-2xl p-4 shadow-card"
              >
                <p className="text-xs text-cream-muted font-mono">Colonization</p>
                <p className="text-xl font-heading font-semibold text-cream mt-0.5">2–3 weeks</p>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-1 flex-1 rounded bg-accent/60" />
                  ))}
                  <div className="h-1 flex-1 rounded bg-ds-border" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="absolute -right-8 bottom-20 glass rounded-2xl p-4 shadow-card"
              >
                <p className="text-xs text-cream-muted font-mono">Beta-glucans</p>
                <p className="text-xl font-heading font-semibold text-accent glow-cyan-text mt-0.5">High</p>
                <p className="text-xs text-cream-muted mt-1">Immune support ✦</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.3 }}
                className="absolute right-0 top-4 glass rounded-xl px-3 py-2"
              >
                <p className="text-xs text-gold glow-gold font-mono">★ 4.9 / 5.0</p>
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
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-cream-muted/50 text-xs font-mono tracking-widest uppercase">scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-accent/50 to-transparent animate-pulse" />
      </motion.div>
    </section>
  )
}
