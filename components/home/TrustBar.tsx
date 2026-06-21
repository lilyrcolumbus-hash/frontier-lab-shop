'use client'

import { useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const STATS = [
  {
    key: 'growers' as const,
    value: '350K+',
    label: 'Active Growers',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: 'accent' as const,
  },
  {
    key: 'organic' as const,
    value: '100%',
    label: 'Organic Certified',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    color: 'violet' as const,
  },
  {
    key: 'species' as const,
    value: '50+',
    label: 'Species in Database',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    color: 'gold' as const,
  },
  {
    key: 'guarantee' as const,
    value: '30-day',
    label: 'Growth Guarantee',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    color: 'accent' as const,
  },
]

const colorMap = {
  accent: 'text-accent',
  violet: 'text-violet',
  gold: 'text-gold',
}

const glowMap = {
  accent: 'rgba(0,255,184,0.15)',
  violet: 'rgba(124,58,237,0.15)',
  gold: 'rgba(255,174,0,0.12)',
}

export function TrustBar() {
  const t = useTranslations('home.trust')

  return (
    <div className="bg-surface border-y border-ds-border relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 mycelium-bg opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <ScrollReveal key={stat.key} delay={i * 0.1} direction="up">
              <div
                className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-ds-border transition-all duration-300 hover:border-accent/20 group"
                style={{ background: `radial-gradient(ellipse at center, ${glowMap[stat.color]} 0%, transparent 70%)` }}
              >
                <span className={`${colorMap[stat.color]} transition-transform duration-300 group-hover:scale-110`}>
                  {stat.icon}
                </span>
                <div>
                  <p className={`font-display text-3xl ${colorMap[stat.color]}`}>{stat.value}</p>
                  <p className="text-xs text-cream-muted mt-0.5 font-mono">{stat.label}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  )
}
