'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { useAdminList } from '@/components/admin/useAdminList'
import { ListState } from '@/components/admin/ListState'
import { DataTable, Thumbnail, type DataTableColumn } from '@/components/admin/DataTable'
import { StatusPill } from '@/components/admin/StatusPill'
import { ProductBulkBar } from '@/components/admin/ProductBulkBar'
import { ProductImportButton } from '@/components/admin/ProductImportButton'

interface AdminProduct {
  id: string
  variants: { id: string; stock: number }[]
  slug: string
  nameEn: string
  category: string
  price: number
  inStock: boolean
  status: string
  images: string[]
}

export default function AdminProductsPage() {
  const { data: products, meta, error, reload } = useAdminList<AdminProduct>('/api/admin/products', 'products')
  const lowStockThreshold = Number(meta.lowStockThreshold ?? 0)
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

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
      render: (p) => {
        const units = p.variants.reduce((sum, v) => sum + v.stock, 0)
        // A warning only means something once the owner has set a threshold in Settings.
        const isLow = lowStockThreshold > 0 && units > 0 && units <= lowStockThreshold
        if (!p.inStock) return <span className="text-cream-muted">Out of stock</span>
        return (
          <span className={isLow ? 'text-amber' : 'text-cream-muted'}>
            {units} in stock{isLow && ' · low'}
          </span>
        )
      },
    },
    { key: 'price', header: 'Price', align: 'right', render: (p) => formatPrice(p.price) },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-body font-bold text-2xl text-cream">Products</h1>
        <div className="flex items-center gap-2">
          <ProductImportButton
            onDone={() => {
              setSelectedIds([])
              void reload()
            }}
          />
          <a
            href="/api/admin/products/export"
            className="px-4 py-2 rounded-lg border border-ds-border text-sm font-medium text-cream hover:bg-elevated transition-colors"
          >
            Export CSV
          </a>
          <Link
            href="/admin/products/new"
            className="px-4 py-2 rounded-lg bg-cream text-surface text-sm font-semibold hover:bg-cream/90 transition-colors"
          >
            Add product
          </Link>
        </div>
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

      {selectedIds.length > 0 && (
        <ProductBulkBar
          selectedIds={selectedIds}
          onClear={() => setSelectedIds([])}
          onDone={() => {
            setSelectedIds([])
            void reload()
          }}
        />
      )}

      {products === null ? (
        <ListState error={error} onRetry={reload} />
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          rowHref={(p) => `/admin/products/${p.id}`}
          emptyLabel={query ? 'No products match your search.' : 'No products yet.'}
          selection={{ selectedIds, onChange: setSelectedIds }}
        />
      )}
    </div>
  )
}
