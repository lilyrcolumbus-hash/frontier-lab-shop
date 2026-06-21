'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface FilterState {
  type: string
  difficulty: string
  search: string
}

interface SpeciesFilterProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

const TYPES = ['all', 'edible', 'medicinal', 'toxic', 'psychoactive', 'wild-only']
const DIFFICULTIES = ['all', 'beginner', 'intermediate', 'advanced']
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export function SpeciesFilter({ filters, onChange }: SpeciesFilterProps) {
  const t = useTranslations('encyclopedia.filters')
  const tc = useTranslations('common')

  const set = (key: keyof FilterState, value: string) =>
    onChange({ ...filters, [key]: value })

  return (
    <div className="space-y-6 p-6 bg-elevated rounded-2xl border border-ds-border sticky top-24">
      {/* Search */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-cream-muted mb-2">
          Search
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-muted"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            placeholder="Search species..."
            className="w-full bg-surface border border-ds-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-cream placeholder:text-cream-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
          />
        </div>
      </div>

      {/* Type */}
      <div>
        <p className="text-xs uppercase tracking-wider text-cream-muted mb-2">{t('type')}</p>
        <div className="flex flex-col gap-1">
          {TYPES.map((type) => (
            <button
              key={type}
              onClick={() => set('type', type)}
              className={cn(
                'text-left text-sm px-3 py-2 rounded-xl transition-colors',
                filters.type === type
                  ? 'bg-accent/20 text-accent font-medium'
                  : 'text-cream-muted hover:text-cream hover:bg-surface'
              )}
            >
              {type === 'all' ? t('all') : tc(type as 'edible')}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <p className="text-xs uppercase tracking-wider text-cream-muted mb-2">{t('difficulty')}</p>
        <div className="flex flex-col gap-1">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => set('difficulty', d)}
              className={cn(
                'text-left text-sm px-3 py-2 rounded-xl transition-colors',
                filters.difficulty === d
                  ? 'bg-accent/20 text-accent font-medium'
                  : 'text-cream-muted hover:text-cream hover:bg-surface'
              )}
            >
              {d === 'all' ? 'All levels' : tc(d as 'beginner')}
            </button>
          ))}
        </div>
      </div>

      {/* A–Z */}
      <div>
        <p className="text-xs uppercase tracking-wider text-cream-muted mb-2">{t('alphabetical')}</p>
        <div className="flex flex-wrap gap-1">
          {ALPHABET.map((letter) => (
            <button
              key={letter}
              onClick={() => set('search', letter)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-xs text-cream-muted hover:text-cream hover:bg-surface transition-colors"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {(filters.type !== 'all' || filters.difficulty !== 'all' || filters.search) && (
        <button
          onClick={() => onChange({ type: 'all', difficulty: 'all', search: '' })}
          className="w-full text-sm text-accent hover:text-accent-hover transition-colors"
        >
          {t('clearFilters')}
        </button>
      )}
    </div>
  )
}
