'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SITE_URL } from '@/lib/site-url'

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
  imageAlts: string[]
  isOrganic: boolean
  inStock: boolean
  tags: string[]
  status: 'draft' | 'active' | 'archived'
  collectionIds: string[]
  taxable: boolean
  /** Slugs of other products shown as "You'll Also Need" on the storefront. */
  relatedProducts: string[]
  /** Search-engine overrides. Empty means the product name and description are used. */
  metaTitle: string
  metaDescription: string
  variants: ProductFormVariant[]
}

export interface ProductFormVariant {
  /** Absent on a row the admin just added — the API creates it on save. */
  id?: string
  name: string
  sku: string
  price: number
  stock: number
  /** Both are optional: an empty string means "not recorded", which is not zero. */
  cost: string
  weightGrams: string
}

interface AvailableCollection {
  id: string
  titleEn: string
}

interface AvailableProduct {
  id: string
  slug: string
  nameEn: string
}

/** Profit and margin for one variant. Cost is per unit and never shown to shoppers. */
function marginLabel(priceCents: number, cost: string): string {
  const costCents = Number(cost)
  if (cost === '' || !Number.isFinite(costCents)) return 'Enter a cost'
  if (priceCents <= 0) return '—'
  const profit = priceCents - costCents
  return `$${(profit / 100).toFixed(2)} · ${Math.round((profit / priceCents) * 100)}%`
}

