'use client'

import { useState } from 'react'
import { useAdminList } from '@/components/admin/useAdminList'
import { ListState } from '@/components/admin/ListState'

interface Location {
  id: string
  name: string
  address: string
  isDefault: boolean
  units: number
}

const NETWORK_ERROR = 'Could not reach the server. Check your connection and try again.'
const inputClass =
  'px-3 py-2 rounded-none border border-ds-border bg-bg text-sm text-cream placeholder:text-cream-muted/60'

export default function AdminLocationsPage() {
  const { data: locations, error, reload } = useAdminList<Location>('/api/admin/locations', 'locations')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setFormError('')
    try {
      const res = await fetch('/api/admin/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setFormError(data?.error ?? 'Could not add that location')
        return
      }
      setName('')
      setAddress('')
      void reload()
    } catch {
      setFormError(NETWORK_ERROR)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (location: Location) => {
    if (!window.confirm(`Delete "${location.name}"?`)) return
    try {
      const res = await fetch(`/api/admin/locations/${location.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setFormError(data?.error ?? 'Could not delete that location')
        return
      }
      void reload()
    } catch {
      setFormError(NETWORK_ERROR)
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading font-medium text-2xl text-cream mb-2">Locations</h1>
      <p className="text-sm text-cream-muted mb-6">
        Where your stock physically is. The first location you create takes on all the stock you
        already have, so nothing changes for your customers.
      </p>

      <form onSubmit={add} className="bg-surface border border-ds-border rounded-none p-5 mb-6 space-y-3">
        <h2 className="text-sm font-medium text-cream">Add a location</h2>
        <div className="flex flex-wrap gap-2">
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Main lab" className={`${inputClass} flex-1 min-w-[160px]`} />
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address (optional)" className={`${inputClass} flex-1 min-w-[180px]`} />
          <button type="submit" disabled={busy} className="px-4 py-2 rounded-none bg-cream text-surface text-sm font-semibold hover:bg-cream/90 disabled:opacity-50">
            {busy ? 'Adding…' : 'Add'}
          </button>
        </div>
        {formError && <p className="text-sm text-error">{formError}</p>}
      </form>

      {locations === null ? (
        <ListState error={error} onRetry={reload} />
      ) : locations.length === 0 ? (
        <div className="border border-ds-border rounded-none bg-surface py-16 text-center text-cream-muted text-sm">
          No locations yet — stock is simply counted per product.
        </div>
      ) : (
        <div className="border border-ds-border rounded-none bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-elevated text-cream-muted">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Location</th>
                <th className="text-left px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Address</th>
                <th className="text-right px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Units held</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr key={location.id} className="border-t border-ds-border">
                  <td className="px-4 py-3 text-cream">
                    {location.name}
                    {location.isDefault && (
                      <span className="ml-2 text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded-none bg-accent-dim text-accent">
                        Default
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-cream-muted">{location.address || '—'}</td>
                  <td className="px-4 py-3 text-right text-cream">{location.units}</td>
                  <td className="px-4 py-3 text-right">
                    {!location.isDefault && (
                      <button type="button" onClick={() => remove(location)} className="text-xs text-error hover:underline">
                        Delete
                      </button>
                    )}
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
