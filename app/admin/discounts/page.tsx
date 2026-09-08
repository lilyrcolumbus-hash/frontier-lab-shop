'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { useAdminList } from '@/components/admin/useAdminList'
import { ListState } from '@/components/admin/ListState'
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
  minimumAmount: number | null
  firstTimeOnly: boolean
}

function discountValue(d: AdminDiscount) {
  if (d.percentOff) return `${d.percentOff}% off`
  if (d.amountOff) return `${formatPrice(d.amountOff)} off`
  return '—'
}

export default function AdminDiscountsPage() {
  const { data: discounts, error, reload } = useAdminList<AdminDiscount>('/api/admin/discounts', 'discounts')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')

  const toggleActive = async (d: AdminDiscount) => {
    setBusyId(d.id)
    setActionError('')
    try {
      const res = await fetch(`/api/admin/discounts/${d.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !d.active }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setActionError(data?.error ?? 'Could not change that code')
        return
      }
      void reload()
    } catch {
      setActionError('Could not reach the server. Check your connection and try again.')
    } finally {
      // Always release the row, even on a dropped connection.
      setBusyId(null)
    }
  }

  const columns: DataTableColumn<AdminDiscount>[] = [
    { key: 'code', header: 'Code', render: (d) => <span className="font-mono font-semibold text-cream">{d.code}</span> },
    { key: 'value', header: 'Discount', render: (d) => <span className="text-cream-muted">{discountValue(d)}</span> },
    {
      key: 'conditions',
      header: 'Conditions',
      render: (d) => {
        const conditions = [
          d.minimumAmount ? `${formatPrice(d.minimumAmount)} minimum` : null,
          d.firstTimeOnly ? 'First order only' : null,
        ].filter(Boolean)
        return <span className="text-cream-muted">{conditions.length ? conditions.join(' · ') : '—'}</span>
      },
    },
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
        <h1 className="font-heading font-medium text-2xl text-cream">Discounts</h1>
        <Link
          href="/admin/discounts/new"
          className="px-4 py-2 rounded-none bg-cream text-surface text-sm font-semibold hover:bg-cream/90 transition-colors"
        >
          Create discount
        </Link>
      </div>

      {actionError && <p className="text-sm text-error mb-3">{actionError}</p>}

      {discounts === null ? (
        <ListState error={error} onRetry={reload} />
      ) : (
        <DataTable columns={columns} rows={discounts} emptyLabel="No discount codes yet." />
      )}
    </div>
  )
}
