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

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
]

const inputClass =
  'px-3.5 py-2 rounded-lg border border-ds-border bg-surface text-sm text-cream placeholder:text-cream-muted focus:outline-none focus:ring-2 focus:ring-accent/30'

export default function AdminOrdersPage() {
  const [status, setStatus] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [query, setQuery] = useState('')

  // Status and date narrow the query server-side so they apply to every order, not just the
  // page already in the browser. The text search stays client-side — it only refines what is shown.
  const url = useMemo(() => {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    const qs = params.toString()
    return qs ? `/api/admin/orders?${qs}` : '/api/admin/orders'
  }, [status, from, to])

  const { data: orders, error, reload } = useAdminList<AdminOrder>(url, 'orders')

  const filtered = useMemo(() => {
    if (!orders) return []
    const q = query.trim().toLowerCase()
    if (!q) return orders
    return orders.filter((o) => o.email.toLowerCase().includes(q) || o.id.toLowerCase().includes(q))
  }, [orders, query])

  const hasFilters = Boolean(status || from || to || query)

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

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by email or order id"
          className={`${inputClass} w-full max-w-xs`}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-xs text-cream-muted">
          From
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={inputClass} />
        </label>

        <label className="flex items-center gap-2 text-xs text-cream-muted">
          To
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={inputClass} />
        </label>

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setStatus('')
              setFrom('')
              setTo('')
              setQuery('')
            }}
            className="px-3.5 py-2 text-sm text-cream-muted hover:text-cream underline underline-offset-4"
          >
            Clear
          </button>
        )}
      </div>

      {orders === null ? (
        <ListState error={error} onRetry={reload} />
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          rowHref={(o) => `/admin/orders/${o.id}`}
          emptyLabel={hasFilters ? 'No orders match these filters.' : 'No orders yet.'}
        />
      )}
    </div>
  )
}
