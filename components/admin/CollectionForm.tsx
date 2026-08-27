'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export interface CollectionFormValues {
  slug?: string
  titleEn: string
  titleEs: string
  descriptionEn: string
  descriptionEs: string
  image: string
}

export function CollectionForm({ initial, collectionId }: { initial: CollectionFormValues; collectionId?: string }) {
  const router = useRouter()
  const [values, setValues] = useState<CollectionFormValues>(initial)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const update = <K extends keyof CollectionFormValues>(key: K, value: CollectionFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const url = collectionId ? `/api/admin/collections/${collectionId}` : '/api/admin/collections'
    const method = collectionId ? 'PATCH' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      setError(data.error ?? 'Could not save collection')
      return
    }
    router.push('/admin/collections')
    router.refresh()
  }

  const handleDelete = async () => {
    if (!collectionId) return
    if (!confirm(`Delete "${values.titleEn}"? Products stay, they just lose this collection.`)) return
    setDeleting(true)
    const res = await fetch(`/api/admin/collections/${collectionId}`, { method: 'DELETE' })
    setDeleting(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Could not delete collection')
      return
    }
    router.push('/admin/collections')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {!collectionId && (
        <Input label="Slug (URL, e.g. culture-bank)" value={values.slug ?? ''} onChange={(e) => update('slug', e.target.value)} required />
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input label="Title (English)" value={values.titleEn} onChange={(e) => update('titleEn', e.target.value)} required />
        <Input label="Title (Spanish)" value={values.titleEs} onChange={(e) => update('titleEs', e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-cream-muted mb-1.5">Description (English)</label>
          <textarea
            className="w-full bg-surface border border-ds-border rounded-xl px-4 py-3 text-cream text-sm min-h-24"
            value={values.descriptionEn}
            onChange={(e) => update('descriptionEn', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-cream-muted mb-1.5">Description (Spanish)</label>
          <textarea
            className="w-full bg-surface border border-ds-border rounded-xl px-4 py-3 text-cream text-sm min-h-24"
            value={values.descriptionEs}
            onChange={(e) => update('descriptionEs', e.target.value)}
          />
        </div>
      </div>

      <Input label="Image URL (optional)" value={values.image} onChange={(e) => update('image', e.target.value)} />

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" isLoading={saving}>
          {collectionId ? 'Save changes' : 'Create collection'}
        </Button>
        {collectionId && (
          <Button type="button" variant="danger" isLoading={deleting} onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}
