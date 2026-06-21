'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

const SPORE_COUNT = 20

export function Hero() {
  const t = useTranslations('home.hero')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const spores = Array.from({ length: SPORE_COUNT }, (_, i) => {
      const el = document.createElement('div')
      const size = Math.random() * 6 + 2
      const duration = Math.random() * 12 + 8
      const delay = Math.random() * 10
      const drift = (Math.random() - 0.5) * 200

      el.className = 'spore'
      el.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        --duration: ${duration}s;
        --delay: ${delay}s;
        --drift: ${drift}px;
        animation-delay: ${delay}s;
      `
      container.appendChild(el)
      return el
    })

    return () => spores.forEach((s) => s.remove())
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-bg">
      {/* Spore container */}
      <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true" />

      {/* Background radial gradients */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-moss/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="font-body font-light uppercase tracking-[0.2em] text-moss text-sm">
                {t('eyebrow')}
              </p>
              <h1 className="leading-none">
                <span className="block font-heading text-cream text-5xl sm:text-6xl lg:text-7xl font-bold">
                  {t('headline1')}
                </span>
                <span
                  className="block font-display text-7xl sm:text-8xl lg:text-9xl leading-none tracking-[0.02em]"
                  style={{ color: '#C45E2A' }}
                >
                  {t('headline2')}
                </span>
              </h1>
              <p className="font-body text-cream-muted text-lg sm:text-xl mt-4 max-w-md">
                {t('subtext')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/quiz">
                <Button size="lg" className="text-base w-full sm:w-auto">
                  🍄 {t('ctaPrimary')}
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline" size="lg" className="text-base w-full sm:w-auto">
                  {t('ctaSecondary')} →
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-elevated border-2 border-bg flex items-center justify-center text-xs"
                    style={{ backgroundColor: `hsl(${i * 40 + 120}, 30%, 25%)` }}
                  >
                    🍄
                  </div>
                ))}
              </div>
              <p className="text-sm text-cream-muted">
                <span className="text-cream font-medium">350,000+</span> growers worldwide
              </p>
            </div>
          </div>

          {/* Right — decorative mushroom illustration */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="relative w-full max-w-lg aspect-square">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full border border-accent/10 animate-pulse" />
              <div className="absolute inset-8 rounded-full border border-moss/10 animate-pulse" style={{ animationDelay: '0.5s' }} />

              {/* Central mushroom placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Mushroom SVG illustration */}
                  <svg
                    viewBox="0 0 300 340"
                    className="w-72 h-80 drop-shadow-[0_0_40px_rgba(196,94,42,0.2)]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Stem */}
                    <path
                      d="M120 200 Q140 260 150 300 Q160 260 180 200"
                      fill="#1E3828"
                      stroke="#2A4A35"
                      strokeWidth="2"
                    />
                    {/* Cap base */}
                    <path
                      d="M80 210 Q90 200 120 200 L180 200 Q210 200 220 210"
                      fill="#162B1D"
                      stroke="#C45E2A"
                      strokeWidth="1.5"
                    />
                    {/* Main cap */}
                    <path
                      d="M60 200 Q60 100 150 60 Q240 100 240 200 Z"
                      fill="#1E3828"
                      stroke="#C45E2A"
                      strokeWidth="2"
                    />
                    {/* Cap highlight */}
                    <path
                      d="M100 160 Q130 100 150 90 Q170 100 180 140"
                      stroke="#C45E2A"
                      strokeWidth="1"
                      opacity="0.4"
                    />
                    {/* Gills */}
                    <path d="M90 200 Q100 185 110 200" stroke="#4A7C59" strokeWidth="1" opacity="0.6" />
                    <path d="M110 200 Q120 180 130 200" stroke="#4A7C59" strokeWidth="1" opacity="0.6" />
                    <path d="M130 200 Q140 175 150 200" stroke="#4A7C59" strokeWidth="1" opacity="0.6" />
                    <path d="M150 200 Q160 175 170 200" stroke="#4A7C59" strokeWidth="1" opacity="0.6" />
                    <path d="M170 200 Q180 180 190 200" stroke="#4A7C59" strokeWidth="1" opacity="0.6" />
                    <path d="M190 200 Q200 185 210 200" stroke="#4A7C59" strokeWidth="1" opacity="0.6" />
                    {/* Spore dots */}
                    <circle cx="130" cy="130" r="2" fill="#C45E2A" opacity="0.6" />
                    <circle cx="170" cy="110" r="1.5" fill="#C45E2A" opacity="0.5" />
                    <circle cx="150" cy="90" r="2.5" fill="#C45E2A" opacity="0.7" />
                    <circle cx="110" cy="150" r="1" fill="#C45E2A" opacity="0.4" />
                    <circle cx="190" cy="140" r="1.5" fill="#C45E2A" opacity="0.5" />
                    {/* Floating spores */}
                    <circle cx="50" cy="100" r="3" fill="#C45E2A" opacity="0.2" />
                    <circle cx="270" cy="120" r="2" fill="#4A7C59" opacity="0.3" />
                    <circle cx="40" cy="160" r="2" fill="#C45E2A" opacity="0.15" />
                    <circle cx="260" cy="80" r="4" fill="#4A7C59" opacity="0.15" />
                  </svg>
                </div>
              </div>

              {/* Floating stats cards */}
              <div className="absolute -left-4 top-16 bg-elevated border border-ds-border rounded-2xl p-4 shadow-card">
                <p className="text-xs text-cream-muted">Colonization</p>
                <p className="text-lg font-heading font-semibold text-cream">2–3 weeks</p>
              </div>
              <div className="absolute -right-4 bottom-24 bg-elevated border border-ds-border rounded-2xl p-4 shadow-card">
                <p className="text-xs text-cream-muted">Beta-glucans</p>
                <p className="text-lg font-heading font-semibold text-success">High</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
    </section>
  )
}
