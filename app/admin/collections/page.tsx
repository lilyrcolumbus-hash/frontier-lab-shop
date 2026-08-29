'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useAdminList } from '@/components/admin/useAdminList'
import { ListState } from '@/components/admin/ListState'
import { DataTable, Thumbnail, type DataTableColumn } from '@/components/admin/DataTable'

interface AdminCollection {
  id: string
  slug: string
  titleEn: string
  image: string | null
  _count: { products: number }
}

export default function AdminCollectionsPage() {
  const { data: collections, error, reload } = useAdminList<AdminCollection>('/api/admin/collections', 'collections')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!collections) return []
    const q = query.trim().toLowerCase()
    if (!q) return collections
    return collections.filter((c) => c.titleEn.toLowerCase().includes(q))
  }, [collections, query])

  const columns: DataTableColumn<AdminCollection>[] = [
    {
      key: 'title',
      header: 'Collection',
      render: (c) => (
        <div className="flex items-center gap-3">
          <Thumbnail src={c.image} alt={c.titleEn} />
          <div>
            <div className="font-medium text-cream">{c.titleEn}</div>
            <div className="text-xs font-mono text-cream-muted">{c.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'products',
      header: 'Products',
      render: (c) => <span className="text-cream-muted">{c._count.products}</span>,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-body font-bold text-2xl text-cream">Collections</h1>
        <Link
          href="/admin/collections/new"
          className="px-4 py-2 rounded-lg bg-cream text-surface text-sm font-semibold hover:bg-cream/90 transition-colors"
        >
          Add collection
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search collections"
          className="w-full max-w-xs px-3.5 py-2 rounded-lg border border-ds-border bg-surface text-sm text-cream placeholder:text-cream-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {collections === null ? (
        <ListState error={error} onRetry={reload} />
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          rowHref={(c) => `/admin/collections/${c.id}`}
          emptyLabel={query ? 'No collections match your search.' : 'No collections yet.'}
        />
      )}
    </div>
  )
}
