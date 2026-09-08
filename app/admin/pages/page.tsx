'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useAdminList } from '@/components/admin/useAdminList'
import { ListState } from '@/components/admin/ListState'
import { DataTable, type DataTableColumn } from '@/components/admin/DataTable'
import { StatusPill } from '@/components/admin/StatusPill'

interface AdminPage {
  id: string
  slug: string
  titleEn: string
  status: string
  showInFooter: boolean
}

export default function AdminPagesPage() {
  const { data: pages, error, reload } = useAdminList<AdminPage>('/api/admin/pages', 'pages')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!pages) return []
    const q = query.trim().toLowerCase()
    if (!q) return pages
    return pages.filter((p) => p.titleEn.toLowerCase().includes(q) || p.slug.includes(q))
  }, [pages, query])

  const columns: DataTableColumn<AdminPage>[] = [
    { key: 'title', header: 'Page', render: (p) => <span className="font-medium text-cream">{p.titleEn}</span> },
    { key: 'slug', header: 'Address', render: (p) => <span className="font-mono text-xs text-cream-muted">/pages/{p.slug}</span> },
    { key: 'status', header: 'Status', render: (p) => <StatusPill status={p.status} /> },
    {
      key: 'footer',
      header: 'In footer',
      render: (p) => <span className="text-cream-muted">{p.showInFooter ? 'Yes' : '—'}</span>,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-medium text-2xl text-cream">Pages</h1>
        <Link
          href="/admin/pages/new"
          className="px-4 py-2 rounded-none bg-cream text-surface text-sm font-semibold hover:bg-cream/90 transition-colors"
        >
          Add page
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pages"
          className="w-full max-w-xs px-3.5 py-2 rounded-none border border-ds-border bg-surface text-sm text-cream placeholder:text-cream-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {pages === null ? (
        <ListState error={error} onRetry={reload} />
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          rowHref={(p) => `/admin/pages/${p.id}`}
          emptyLabel={query ? 'No pages match your search.' : 'No pages yet.'}
        />
      )}
    </div>
  )
}
