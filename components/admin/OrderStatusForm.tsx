'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ORDER_STATUSES = ['pending', 'paid', 'fulfilled', 'cancelled', 'refunded'] as const

export function OrderStatusForm({
  orderId,
  initialStatus,
  initialTrackingNumber,
}: {
  orderId: string
  initialStatus: string
  initialTrackingNumber: string | null
}) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, trackingNumber: trackingNumber || null }),
    })
    setSaving(false)
    if (!res.ok) {
      setError('Could not update the order')
      return
    }
    router.refresh()
  }

  return (
    <div className="bg-surface border border-ds-border rounded-xl p-5 space-y-4">
      <div>
        <label className="block text-xs font-medium text-cream-muted mb-1.5">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-ds-border bg-bg text-sm text-cream"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-cream-muted mb-1.5">Tracking number</label>
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Optional"
          className="w-full px-3 py-2 rounded-lg border border-ds-border bg-bg text-sm text-cream placeholder:text-cream-muted"
        />
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 rounded-full bg-amber text-bg text-sm font-semibold hover:bg-amber-bright transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  )
}
