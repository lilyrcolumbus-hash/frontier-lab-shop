'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'

type DiscountType = 'percentage' | 'amount'

/** Turns a dollars field ("12.50") into the cents Stripe expects. */
function toCents(value: string): number | undefined {
  const dollars = Number(value)
  return value && Number.isFinite(dollars) && dollars > 0 ? Math.round(dollars * 100) : undefined
}

export default function NewDiscountPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [type, setType] = useState<DiscountType>('percentage')
  const [percentOff, setPercentOff] = useState('')
  const [amountOff, setAmountOff] = useState('')
  const [minimumAmount, setMinimumAmount] = useState('')
  const [firstTimeOnly, setFirstTimeOnly] = useState(false)
  const [maxRedemptions, setMaxRedemptions] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const res = await fetch('/api/admin/discounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        percentOff: type === 'percentage' && percentOff ? Number(percentOff) : undefined,
        amountOff: type === 'amount' ? toCents(amountOff) : undefined,
        minimumAmount: toCents(minimumAmount),
        firstTimeOnly,
        maxRedemptions: maxRedemptions ? Number(maxRedemptions) : undefined,
        expiresAt: expiresAt || undefined,
      }),
    })

    setSaving(false)
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.error ?? 'Could not create the discount code')
      return
    }
    router.push('/admin/discounts')
    router.refresh()
  }

  return (
    <div className="max-w-md">
      <h1 className="font-body font-bold text-2xl text-cream mb-6">Create discount</h1>

      <form onSubmit={handleSubmit} className="bg-surface border border-ds-border rounded-xl p-6 space-y-4">
        <Input
          label="Code"
          placeholder="SAVE15"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          required
        />

        <div>
          <label className="block text-sm font-medium text-cream-muted mb-1.5">Discount type</label>
          <div className="flex gap-2">
            {(
              [
                { value: 'percentage', label: 'Percentage' },
                { value: 'amount', label: 'Fixed amount' },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setType(option.value)}
                className={`px-3.5 py-2 rounded-lg border text-sm transition-colors ${
                  type === option.value
                    ? 'border-accent text-cream'
                    : 'border-ds-border text-cream-muted hover:text-cream'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {type === 'percentage' ? (
          <Input
            label="Percent off"
            type="number"
            min={1}
            max={100}
            placeholder="15"
            value={percentOff}
            onChange={(e) => setPercentOff(e.target.value)}
            required
          />
        ) : (
          <Input
            label="Amount off (USD)"
            type="number"
            min={0.01}
            step={0.01}
            placeholder="10.00"
            value={amountOff}
            onChange={(e) => setAmountOff(e.target.value)}
            required
          />
        )}

        <Input
          label="Minimum purchase (optional, USD)"
          type="number"
          min={0.01}
          step={0.01}
          placeholder="No minimum"
          value={minimumAmount}
          onChange={(e) => setMinimumAmount(e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm text-cream-muted cursor-pointer">
          <input
            type="checkbox"
            checked={firstTimeOnly}
            onChange={(e) => setFirstTimeOnly(e.target.checked)}
            className="accent-accent"
          />
          First-time customers only
        </label>

        <Input
          label="Max redemptions (optional)"
          type="number"
          min={1}
          placeholder="Unlimited"
          value={maxRedemptions}
          onChange={(e) => setMaxRedemptions(e.target.value)}
        />
        <Input
          label="Expires (optional)"
          type="date"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
        />

        {error && <p className="text-sm text-error">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-cream text-surface text-sm font-semibold hover:bg-cream/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Creating…' : 'Create discount'}
        </button>
      </form>

      <p className="text-xs text-cream-muted/70 mt-4">
        Free shipping cannot be given through a code: Stripe applies discounts to the order subtotal,
        never to the shipping rate. Use the free shipping threshold in Settings instead.
      </p>
    </div>
  )
}
