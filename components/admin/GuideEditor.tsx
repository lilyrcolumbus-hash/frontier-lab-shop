'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { GUIDE_BUCKET, emptyGuide, guideSlugFrom, type Guide, type GuideMedia, type GuideStep } from '@/lib/guide'

interface GuideProduct {
  id: string
  slug: string
  nameEn: string
  guide?: Guide | null
}

interface Props {
  guide: Guide | null
  onChange: (guide: Guide | null) => void
  /** The product's own slug or name, used to suggest the guide address. */
  suggestedSlug: string
  /** Every product, for "What you need" links and for copying another product's guide. */
  products: GuideProduct[]
  productId?: string
}

const inputClass = 'w-full bg-bg border border-ds-border rounded-none px-3 py-2 text-cream text-sm'
const areaClass = `${inputClass} min-h-16`
const labelClass = 'block text-xs text-cream-muted mb-1'
const smallButton = 'border border-ds-border bg-surface px-2.5 py-1 text-xs text-cream-muted hover:text-cream disabled:opacity-30'

function moveItem<T>(list: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction
  if (target < 0 || target >= list.length) return list
  const copy = [...list]
  ;[copy[index], copy[target]] = [copy[target], copy[index]]
  return copy
}

/** Photo or video straight to storage. HEIC photos from an iPhone are converted to JPEG first. */
async function uploadGuideFile(original: File): Promise<{ url: string; kind: 'photo' | 'video' }> {
  let file = original
  if (/\.(heic|heif)$/i.test(original.name) || /image\/hei[cf]/i.test(original.type)) {
    const { default: heic2any } = await import('heic2any')
    const converted = await heic2any({ blob: original, toType: 'image/jpeg', quality: 0.9 })
    const blob = Array.isArray(converted) ? converted[0] : converted
    file = new File([blob], original.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' })
  }

  const contentType = file.type || (/\.mov$/i.test(file.name) ? 'video/quicktime' : '')
  const signResponse = await fetch('/api/admin/guide-media/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: file.name, contentType, size: file.size }),
  })
  const signed = await signResponse.json().catch(() => null)
  if (!signResponse.ok || !signed) throw new Error(signed?.error ?? 'Could not prepare the upload')

  const supabase = createClient()
  const { error } = await supabase.storage.from(GUIDE_BUCKET).uploadToSignedUrl(signed.path, signed.token, file, { contentType })
  if (error) throw new Error('The upload failed. Check your connection and try again.')
  return { url: signed.publicUrl as string, kind: signed.kind as 'photo' | 'video' }
}

function checklist(guide: Guide) {
  const steps = guide.steps
  const withText = steps.filter((step) => step.text.trim()).length
  const withMedia = steps.filter((step) => step.media.length > 0).length
  return [
    { ok: steps.length > 0, label: steps.length === 1 ? '1 step' : `${steps.length} steps` },
    { ok: steps.length > 0 && steps.every((step) => step.title.trim()), label: 'Every step has a title' },
    { ok: steps.length > 0 && withText === steps.length, label: `Every step has text (${withText} of ${steps.length})` },
    { ok: steps.length > 0 && withMedia === steps.length, label: `Photo or video on every step (${withMedia} of ${steps.length})` },
    { ok: guide.needs.length > 0, label: '"What you need" filled' },
    { ok: guide.helpEmail.trim().length > 0, label: 'Help email set' },
  ]
}

