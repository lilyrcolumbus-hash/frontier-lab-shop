'use client'

import { useEffect, useMemo, useState } from 'react'
import { formatPrice } from '@/lib/utils'
import { DataTable, type DataTableColumn } from '@/components/admin/DataTable'

interface AdminCustomer {
  email: string
  orderCount: number
  totalSpent: number
  lastOrderAt: string
  registered: boolean
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[] | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetch('/api/admin/customers')
      .then((r) => r.json())
      .then((data) => setCustomers(data.customers ?? []))
      .catch(() => setCustomers([]))
  }, [])

  const filtered = useMemo(() => {
    if (!customers) return []
    const q = query.trim().toLowerCase()
    if (!q) return customers
    return customers.filter((c) => c.email.toLowerCase().includes(q))
  }, [customers, query])

  const columns: DataTableColumn<AdminCustomer & { id: string }>[] = [
    {
      key: 'email',
      header: 'Customer',
      render: (c) => (
        <div className="flex items-center gap-2">
          <span className="text-cream">{c.email}</span>
          {c.registered && (
            <span className="text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded bg-accent-dim text-accent">
              Account
            </span>
          )}
        </div>
      ),
    },
    { key: 'orders', header: 'Orders', render: (c) => <span className="text-cream-muted">{c.orderCount}</span> },
    {
      key: 'last',
      header: 'Last order',
      render: (c) => <span className="text-cream-muted">{new Date(c.lastOrderAt).toLocaleDateString()}</span>,
    },
    { key: 'spent', header: 'Total spent', align: 'right', render: (c) => formatPrice(c.totalSpent) },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-body font-bold text-2xl text-cream">Customers</h1>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by email"
          className="w-full max-w-xs px-3.5 py-2 rounded-lg border border-ds-border bg-surface text-sm text-cream placeholder:text-cream-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {customers === null ? (
        <p className="text-cream-muted">Loading…</p>
      ) : (
        <DataTable
          columns={columns}
          rows={filtered.map((c) => ({ ...c, id: c.email }))}
          rowHref={(c) => `/admin/customers/${encodeURIComponent(c.email)}`}
          emptyLabel={query ? 'No customers match your search.' : 'No customers yet — orders will show up here once someone checks out.'}
        />
      )}
    </div>
  )
}
