'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export interface SpeciesFormValues {
  slug?: string
  commonName: string
  scientificName: string
  family: string
  order: string
  type: string
  difficulty: string
  substrate: string[]
  colonizationWeeksMin: number
  colonizationWeeksMax: number
  fruitingTempFMin: number
  fruitingTempFMax: number
  fruitingTempCMin: number
  fruitingTempCMax: number
  expectedFlushes: number
  biologicalEfficiency: string
  betaGlucanContent: string
  indoorOutdoor: string
  descriptionEn: string
  descriptionEs: string
  cultivationNotesEn: string
  cultivationNotesEs: string
  medicalNotesEn: string
  medicalNotesEs: string
  cookingNotesEn: string
  cookingNotesEs: string
  lookalikes: string[]
  imageUrl: string
  thumbnailUrl: string
}

const TYPES = ['edible', 'medicinal', 'toxic', 'psychoactive', 'wild-only']
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced']
const INDOOR_OUTDOOR = ['indoor', 'outdoor', 'both']

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-cream-muted mb-1.5">{label}</label>
      <textarea
        className="w-full bg-surface border border-ds-border rounded-none px-4 py-3 text-cream text-sm min-h-24"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  )
}

export function SpeciesForm({ initial, speciesId }: { initial: SpeciesFormValues; speciesId?: string }) {
  const router = useRouter()
  const [values, setValues] = useState<SpeciesFormValues>(initial)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const update = <K extends keyof SpeciesFormValues>(key: K, value: SpeciesFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const url = speciesId ? `/api/admin/species/${speciesId}` : '/api/admin/species'
    const method = speciesId ? 'PATCH' : 'POST'
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          descriptionEs: values.descriptionEs || values.descriptionEn,
          cultivationNotesEs: values.cultivationNotesEs || values.cultivationNotesEn,
          medicalNotesEs: values.medicalNotesEs || values.medicalNotesEn,
          cookingNotesEs: values.cookingNotesEs || values.cookingNotesEn,
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error ?? 'Could not save species')
        return
      }
      router.push('/admin/species')
      router.refresh()
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!speciesId) return
    if (!confirm(`Delete "${values.commonName}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/species/${speciesId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? 'Could not delete species')
        return
      }
      router.push('/admin/species')
      router.refresh()
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {!speciesId && (
        <Input label="Slug (URL, e.g. lions-mane)" value={values.slug ?? ''} onChange={(e) => update('slug', e.target.value)} required />
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input label="Common name" value={values.commonName} onChange={(e) => update('commonName', e.target.value)} required />
        <Input
          label="Scientific name"
          value={values.scientificName}
          onChange={(e) => update('scientificName', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Family" value={values.family} onChange={(e) => update('family', e.target.value)} required />
        <Input label="Order" value={values.order} onChange={(e) => update('order', e.target.value)} required />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-cream-muted mb-1.5">Type</label>
          <select
            className="w-full bg-surface border border-ds-border rounded-none px-4 py-3 text-cream text-sm"
            value={values.type}
            onChange={(e) => update('type', e.target.value)}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-cream-muted mb-1.5">Difficulty</label>
          <select
            className="w-full bg-surface border border-ds-border rounded-none px-4 py-3 text-cream text-sm"
            value={values.difficulty}
            onChange={(e) => update('difficulty', e.target.value)}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-cream-muted mb-1.5">Indoor/Outdoor</label>
          <select
            className="w-full bg-surface border border-ds-border rounded-none px-4 py-3 text-cream text-sm"
            value={values.indoorOutdoor}
            onChange={(e) => update('indoorOutdoor', e.target.value)}
          >
            {INDOOR_OUTDOOR.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input
        label="Substrate (comma-separated)"
        value={values.substrate.join(', ')}
        onChange={(e) => update('substrate', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Colonization weeks (min)"
          type="number"
          value={values.colonizationWeeksMin}
          onChange={(e) => update('colonizationWeeksMin', Number(e.target.value))}
        />
        <Input
          label="Colonization weeks (max)"
          type="number"
          value={values.colonizationWeeksMax}
          onChange={(e) => update('colonizationWeeksMax', Number(e.target.value))}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Input label="Fruiting °F min" type="number" value={values.fruitingTempFMin} onChange={(e) => update('fruitingTempFMin', Number(e.target.value))} />
        <Input label="Fruiting °F max" type="number" value={values.fruitingTempFMax} onChange={(e) => update('fruitingTempFMax', Number(e.target.value))} />
        <Input label="Fruiting °C min" type="number" value={values.fruitingTempCMin} onChange={(e) => update('fruitingTempCMin', Number(e.target.value))} />
        <Input label="Fruiting °C max" type="number" value={values.fruitingTempCMax} onChange={(e) => update('fruitingTempCMax', Number(e.target.value))} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Expected flushes"
          type="number"
          value={values.expectedFlushes}
          onChange={(e) => update('expectedFlushes', Number(e.target.value))}
        />
        <Input
          label="Biological efficiency"
          value={values.biologicalEfficiency}
          onChange={(e) => update('biologicalEfficiency', e.target.value)}
        />
        <Input
          label="Beta-glucan content"
          value={values.betaGlucanContent}
          onChange={(e) => update('betaGlucanContent', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextArea label="Description" value={values.descriptionEn} onChange={(v) => update('descriptionEn', v)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextArea label="Cultivation notes" value={values.cultivationNotesEn} onChange={(v) => update('cultivationNotesEn', v)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextArea label="Medical notes" value={values.medicalNotesEn} onChange={(v) => update('medicalNotesEn', v)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextArea label="Cooking notes" value={values.cookingNotesEn} onChange={(v) => update('cookingNotesEn', v)} />
      </div>

      <Input
        label="Lookalikes (comma-separated)"
        value={values.lookalikes.join(', ')}
        onChange={(e) => update('lookalikes', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input label="Image URL" value={values.imageUrl} onChange={(e) => update('imageUrl', e.target.value)} required />
        <Input label="Thumbnail URL" value={values.thumbnailUrl} onChange={(e) => update('thumbnailUrl', e.target.value)} required />
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" isLoading={saving}>
          {speciesId ? 'Save changes' : 'Create species'}
        </Button>
        {speciesId && (
          <Button type="button" variant="danger" isLoading={deleting} onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}
