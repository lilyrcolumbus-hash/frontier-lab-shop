'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface Section {
  key: string
  label: string
  description: string
  enabled: boolean
  sortOrder: number
}

export function HomeLayoutEditor({ initial }: { initial: Section[] }) {
  const router = useRouter()
  const [sections, setSections] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= sections.length) return
    const next = [...sections]
    ;[next[index], next[target]] = [next[target], next[index]]
    setSections(next)
    setSaved(false)
  }

  const toggle = (index: number) => {
    setSections((current) => current.map((s, i) => (i === index ? { ...s, enabled: !s.enabled } : s)))
    setSaved(false)
  }

  const save = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/admin/home-sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // Position in the list is the order — the index is authoritative, not the stored value.
        body: JSON.stringify({
          sections: sections.map((s, i) => ({ key: s.key, enabled: s.enabled, sortOrder: i })),
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error ?? 'Could not save the layout')
        return
      }
      setSaved(true)
      router.refresh()
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {sections.map((section, index) => (
          <div
            key={section.key}
            className={`flex items-center gap-3 p-3 rounded-xl border bg-surface ${
              section.enabled ? 'border-ds-border' : 'border-dashed border-ds-border opacity-60'
            }`}
          >
            <span className="text-xs text-cream-muted/60 w-5 text-right">{index + 1}</span>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-cream">{section.label}</p>
              <p className="text-xs text-cream-muted/70 truncate">{section.description}</p>
            </div>

            <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="text-cream-muted hover:text-cream disabled:opacity-30" aria-label="Move up">
              ↑
            </button>
            <button type="button" onClick={() => move(index, 1)} disabled={index === sections.length - 1} className="text-cream-muted hover:text-cream disabled:opacity-30" aria-label="Move down">
              ↓
            </button>

            <label className="flex items-center gap-2 text-xs text-cream-muted cursor-pointer whitespace-nowrap">
              <input type="checkbox" checked={section.enabled} onChange={() => toggle(index)} className="accent-accent" />
              Show
            </label>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-error">{error}</p>}
      {saved && <p className="text-sm text-accent">Home page saved.</p>}

      <Button type="button" onClick={save} isLoading={saving}>
        Save home page
      </Button>
    </div>
  )
}
