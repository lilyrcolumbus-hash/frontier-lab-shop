'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { useAdminList } from '@/components/admin/useAdminList'
import { ListState } from '@/components/admin/ListState'
import { DataTable, Thumbnail, type DataTableColumn } from '@/components/admin/DataTable'
import { StatusPill } from '@/components/admin/StatusPill'

interface AdminProduct {
  id: string
  slug: string
  nameEn: string
  category: string
  price: number
  inStock: boolean
  status: string
  images: string[]
}

export default function AdminProductsPage() {
  const { data: products, error, reload } = useAdminList<AdminProduct>('/api/admin/products', 'products')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!products) return []
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => p.nameEn.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  }, [products, query])

  const columns: DataTableColumn<AdminProduct>[] = [
    {
      key: 'name',
      header: 'Product',
      render: (p) => (
        <div className="flex items-center gap-3">
          <Thumbnail src={p.images[0]} alt={p.nameEn} />
          <span className="font-medium text-cream">{p.nameEn}</span>
        </div>
      ),
    },
    { key: 'status', header: 'Status', render: (p) => <StatusPill status={p.status} /> },
    { key: 'category', header: 'Category', render: (p) => <span className="text-cream-muted">{p.category}</span> },
    {
      key: 'inventory',
      header: 'Inventory',
      render: (p) => <span className="text-cream-muted">{p.inStock ? 'In stock' : 'Out of stock'}</span>,
    },
    { key: 'price', header: 'Price', align: 'right', render: (p) => formatPrice(p.price) },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-body font-bold text-2xl text-cream">Products</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 rounded-lg bg-cream text-surface text-sm font-semibold hover:bg-cream/90 transition-colors"
        >
          Add product
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products"
          className="w-full max-w-xs px-3.5 py-2 rounded-lg border border-ds-border bg-surface text-sm text-cream placeholder:text-cream-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {products === null ? (
        <ListState error={error} onRetry={reload} />
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          rowHref={(p) => `/admin/products/${p.id}`}
          emptyLabel={query ? 'No products match your search.' : 'No products yet.'}
        />
      )}
    </div>
  )
}
