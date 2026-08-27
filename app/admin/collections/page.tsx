'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface AdminCollection {
  id: string
  slug: string
  titleEn: string
  _count: { products: number }
}

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<AdminCollection[] | null>(null)

  useEffect(() => {
    fetch('/api/admin/collections')
      .then((r) => r.json())
      .then((data) => setCollections(data.collections ?? []))
      .catch(() => setCollections([]))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-body font-bold text-2xl text-cream">Collections</h1>
        <Link
          href="/admin/collections/new"
          className="px-4 py-2 rounded-full bg-amber text-bg text-sm font-semibold hover:bg-amber-bright transition-colors"
        >
          New collection
        </Link>
      </div>

      {collections === null ? (
        <p className="text-cream-muted">Loading…</p>
      ) : collections.length === 0 ? (
        <p className="text-cream-muted">No collections yet.</p>
      ) : (
        <div className="border border-ds-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-elevated text-cream-muted">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Slug</th>
                <th className="text-left px-4 py-3 font-medium">Products</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {collections.map((c) => (
                <tr key={c.id} className="border-t border-ds-border">
                  <td className="px-4 py-3 text-cream">{c.titleEn}</td>
                  <td className="px-4 py-3 text-cream-muted font-mono text-xs">{c.slug}</td>
                  <td className="px-4 py-3 text-cream-muted">{c._count.products}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/collections/${c.id}`} className="text-accent hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
