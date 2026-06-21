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

          {/* Right column — real mushroom photography */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.35, ease: EASE }}
            className="hidden lg:flex items-center justify-center relative"
          >
            <div className="relative w-full max-w-md">
              {/* Ambient glow behind */}
              <div className="absolute -inset-6 bg-amber/[0.07] rounded-[2.5rem] blur-3xl pointer-events-none" />

              {/* Main hero photo */}
              <div className="relative rounded-3xl overflow-hidden border border-amber/20 shadow-[0_0_80px_rgba(212,145,58,0.15)]">
                <img
                  src="https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=600&h=680&q=85&auto=format&fit=crop"
                  alt="Lion's Mane mushroom — Hericium erinaceus"
                  className="w-full h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/10 to-transparent" />
                {/* Species label at bottom */}
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-mono text-[10px] text-amber/60 uppercase tracking-[0.2em] mb-1">Featured species</p>
                  <p className="font-heading text-cream text-xl font-semibold leading-tight">Lion's Mane</p>
                  <p className="font-mono text-cream-muted/50 text-xs italic">Hericium erinaceus</p>
                </div>
              </div>

              {/* Secondary photo — bottom left overlap */}
              <motion.div
                initial={{ opacity: 0, x: -16, y: 8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.7, delay: 1.0 }}
                className="absolute -left-14 bottom-24 w-36 h-36 rounded-2xl overflow-hidden border-2 border-bg/80 shadow-xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=300&h=300&q=85&auto=format&fit=crop"
                  alt="Blue Oyster mushroom cluster"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/70 to-transparent" />
                <div className="absolute bottom-2 left-2.5">
                  <p className="text-[10px] font-mono text-cream/80">Blue Oyster</p>
                </div>
              </motion.div>

              {/* Floating card — colonization */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 1.1 }}
                className="absolute -right-10 top-14 glass-warm rounded-2xl p-4 shadow-card"
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

              {/* Floating card — beta-glucans */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 1.3 }}
                className="absolute -right-10 bottom-32 glass-warm rounded-2xl p-4 shadow-card"
              >
                <p className="text-xs text-cream-muted/70 font-mono">Beta-glucans</p>
                <p className="text-xl font-heading font-semibold text-amber glow-amber-text mt-0.5">High</p>
                <p className="text-xs text-cream-muted/60 mt-1">Immune support ✦</p>
              </motion.div>

              {/* Rating pill */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                className="absolute right-4 top-4 glass-warm rounded-xl px-3 py-2"
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
