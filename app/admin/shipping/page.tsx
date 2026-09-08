'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import { useAdminList } from '@/components/admin/useAdminList'
import { ListState } from '@/components/admin/ListState'

interface Rate {
  id: string
  name: string
  amount: number
  minSubtotal: number | null
  maxSubtotal: number | null
  minWeightGrams: number | null
  maxWeightGrams: number | null
  minDays: number
  maxDays: number
}

interface Zone {
  id: string
  name: string
  countries: string[]
  rates: Rate[]
}

const NETWORK_ERROR = 'Could not reach the server. Check your connection and try again.'
const inputClass =
  'px-3 py-2 rounded-none border border-ds-border bg-bg text-sm text-cream placeholder:text-cream-muted/60'

const toCents = (v: string) => (v.trim() === '' ? null : Math.round(Number(v) * 100))
const toGrams = (v: string) => (v.trim() === '' ? null : Math.round(Number(v)))

export default function AdminShippingPage() {
  const { data: zones, error, reload } = useAdminList<Zone>('/api/admin/shipping', 'zones')
  const [zoneName, setZoneName] = useState('')
  const [countries, setCountries] = useState('')
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')

  const post = async (payload: Record<string, unknown>) => {
    setBusy(true)
    setFormError('')
    try {
      const res = await fetch('/api/admin/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setFormError(data?.error ?? 'Could not save that')
        return false
      }
      void reload()
      return true
    } catch {
      setFormError(NETWORK_ERROR)
      return false
    } finally {
      setBusy(false)
    }
  }

  const addZone = async (e: React.FormEvent) => {
    e.preventDefault()
    const list = countries.split(',').map((c) => c.trim().toUpperCase()).filter(Boolean)
    if ((await post({ name: zoneName, countries: list })) === true) {
      setZoneName('')
      setCountries('')
    }
  }

  const remove = async (id: string, kind?: 'rate') => {
    if (!window.confirm(kind === 'rate' ? 'Delete this rate?' : 'Delete this zone and its rates?')) return
    try {
      const res = await fetch(`/api/admin/shipping/${id}${kind ? '?kind=rate' : ''}`, { method: 'DELETE' })
      if (!res.ok) {
        setFormError('Could not delete that')
        return
      }
      void reload()
    } catch {
      setFormError(NETWORK_ERROR)
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading font-medium text-2xl text-cream mb-2">Shipping zones</h1>
      <p className="text-sm text-cream-muted mb-6">
        A zone is a group of countries; each zone has its own rates, which can depend on the order
        total or its weight. With no zones defined, the flat rate in Settings is used instead.
      </p>

      <form onSubmit={addZone} className="bg-surface border border-ds-border rounded-none p-5 mb-6 space-y-3">
        <h2 className="text-sm font-medium text-cream">Add a zone</h2>
        <div className="flex flex-wrap gap-2">
          <input required value={zoneName} onChange={(e) => setZoneName(e.target.value)} placeholder="United States" className={`${inputClass} flex-1 min-w-[180px]`} />
          <input required value={countries} onChange={(e) => setCountries(e.target.value)} placeholder="US, CA, MX" className={`${inputClass} flex-1 min-w-[160px]`} />
          <button type="submit" disabled={busy} className="px-4 py-2 rounded-none bg-cream text-surface text-sm font-semibold hover:bg-cream/90 disabled:opacity-50">
            Add zone
          </button>
        </div>
        <p className="text-xs text-cream-muted/70">Two-letter country codes, separated by commas.</p>
        {formError && <p className="text-sm text-error">{formError}</p>}
      </form>

      {zones === null ? (
        <ListState error={error} onRetry={reload} />
      ) : zones.length === 0 ? (
        <div className="border border-ds-border rounded-none bg-surface py-16 text-center text-cream-muted text-sm">
          No zones yet — the flat rate from Settings applies to every order.
        </div>
      ) : (
        <div className="space-y-4">
          {zones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} onAddRate={post} onRemove={remove} busy={busy} />
          ))}
        </div>
      )}
    </div>
  )
}

function ZoneCard({
  zone,
  onAddRate,
  onRemove,
  busy,
}: {
  zone: Zone
  onAddRate: (payload: Record<string, unknown>) => Promise<boolean>
  onRemove: (id: string, kind?: 'rate') => void
  busy: boolean
}) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [minSubtotal, setMinSubtotal] = useState('')
  const [maxSubtotal, setMaxSubtotal] = useState('')
  const [maxWeight, setMaxWeight] = useState('')

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await onAddRate({
      kind: 'rate',
      zoneId: zone.id,
      name,
      amount: toCents(amount) ?? 0,
      minSubtotal: toCents(minSubtotal),
      maxSubtotal: toCents(maxSubtotal),
      maxWeightGrams: toGrams(maxWeight),
    })
    if (ok) {
      setName('')
      setAmount('')
      setMinSubtotal('')
      setMaxSubtotal('')
      setMaxWeight('')
    }
  }

  return (
    <div className="border border-ds-border rounded-none bg-surface p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-cream text-sm">{zone.name}</h3>
          <p className="text-xs text-cream-muted/70">{zone.countries.join(', ')}</p>
        </div>
        <button type="button" onClick={() => onRemove(zone.id)} className="text-xs text-error hover:underline">
          Delete zone
        </button>
      </div>

      {zone.rates.length === 0 ? (
        <p className="text-xs text-cream-muted/70 mb-3">No rates yet — this zone charges nothing until you add one.</p>
      ) : (
        <ul className="space-y-1.5 mb-3">
          {zone.rates.map((rate) => (
            <li key={rate.id} className="flex items-center gap-3 text-sm">
              <span className="text-cream flex-1 min-w-0 truncate">{rate.name}</span>
              <span className="text-cream-muted text-xs">
                {rate.minSubtotal !== null && `from ${formatPrice(rate.minSubtotal)} `}
                {rate.maxSubtotal !== null && `under ${formatPrice(rate.maxSubtotal)} `}
                {rate.maxWeightGrams !== null && `up to ${rate.maxWeightGrams}g`}
              </span>
              <span className="text-cream">{formatPrice(rate.amount)}</span>
              <button type="button" onClick={() => onRemove(rate.id, 'rate')} className="text-xs text-error hover:underline">
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={add} className="flex flex-wrap gap-2 pt-3 border-t border-ds-border">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Standard" className={`${inputClass} flex-1 min-w-[140px]`} />
        <input required type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="9.99" className={`${inputClass} w-24`} />
        <input type="number" step="0.01" min="0" value={minSubtotal} onChange={(e) => setMinSubtotal(e.target.value)} placeholder="min $" className={`${inputClass} w-24`} />
        <input type="number" step="0.01" min="0" value={maxSubtotal} onChange={(e) => setMaxSubtotal(e.target.value)} placeholder="max $" className={`${inputClass} w-24`} />
        <input type="number" min="0" value={maxWeight} onChange={(e) => setMaxWeight(e.target.value)} placeholder="max g" className={`${inputClass} w-24`} />
        <button type="submit" disabled={busy} className="px-3 py-2 rounded-none border border-ds-border text-xs font-medium text-cream hover:bg-elevated disabled:opacity-50">
          Add rate
        </button>
      </form>
    </div>
  )
}
