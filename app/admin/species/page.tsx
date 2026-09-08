'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useAdminList } from '@/components/admin/useAdminList'
import { ListState } from '@/components/admin/ListState'
import { DataTable, Thumbnail, type DataTableColumn } from '@/components/admin/DataTable'

interface AdminSpecies {
  id: string
  slug: string
  commonName: string
  scientificName: string
  difficulty: string
  thumbnailUrl: string
}

export default function AdminSpeciesPage() {
  const { data: species, error, reload } = useAdminList<AdminSpecies>('/api/admin/species', 'species')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!species) return []
    const q = query.trim().toLowerCase()
    if (!q) return species
    return species.filter(
      (s) => s.commonName.toLowerCase().includes(q) || s.scientificName.toLowerCase().includes(q)
    )
  }, [species, query])

  const columns: DataTableColumn<AdminSpecies>[] = [
    {
      key: 'name',
      header: 'Species',
      render: (s) => (
        <div className="flex items-center gap-3">
          <Thumbnail src={s.thumbnailUrl} alt={s.commonName} />
          <div>
            <div className="font-medium text-cream">{s.commonName}</div>
            <div className="text-xs italic text-cream-muted">{s.scientificName}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'difficulty',
      header: 'Difficulty',
      render: (s) => <span className="text-cream-muted capitalize">{s.difficulty}</span>,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-medium text-2xl text-cream">Species</h1>
        <Link
          href="/admin/species/new"
          className="px-4 py-2 rounded-none bg-cream text-surface text-sm font-semibold hover:bg-cream/90 transition-colors"
        >
          Add species
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search species"
          className="w-full max-w-xs px-3.5 py-2 rounded-none border border-ds-border bg-surface text-sm text-cream placeholder:text-cream-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {species === null ? (
        <ListState error={error} onRetry={reload} />
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          rowHref={(s) => `/admin/species/${s.id}`}
          emptyLabel={query ? 'No species match your search.' : 'No species yet.'}
        />
      )}
    </div>
  )
}
