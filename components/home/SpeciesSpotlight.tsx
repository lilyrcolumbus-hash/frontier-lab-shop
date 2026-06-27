'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/Badge'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const SEED_SPECIES = [
  { slug: 'blue-oyster', commonName: 'Blue Oyster', scientificName: 'Pleurotus ostreatus', difficulty: 'beginner', type: 'edible', thumbnailUrl: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=500' },
  { slug: 'lions-mane', commonName: "Lion's Mane", scientificName: 'Hericium erinaceus', difficulty: 'intermediate', type: 'medicinal', thumbnailUrl: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=500' },
  { slug: 'shiitake', commonName: 'Shiitake', scientificName: 'Lentinula edodes', difficulty: 'intermediate', type: 'edible', thumbnailUrl: 'https://images.unsplash.com/photo-1585155784229-aff921ccfa12?w=500' },
  { slug: 'reishi', commonName: 'Reishi', scientificName: 'Ganoderma lucidum', difficulty: 'advanced', type: 'medicinal', thumbnailUrl: 'https://images.unsplash.com/photo-1504470695779-75300268aa0e?w=500' },
  { slug: 'pink-oyster', commonName: 'Pink Oyster', scientificName: 'Pleurotus djamor', difficulty: 'beginner', type: 'edible', thumbnailUrl: 'https://images.unsplash.com/photo-1773600149997-2b6af77031d7?w=500' },
  { slug: 'yellow-oyster', commonName: 'Yellow Oyster', scientificName: 'Pleurotus citrinopileatus', difficulty: 'beginner', type: 'edible', thumbnailUrl: 'https://images.unsplash.com/photo-1748118869505-e75f25812a70?w=500' },
]

const difficultyMap: Record<string, 'success' | 'warning' | 'error'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error',
}

export function SpeciesSpotlight() {
  const t = useTranslations('home.spotlight')
  const tc = useTranslations('common')
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-10% 0px' })

  return (
    <section ref={sectionRef} className="py-28 bg-bg relative overflow-hidden">
      {/* Background ambient */}
      <div className="absolute inset-0 mycelium-bg pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="flex items-end justify-between mb-16">
          <div>
            <div className="section-divider mb-4" />
            <h2 className="font-body font-bold text-3xl sm:text-4xl text-cream tracking-tight">
              {t('title')}
            </h2>
            <p className="text-cream-muted mt-3 text-lg max-w-lg">
              From beginner-friendly to expert-level cultivation — explore the full spectrum.
            </p>
          </div>
          <Link
            href="/encyclopedia"
            className="hidden sm:flex items-center gap-2 text-sm font-mono text-accent hover:text-cream transition-colors group"
          >
            View all →
            <span className="w-0 group-hover:w-4 h-px bg-accent transition-all duration-300" />
          </Link>
        </ScrollReveal>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SEED_SPECIES.map((species, i) => (
            <motion.div
              key={`${species.slug}-${species.scientificName}`}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={`/encyclopedia/${species.slug}`} className="group block h-full">
                <div className="relative overflow-hidden rounded-2xl border border-ds-border bg-surface h-full transition-all duration-500 hover:border-accent/30 hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={species.thumbnailUrl}
                      alt={species.commonName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
                    {/* Hover glow overlay */}
                    <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-500" />

                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-body text-base font-semibold text-cream group-hover:text-accent transition-colors duration-300">
                          {species.commonName}
                        </h3>
                        <p className="font-mono-lab text-xs text-cream-muted/70 italic mt-0.5">
                          {species.scientificName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant={difficultyMap[species.difficulty]}>
                        {tc(species.difficulty)}
                      </Badge>
                      <Badge variant={species.type === 'medicinal' ? 'accent' : 'moss'}>
                        {tc(species.type)}
                      </Badge>
                    </div>

                    {/* Bottom CTA line */}
                    <div className="flex items-center gap-1 mt-4 text-xs text-cream-muted/60 font-mono group-hover:text-accent transition-colors duration-300">
                      <span>View species</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </div>
                  </div>

                  {/* Glow bottom border on hover */}
                  <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile link */}
        <div className="mt-10 text-center sm:hidden">
          <Link href="/encyclopedia" className="text-sm font-mono text-accent">
            View encyclopedia →
          </Link>
        </div>
      </div>
    </section>
  )
}
