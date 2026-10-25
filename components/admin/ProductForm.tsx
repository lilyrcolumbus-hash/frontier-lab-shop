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
  /** Short selling points shown as cards above the tabs. */
  keyBenefits: { icon: 'brain' | 'shield' | 'heart' | 'leaf' | 'activity' | 'zap' | 'sun' | 'droplet'; label: string; detail: string }[]
  /** "Growing details" block. Leave every box empty to hide it. */
  growing: {
    difficulty: string
    colonizationTime: string
    fruitingTempF: string
    fruitingTempC: string
    idealSubstrate: string
    expectedYield: string
    indoorOutdoor: string
  }
  /** "Bag details" block for substrate and grain products. Leave every box empty to hide it. */
  bag: {
    bagSize: string
    sterilization: string
    moisture: string
    colonizationEstimate: string
    recommendedInoculation: string
    shelfLife: string
  }
  /** One step per line. Empty means the product page has no "How to use" tab. */
  howToUse: string[]
  /** Science text for the "Science" tab. Empty hides the tab. */
  science: string
  /** Question and answer pairs for the "FAQ" tab. None hides the tab. */
  faqs: { question: string; answer: string }[]
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

const HOW_TO_USE_POINTS = [
  { label: 'Prepare', hint: 'What to prepare or check before starting (equipment, cleaning, what the customer needs on hand).' },
  { label: 'Start / inoculate', hint: 'The first action: how to open it, inoculate it, or mix it in. Quantities and ratios if they matter.' },
  { label: 'Incubate', hint: 'Where to keep it, the temperature range, and how many days or weeks it takes.' },
  { label: 'Fruit', hint: 'What changes to make for fruiting: humidity, fresh air, light, temperature.' },
  { label: 'Harvest', hint: 'How to tell it is ready and how to pick it.' },
  { label: 'Store / next steps', hint: 'How to store what is left, shelf life, and what to do next.' },
]

const FAQ_SUGGESTIONS = [
  'What is included?',
  'How long does it last?',
  'How should I store it?',
  'What if it arrives damaged or contaminated?',
  'How do I know it is working?',
]

