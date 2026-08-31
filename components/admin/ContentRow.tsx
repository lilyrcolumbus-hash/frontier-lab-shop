'use client'

import { useState } from 'react'
import type { ContentEntry } from '@/app/admin/content/page'

/** One editable piece of site text: the shipped default, plus an override per language. */
export function ContentRow({ entry, onSaved }: { entry: ContentEntry; onSaved: () => void }) {
  const [valueEn, setValueEn] = useState(entry.valueEn)
  const [valueEs, setValueEs] = useState(entry.valueEs)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Long copy needs room; a button label does not.
  const isLong = entry.defaultEn.length > 90
  const dirty = valueEn !== entry.valueEn || valueEs !== entry.valueEs

  const save = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      // An empty box means "use the shipped text", so the default is sent for that language.
      body: JSON.stringify({
        key: entry.key,
        valueEn: valueEn.trim() === '' && valueEs.trim() === '' ? '' : valueEn.trim() || entry.defaultEn,
        valueEs: valueEn.trim() === '' && valueEs.trim() === '' ? '' : valueEs.trim() || entry.defaultEs,
      }),
    })
    const data = await res.json().catch(() => null)
    setSaving(false)
    if (!res.ok) {
      setError(data?.error ?? 'Could not save that text')
      return
    }
    setSaved(true)
    onSaved()
  }

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-ds-border bg-bg text-sm text-cream placeholder:text-cream-muted/60'

  return (
    <div className="p-4 rounded-xl border border-ds-border bg-surface">
      <div className="flex items-start justify-between gap-3 mb-2">
        <code className="text-[11px] text-cream-muted/70 break-all">{entry.key}</code>
        {entry.edited && (
          <span className="text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded bg-accent-dim text-accent flex-shrink-0">
            Edited
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-cream-muted mb-1">English</label>
          {isLong ? (
            <textarea rows={3} value={valueEn} onChange={(e) => setValueEn(e.target.value)} placeholder={entry.defaultEn} className={inputClass} />
          ) : (
            <input type="text" value={valueEn} onChange={(e) => setValueEn(e.target.value)} placeholder={entry.defaultEn} className={inputClass} />
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-cream-muted mb-1">Spanish</label>
          {isLong ? (
            <textarea rows={3} value={valueEs} onChange={(e) => setValueEs(e.target.value)} placeholder={entry.defaultEs} className={inputClass} />
          ) : (
            <input type="text" value={valueEs} onChange={(e) => setValueEs(e.target.value)} placeholder={entry.defaultEs} className={inputClass} />
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <button
          type="button"
          onClick={save}
          disabled={saving || !dirty}
          className="px-3.5 py-1.5 rounded-lg bg-cream text-surface text-xs font-semibold hover:bg-cream/90 transition-colors disabled:opacity-40"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        {entry.edited && (
          <button
            type="button"
            onClick={() => {
              setValueEn('')
              setValueEs('')
            }}
            className="text-xs text-cream-muted hover:text-cream underline"
          >
            Clear to restore the original
          </button>
        )}
        {saved && <span className="text-xs text-accent">Saved</span>}
        {error && <span className="text-xs text-error">{error}</span>}
      </div>
    </div>
  )
}
