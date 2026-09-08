'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import { useAdminList } from '@/components/admin/useAdminList'
import { ListState } from '@/components/admin/ListState'

interface GiftCard {
  id: string
  code: string
  initialAmount: number
  balance: number
  status: string
  note: string
  expiresAt: string | null
  createdAt: string
}

const NETWORK_ERROR = 'Could not reach the server. Check your connection and try again.'
const inputClass =
  'px-3 py-2 rounded-none border border-ds-border bg-bg text-sm text-cream placeholder:text-cream-muted/60'

export default function AdminGiftCardsPage() {
  const { data: cards, error, reload } = useAdminList<GiftCard>('/api/admin/gift-cards', 'giftCards')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')
  const [created, setCreated] = useState<string | null>(null)

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setFormError('')
    setCreated(null)
    try {
      const res = await fetch('/api/admin/gift-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(Number(amount) * 100), note, expiresAt: expiresAt || undefined }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setFormError(data?.error ?? 'Could not create the gift card')
        return
      }
      setCreated(data.giftCard.code)
      setAmount('')
      setNote('')
      setExpiresAt('')
      void reload()
    } catch {
      setFormError(NETWORK_ERROR)
    } finally {
      setBusy(false)
    }
  }

  const toggle = async (card: GiftCard) => {
    try {
      const res = await fetch(`/api/admin/gift-cards/${card.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: card.status === 'active' ? 'disabled' : 'active' }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setFormError(data?.error ?? 'Could not change that card')
        return
      }
      void reload()
    } catch {
      setFormError(NETWORK_ERROR)
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading font-medium text-2xl text-cream mb-2">Gift cards</h1>
      <p className="text-sm text-cream-muted mb-6">
        Each card is a single-use code worth a fixed amount off an order. The customer types it in
        the discount box at checkout.
      </p>

      <form onSubmit={create} className="bg-surface border border-ds-border rounded-none p-5 mb-6 space-y-3">
        <h2 className="text-sm font-medium text-cream">Issue a card</h2>
        <div className="flex flex-wrap gap-2">
          <input required type="number" step="1" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="50" className={`${inputClass} w-28`} />
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Who it is for (optional)" className={`${inputClass} flex-1 min-w-[180px]`} />
          <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className={inputClass} />
          <button type="submit" disabled={busy} className="px-4 py-2 rounded-none bg-cream text-surface text-sm font-semibold hover:bg-cream/90 disabled:opacity-50">
            {busy ? 'Creating…' : 'Create'}
          </button>
        </div>
        {formError && <p className="text-sm text-error">{formError}</p>}
        {created && (
          <p className="text-sm text-accent">
            Card created: <span className="font-mono font-semibold">{created}</span> — copy it now, it is
            also in the list below.
          </p>
        )}
      </form>

      {cards === null ? (
        <ListState error={error} onRetry={reload} />
      ) : cards.length === 0 ? (
        <div className="border border-ds-border rounded-none bg-surface py-16 text-center text-cream-muted text-sm">
          No gift cards yet.
        </div>
      ) : (
        <div className="border border-ds-border rounded-none bg-surface overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-elevated text-cream-muted">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Code</th>
                <th className="text-left px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Note</th>
                <th className="text-left px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Value</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {cards.map((card) => (
                <tr key={card.id} className="border-t border-ds-border">
                  <td className="px-4 py-3 font-mono text-xs text-cream">{card.code}</td>
                  <td className="px-4 py-3 text-cream-muted">{card.note || '—'}</td>
                  <td className="px-4 py-3 text-cream-muted">{card.status === 'active' ? 'Active' : 'Disabled'}</td>
                  <td className="px-4 py-3 text-right text-cream">{formatPrice(card.initialAmount)}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => toggle(card)} className="text-xs text-cream-muted hover:text-cream underline">
                      {card.status === 'active' ? 'Disable' : 'Enable'}
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
