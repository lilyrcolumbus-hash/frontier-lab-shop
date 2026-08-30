'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface StoreSettings {
  /** Both are in cents, the same unit the checkout and Stripe use. */
  shippingRate: number
  freeShippingThreshold: number
}

const toDollars = (cents: number) => (cents / 100).toFixed(2)
const toCents = (dollars: string) => Math.round((Number(dollars) || 0) * 100)

export function SettingsForm({ initial }: { initial: StoreSettings }) {
  const router = useRouter()
  const [shippingRate, setShippingRate] = useState(toDollars(initial.shippingRate))
  const [threshold, setThreshold] = useState(toDollars(initial.freeShippingThreshold))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const thresholdCents = toCents(threshold)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaved(false)
    setSaving(true)

    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shippingRate: toCents(shippingRate), freeShippingThreshold: thresholdCents }),
    })

    setSaving(false)
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.error ?? 'Could not save the settings')
      return
    }
    setSaved(true)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-ds-border rounded-xl p-6 space-y-4">
      <div>
        <h2 className="text-sm font-medium text-cream">Shipping</h2>
        <p className="text-xs text-cream-muted/70 mt-1">
          Applied to every order at checkout. A discount code can never cover shipping — Stripe
          discounts the order subtotal only — so free shipping is granted here.
        </p>
      </div>

      <Input
        label="Shipping rate (USD)"
        type="number"
        min={0}
        step={0.01}
        value={shippingRate}
        onChange={(e) => setShippingRate(e.target.value)}
        required
      />

      <Input
        label="Free shipping over (USD)"
        type="number"
        min={0}
        step={0.01}
        value={threshold}
        onChange={(e) => setThreshold(e.target.value)}
      />
      <p className="text-xs text-cream-muted/70">
        {thresholdCents > 0
          ? `Orders of $${toDollars(thresholdCents)} or more ship free.`
          : 'Set to 0 to charge shipping on every order.'}
      </p>

      {error && <p className="text-sm text-error">{error}</p>}
      {saved && <p className="text-sm text-accent">Settings saved.</p>}

      <Button type="submit" disabled={saving}>
        {saving ? 'Saving…' : 'Save settings'}
      </Button>
    </form>
  )
}
