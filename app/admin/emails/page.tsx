'use client'

import { useState } from 'react'
import { useAdminList } from '@/components/admin/useAdminList'
import { ListState } from '@/components/admin/ListState'
import { Button } from '@/components/ui/Button'

interface TemplateDefaults {
  subjectEn: string
  subjectEs: string
  headingEn: string
  headingEs: string
  introEn: string
  introEs: string
  footerEn: string
  footerEs: string
}

interface Template {
  key: string
  label: string
  description: string
  defaults: TemplateDefaults
  saved: TemplateDefaults | null
}

export default function AdminEmailsPage() {
  const { data: templates, error, reload } = useAdminList<Template>('/api/admin/emails', 'templates')

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading font-medium text-2xl text-cream mb-2">Emails</h1>
      <p className="text-sm text-cream-muted mb-6">
        The wording of the emails your customers receive. The layout, the items and the totals are
        built automatically — you write the words around them. Use{' '}
        <code className="text-cream">{'{store}'}</code> for your store name and{' '}
        <code className="text-cream">{'{number}'}</code> for the order number.
      </p>

      {templates === null ? (
        <ListState error={error} onRetry={reload} />
      ) : (
        <div className="space-y-6">
          {templates.map((template) => (
            <TemplateCard key={template.key} template={template} onSaved={reload} />
          ))}
        </div>
      )}
    </div>
  )
}

const areaClass =
  'w-full px-3 py-2 rounded-none border border-ds-border bg-bg text-sm text-cream placeholder:text-cream-muted/60'

function TemplateCard({ template, onSaved }: { template: Template; onSaved: () => void }) {
  const [values, setValues] = useState<TemplateDefaults>(template.saved ?? {
    subjectEn: '', subjectEs: '', headingEn: '', headingEs: '',
    introEn: '', introEs: '', footerEn: '', footerEs: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const update = (key: keyof TemplateDefaults, value: string) => {
    setValues((v) => ({ ...v, [key]: value }))
    setSaved(false)
  }

  const save = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/admin/emails', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: template.key, ...values }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error ?? 'Could not save the template')
        return
      }
      setSaved(true)
      onSaved()
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  const Row = ({ label, en, es }: { label: string; en: keyof TemplateDefaults; es: keyof TemplateDefaults }) => (
    <div>
      <label className="block text-xs font-medium text-cream-muted mb-1">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input value={values[en]} onChange={(e) => update(en, e.target.value)} placeholder={template.defaults[en]} className={areaClass} />
        <input value={values[es]} onChange={(e) => update(es, e.target.value)} placeholder={template.defaults[es]} className={areaClass} />
      </div>
    </div>
  )

  return (
    <div className="bg-surface border border-ds-border rounded-none p-5 space-y-4">
      <div>
        <h2 className="text-sm font-medium text-cream">{template.label}</h2>
        <p className="text-xs text-cream-muted/70 mt-1">{template.description}</p>
        <p className="text-xs text-cream-muted/60 mt-1">Left is English, right is Spanish. Empty uses the wording shown in grey.</p>
      </div>

      <Row label="Subject" en="subjectEn" es="subjectEs" />
      <Row label="Heading" en="headingEn" es="headingEs" />

      <div>
        <label className="block text-xs font-medium text-cream-muted mb-1">Intro (optional)</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <textarea rows={3} value={values.introEn} onChange={(e) => update('introEn', e.target.value)} placeholder="English" className={areaClass} />
          <textarea rows={3} value={values.introEs} onChange={(e) => update('introEs', e.target.value)} placeholder="Spanish" className={areaClass} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-cream-muted mb-1">Footer</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <textarea rows={2} value={values.footerEn} onChange={(e) => update('footerEn', e.target.value)} placeholder={template.defaults.footerEn} className={areaClass} />
          <textarea rows={2} value={values.footerEs} onChange={(e) => update('footerEs', e.target.value)} placeholder={template.defaults.footerEs} className={areaClass} />
        </div>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}
      {saved && <p className="text-sm text-accent">Saved.</p>}

      <Button type="button" onClick={save} isLoading={saving}>
        Save wording
      </Button>
    </div>
  )
}