function moveItem<T>(list: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction
  if (target < 0 || target >= list.length) return list
  const copy = [...list]
  ;[copy[index], copy[target]] = [copy[target], copy[index]]
  return copy
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

    for (const original of Array.from(files)) {
      // iPhone photos are HEIC, which browsers cannot show and the server rejects. Convert them
      // to JPEG here, in the browser, before uploading. Chrome reports an empty type for HEIC,
      // so the file name is checked too.
      let file = original
      if (/\.(heic|heif)$/i.test(original.name) || /image\/hei[cf]/i.test(original.type)) {
        try {
          const { default: heic2any } = await import('heic2any')
          const converted = await heic2any({ blob: original, toType: 'image/jpeg', quality: 0.9 })
          const blob = Array.isArray(converted) ? converted[0] : converted
          file = new File([blob], original.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' })
        } catch {
          setError(`Could not convert ${original.name} to JPEG. Export it as JPEG and try again.`)
          break
        }
      }

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

    // For an existing product, attach the photos right away instead of waiting for "Save
    // changes", so closing or reloading the page cannot lose them.
    if (uploaded.length && productId) {
      try {
        const attach = await fetch(`/api/admin/products/${productId}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: uploaded }),
        })
        if (!attach.ok) throw new Error('attach failed')
      } catch {
        setError('Photos uploaded but not saved to the product yet. Press "Save changes" to keep them.')
      }
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
        <p className="text-xs text-cream-muted/70 mb-2">
          Cover: what it is, what is inside, who it is for, the result the customer gets, and anything they must know before buying.
          Leave a blank line between paragraphs.
        </p>
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
          accept="image/*,.heic,.heif"
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
        <label className="block text-sm font-medium text-cream-muted mb-1.5">Key benefits</label>
        <p className="text-xs text-cream-muted/70 mb-2">
          Up to four short selling points shown as cards on the product page. A label (2 to 4 words) and one sentence that is true for this product.
        </p>
        <div className="space-y-3">
          {values.keyBenefits.map((benefit, index) => (
            <div key={index} className="grid gap-2 border border-ds-border bg-surface p-3 sm:grid-cols-[120px_1fr]">
              <select
                className="bg-bg border border-ds-border rounded-none px-3 py-2 text-cream text-sm"
                value={benefit.icon}
                onChange={(e) =>
                  update('keyBenefits', values.keyBenefits.map((item, i) => (i === index ? { ...item, icon: e.target.value as typeof benefit.icon } : item)))
                }
              >
                {['brain', 'shield', 'heart', 'leaf', 'activity', 'zap', 'sun', 'droplet'].map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <div className="space-y-2">
                <input
                  className="w-full bg-bg border border-ds-border rounded-none px-3 py-2 text-cream text-sm"
                  placeholder="Label"
                  value={benefit.label}
                  onChange={(e) => update('keyBenefits', values.keyBenefits.map((item, i) => (i === index ? { ...item, label: e.target.value } : item)))}
                />
                <textarea
                  className="w-full bg-bg border border-ds-border rounded-none px-3 py-2 text-cream text-sm min-h-16"
                  placeholder="One sentence"
                  value={benefit.detail}
                  onChange={(e) => update('keyBenefits', values.keyBenefits.map((item, i) => (i === index ? { ...item, detail: e.target.value } : item)))}
                />
                <button type="button" className="text-xs text-error" onClick={() => update('keyBenefits', values.keyBenefits.filter((_, i) => i !== index))}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        {values.keyBenefits.length < 8 && (
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => update('keyBenefits', [...values.keyBenefits, { icon: 'leaf', label: '', detail: '' }])}>
            Add benefit
          </Button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-cream-muted mb-1.5">Growing details</label>
        <p className="text-xs text-cream-muted/70 mb-2">
          The &quot;at a glance&quot; block for products that are grown. Leave every box empty and the block does not appear.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-xs text-cream-muted">Difficulty
            <select className="mt-1 w-full bg-surface border border-ds-border rounded-none px-3 py-2 text-cream text-sm" value={values.growing.difficulty} onChange={(e) => update('growing', { ...values.growing, difficulty: e.target.value })}>
              <option value="">Not set</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
            </select>
          </label>
          <label className="text-xs text-cream-muted">Indoor or outdoor
            <select className="mt-1 w-full bg-surface border border-ds-border rounded-none px-3 py-2 text-cream text-sm" value={values.growing.indoorOutdoor} onChange={(e) => update('growing', { ...values.growing, indoorOutdoor: e.target.value })}>
              <option value="">Not set</option><option value="indoor">Indoor</option><option value="outdoor">Outdoor</option><option value="both">Both</option>
            </select>
          </label>
          <Input label="Colonization time" placeholder="e.g. 2 to 3 weeks" value={values.growing.colonizationTime} onChange={(e) => update('growing', { ...values.growing, colonizationTime: e.target.value })} />
          <Input label="Expected yield" placeholder="Only what you have measured" value={values.growing.expectedYield} onChange={(e) => update('growing', { ...values.growing, expectedYield: e.target.value })} />
          <Input label="Fruiting temperature (°F)" placeholder="e.g. 60 to 75" value={values.growing.fruitingTempF} onChange={(e) => update('growing', { ...values.growing, fruitingTempF: e.target.value })} />
          <Input label="Fruiting temperature (°C)" placeholder="e.g. 15 to 24" value={values.growing.fruitingTempC} onChange={(e) => update('growing', { ...values.growing, fruitingTempC: e.target.value })} />
          <Input label="Ideal substrate" placeholder="What it grows on" value={values.growing.idealSubstrate} onChange={(e) => update('growing', { ...values.growing, idealSubstrate: e.target.value })} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-cream-muted mb-1.5">Bag details</label>
        <p className="text-xs text-cream-muted/70 mb-2">
          For bags of grain or substrate. Leave every box empty and the block does not appear.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Bag size" placeholder="e.g. 3 lb" value={values.bag.bagSize} onChange={(e) => update('bag', { ...values.bag, bagSize: e.target.value })} />
          <Input label="Sterilization" placeholder="How it is sterilized" value={values.bag.sterilization} onChange={(e) => update('bag', { ...values.bag, sterilization: e.target.value })} />
          <Input label="Moisture" value={values.bag.moisture} onChange={(e) => update('bag', { ...values.bag, moisture: e.target.value })} />
          <Input label="Colonization estimate" value={values.bag.colonizationEstimate} onChange={(e) => update('bag', { ...values.bag, colonizationEstimate: e.target.value })} />
          <Input label="Recommended inoculation" value={values.bag.recommendedInoculation} onChange={(e) => update('bag', { ...values.bag, recommendedInoculation: e.target.value })} />
          <Input label="Shelf life" value={values.bag.shelfLife} onChange={(e) => update('bag', { ...values.bag, shelfLife: e.target.value })} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-cream-muted mb-1.5">How to use</label>
        <p className="text-xs text-cream-muted/70 mb-3">
          Shown in the &quot;How To Use&quot; tab, step by step. Write only what is true for this product. With no steps the tab does not appear.
          Add a step from the points below, or write your own.
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {HOW_TO_USE_POINTS.map((point) => (
            <button
              key={point.label}
              type="button"
              className="border border-ds-border bg-surface px-3 py-1.5 text-xs text-cream-muted hover:text-cream"
              onClick={() => update('howToUse', [...values.howToUse, ''])}
              title={point.hint}
            >
              + {point.label}
            </button>
          ))}
        </div>
        <ol className="space-y-3">
          {values.howToUse.map((step, index) => (
            <li key={index} className="flex gap-3 items-start border border-ds-border bg-surface p-3">
              <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center border border-ds-border font-mono text-[11px] text-cream-muted">
                {index + 1}
              </span>
              <textarea
                className="w-full bg-bg border border-ds-border rounded-none px-3 py-2 text-cream text-sm min-h-16"
                placeholder={HOW_TO_USE_POINTS[index]?.hint ?? 'Describe this step'}
                value={step}
                onChange={(e) => update('howToUse', values.howToUse.map((item, i) => (i === index ? e.target.value : item)))}
              />
              <div className="flex flex-col gap-1 text-xs">
                <button
                  type="button"
                  disabled={index === 0}
                  className="text-cream-muted disabled:opacity-30"
                  onClick={() => update('howToUse', moveItem(values.howToUse, index, -1))}
                >
                  Up
                </button>
                <button
                  type="button"
                  disabled={index === values.howToUse.length - 1}
                  className="text-cream-muted disabled:opacity-30"
                  onClick={() => update('howToUse', moveItem(values.howToUse, index, 1))}
                >
                  Down
                </button>
                <button type="button" className="text-error" onClick={() => update('howToUse', values.howToUse.filter((_, i) => i !== index))}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ol>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => update('howToUse', [...values.howToUse, ''])}>
          Add step
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium text-cream-muted mb-1.5">Science</label>
        <p className="text-xs text-cream-muted/70 mb-2">
          Shown in the &quot;Science&quot; tab. Say what the research shows: the compound or process, the effect, and where it comes
          from. Only claims you can back up. Leave a blank line between paragraphs. Empty means the tab does not appear.
        </p>
        <textarea
          className="w-full bg-surface border border-ds-border rounded-none px-4 py-3 text-cream text-sm min-h-32"
          value={values.science}
          onChange={(e) => update('science', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cream-muted mb-1.5">FAQ</label>
        <p className="text-xs text-cream-muted/70 mb-2">Shown in the &quot;FAQ&quot; tab. No questions means the tab does not appear.</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {FAQ_SUGGESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              className="border border-ds-border bg-surface px-3 py-1.5 text-xs text-cream-muted hover:text-cream"
              onClick={() => update('faqs', [...values.faqs, { question, answer: '' }])}
            >
              + {question}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {values.faqs.map((faq, index) => (
            <div key={index} className="border border-ds-border bg-surface p-3 space-y-2">
              <input
                className="w-full bg-bg border border-ds-border rounded-none px-3 py-2 text-cream text-sm"
                placeholder="Question"
                value={faq.question}
                onChange={(e) => update('faqs', values.faqs.map((item, i) => (i === index ? { ...item, question: e.target.value } : item)))}
              />
              <textarea
                className="w-full bg-bg border border-ds-border rounded-none px-3 py-2 text-cream text-sm min-h-20"
                placeholder="Answer"
                value={faq.answer}
                onChange={(e) => update('faqs', values.faqs.map((item, i) => (i === index ? { ...item, answer: e.target.value } : item)))}
              />
              <button
                type="button"
                className="text-xs text-error"
                onClick={() => update('faqs', values.faqs.filter((_, i) => i !== index))}
              >
                Remove question
              </button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => update('faqs', [...values.faqs, { question: '', answer: '' }])}>
          Add question
        </Button>
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
