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
  /** Empty ruleField means the collection is manual — products are picked one by one. */
  ruleField: '' | 'category' | 'subcategory' | 'tag'
  ruleValue: string
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
      body: JSON.stringify({
        ...values,
        titleEs: values.titleEs || values.titleEn,
        descriptionEs: values.descriptionEs || values.descriptionEn,
        // The API only accepts a complete rule; '' has to become null, not an empty string.
        ruleField: values.ruleField === '' ? null : values.ruleField,
        ruleValue: values.ruleField === '' ? null : values.ruleValue,
      }),
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
        <Input label="Title" value={values.titleEn} onChange={(e) => update('titleEn', e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-cream-muted mb-1.5">Description</label>
          <textarea
            className="w-full bg-surface border border-ds-border rounded-xl px-4 py-3 text-cream text-sm min-h-24"
            value={values.descriptionEn}
            onChange={(e) => update('descriptionEn', e.target.value)}
          />
        </div>
      </div>

      <Input label="Image URL (optional)" value={values.image} onChange={(e) => update('image', e.target.value)} />

      <div className="border border-ds-border rounded-xl p-4 space-y-3">
        <div>
          <h3 className="text-sm font-medium text-cream">How products get in</h3>
          <p className="text-xs text-cream-muted/70 mt-1">
            Manual means you pick each product from its own page. Automatic means every product
            matching the rule belongs — including ones you add later.
          </p>
        </div>

        <select
          value={values.ruleField}
          onChange={(e) => update('ruleField', e.target.value as CollectionFormValues['ruleField'])}
          className="w-full bg-surface border border-ds-border rounded-xl px-4 py-2.5 text-cream text-sm"
        >
          <option value="">Manual — I pick the products</option>
          <option value="category">Automatic — category is…</option>
          <option value="subcategory">Automatic — subcategory is…</option>
          <option value="tag">Automatic — has the tag…</option>
        </select>

        {values.ruleField !== '' && (
          <Input
            label="Matches this value"
            value={values.ruleValue}
            onChange={(e) => update('ruleValue', e.target.value)}
            placeholder={values.ruleField === 'tag' ? 'e.g. beginner' : 'e.g. substrate'}
            required
          />
        )}

        {values.ruleField !== '' && (
          <p className="text-xs text-cream-muted/70">
            Saving replaces this collection&apos;s products with everything that matches.
          </p>
        )}
      </div>

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
