'use client'

import { useState } from 'react'
import { useAdminList } from '@/components/admin/useAdminList'
import { ListState } from '@/components/admin/ListState'

interface TaxRate {
  id: string
  name: string
  country: string
  state: string | null
  basisPoints: number
  enabled: boolean
}

const NETWORK_ERROR = 'Could not reach the server. Check your connection and try again.'
const inputClass =
  'px-3 py-2 rounded-lg border border-ds-border bg-bg text-sm text-cream placeholder:text-cream-muted/60'

export default function AdminTaxesPage() {
  const { data: taxes, error, reload } = useAdminList<TaxRate>('/api/admin/taxes', 'taxes')
  const [name, setName] = useState('')
  const [country, setCountry] = useState('US')
  const [state, setState] = useState('')
  const [percent, setPercent] = useState('')
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setFormError('')
    try {
      const res = await fetch('/api/admin/taxes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Percent in, basis points stored — 8.25% becomes 825.
        body: JSON.stringify({ name, country, state, basisPoints: Math.round(Number(percent) * 100) }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setFormError(data?.error ?? 'Could not add that rate')
        return
      }
      setName('')
      setState('')
      setPercent('')
      void reload()
    } catch {
      setFormError(NETWORK_ERROR)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (rate: TaxRate) => {
    if (!window.confirm(`Delete "${rate.name}"?`)) return
    try {
      const res = await fetch(`/api/admin/taxes/${rate.id}`, { method: 'DELETE' })
      if (!res.ok) {
        setFormError('Could not delete that rate')
        return
      }
      void reload()
    } catch {
      setFormError(NETWORK_ERROR)
    }
  }

  const toggle = async (rate: TaxRate) => {
    try {
      await fetch(`/api/admin/taxes/${rate.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !rate.enabled }),
      })
      void reload()
    } catch {
      setFormError(NETWORK_ERROR)
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-body font-bold text-2xl text-cream mb-2">Taxes</h1>
      <p className="text-sm text-cream-muted mb-6">
        Fixed rates you charge, added to the order at checkout. These are your own rates — not an
        automatic tax service, which charges a fee on every sale.
      </p>

      <form onSubmit={add} className="bg-surface border border-ds-border rounded-xl p-5 mb-6 space-y-3">
        <h2 className="text-sm font-medium text-cream">Add a rate</h2>
        <div className="flex flex-wrap gap-2">
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ohio sales tax" className={`${inputClass} flex-1 min-w-[180px]`} />
          <input required value={country} onChange={(e) => setCountry(e.target.value.toUpperCase())} maxLength={2} placeholder="US" className={`${inputClass} w-20`} />
          <input value={state} onChange={(e) => setState(e.target.value.toUpperCase())} maxLength={10} placeholder="OH (optional)" className={`${inputClass} w-32`} />
          <input required type="number" step="0.01" min="0" max="100" value={percent} onChange={(e) => setPercent(e.target.value)} placeholder="8.25" className={`${inputClass} w-24`} />
          <button type="submit" disabled={busy} className="px-4 py-2 rounded-lg bg-cream text-surface text-sm font-semibold hover:bg-cream/90 disabled:opacity-50">
            {busy ? 'Adding…' : 'Add'}
          </button>
        </div>
        <p className="text-xs text-cream-muted/70">Leave the state empty to charge the rate across the whole country.</p>
        {formError && <p className="text-sm text-error">{formError}</p>}
      </form>

      {taxes === null ? (
        <ListState error={error} onRetry={reload} />
      ) : taxes.length === 0 ? (
        <div className="border border-ds-border rounded-xl bg-surface py-16 text-center text-cream-muted text-sm">
          No tax rates yet — orders are charged without tax.
        </div>
      ) : (
        <div className="border border-ds-border rounded-xl bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-elevated text-cream-muted">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Rate</th>
                <th className="text-left px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Applies to</th>
                <th className="text-right px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Percent</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {taxes.map((rate) => (
                <tr key={rate.id} className="border-t border-ds-border">
                  <td className="px-4 py-3 text-cream">{rate.name}</td>
                  <td className="px-4 py-3 text-cream-muted">
                    {rate.state ? `${rate.state}, ${rate.country}` : rate.country}
                  </td>
                  <td className="px-4 py-3 text-right text-cream">{(rate.basisPoints / 100).toFixed(2)}%</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button type="button" onClick={() => toggle(rate)} className="text-xs text-cream-muted hover:text-cream underline mr-3">
                      {rate.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button type="button" onClick={() => remove(rate)} className="text-xs text-error hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
