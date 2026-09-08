'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export interface PostFormValues {
  slug: string
  titleEn: string
  titleEs: string
  excerptEn: string
  excerptEs: string
  bodyEn: string
  bodyEs: string
  coverImage: string
  status: 'draft' | 'active'
  metaTitle: string
  metaDescription: string
}

const NETWORK_ERROR = 'Could not reach the server. Check your connection and try again.'
const areaClass =
  'w-full px-3 py-2 rounded-none border border-ds-border bg-bg text-sm text-cream placeholder:text-cream-muted/60'

export function PostForm({ initial, postId }: { initial: PostFormValues; postId?: string }) {
  const router = useRouter()
  const [values, setValues] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const update = <K extends keyof PostFormValues>(key: K, value: PostFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const res = await fetch(postId ? `/api/admin/posts/${postId}` : '/api/admin/posts', {
        method: postId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          titleEs: values.titleEs || values.titleEn,
          coverImage: values.coverImage || null,
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error ?? 'Could not save the post')
        return
      }
      router.push('/admin/blog')
      router.refresh()
    } catch {
      setError(NETWORK_ERROR)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!postId) return
    if (!window.confirm(`Delete "${values.titleEn}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/posts/${postId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? 'Could not delete the post')
        return
      }
      router.push('/admin/blog')
      router.refresh()
    } catch {
      setError(NETWORK_ERROR)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5 max-w-3xl">
      <Input label="Title" value={values.titleEn} onChange={(e) => update('titleEn', e.target.value)} required />
      <Input
        label="Title (Spanish)"
        value={values.titleEs}
        onChange={(e) => update('titleEs', e.target.value)}
        placeholder="Leave empty to reuse the English title"
      />

      {!postId && (
        <Input
          label="Web address"
          value={values.slug}
          onChange={(e) => update('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
          placeholder="how-to-sterilise-grain"
          required
        />
      )}

      <Input label="Cover image URL" value={values.coverImage} onChange={(e) => update('coverImage', e.target.value)} />

      <div>
        <label className="block text-sm font-medium text-cream-muted mb-1.5">Summary</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <textarea rows={3} value={values.excerptEn} onChange={(e) => update('excerptEn', e.target.value)} placeholder="English" className={areaClass} />
          <textarea rows={3} value={values.excerptEs} onChange={(e) => update('excerptEs', e.target.value)} placeholder="Spanish" className={areaClass} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-cream-muted mb-1.5">Article</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <textarea rows={16} value={values.bodyEn} onChange={(e) => update('bodyEn', e.target.value)} placeholder="English" className={areaClass} />
          <textarea rows={16} value={values.bodyEs} onChange={(e) => update('bodyEs', e.target.value)} placeholder="Spanish" className={areaClass} />
        </div>
        <p className="text-xs text-cream-muted/70 mt-1">Leave a blank line between paragraphs.</p>
      </div>

      <div className="border border-ds-border rounded-none p-4 space-y-3">
        <h3 className="text-sm font-medium text-cream">Search engine listing</h3>
        <Input label="Page title" value={values.metaTitle} maxLength={70} onChange={(e) => update('metaTitle', e.target.value)} />
        <Input label="Meta description" value={values.metaDescription} maxLength={160} onChange={(e) => update('metaDescription', e.target.value)} />
      </div>

      <div className="border border-ds-border rounded-none p-4 flex items-center gap-4">
        <select
          value={values.status}
          onChange={(e) => update('status', e.target.value as 'draft' | 'active')}
          className="bg-surface border border-ds-border rounded-none px-4 py-2.5 text-cream text-sm"
        >
          <option value="draft">Draft</option>
          <option value="active">Published</option>
        </select>
        <p className="text-xs text-cream-muted">
          {values.status === 'active' ? 'Live on the blog right now.' : 'Only you can see this.'}
        </p>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" isLoading={saving}>
          {postId ? 'Save changes' : 'Create post'}
        </Button>
        {postId && (
          <Button type="button" variant="danger" isLoading={deleting} onClick={remove}>
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}
