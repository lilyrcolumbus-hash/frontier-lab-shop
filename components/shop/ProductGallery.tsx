'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
  alt: string
}

const SLOTS = [
  {
    label: 'Product Shot',
    hint: 'Syringe & packaging',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 4l5.5 5.5-9 9-3 .5.5-3 6-6z" /><path d="M12 6.5l5 5" />
      </svg>
    ),
    iconSm: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 4l5.5 5.5-9 9-3 .5.5-3 6-6z" />
      </svg>
    ),
  },
  {
    label: "What's Included",
    hint: 'Needle · swab · card',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    iconSm: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      </svg>
    ),
  },
  {
    label: 'Fruiting Results',
    hint: 'The mushroom you grow',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12" /><path d="M5 12a7 7 0 0114 0H5z" /><path d="M9 12v2a3 3 0 006 0v-2" />
      </svg>
    ),
    iconSm: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12" /><path d="M5 12a7 7 0 0114 0H5z" />
      </svg>
    ),
  },
  {
    label: 'Culture Detail',
    hint: 'Live mycelium close-up',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /><path d="M11 8v6m-3-3h6" />
      </svg>
    ),
    iconSm: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
]

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0)

  if (!images.length) {
    const slot = SLOTS[active]
    return (
      <div className="flex flex-col gap-3">
        {/* Main placeholder */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative aspect-square rounded-2xl border border-ds-border overflow-hidden bg-elevated"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-surface via-elevated to-surface" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="text-cream-muted/25">{slot.icon}</div>
              <div className="text-center space-y-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent/60">{slot.label}</p>
                <p className="text-sm text-cream-muted/40">{slot.hint}</p>
              </div>
              <div className="mt-1 px-4 py-1.5 rounded-full border border-dashed border-cream-muted/15">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream-muted/25">Photo coming soon</span>
              </div>
            </div>
            {/* Slot counter */}
            <div className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-widest text-cream-muted/20">
              {active + 1} / {SLOTS.length}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Thumbnail slots */}
        <div className="flex gap-2">
          {SLOTS.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={s.label}
              className={cn(
                'flex-1 aspect-square rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-1 p-1',
                active === i
                  ? 'border-accent bg-accent/8'
                  : 'border-ds-border bg-elevated hover:border-accent/30 hover:bg-elevated'
              )}
            >
              <div className={cn('transition-colors duration-200', active === i ? 'text-accent/70' : 'text-cream-muted/25')}>
                {s.iconSm}
              </div>
              <span className={cn(
                'font-mono text-[7px] uppercase tracking-wider leading-tight text-center px-0.5 transition-colors duration-200',
                active === i ? 'text-accent/60' : 'text-cream-muted/25'
              )}>
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative aspect-square bg-elevated rounded-2xl overflow-hidden border border-ds-border"
        >
          <img
            src={images[active]}
            alt={`${alt} - image ${active + 1}`}
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() => setActive((a) => (a - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-bg/80 backdrop-blur-sm rounded-full border border-ds-border text-cream flex items-center justify-center hover:bg-elevated transition-colors"
                aria-label="Previous image"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button
                onClick={() => setActive((a) => (a + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-bg/80 backdrop-blur-sm rounded-full border border-ds-border text-cream flex items-center justify-center hover:bg-elevated transition-colors"
                aria-label="Next image"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200',
                active === i ? 'border-accent' : 'border-ds-border hover:border-accent/50'
              )}
              aria-label={`View image ${i + 1}`}
            >
              <img src={src} alt={`${alt} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
