'use client'

import { useMemo, useState } from 'react'
import { formatPrice } from '@/lib/utils'
import { useAdminList } from '@/components/admin/useAdminList'
import { ListState } from '@/components/admin/ListState'
import { DataTable, type DataTableColumn } from '@/components/admin/DataTable'
import { StatusPill } from '@/components/admin/StatusPill'

interface AdminOrder {
  id: string
  email: string
  status: string
  total: number
  createdAt: string
  items: { id: string }[]
}

export default function AdminOrdersPage() {
  const { data: orders, error, reload } = useAdminList<AdminOrder>('/api/admin/orders', 'orders')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!orders) return []
    const q = query.trim().toLowerCase()
    if (!q) return orders
    return orders.filter((o) => o.email.toLowerCase().includes(q) || o.id.toLowerCase().includes(q))
  }, [orders, query])

  const columns: DataTableColumn<AdminOrder>[] = [
    {
      key: 'order',
      header: 'Order',
      render: (o) => <span className="font-mono text-xs text-cream">#{o.id.slice(-8)}</span>,
    },
    { key: 'customer', header: 'Customer', render: (o) => <span className="text-cream-muted">{o.email}</span> },
    { key: 'status', header: 'Status', render: (o) => <StatusPill status={o.status} /> },
    {
      key: 'items',
      header: 'Items',
      render: (o) => <span className="text-cream-muted">{o.items.length}</span>,
    },
    {
      key: 'date',
      header: 'Date',
      render: (o) => <span className="text-cream-muted">{new Date(o.createdAt).toLocaleDateString()}</span>,
    },
    { key: 'total', header: 'Total', align: 'right', render: (o) => formatPrice(o.total) },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-body font-bold text-2xl text-cream">Orders</h1>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by email or order id"
          className="w-full max-w-xs px-3.5 py-2 rounded-lg border border-ds-border bg-surface text-sm text-cream placeholder:text-cream-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {orders === null ? (
        <ListState error={error} onRetry={reload} />
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          rowHref={(o) => `/admin/orders/${o.id}`}
          emptyLabel={query ? 'No orders match your search.' : 'No orders yet.'}
        />
      )}
    </div>
  )
}
