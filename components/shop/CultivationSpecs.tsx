'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import type { CultivationSpecs as CultivationSpecsType } from '@/types/product'

interface CultivationSpecsProps {
  specs: CultivationSpecsType
}

const icons = {
  clock: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  thermo: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/>
    </svg>
  ),
  layers: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
  harvest: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  location: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
}

const DIFFICULTY_CONFIG = {
  beginner:     { dots: 1, color: 'bg-accent',   text: 'text-accent',   label: 'Beginner' },
  intermediate: { dots: 2, color: 'bg-amber-600', text: 'text-amber-600', label: 'Intermediate' },
  advanced:     { dots: 3, color: 'bg-red-500',   text: 'text-red-500',  label: 'Advanced' },
}

export function CultivationSpecs({ specs }: CultivationSpecsProps) {
  const t = useTranslations('shop.product.specs')
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  const diff = DIFFICULTY_CONFIG[specs.difficulty]

  const rows = [
    { label: t('colonization'), value: specs.colonizationTime, icon: icons.clock },
    { label: t('fruitingTemp'), value: `${specs.fruitingTempF} / ${specs.fruitingTempC}`, icon: icons.thermo },
    { label: t('substrate'), value: specs.idealSubstrate, icon: icons.layers },
    { label: t('yield'), value: specs.expectedYield, icon: icons.harvest },
    {
      label: t('method'),
      value: specs.indoorOutdoor === 'indoor' ? 'Indoor' : specs.indoorOutdoor === 'outdoor' ? 'Outdoor' : 'Indoor & Outdoor',
      icon: icons.location,
    },
  ]

  return (
    <div ref={ref} className="rounded-2xl border border-ds-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-elevated border-b border-ds-border">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream-muted">{t('title')}</p>

        {/* Animated difficulty dots */}
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1">
            {[1, 2, 3].map((level) => (
              <motion.div
                key={level}
                className={cn(
                  'w-2 h-2 rounded-full',
                  level <= diff.dots ? diff.color : 'bg-ds-border'
                )}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{
                  delay: 0.2 + (level - 1) * 0.12,
                  type: 'spring',
                  stiffness: 400,
                  damping: 20,
                }}
              />
            ))}
          </div>
          <span className={cn('font-mono text-[9px] uppercase tracking-wider', diff.text)}>{diff.label}</span>
        </div>
      </div>

      {/* Rows with stagger */}
      <div className="grid grid-cols-2 divide-x divide-y divide-ds-border">
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            className={cn(
              'flex flex-col gap-1.5 p-4 bg-surface',
              i === rows.length - 1 && rows.length % 2 !== 0 && 'col-span-2'
            )}
            initial={{ opacity: 0, x: i % 2 === 0 ? -12 : 12 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-accent/55">{row.icon}</div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream-muted/50">{row.label}</p>
            <p className="text-sm text-cream font-medium leading-snug">{row.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
