'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { DataTable, type DataTableColumn } from '@/components/admin/DataTable'
import { StatusPill } from '@/components/admin/StatusPill'

interface AdminDiscount {
  id: string
  code: string
  active: boolean
  percentOff: number | null
  amountOff: number | null
  timesRedeemed: number
  maxRedemptions: number | null
  expiresAt: string | null
}

function discountValue(d: AdminDiscount) {
  if (d.percentOff) return `${d.percentOff}% off`
  if (d.amountOff) return `${formatPrice(d.amountOff)} off`
  return '—'
}

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<AdminDiscount[] | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = () => {
    fetch('/api/admin/discounts')
      .then((r) => r.json())
      .then((data) => setDiscounts(data.discounts ?? []))
      .catch(() => setDiscounts([]))
  }

  useEffect(load, [])

  const toggleActive = async (d: AdminDiscount) => {
    setBusyId(d.id)
    await fetch(`/api/admin/discounts/${d.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !d.active }),
    })
    setBusyId(null)
    load()
  }

  const columns: DataTableColumn<AdminDiscount>[] = [
    { key: 'code', header: 'Code', render: (d) => <span className="font-mono font-semibold text-cream">{d.code}</span> },
    { key: 'value', header: 'Discount', render: (d) => <span className="text-cream-muted">{discountValue(d)}</span> },
    { key: 'status', header: 'Status', render: (d) => <StatusPill status={d.active ? 'active' : 'archived'} /> },
    {
      key: 'redemptions',
      header: 'Redemptions',
      render: (d) => (
        <span className="text-cream-muted">
          {d.timesRedeemed}
          {d.maxRedemptions ? ` / ${d.maxRedemptions}` : ''}
        </span>
      ),
    },
    {
      key: 'expires',
      header: 'Expires',
      render: (d) => <span className="text-cream-muted">{d.expiresAt ? new Date(d.expiresAt).toLocaleDateString() : 'Never'}</span>,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (d) => (
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleActive(d)
          }}
          disabled={busyId === d.id}
          className="text-xs font-medium text-accent hover:underline disabled:opacity-50"
        >
          {d.active ? 'Deactivate' : 'Activate'}
        </button>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-body font-bold text-2xl text-cream">Discounts</h1>
        <Link
          href="/admin/discounts/new"
          className="px-4 py-2 rounded-lg bg-cream text-surface text-sm font-semibold hover:bg-cream/90 transition-colors"
        >
          Create discount
        </Link>
      </div>

      {discounts === null ? (
        <p className="text-cream-muted">Loading…</p>
      ) : (
        <DataTable columns={columns} rows={discounts} emptyLabel="No discount codes yet." />
      )}
    </div>
  )
}
