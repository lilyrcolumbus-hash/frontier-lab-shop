'use client'

import { useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const STATS = [
  {
    value: '350K+',
    label: 'Active Growers',
    icon: '🌿',
    color: 'text-accent',
    glow: 'rgba(107,191,106,0.08)',
  },
  {
    value: '100%',
    label: 'Organic Certified',
    icon: '🛡️',
    color: 'text-amber',
    glow: 'rgba(212,145,58,0.08)',
  },
  {
    value: '50+',
    label: 'Species in Database',
    icon: '🍄',
    color: 'text-lavender',
    glow: 'rgba(139,107,181,0.08)',
  },
  {
    value: '30-day',
    label: 'Growth Guarantee',
    icon: '✦',
    color: 'text-accent',
    glow: 'rgba(107,191,106,0.08)',
  },
]

export function TrustBar() {
  const t = useTranslations('home.trust')

  return (
    <div className="bg-surface border-y border-ds-border relative overflow-hidden">
      <div className="absolute inset-0 forest-bg opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <div
                className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-ds-border transition-all duration-400 hover:border-amber/20 group"
                style={{ background: `radial-gradient(ellipse at center, ${stat.glow} 0%, transparent 70%)` }}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </span>
                <div>
                  <p className={`font-display text-3xl ${stat.color}`}>{stat.value}</p>
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