export function GuideEditor({ guide, onChange, suggestedSlug, products, productId }: Props) {
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [confirmRemove, setConfirmRemove] = useState(false)
  const [copyFrom, setCopyFrom] = useState('')
  const photoInputs = useRef<Record<number, HTMLInputElement | null>>({})
  const videoInputs = useRef<Record<number, HTMLInputElement | null>>({})

  const guideProducts = products.filter((product) => product.guide && product.id !== productId)

  if (!guide) {
    return (
      <div className="border border-ds-border bg-surface p-4 space-y-3">
        <p className="text-sm text-cream-muted">
          This product has no instructions guide yet. A guide is a step-by-step page with photos and videos. The QR code on the label opens it.
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <Button type="button" variant="outline" size="sm" onClick={() => onChange(emptyGuide(guideSlugFrom(suggestedSlug) || 'guide'))}>
            Create guide
          </Button>
          {guideProducts.length > 0 && (
            <>
              <select className={`${inputClass} w-auto`} value={copyFrom} onChange={(e) => setCopyFrom(e.target.value)} aria-label="Copy a guide from another product">
                <option value="">Or copy a guide from…</option>
                {guideProducts.map((product) => (
                  <option key={product.id} value={product.id}>{product.nameEn}</option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!copyFrom}
                onClick={() => {
                  const source = guideProducts.find((product) => product.id === copyFrom)?.guide
                  if (source) onChange({ ...source, slug: guideSlugFrom(suggestedSlug) || 'guide' })
                }}
              >
                Copy
              </Button>
            </>
          )}
        </div>
      </div>
    )
  }

  const update = (partial: Partial<Guide>) => onChange({ ...guide, ...partial })
  const setStep = (index: number, partial: Partial<GuideStep>) =>
    update({ steps: guide.steps.map((step, i) => (i === index ? { ...step, ...partial } : step)) })
  const setMedia = (stepIndex: number, mediaIndex: number, partial: Partial<GuideMedia>) =>
    setStep(stepIndex, { media: guide.steps[stepIndex].media.map((item, i) => (i === mediaIndex ? { ...item, ...partial } : item)) })

  const addFiles = async (stepIndex: number, files: FileList, expected: 'photo' | 'video') => {
    setError('')
    const added: GuideMedia[] = []
    try {
      for (const file of Array.from(files)) {
        setBusy(`Uploading ${file.name}…`)
        const uploaded = await uploadGuideFile(file)
        if (uploaded.kind !== expected) throw new Error(expected === 'photo' ? 'That file is a video. Use "Add video".' : 'That file is a photo. Use "Add photo".')
        added.push({ kind: uploaded.kind, url: uploaded.url, caption: '', badge: '' })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The upload failed')
    } finally {
      setBusy('')
      if (added.length) setStep(stepIndex, { media: [...guide.steps[stepIndex].media, ...added] })
    }
  }

  const uploadExample = async (which: 'normal' | 'problem', files: FileList) => {
    setError('')
    try {
      setBusy('Uploading…')
      const uploaded = await uploadGuideFile(files[0])
      if (uploaded.kind !== 'photo') throw new Error('Use a photo here.')
      update({ [which]: { ...guide[which], photoUrl: uploaded.url } } as Partial<Guide>)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The upload failed')
    } finally {
      setBusy('')
    }
  }

  const items = checklist(guide)
  const missing = items.filter((item) => !item.ok).length

  return (
    <div className="space-y-5 border border-ds-border bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-cream-muted mb-1">Guide address (the QR on the label points here)</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm text-cream-muted">myfrontierlab.com/g/</span>
            <input
              className={`${inputClass} w-56`}
              value={guide.slug}
              onChange={(e) => update({ slug: guideSlugFrom(e.target.value) })}
              aria-label="Guide address"
            />
          </div>
        </div>
        {confirmRemove ? (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-cream-muted">Delete this guide?</span>
            <button type="button" className="text-error" onClick={() => { onChange(null); setConfirmRemove(false) }}>Yes, delete</button>
            <button type="button" className="text-cream-muted" onClick={() => setConfirmRemove(false)}>Keep</button>
          </div>
        ) : (
          <button type="button" className="text-xs text-error" onClick={() => setConfirmRemove(true)}>Delete guide</button>
        )}
      </div>

      <div className="border border-ds-border bg-bg p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-cream-muted">Guide checklist</p>
          <p className={`text-xs font-semibold ${missing === 0 ? 'text-accent' : 'text-amber'}`}>
            {missing === 0 ? 'Ready' : `${missing} still missing`}
          </p>
        </div>
        <ul className="mt-2 grid gap-1 text-xs sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.label} className="flex gap-2">
              <span className={item.ok ? 'text-accent' : 'text-amber'}>{item.ok ? '✓' : '!'}</span>
              <span className="text-cream-muted">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {(busy || error) && (
        <p className={`text-sm ${error ? 'text-error' : 'text-cream-muted'}`} role="status">{error || busy}</p>
      )}

      <div>
        <label className={labelClass} htmlFor="guide-intro">Intro (one line)</label>
        <input id="guide-intro" className={inputClass} value={guide.intro} onChange={(e) => update({ intro: e.target.value })} />
      </div>

      <div>
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-cream-muted mb-2">What you need</p>
        <div className="space-y-2">
          {guide.needs.map((need, index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[1fr_130px_170px_auto]">
              <input className={inputClass} placeholder="Item" aria-label={`Item ${index + 1}`} value={need.text}
                onChange={(e) => update({ needs: guide.needs.map((n, i) => (i === index ? { ...n, text: e.target.value } : n)) })} />
              <input className={inputClass} placeholder="Tag, e.g. Not included" aria-label={`Tag for item ${index + 1}`} value={need.note}
                onChange={(e) => update({ needs: guide.needs.map((n, i) => (i === index ? { ...n, note: e.target.value } : n)) })} />
              <select className={inputClass} aria-label={`Link for item ${index + 1}`} value={need.linkSlug}
                onChange={(e) => update({ needs: guide.needs.map((n, i) => (i === index ? { ...n, linkSlug: e.target.value } : n)) })}>
                <option value="">No link</option>
                {products.map((product) => (
                  <option key={product.id} value={product.slug}>Link: {product.nameEn}</option>
                ))}
              </select>
              <button type="button" className="text-xs text-error text-left" onClick={() => update({ needs: guide.needs.filter((_, i) => i !== index) })}>Remove</button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => update({ needs: [...guide.needs, { text: '', note: '', linkSlug: '' }] })}>
          Add item
        </Button>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-cream-muted">Steps (as many as you need)</p>
        {guide.steps.map((step, index) => {
          const warnings = [
            !step.title.trim() && 'No title',
            !step.text.trim() && 'No text',
            step.media.length === 0 && 'No photo or video yet',
          ].filter(Boolean) as string[]
          return (
            <article key={index} className={`border bg-bg ${warnings.length ? 'border-amber' : 'border-ds-border'}`}>
              <div className="flex flex-wrap items-center gap-2 border-b border-ds-border p-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center border border-cream font-mono text-xs font-bold text-cream">{index + 1}</span>
                <input className={`${inputClass} flex-1 min-w-40`} placeholder="Step title" aria-label={`Step ${index + 1} title`} value={step.title}
                  onChange={(e) => setStep(index, { title: e.target.value })} />
                <button type="button" className={smallButton} disabled={index === 0} onClick={() => update({ steps: moveItem(guide.steps, index, -1) })}>Up</button>
                <button type="button" className={smallButton} disabled={index === guide.steps.length - 1} onClick={() => update({ steps: moveItem(guide.steps, index, 1) })}>Down</button>
                <button type="button" className={`${smallButton} text-error`} onClick={() => update({ steps: guide.steps.filter((_, i) => i !== index) })}>Remove</button>
              </div>
              <div className="space-y-3 p-3">
                <div>
                  <label className={labelClass} htmlFor={`guide-text-${index}`}>Short text</label>
                  <textarea id={`guide-text-${index}`} className={areaClass} value={step.text} onChange={(e) => setStep(index, { text: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass} htmlFor={`guide-imp-${index}`}>Important note (optional)</label>
                  <input id={`guide-imp-${index}`} className={inputClass} value={step.important} onChange={(e) => setStep(index, { important: e.target.value })} />
                </div>

                <div>
                  <p className={labelClass}>Photos and videos (as many as you want). One shows large. Two or more show as a row to swipe.</p>
                  {step.media.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {step.media.map((item, mediaIndex) => (
                        <div key={item.url} className="space-y-2 border border-ds-border bg-surface p-2">
                          {item.kind === 'video' ? (
                            <video src={item.url} className="aspect-video w-full bg-black object-cover" muted playsInline preload="metadata" controls />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.url} alt="" className="aspect-video w-full object-cover" />
                          )}
                          <textarea className={`${inputClass} min-h-14`} placeholder="Note under it (optional)" aria-label={`Note for item ${mediaIndex + 1}`} value={item.caption}
                            onChange={(e) => setMedia(index, mediaIndex, { caption: e.target.value })} />
                          <div className="flex flex-wrap items-center gap-2">
                            <input className={`${inputClass} flex-1 min-w-28`} placeholder="Badge, e.g. Ready" aria-label={`Badge for item ${mediaIndex + 1}`} value={item.badge}
                              onChange={(e) => setMedia(index, mediaIndex, { badge: e.target.value })} />
                            <button type="button" className={smallButton} disabled={mediaIndex === 0} aria-label="Move earlier"
                              onClick={() => setStep(index, { media: moveItem(step.media, mediaIndex, -1) })}>←</button>
                            <button type="button" className={smallButton} disabled={mediaIndex === step.media.length - 1} aria-label="Move later"
                              onClick={() => setStep(index, { media: moveItem(step.media, mediaIndex, 1) })}>→</button>
                            <button type="button" className={`${smallButton} text-error`}
                              onClick={() => setStep(index, { media: step.media.filter((_, i) => i !== mediaIndex) })}>Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <input ref={(el) => { photoInputs.current[index] = el }} type="file" accept="image/*,.heic,.heif" multiple className="hidden"
                      onChange={(e) => { if (e.target.files?.length) addFiles(index, e.target.files, 'photo'); e.target.value = '' }} />
                    <input ref={(el) => { videoInputs.current[index] = el }} type="file" accept="video/mp4,video/quicktime,video/webm,.mov,.mp4" multiple className="hidden"
                      onChange={(e) => { if (e.target.files?.length) addFiles(index, e.target.files, 'video'); e.target.value = '' }} />
                    <Button type="button" variant="outline" size="sm" disabled={Boolean(busy)} onClick={() => photoInputs.current[index]?.click()}>Add photo</Button>
                    <Button type="button" variant="outline" size="sm" disabled={Boolean(busy)} onClick={() => videoInputs.current[index]?.click()}>Add video</Button>
                  </div>
                </div>

                {warnings.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {warnings.map((warning) => (
                      <span key={warning} className="bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber">{warning}</span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          )
        })}
        <Button type="button" variant="primary" size="sm" onClick={() => update({ steps: [...guide.steps, { title: '', text: '', important: '', media: [] }] })}>
          Add step
        </Button>
      </div>

      <div>
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-cream-muted mb-2">Is this normal? (optional)</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {(['normal', 'problem'] as const).map((which) => (
            <div key={which} className="space-y-2 border border-ds-border bg-bg p-3">
              <p className={`text-xs font-semibold uppercase tracking-wider ${which === 'normal' ? 'text-accent' : 'text-error'}`}>{which === 'normal' ? 'Normal' : 'Problem'}</p>
              <textarea className={`${inputClass} min-h-16`} aria-label={`${which} text`} value={guide[which].text}
                placeholder={which === 'normal' ? 'What a healthy bag looks like' : 'What a problem looks like and what to do'}
                onChange={(e) => update({ [which]: { ...guide[which], text: e.target.value } } as Partial<Guide>)} />
              {guide[which].photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={guide[which].photoUrl} alt="" className="aspect-video w-full object-cover" />
              )}
              <div className="flex gap-2">
                <label className={`${smallButton} cursor-pointer`}>
                  {guide[which].photoUrl ? 'Replace photo' : 'Add photo'}
                  <input type="file" accept="image/*,.heic,.heif" className="hidden"
                    onChange={(e) => { if (e.target.files?.length) uploadExample(which, e.target.files); e.target.value = '' }} />
                </label>
                {guide[which].photoUrl && (
                  <button type="button" className={`${smallButton} text-error`} onClick={() => update({ [which]: { ...guide[which], photoUrl: '' } } as Partial<Guide>)}>Remove photo</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="guide-help">Help email (shown at the end of the guide)</label>
        <input id="guide-help" className={inputClass} value={guide.helpEmail} onChange={(e) => update({ helpEmail: e.target.value })} />
      </div>

      <p className="text-xs text-cream-muted">
        {productId ? 'Press "Save changes" to publish the guide. ' : 'The guide is saved with the product. '}
        Photos and videos are uploaded right away. Videos: MP4 or MOV, under 40 MB. Photos: under 10 MB (iPhone HEIC is converted).
      </p>
    </div>
  )
}
