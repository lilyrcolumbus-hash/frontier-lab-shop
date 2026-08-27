'use client'

import { useState, useMemo } from 'react'
import { SpeciesCard } from '@/components/encyclopedia/SpeciesCard'
import { SpeciesFilter } from '@/components/encyclopedia/SpeciesFilter'
import type { SpeciesData } from '@/lib/species-data'

export function EncyclopediaBrowser({ speciesList }: { speciesList: SpeciesData[] }) {
  const [filters, setFilters] = useState({ type: 'all', difficulty: 'all', search: '' })

  const filtered = useMemo(() => {
    return speciesList.filter((s) => {
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
  }, [speciesList, filters])

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-64 flex-shrink-0">
        <SpeciesFilter filters={filters} onChange={setFilters} />
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <p className="text-cream-muted text-sm">
            Showing <span className="text-cream font-medium">{filtered.length}</span> of{' '}
            <span className="text-cream font-medium">{speciesList.length}</span> species
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
  )
}
