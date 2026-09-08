'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { BlockEditor } from '@/components/admin/BlockEditor'
import type { PageBlock } from '@/lib/page-blocks'

export interface PageFormValues {
  slug: string
  titleEn: string
  titleEs: string
  blocks: PageBlock[]
  status: 'draft' | 'active'
  metaTitle: string
  metaDescription: string
  showInFooter: boolean
  sortOrder: number
}

const NETWORK_ERROR = 'Could not reach the server. Check your connection and try again.'

export function PageForm({ initial, pageId }: { initial: PageFormValues; pageId?: string }) {
  const router = useRouter()
  const [values, setValues] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const update = <K extends keyof PageFormValues>(key: K, value: PageFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const res = await fetch(pageId ? `/api/admin/pages/${pageId}` : '/api/admin/pages', {
        method: pageId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, titleEs: values.titleEs || values.titleEn }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error ?? 'Could not save the page')
        return
      }
      router.push('/admin/pages')
      router.refresh()
    } catch {
      setError(NETWORK_ERROR)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!pageId) return
    if (!window.confirm(`Delete "${values.titleEn}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/pages/${pageId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? 'Could not delete the page')
        return
      }
      router.push('/admin/pages')
      router.refresh()
    } catch {
      setError(NETWORK_ERROR)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      <Input label="Title" value={values.titleEn} onChange={(e) => update('titleEn', e.target.value)} required />
      <Input
        label="Title (Spanish)"
        value={values.titleEs}
        onChange={(e) => update('titleEs', e.target.value)}
        placeholder="Leave empty to reuse the English title"
      />

      {!pageId && (
        <Input
          label="Web address"
          value={values.slug}
          onChange={(e) => update('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
          placeholder="about-our-lab"
          required
        />
      )}
      {pageId && (
        <p className="text-xs text-cream-muted/70">
          Address: /pages/{values.slug} — this cannot change once the page exists, so links to it keep working.
        </p>
      )}

      <BlockEditor blocks={values.blocks} onChange={(blocks) => update('blocks', blocks)} />

      <div className="border border-ds-border rounded-none p-4 space-y-3">
        <h3 className="text-sm font-medium text-cream">Search engine listing</h3>
        <Input label="Page title" value={values.metaTitle} maxLength={70} onChange={(e) => update('metaTitle', e.target.value)} />
        <Input label="Meta description" value={values.metaDescription} maxLength={160} onChange={(e) => update('metaDescription', e.target.value)} />
      </div>

      <div className="border border-ds-border rounded-none p-4 space-y-3">
        <div className="flex items-center gap-4">
          <select
            value={values.status}
            onChange={(e) => update('status', e.target.value as 'draft' | 'active')}
            className="bg-surface border border-ds-border rounded-none px-4 py-2.5 text-cream text-sm"
          >
            <option value="draft">Draft</option>
            <option value="active">Published</option>
          </select>
          <p className="text-xs text-cream-muted">
            {values.status === 'active' ? 'Live on the site right now.' : 'Only you can see this page.'}
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm text-cream-muted cursor-pointer">
          <input type="checkbox" checked={values.showInFooter} onChange={(e) => update('showInFooter', e.target.checked)} />
          Link this page from the footer
        </label>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" isLoading={saving}>
          {pageId ? 'Save changes' : 'Create page'}
        </Button>
        {pageId && (
          <Button type="button" variant="danger" isLoading={deleting} onClick={remove}>
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}
