'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { SpeciesCard } from '@/components/encyclopedia/SpeciesCard'
import { SpeciesFilter } from '@/components/encyclopedia/SpeciesFilter'
import { SPECIES_LIST } from '@/lib/species-data'
import { VideoMoment } from '@/components/ui/VideoMoment'

export default function EncyclopediaPage() {
  const t = useTranslations('encyclopedia')

  const [filters, setFilters] = useState({ type: 'all', difficulty: 'all', search: '' })

  const filtered = useMemo(() => {
    return SPECIES_LIST.filter((s) => {
      if (filters.type !== 'all' && s.type !== filters.type) return false
      if (filters.difficulty !== 'all' && s.difficulty !== filters.difficulty) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        return (
          s.commonName.toLowerCase().includes(q) ||
          s.scientificName.toLowerCase().includes(q) ||
          s.substrate.some((sub) => sub.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [filters])

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <div className="bg-surface border-b border-ds-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-3">
            Frontier Lab Encyclopedia
          </p>
          <h1 className="font-body font-bold text-4xl sm:text-5xl tracking-tight text-cream mb-4">
            {t('title')}
          </h1>
          <p className="text-cream-muted text-lg max-w-xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      <VideoMoment
        src="/video/grow-journey.mp4"
        eyebrow="Eight Species, One Standard"
        headline="Every profile below is grounded in real bioactive compounds, not vague wellness claims"
        subtext="Beta-glucans, ganoderic acids, cordycepin — we name the actual compound behind every benefit we list."
        align="center"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filter */}
          <aside className="lg:w-64 flex-shrink-0">
            <SpeciesFilter filters={filters} onChange={setFilters} />
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-cream-muted text-sm">
                Showing <span className="text-cream font-medium">{filtered.length}</span> of{' '}
                <span className="text-cream font-medium">{SPECIES_LIST.length}</span> species
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-12 h-12 text-cream-muted/40 mx-auto mb-4"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <p className="text-cream-muted">No species match your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((species, i) => (
                  <SpeciesCard key={species.id} species={species} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
