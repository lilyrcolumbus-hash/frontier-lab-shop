'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface FulfilmentLine {
  id: string
  name: string
  quantity: number
  fulfilledQuantity: number
}

export function OrderFulfilmentForm({
  orderId,
  items,
  disabled,
}: {
  orderId: string
  items: FulfilmentLine[]
  disabled: boolean
}) {
  const router = useRouter()
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(items.map((i) => [i.id, i.fulfilledQuantity]))
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const shipped = Object.values(quantities).reduce((sum, n) => sum + n, 0)
  const ordered = items.reduce((sum, i) => sum + i.quantity, 0)

  const setLine = (id: string, value: number, max: number) =>
    setQuantities((current) => ({ ...current, [id]: Math.max(0, Math.min(max, value)) }))

  const save = async (lines: Record<string, number>) => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/fulfil`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: Object.entries(lines).map(([itemId, fulfilledQuantity]) => ({ itemId, fulfilledQuantity })),
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error ?? 'Could not update the fulfilment')
        return
      }
      router.refresh()
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  const markAllShipped = () => {
    const all = Object.fromEntries(items.map((i) => [i.id, i.quantity]))
    setQuantities(all)
    void save(all)
  }

  return (
    <div className="bg-surface border border-ds-border rounded-xl p-5 space-y-4">
      <div>
        <h2 className="font-semibold text-cream text-sm">Fulfilment</h2>
        <p className="text-xs text-cream-muted/70 mt-1">
          {shipped} of {ordered} units shipped. Ship part of an order by entering how many units of
          each line have gone out.
        </p>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <span className="flex-1 min-w-0 truncate text-sm text-cream-muted">{item.name}</span>
            <input
              type="number"
              min={0}
              max={item.quantity}
              value={quantities[item.id] ?? 0}
              disabled={disabled}
              onChange={(e) => setLine(item.id, Number(e.target.value), item.quantity)}
              className="w-16 px-2 py-1.5 rounded-lg border border-ds-border bg-bg text-sm text-cream text-right disabled:opacity-50"
            />
            <span className="text-xs text-cream-muted/70 w-10">/ {item.quantity}</span>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void save(quantities)}
          disabled={saving || disabled}
          className="px-4 py-2 rounded-full bg-amber text-bg text-sm font-semibold hover:bg-amber-bright transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save fulfilment'}
        </button>
        <button
          type="button"
          onClick={markAllShipped}
          disabled={saving || disabled || shipped >= ordered}
          className="px-4 py-2 rounded-full border border-ds-border text-sm font-medium text-cream hover:bg-elevated transition-colors disabled:opacity-50"
        >
          Mark everything shipped
        </button>
      </div>
    </div>
  )
}
