'use client'

import { useMemo, useState } from 'react'
import { formatPrice } from '@/lib/utils'
import { useAdminList } from '@/components/admin/useAdminList'
import { ListState } from '@/components/admin/ListState'
import { DataTable, type DataTableColumn } from '@/components/admin/DataTable'

interface AdminCustomer {
  email: string
  orderCount: number
  totalSpent: number
  lastOrderAt: string
  registered: boolean
  tags: string[]
}

export default function AdminCustomersPage() {
  const { data: customers, error, reload } = useAdminList<AdminCustomer>('/api/admin/customers', 'customers')
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('')

  // Every tag in use, so the segment filter offers what actually exists rather than a free
  // text box that silently matches nothing.
  const allTags = useMemo(
    () => Array.from(new Set((customers ?? []).flatMap((c) => c.tags))).sort(),
    [customers]
  )

  const filtered = useMemo(() => {
    if (!customers) return []
    const q = query.trim().toLowerCase()
    return customers.filter((c) => {
      if (tag && !c.tags.includes(tag)) return false
      return !q || c.email.toLowerCase().includes(q)
    })
  }, [customers, query, tag])

  const columns: DataTableColumn<AdminCustomer & { id: string }>[] = [
    {
      key: 'email',
      header: 'Customer',
      render: (c) => (
        <div className="flex items-center gap-2">
          <span className="text-cream">{c.email}</span>
          {c.registered && (
            <span className="text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded-none bg-accent-dim text-accent">
              Account
            </span>
          )}
        </div>
      ),
    },
    { key: 'orders', header: 'Orders', render: (c) => <span className="text-cream-muted">{c.orderCount}</span> },
    {
      key: 'tags',
      header: 'Segments',
      render: (c) =>
        c.tags.length ? (
          <span className="text-cream-muted">{c.tags.join(', ')}</span>
        ) : (
          <span className="text-cream-muted/50">—</span>
        ),
    },
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
        <h1 className="font-heading font-medium text-2xl text-cream">Customers</h1>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by email"
          className="w-full max-w-xs px-3.5 py-2 rounded-none border border-ds-border bg-surface text-sm text-cream placeholder:text-cream-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
        />

        {allTags.length > 0 && (
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="px-3.5 py-2 rounded-none border border-ds-border bg-surface text-sm text-cream"
          >
            <option value="">All segments</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}
      </div>

      {customers === null ? (
        <ListState error={error} onRetry={reload} />
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
