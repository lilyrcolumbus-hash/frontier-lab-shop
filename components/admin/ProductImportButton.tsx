'use client'

import { useRef, useState } from 'react'

interface ImportResult {
  updatedVariants: number
  updatedProducts: number
  skipped: string[]
}

/** Uploads a CSV of edits. Pairs with the export, which produces exactly this shape. */
export function ProductImportButton({ onDone }: { onDone: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState('')

  const upload = async (file: File) => {
    setBusy(true)
    setError('')
    setResult(null)

    const form = new FormData()
    form.append('file', file)
    try {
      const res = await fetch('/api/admin/products/import', { method: 'POST', body: form })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error ?? 'Could not import that file')
        return
      }
      setResult(data)
      onDone()
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void upload(file)
        }}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="px-4 py-2 rounded-none border border-ds-border text-sm font-medium text-cream hover:bg-elevated transition-colors disabled:opacity-50"
      >
        {busy ? 'Importing…' : 'Import CSV'}
      </button>

      {error && <p className="text-xs text-error mt-2">{error}</p>}
      {result && (
        <div className="text-xs mt-2">
          <p className="text-accent">
            Updated {result.updatedVariants} variants across {result.updatedProducts} products.
          </p>
          {result.skipped.length > 0 && (
            <ul className="text-cream-muted mt-1 space-y-0.5">
              {result.skipped.slice(0, 5).map((line) => (
                <li key={line}>{line}</li>
              ))}
              {result.skipped.length > 5 && <li>…and {result.skipped.length - 5} more rows skipped.</li>}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
