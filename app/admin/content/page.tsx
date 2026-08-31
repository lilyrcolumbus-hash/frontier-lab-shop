'use client'

import { useMemo, useState } from 'react'
import { useAdminList } from '@/components/admin/useAdminList'
import { ListState } from '@/components/admin/ListState'
import { ContentRow } from '@/components/admin/ContentRow'

export interface ContentEntry {
  key: string
  section: string
  defaultEn: string
  defaultEs: string
  valueEn: string
  valueEs: string
  edited: boolean
}

export default function AdminContentPage() {
  const { data: entries, error, reload } = useAdminList<ContentEntry>('/api/admin/content', 'entries')
  const [query, setQuery] = useState('')
  const [section, setSection] = useState('')
  const [onlyEdited, setOnlyEdited] = useState(false)

  const sections = useMemo(
    () => Array.from(new Set((entries ?? []).map((e) => e.section))).sort(),
    [entries]
  )

  const filtered = useMemo(() => {
    if (!entries) return []
    const q = query.trim().toLowerCase()
    return entries.filter((entry) => {
      if (section && entry.section !== section) return false
      if (onlyEdited && !entry.edited) return false
      if (!q) return true
      // Searching the text itself is how you find a phrase you saw on the site.
      return (
        entry.key.toLowerCase().includes(q) ||
        entry.defaultEn.toLowerCase().includes(q) ||
        entry.defaultEs.toLowerCase().includes(q)
      )
    })
  }, [entries, query, section, onlyEdited])

  const editedCount = (entries ?? []).filter((e) => e.edited).length

  return (
    <div className="max-w-4xl">
      <h1 className="font-body font-bold text-2xl text-cream mb-2">Content</h1>
      <p className="text-sm text-cream-muted mb-1">
        Every piece of text on the storefront. Leave a box empty to keep the text the site ships
        with; clear both to undo an edit.
      </p>
      <p className="text-xs text-cream-muted/70 mb-6">
        Saved changes appear on the site within a minute. {editedCount} of {entries?.length ?? 0}{' '}
        edited so far.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the text or its name"
          className="flex-1 min-w-[240px] px-3.5 py-2 rounded-lg border border-ds-border bg-surface text-sm text-cream placeholder:text-cream-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="px-3.5 py-2 rounded-lg border border-ds-border bg-surface text-sm text-cream"
        >
          <option value="">All sections</option>
          {sections.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-cream-muted cursor-pointer">
          <input
            type="checkbox"
            checked={onlyEdited}
            onChange={(e) => setOnlyEdited(e.target.checked)}
            className="accent-accent"
          />
          Only edited
        </label>
      </div>

      {entries === null ? (
        <ListState error={error} onRetry={reload} />
      ) : filtered.length === 0 ? (
        <div className="border border-ds-border rounded-xl bg-surface py-16 text-center text-cream-muted text-sm">
          No text matches that.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.slice(0, 60).map((entry) => (
            <ContentRow key={entry.key} entry={entry} onSaved={reload} />
          ))}
          {filtered.length > 60 && (
            <p className="text-xs text-cream-muted/70 py-3">
              Showing the first 60 of {filtered.length}. Narrow the search to see the rest.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
