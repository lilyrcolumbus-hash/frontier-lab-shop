'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
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
  const [species, setSpecies] = useState<AdminSpecies[] | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetch('/api/admin/species')
      .then((r) => r.json())
      .then((data) => setSpecies(data.species ?? []))
      .catch(() => setSpecies([]))
  }, [])

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
        <h1 className="font-body font-bold text-2xl text-cream">Species</h1>
        <Link
          href="/admin/species/new"
          className="px-4 py-2 rounded-full bg-amber text-bg text-sm font-semibold hover:bg-amber-bright transition-colors"
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
          className="w-full max-w-xs px-3.5 py-2 rounded-lg border border-ds-border bg-surface text-sm text-cream placeholder:text-cream-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {species === null ? (
        <p className="text-cream-muted">Loading…</p>
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
