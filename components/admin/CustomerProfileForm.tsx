'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CustomerProfileForm({
  email,
  initialNotes,
  initialTags,
}: {
  email: string
  initialNotes: string
  initialTags: string[]
}) {
  const router = useRouter()
  const [notes, setNotes] = useState(initialNotes)
  const [tags, setTags] = useState(initialTags.join(', '))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const save = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    const res = await fetch(`/api/admin/customers/${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notes,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      }),
    })
    const data = await res.json().catch(() => null)
    setSaving(false)
    if (!res.ok) {
      setError(data?.error ?? 'Could not save')
      return
    }
    setSaved(true)
    router.refresh()
  }

  return (
    <div className="bg-surface border border-ds-border rounded-xl p-5 space-y-4">
      <div>
        <h2 className="font-semibold text-cream text-sm">Notes and tags</h2>
        <p className="text-xs text-cream-muted/70 mt-1">
          Only you see this. Tags group customers into segments you can filter by on the list.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-cream-muted mb-1.5">Tags (comma-separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="vip, wholesale, repeat"
          className="w-full px-3 py-2 rounded-lg border border-ds-border bg-bg text-sm text-cream placeholder:text-cream-muted"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-cream-muted mb-1.5">Notes</label>
        <textarea
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything worth remembering about this customer"
          className="w-full px-3 py-2 rounded-lg border border-ds-border bg-bg text-sm text-cream placeholder:text-cream-muted"
        />
      </div>

      {error && <p className="text-sm text-error">{error}</p>}
      {saved && <p className="text-sm text-accent">Saved.</p>}

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="px-4 py-2 rounded-full bg-amber text-bg text-sm font-semibold hover:bg-amber-bright transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save'}
      </button>
    </div>
  )
}