const CATEGORIES = ['kit', 'spawn', 'substrate', 'equipment', 'wellness', 'bundle']
const STATUSES = ['draft', 'active', 'archived'] as const

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
  const [availableCollections, setAvailableCollections] = useState<AvailableCollection[]>([])
  const [availableProducts, setAvailableProducts] = useState<AvailableProduct[]>([])
  const [relatedQuery, setRelatedQuery] = useState('')

  const update = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  // Mirrors what generateMetadata does on the storefront, so the preview is not a guess.
  const siteHost = SITE_URL.replace(/^https?:\/\//, '')
  const seoTitle = values.metaTitle.trim() || values.nameEn
  const seoDescription =
    values.metaDescription.trim() ||
    (values.descriptionEn.length > 160
      ? `${values.descriptionEn.replace(/\s+/g, ' ').slice(0, 160).trimEnd()}…`
      : values.descriptionEn)

  useEffect(() => {
    fetch('/api/admin/collections')
      .then((r) => r.json())
      .then((data) => setAvailableCollections(data.collections ?? []))
      .catch(() => setAvailableCollections([]))

    fetch('/api/admin/products')
      .then((r) => r.json())
      .then((data) => setAvailableProducts(data.products ?? []))
      .catch(() => setAvailableProducts([]))
  }, [])

  const toggleRelated = (slug: string) => {
    update(
      'relatedProducts',
      values.relatedProducts.includes(slug)
        ? values.relatedProducts.filter((s) => s !== slug)
        : [...values.relatedProducts, slug]
    )
  }

  const toggleCollection = (id: string) => {
    update('collectionIds', values.collectionIds.includes(id) ? values.collectionIds.filter((c) => c !== id) : [...values.collectionIds, id])
  }

  const handlePublish = async () => {
    update('status', 'active')
    // Publish immediately rather than waiting for a separate "Save" click — matches the
    // one-click Publish action in Shopify's own product editor.
    setError('')
    setSaving(true)
    const url = productId ? `/api/admin/products/${productId}` : '/api/admin/products'
    const method = productId ? 'PATCH' : 'POST'
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, status: 'active' }),
      })
      // A gateway timeout answers with HTML, not JSON — parsing it unguarded used to throw and
      // leave the button stuck on "Saving…" with nothing said.
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error ?? 'Could not publish product')
        return
      }
      router.push('/admin/products')
      router.refresh()
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (files: FileList) => {
    setUploading(true)
    setError('')
    const uploaded: string[] = []

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error ?? `Upload failed for ${file.name}`)
        break
      }
      uploaded.push(data.url)
    }

    setUploading(false)
    if (uploaded.length) {
      setValues((v) => ({
        ...v,
        images: [...v.images, ...uploaded],
        imageAlts: [...v.imageAlts, ...uploaded.map(() => '')],
      }))
    }
  }

  // `images` and `imageAlts` are index-aligned, so every reorder/removal has to move both.
  const removeImage = (index: number) =>
    setValues((v) => ({
      ...v,
      images: v.images.filter((_, i) => i !== index),
      imageAlts: v.imageAlts.filter((_, i) => i !== index),
    }))

  const moveImage = (index: number, direction: -1 | 1) =>
    setValues((v) => {
      const target = index + direction
      if (target < 0 || target >= v.images.length) return v
      const images = [...v.images]
      const imageAlts = [...v.imageAlts]
      ;[images[index], images[target]] = [images[target], images[index]]
      ;[imageAlts[index], imageAlts[target]] = [imageAlts[target] ?? '', imageAlts[index] ?? '']
      return { ...v, images, imageAlts }
    })

  const updateVariant = <K extends keyof ProductFormVariant>(index: number, key: K, value: ProductFormVariant[K]) =>
    setValues((v) => ({
      ...v,
      variants: v.variants.map((variant, i) => (i === index ? { ...variant, [key]: value } : variant)),
    }))

  const addVariant = () =>
    setValues((v) => ({
      ...v,
      variants: [...v.variants, { name: '', sku: '', price: v.price, stock: 0, cost: '', weightGrams: '' }],
    }))

  // A product always needs at least one variant — that row is what the cart and Stripe charge.
  const removeVariant = (index: number) =>
    setValues((v) =>
      v.variants.length <= 1 ? v : { ...v, variants: v.variants.filter((_, i) => i !== index) }
    )

  const setAlt = (index: number, text: string) =>
    setValues((v) => {
      const imageAlts = [...v.imageAlts]
      while (imageAlts.length < v.images.length) imageAlts.push('')
      imageAlts[index] = text
      return { ...v, imageAlts }
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const url = productId ? `/api/admin/products/${productId}` : '/api/admin/products'
    const method = productId ? 'PATCH' : 'POST'
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          nameEs: values.nameEs || values.nameEn,
          descriptionEs: values.descriptionEs || values.descriptionEn,
          variants: values.variants.map((v) => ({
            ...v,
            cost: v.cost === '' ? null : Number(v.cost),
            weightGrams: v.weightGrams === '' ? null : Number(v.weightGrams),
          })),
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error ?? 'Could not save product')
        return
      }
      router.push('/admin/products')
      router.refresh()
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!productId) return
    if (!confirm(`Delete "${values.nameEn}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? 'Could not delete product')
        return
      }
      router.push('/admin/products')
      router.refresh()
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setDeleting(false)
    }
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

      <Input label="Name" value={values.nameEn} onChange={(e) => update('nameEn', e.target.value)} required />

      <div>
        <label className="block text-sm font-medium text-cream-muted mb-1.5">Description</label>
        <textarea
          className="w-full bg-surface border border-ds-border rounded-none px-4 py-3 text-cream text-sm min-h-32"
          value={values.descriptionEn}
          onChange={(e) => update('descriptionEn', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-cream-muted mb-1.5">Category</label>
          <select
            className="w-full bg-surface border border-ds-border rounded-none px-4 py-3 text-cream text-sm"
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

      <div>
        <label className="block text-sm font-medium text-cream-muted mb-1.5">Variants</label>
        <p className="text-xs text-cream-muted mb-3">
          One row per version of this product a customer can buy — a size, a grain type, a pack
          count. With a single variant its price follows the product price above. With more than
          one, each sets its own price and shoppers pick before adding to the cart.
        </p>

        <div className="space-y-3 mb-3">
          {values.variants.map((variant, i) => (
            <div key={variant.id ?? `new-${i}`} className="p-3 rounded-none border border-ds-border bg-surface">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Input
                  label="Name"
                  value={variant.name}
                  onChange={(e) => updateVariant(i, 'name', e.target.value)}
                  placeholder="e.g. 10cc syringe"
                  required
                />
                <Input
                  label="SKU"
                  value={variant.sku}
                  onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                  required
                />
                <Input
                  label={values.variants.length === 1 ? 'Price (follows product)' : 'Price (cents)'}
                  type="number"
                  min={0}
                  value={values.variants.length === 1 ? values.price : variant.price}
                  disabled={values.variants.length === 1}
                  onChange={(e) => updateVariant(i, 'price', Number(e.target.value))}
                />
                <Input
                  label="Stock (units on hand)"
                  type="number"
                  min={0}
                  value={variant.stock}
                  onChange={(e) => updateVariant(i, 'stock', Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <Input
                  label="Cost per item (cents)"
                  type="number"
                  min={0}
                  placeholder="Not recorded"
                  value={variant.cost}
                  onChange={(e) => updateVariant(i, 'cost', e.target.value)}
                />
                <Input
                  label="Weight (grams)"
                  type="number"
                  min={0}
                  placeholder="Not recorded"
                  value={variant.weightGrams}
                  onChange={(e) => updateVariant(i, 'weightGrams', e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-cream-muted mb-1.5">Margin</label>
                  <p className="px-4 py-3 rounded-none border border-ds-border bg-elevated text-sm text-cream">
                    {marginLabel(values.variants.length === 1 ? values.price : variant.price, variant.cost)}
                  </p>
                </div>
              </div>

              {values.variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="mt-2 text-xs text-error hover:underline"
                >
                  Remove this variant
                </button>
              )}
            </div>
          ))}
        </div>

        <Button type="button" variant="outline" size="sm" onClick={addVariant}>
          Add variant
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium text-cream-muted mb-1.5">Images</label>
        <p className="text-xs text-cream-muted mb-3">
          The first image is the one shoppers see on the shop grid. Alt text describes the photo for
          screen readers and search engines.
        </p>

        <div className="space-y-3 mb-3">
          {values.images.map((img, i) => (
            <div key={img} className="flex items-start gap-3 p-3 rounded-none border border-ds-border bg-surface">
              <div className="relative w-20 h-20 rounded-none overflow-hidden border border-ds-border flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={values.imageAlts[i] || ''} className="w-full h-full object-cover" />
                {i === 0 && (
                  <span className="absolute bottom-0 inset-x-0 bg-bg/80 text-[10px] text-cream text-center py-0.5">
                    Main
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Input
                  label={`Alt text — image ${i + 1}`}
                  value={values.imageAlts[i] ?? ''}
                  onChange={(e) => setAlt(i, e.target.value)}
                  placeholder="e.g. Blue Oyster fruiting block ready to harvest"
                />
              </div>

              <div className="flex flex-col gap-1 pt-6">
                <button
                  type="button"
                  onClick={() => moveImage(i, -1)}
                  disabled={i === 0}
                  aria-label="Move image up"
                  className="px-2 py-1 rounded-none border border-ds-border text-xs text-cream-muted hover:text-cream disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(i, 1)}
                  disabled={i === values.images.length - 1}
                  aria-label="Move image down"
                  className="px-2 py-1 rounded-none border border-ds-border text-xs text-cream-muted hover:text-cream disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="px-2 py-1 rounded-none border border-ds-border text-xs text-error hover:bg-error/10"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleUpload(e.target.files)
            e.target.value = ''
          }}
        />
        <Button type="button" variant="outline" size="sm" isLoading={uploading} onClick={() => fileInputRef.current?.click()}>
          Upload images
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
        <label className="flex items-center gap-2 text-sm text-cream-muted cursor-pointer">
          <input type="checkbox" checked={values.taxable} onChange={(e) => update('taxable', e.target.checked)} />
          Charge tax
        </label>
      </div>

      <Input
        label="Tags (comma-separated)"
        value={values.tags.join(', ')}
        onChange={(e) => update('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
      />

      <div>
        <label className="block text-sm font-medium text-cream-muted mb-1.5">Collections</label>
        {availableCollections.length === 0 ? (
          <p className="text-sm text-cream-muted">
            No collections yet — <a href="/admin/collections/new" className="text-accent hover:underline">create one</a>.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableCollections.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-none border border-ds-border text-sm text-cream-muted cursor-pointer has-[:checked]:border-accent has-[:checked]:text-cream"
              >
                <input type="checkbox" checked={values.collectionIds.includes(c.id)} onChange={() => toggleCollection(c.id)} className="hidden" />
                {c.titleEn}
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-cream-muted mb-1.5">Related products</label>
        <p className="text-xs text-cream-muted/70 mb-2">
          Shown under &quot;You&apos;ll Also Need&quot; on this product&apos;s page, in the order picked here.
        </p>
        {values.relatedProducts.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {values.relatedProducts.map((slug) => {
              const match = availableProducts.find((p) => p.slug === slug)
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => toggleRelated(slug)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-none border border-accent text-sm text-cream"
                >
                  {match?.nameEn ?? slug}
                  <span aria-hidden className="text-cream-muted">&times;</span>
                </button>
              )
            })}
          </div>
        )}
        <input
          type="text"
          value={relatedQuery}
          onChange={(e) => setRelatedQuery(e.target.value)}
          placeholder="Search products to add"
          className="w-full px-3.5 py-2 rounded-none border border-ds-border bg-surface text-sm text-cream placeholder:text-cream-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <div className="mt-2 max-h-48 overflow-y-auto border border-ds-border rounded-none divide-y divide-ds-border">
          {availableProducts
            .filter((p) => p.slug !== values.slug && !values.relatedProducts.includes(p.slug))
            .filter((p) => {
              const q = relatedQuery.trim().toLowerCase()
              return !q || p.nameEn.toLowerCase().includes(q) || p.slug.includes(q)
            })
            .slice(0, 50)
            .map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => toggleRelated(p.slug)}
                className="w-full text-left px-3 py-2 text-sm text-cream-muted hover:bg-elevated hover:text-cream"
              >
                {p.nameEn}
              </button>
            ))}
        </div>
      </div>

      <div className="border border-ds-border rounded-none p-4 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-cream">Search engine listing</h3>
          <p className="text-xs text-cream-muted/70 mt-1">
            How this product appears on Google. Leave both empty to use the product name and the
            first 160 characters of its description.
          </p>
        </div>

        <div className="rounded-none bg-elevated px-4 py-3">
          <p className="text-xs text-cream-muted/60 truncate">
            {siteHost}/shop/{values.slug ?? 'product-url'}
          </p>
          <p className="text-[15px] text-accent truncate mt-0.5">{seoTitle || 'Product title'}</p>
          <p className="text-xs text-cream-muted mt-0.5 line-clamp-2">
            {seoDescription || 'Product description'}
          </p>
        </div>

        <div>
          <Input
            label="Page title"
            value={values.metaTitle}
            maxLength={70}
            onChange={(e) => update('metaTitle', e.target.value)}
          />
          <p className="text-xs text-cream-muted/60 mt-1">{values.metaTitle.length} of 70 characters used</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-cream-muted mb-1.5">Meta description</label>
          <textarea
            rows={3}
            maxLength={160}
            value={values.metaDescription}
            onChange={(e) => update('metaDescription', e.target.value)}
            className="w-full bg-surface border border-ds-border rounded-none px-4 py-2.5 text-cream text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <p className="text-xs text-cream-muted/60 mt-1">{values.metaDescription.length} of 160 characters used</p>
        </div>
      </div>

      <div className="border border-ds-border rounded-none p-4 space-y-3">
        <label className="block text-sm font-medium text-cream-muted">Status</label>
        <div className="flex items-center gap-4">
          <select
            className="bg-surface border border-ds-border rounded-none px-4 py-2.5 text-cream text-sm"
            value={values.status}
            onChange={(e) => update('status', e.target.value as ProductFormValues['status'])}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {values.status !== 'active' && (
            <Button type="button" size="sm" isLoading={saving} onClick={handlePublish}>
              Publish
            </Button>
          )}
        </div>
        <p className="text-xs text-cream-muted">
          {values.status === 'draft' && "Draft products don't appear on the live site until published."}
          {values.status === 'active' && 'Live on the site right now.'}
          {values.status === 'archived' && 'Hidden from the site, kept for records.'}
        </p>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" isLoading={saving}>
          {productId ? 'Save changes' : 'Save as draft'}
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
