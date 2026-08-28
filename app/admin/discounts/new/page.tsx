'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'

export default function NewDiscountPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [percentOff, setPercentOff] = useState('')
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
        percentOff: percentOff ? Number(percentOff) : undefined,
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
    </div>
  )
}
