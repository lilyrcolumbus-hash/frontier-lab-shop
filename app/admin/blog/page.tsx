'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useAdminList } from '@/components/admin/useAdminList'
import { ListState } from '@/components/admin/ListState'
import { DataTable, Thumbnail, type DataTableColumn } from '@/components/admin/DataTable'
import { StatusPill } from '@/components/admin/StatusPill'

interface AdminPost {
  id: string
  slug: string
  titleEn: string
  status: string
  coverImage: string | null
  publishedAt: string | null
}

export default function AdminBlogPage() {
  const { data: posts, error, reload } = useAdminList<AdminPost>('/api/admin/posts', 'posts')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!posts) return []
    const q = query.trim().toLowerCase()
    if (!q) return posts
    return posts.filter((p) => p.titleEn.toLowerCase().includes(q) || p.slug.includes(q))
  }, [posts, query])

  const columns: DataTableColumn<AdminPost>[] = [
    {
      key: 'title',
      header: 'Post',
      render: (p) => (
        <div className="flex items-center gap-3">
          <Thumbnail src={p.coverImage} alt={p.titleEn} />
          <span className="font-medium text-cream">{p.titleEn}</span>
        </div>
      ),
    },
    { key: 'status', header: 'Status', render: (p) => <StatusPill status={p.status} /> },
    {
      key: 'date',
      header: 'Published',
      render: (p) => (
        <span className="text-cream-muted">
          {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : '—'}
        </span>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-body font-bold text-2xl text-cream">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2 rounded-lg bg-cream text-surface text-sm font-semibold hover:bg-cream/90 transition-colors"
        >
          Add post
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts"
          className="w-full max-w-xs px-3.5 py-2 rounded-lg border border-ds-border bg-surface text-sm text-cream placeholder:text-cream-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {posts === null ? (
        <ListState error={error} onRetry={reload} />
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          rowHref={(p) => `/admin/blog/${p.id}`}
          emptyLabel={query ? 'No posts match your search.' : 'No posts yet.'}
        />
      )}
    </div>
  )
}
