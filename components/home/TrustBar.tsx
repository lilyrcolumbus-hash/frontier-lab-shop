'use client'

import { useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const STAT_META = [
  {
    key: 'growers',
    color: 'text-accent',
    glow: 'rgba(158,104,32,0.07)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    key: 'lab',
    color: 'text-amber',
    glow: 'rgba(158,104,32,0.07)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    key: 'species',
    // Lavender is banned outright — gold stays reserved for the one CTA/emphasis role, so this
    // neutral warm-grey differentiates the icon without competing with it.
    color: 'text-cream-muted',
    glow: 'rgba(124,119,109,0.07)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
  },
  {
    key: 'guarantee',
    color: 'text-accent',
    glow: 'rgba(158,104,32,0.07)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
]

export function TrustBar() {
  const t = useTranslations('home.trust')

  const stats = STAT_META.map((meta) => ({
    ...meta,
    value: t(`${meta.key}Value`),
    label: t(`${meta.key}Label`),
  }))

  return (
    <div className="bg-surface border-y border-ds-border relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <div
                className="flex flex-col items-center text-center gap-3 p-6 rounded-none border border-ds-border transition-all duration-300 hover:border-accent/20 group"
                style={{ background: `radial-gradient(ellipse at center, ${stat.glow} 0%, transparent 70%)` }}
              >
                <span className={`${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`}>
                  {stat.icon}
                </span>
                <div>
                  <p className={`font-heading font-medium text-3xl tracking-tight ${stat.color}`}>{stat.value}</p>
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
