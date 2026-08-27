'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export interface ProductFormValues {
  slug?: string
  nameEn: string
  nameEs: string
  descriptionEn: string
  descriptionEs: string
  category: string
  subcategory: string
  price: number
  compareAtPrice?: number | null
  images: string[]
  isOrganic: boolean
  inStock: boolean
  tags: string[]
  sku?: string
  stock?: number
}

const CATEGORIES = ['kit', 'spawn', 'substrate', 'equipment', 'wellness', 'bundle']

export function ProductForm({
  initial,
  productId,
}: {
  initial: ProductFormValues
  productId?: string
}) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [values, setValues] = useState<ProductFormValues>(initial)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const update = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const handleUpload = async (file: File) => {
    setUploading(true)
    setError('')
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
    const data = await res.json()
    setUploading(false)
    if (!res.ok) {
      setError(data.error ?? 'Upload failed')
      return
    }
    update('images', [...values.images, data.url])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const url = productId ? `/api/admin/products/${productId}` : '/api/admin/products'
    const method = productId ? 'PATCH' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      setError(data.error ?? 'Could not save product')
      return
    }
    router.push('/admin/products')
    router.refresh()
  }

  const handleDelete = async () => {
    if (!productId) return
    if (!confirm(`Delete "${values.nameEn}"? This cannot be undone.`)) return
    setDeleting(true)
    const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
    setDeleting(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Could not delete product')
      return
    }
    router.push('/admin/products')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {!productId && (
        <Input
          label="Slug (URL, e.g. lions-mane-liquid-culture)"
          value={values.slug ?? ''}
          onChange={(e) => update('slug', e.target.value)}
          required
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input label="Name (English)" value={values.nameEn} onChange={(e) => update('nameEn', e.target.value)} required />
        <Input label="Name (Spanish)" value={values.nameEs} onChange={(e) => update('nameEs', e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-cream-muted mb-1.5">Description (English)</label>
          <textarea
            className="w-full bg-surface border border-ds-border rounded-xl px-4 py-3 text-cream text-sm min-h-32"
            value={values.descriptionEn}
            onChange={(e) => update('descriptionEn', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-cream-muted mb-1.5">Description (Spanish)</label>
          <textarea
            className="w-full bg-surface border border-ds-border rounded-xl px-4 py-3 text-cream text-sm min-h-32"
            value={values.descriptionEs}
            onChange={(e) => update('descriptionEs', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-cream-muted mb-1.5">Category</label>
          <select
            className="w-full bg-surface border border-ds-border rounded-xl px-4 py-3 text-cream text-sm"
            value={values.category}
            onChange={(e) => update('category', e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <Input label="Subcategory" value={values.subcategory} onChange={(e) => update('subcategory', e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price (cents, e.g. 1799 = $17.99)"
          type="number"
          value={values.price}
          onChange={(e) => update('price', Number(e.target.value))}
          required
        />
        <Input
          label="Compare-at price (cents, optional)"
          type="number"
          value={values.compareAtPrice ?? ''}
          onChange={(e) => update('compareAtPrice', e.target.value ? Number(e.target.value) : null)}
        />
      </div>

      {!productId && (
        <div className="grid grid-cols-2 gap-4">
          <Input label="SKU" value={values.sku ?? ''} onChange={(e) => update('sku', e.target.value)} required />
          <Input
            label="Stock"
            type="number"
            value={values.stock ?? 0}
            onChange={(e) => update('stock', Number(e.target.value))}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-cream-muted mb-1.5">Images</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {values.images.map((img, i) => (
            <div key={img} className="relative w-20 h-20 rounded-lg overflow-hidden border border-ds-border group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => update('images', values.images.filter((_, idx) => idx !== i))}
                className="absolute inset-0 bg-bg/70 opacity-0 group-hover:opacity-100 transition-opacity text-error text-xs font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />
        <Button type="button" variant="outline" size="sm" isLoading={uploading} onClick={() => fileInputRef.current?.click()}>
          Upload image
        </Button>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-cream-muted cursor-pointer">
          <input type="checkbox" checked={values.isOrganic} onChange={(e) => update('isOrganic', e.target.checked)} />
          Organic
        </label>
        <label className="flex items-center gap-2 text-sm text-cream-muted cursor-pointer">
          <input type="checkbox" checked={values.inStock} onChange={(e) => update('inStock', e.target.checked)} />
          In stock
        </label>
      </div>

      <Input
        label="Tags (comma-separated)"
        value={values.tags.join(', ')}
        onChange={(e) => update('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
      />

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" isLoading={saving}>
          {productId ? 'Save changes' : 'Create product'}
        </Button>
        {productId && (
          <Button type="button" variant="danger" isLoading={deleting} onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}
