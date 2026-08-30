'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Cancelled and refunded are deliberately not here: they move money and inventory, so they
// are actions with their own buttons below, not something you can type into the record. Letting
// the dropdown set "refunded" would let an order look refunded while the customer was never paid.
const ORDER_STATUSES = ['pending', 'paid', 'fulfilled'] as const

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
  const [resolving, setResolving] = useState<'cancel' | 'refund' | null>(null)
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

  const handleResolve = async (action: 'cancel' | 'refund') => {
    const confirmation =
      action === 'refund'
        ? 'Refund the full amount to the customer in Stripe and put the items back in stock?'
        : 'Cancel this order and put the items back in stock? No money moves.'
    if (!window.confirm(confirmation)) return

    setResolving(action)
    setError('')
    const res = await fetch(`/api/admin/orders/${orderId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    const data = await res.json().catch(() => null)
    setResolving(null)
    if (!res.ok) {
      setError(data?.error ?? 'Could not complete that action')
      return
    }
    router.refresh()
  }

  const isClosed = initialStatus === 'cancelled' || initialStatus === 'refunded'

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
        disabled={saving || isClosed}
        className="px-4 py-2 rounded-full bg-amber text-bg text-sm font-semibold hover:bg-amber-bright transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>

      <div className="pt-4 border-t border-ds-border">
        {isClosed ? (
          <p className="text-xs text-cream-muted">
            This order is {initialStatus}. The items went back into stock and it can no longer be
            edited.
          </p>
        ) : (
          <>
            <p className="text-xs text-cream-muted mb-3">
              Both actions return the items to stock. Refunding also sends the money back to the
              customer through Stripe.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleResolve('cancel')}
                disabled={resolving !== null}
                className="px-4 py-2 rounded-full border border-ds-border text-sm font-medium text-cream hover:bg-elevated transition-colors disabled:opacity-50"
              >
                {resolving === 'cancel' ? 'Cancelling…' : 'Cancel order'}
              </button>
              <button
                onClick={() => handleResolve('refund')}
                disabled={resolving !== null}
                className="px-4 py-2 rounded-full border border-error/40 text-sm font-medium text-error hover:bg-error/10 transition-colors disabled:opacity-50"
              >
                {resolving === 'refund' ? 'Refunding…' : 'Refund in full'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
