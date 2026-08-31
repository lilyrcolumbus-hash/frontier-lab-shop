'use client'

import { useEffect, useState } from 'react'

interface Collection {
  id: string
  titleEn: string
}

type BulkAction =
  | { type: 'status'; status: 'draft' | 'active' | 'archived' }
  | { type: 'inStock'; inStock: boolean }
  | { type: 'priceAdjust'; percent: number }
  | { type: 'addCollection'; collectionId: string }
  | { type: 'removeCollection'; collectionId: string }
  | { type: 'delete'; confirm: 'DELETE' }

/** The action bar that appears once rows are selected in the products table. */
export function ProductBulkBar({
  selectedIds,
  onDone,
  onClear,
}: {
  selectedIds: string[]
  onDone: () => void
  onClear: () => void
}) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [percent, setPercent] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/collections')
      .then((r) => r.json())
      .then((data) => setCollections(data.collections ?? []))
      .catch(() => setCollections([]))
  }, [])

  const apply = async (action: BulkAction, confirmation: string) => {
    if (!window.confirm(`${confirmation} (${selectedIds.length} products)`)) return
    setBusy(true)
    setError('')
    const res = await fetch('/api/admin/products/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds: selectedIds, action }),
    })
    const data = await res.json().catch(() => null)
    setBusy(false)
    if (!res.ok) {
      setError(data?.error ?? 'Could not apply that change')
      return
    }
    onDone()
  }

  const buttonClass =
    'px-3 py-1.5 rounded-lg border border-ds-border text-xs font-medium text-cream hover:bg-elevated transition-colors disabled:opacity-50'

  return (
    <div className="mb-4 p-3 rounded-xl border border-accent/40 bg-surface">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-cream mr-1">{selectedIds.length} selected</span>

        <button
          type="button"
          disabled={busy}
          onClick={() => apply({ type: 'status', status: 'active' }, 'Publish these products?')}
          className={buttonClass}
        >
          Publish
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => apply({ type: 'status', status: 'draft' }, 'Move these products back to draft?')}
          className={buttonClass}
        >
          Unpublish
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => apply({ type: 'inStock', inStock: true }, 'Mark these products as in stock?')}
          className={buttonClass}
        >
          Mark in stock
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => apply({ type: 'inStock', inStock: false }, 'Mark these products as out of stock?')}
          className={buttonClass}
        >
          Mark out of stock
        </button>

        <span className="w-px h-5 bg-ds-border mx-1" aria-hidden />

        <input
          type="number"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          placeholder="±%"
          className="w-20 px-2 py-1.5 rounded-lg border border-ds-border bg-bg text-xs text-cream"
        />
        <button
          type="button"
          disabled={busy || percent === '' || Number.isNaN(Number(percent))}
          onClick={() =>
            apply(
              { type: 'priceAdjust', percent: Number(percent) },
              `Change the price of these products by ${percent}%? This cannot be undone automatically.`
            )
          }
          className={buttonClass}
        >
          Adjust price
        </button>

        {collections.length > 0 && (
          <>
            <span className="w-px h-5 bg-ds-border mx-1" aria-hidden />
            <select
              disabled={busy}
              defaultValue=""
              onChange={(e) => {
                const [type, collectionId] = e.target.value.split(':')
                if (!collectionId) return
                const collection = collections.find((c) => c.id === collectionId)
                void apply(
                  type === 'add'
                    ? { type: 'addCollection', collectionId }
                    : { type: 'removeCollection', collectionId },
                  `${type === 'add' ? 'Add to' : 'Remove from'} "${collection?.titleEn}"?`
                )
                e.target.value = ''
              }}
              className="px-2 py-1.5 rounded-lg border border-ds-border bg-bg text-xs text-cream"
            >
              <option value="">Collections…</option>
              {collections.map((c) => (
                <option key={`add:${c.id}`} value={`add:${c.id}`}>
                  Add to {c.titleEn}
                </option>
              ))}
              {collections.map((c) => (
                <option key={`remove:${c.id}`} value={`remove:${c.id}`}>
                  Remove from {c.titleEn}
                </option>
              ))}
            </select>
          </>
        )}

        <span className="w-px h-5 bg-ds-border mx-1" aria-hidden />

        <button
          type="button"
          disabled={busy}
          onClick={() =>
            apply(
              { type: 'delete', confirm: 'DELETE' },
              'Delete these products permanently? Past orders keep their record, but this cannot be undone.'
            )
          }
          className="px-3 py-1.5 rounded-lg border border-error/40 text-xs font-medium text-error hover:bg-error/10 transition-colors disabled:opacity-50"
        >
          Delete
        </button>

        <button type="button" onClick={onClear} className="ml-auto text-xs text-cream-muted hover:text-cream underline">
          Clear selection
        </button>
      </div>

      {error && <p className="text-sm text-error mt-2">{error}</p>}
    </div>
  )
}
