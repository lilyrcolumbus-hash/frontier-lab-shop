'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/Badge'
import type { Species } from '@/types/species'

interface SpeciesCardProps {
  species: Species
  index?: number
}

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export function SpeciesCard({ species, index = 0 }: SpeciesCardProps) {
  const locale = useLocale() as 'en' | 'es'
  const tc = useTranslations('common')
  const [scrambled, setScrambled] = useState(species.scientificName)
  const scrambleTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const startScramble = () => {
    const target = species.scientificName
    let iteration = 0
    clearInterval(scrambleTimer.current ?? undefined)
    scrambleTimer.current = setInterval(() => {
      setScrambled(
        target.split('').map((char, i) => {
          if (char === ' ') return ' '
          if (i < iteration) return target[i]
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        }).join('')
      )
      iteration += 0.6
      if (iteration >= target.length) {
        clearInterval(scrambleTimer.current ?? undefined)
        setScrambled(target)
      }
    }, 35)
  }

  const stopScramble = () => {
    clearInterval(scrambleTimer.current ?? undefined)
    setScrambled(species.scientificName)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-4% 0px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/encyclopedia/${species.slug}`}>
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={startScramble}
          onMouseLeave={stopScramble}
          className="overflow-hidden rounded-none border border-ds-border bg-surface shadow-sm hover:shadow-[0_20px_60px_-8px_rgba(61,110,69,0.28)] hover:border-accent/30 transition-all duration-500 h-full flex flex-col group"
        >
          {/* Image */}
          <div className="relative h-52 overflow-hidden flex-shrink-0 bg-elevated">
            {species.thumbnailUrl ? (
              <img
                src={species.thumbnailUrl}
                alt={species.commonName}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-elevated">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-cream-muted/30">
                  <path d="M32 8C18 8 8 18 8 28c0 4 4 6 8 6h5l-2 18h26l-2-18h5c4 0 8-2 8-6C56 18 46 8 32 8z" />
                </svg>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber/70">AI Image Pending</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-elevated/80 via-transparent to-transparent" />
            <div className="absolute top-3 right-3">
              <Badge
                variant={species.type === 'medicinal' ? 'accent' : species.type === 'toxic' ? 'error' : 'moss'}
                size="sm"
              >
                {tc(species.type)}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col gap-2 flex-1">
            <div>
              <h3 className="font-body text-xl font-semibold text-cream">{species.commonName}</h3>
              <p className="font-mono text-xs text-cream-muted/60 italic mt-0.5 tabular-nums tracking-wide">
                {scrambled}
              </p>
            </div>
            <p className="text-sm text-cream-muted leading-relaxed line-clamp-2 flex-1">
              {species.description[locale]}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Badge
                variant={species.difficulty === 'beginner' ? 'success' : species.difficulty === 'intermediate' ? 'warning' : 'error'}
                size="sm"
              >
                {tc(species.difficulty)}
              </Badge>
              <Badge variant="outline" size="sm">
                {tc(species.indoorOutdoor === 'indoor' ? 'indoor' : species.indoorOutdoor === 'outdoor' ? 'outdoor' : 'both')}
              </Badge>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
