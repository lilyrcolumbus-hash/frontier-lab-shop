'use client'

import { useState } from 'react'
import { Link } from '@/navigation'
import type { Guide, GuideMedia } from '@/lib/guide'

interface Props {
  productName: string
  guide: Guide
  /** Display names for the products the "What you need" list links to, keyed by slug. */
  linkNames: Record<string, string>
}

function MediaItem({ item, large }: { item: GuideMedia; large?: boolean }) {
  const frame = large ? 'aspect-[4/3] w-full' : 'aspect-square w-full'
  if (item.kind === 'video') {
    return <video src={item.url} className={`${frame} bg-black object-cover`} autoPlay muted loop playsInline controls />
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={item.url} alt={item.caption} className={`${frame} object-cover`} loading="lazy" />
}

function Badge({ text }: { text: string }) {
  return <span className="self-start bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber">{text}</span>
}

const primaryButton = 'flex-1 border border-cream bg-cream px-4 py-3.5 text-center text-base font-semibold text-bg disabled:opacity-40'
const ghostButton = 'flex-1 border border-ds-border bg-surface px-4 py-3.5 text-center text-base font-semibold text-cream'

export function GuideViewer({ productName, guide, linkNames }: Props) {
  const total = guide.steps.length
  const hasHelp = Boolean(guide.normal.text || guide.problem.text || guide.helpEmail)
  const lastScreen = total + (hasHelp ? 1 : 0)
  const [screen, setScreen] = useState(0)

  const go = (next: number) => {
    setScreen(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const progress = total > 0 && screen >= 1 && screen <= total && (
    <div className="flex gap-1.5" role="img" aria-label={`Step ${screen} of ${total}`}>
      {guide.steps.map((_, index) => (
        <span key={index} className={`h-2 w-2 border border-cream ${screen - 1 >= index ? 'bg-cream' : ''}`} />
      ))}
    </div>
  )

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 pb-16 pt-24 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-ds-border pb-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-muted">{productName}</p>
        {progress}
      </div>

      {screen === 0 && (
        <div className="space-y-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-muted">Start here</p>
            <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight text-cream">{productName}</h1>
            {guide.intro && <p className="mt-3 max-w-prose text-cream-muted">{guide.intro}</p>}
          </div>

          {guide.needs.length > 0 && (
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cream-muted">What you need</p>
              <ul className="space-y-2">
                {guide.needs.map((need, index) => (
                  <li key={index} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border border-ds-border bg-surface px-4 py-3 text-sm text-cream">
                    <span>{need.text}</span>
                    {need.note && <Badge text={need.note} />}
                    {need.linkSlug && (
                      <Link href={`/shop/${need.linkSlug}`} className="font-semibold text-accent underline">
                        {linkNames[need.linkSlug] ?? 'View in the shop'}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex">
            <button type="button" className={primaryButton} disabled={lastScreen === 0} onClick={() => go(1)}>Start</button>
          </div>
        </div>
      )}

      {screen >= 1 && screen <= total && (() => {
        const step = guide.steps[screen - 1]
        const single = step.media.length === 1 ? step.media[0] : null
        return (
          <div className="space-y-5">
            <div className={single ? 'grid gap-6 md:grid-cols-2 md:items-start' : ''}>
              {single && (
                <div>
                  <MediaItem item={single} large />
                  {single.caption && <p className="mt-2 text-sm text-cream-muted">{single.caption}</p>}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-muted">Step {screen} of {total}</p>
                  <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-cream">{step.title}</h1>
                </div>
                {step.text && <p className="max-w-prose text-base leading-relaxed text-cream">{step.text}</p>}
                {step.important && (
                  <div className="border border-accent/40 bg-accent/5 px-4 py-3 text-sm text-cream">
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-amber">Important</p>
                    {step.important}
                  </div>
                )}
              </div>
            </div>

            {step.media.length > 1 && (
              <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0" tabIndex={0} aria-label="Photos and videos, swipe sideways">
                {step.media.map((item, index) => (
                  <div key={item.url} className="w-56 flex-none snap-start border border-ds-border bg-surface sm:w-60">
                    <MediaItem item={item} />
                    <div className="flex flex-col gap-1.5 p-3 text-sm text-cream">
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cream-muted">{index + 1} of {step.media.length}</span>
                      {item.badge && <Badge text={item.badge} />}
                      {item.caption && <span>{item.caption}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" className={ghostButton} onClick={() => go(screen - 1)}>Back</button>
              <button type="button" className={primaryButton} onClick={() => go(screen + 1)}>{screen === total && !hasHelp ? 'Done' : 'Next'}</button>
            </div>
          </div>
        )
      })()}

      {hasHelp && screen === lastScreen && lastScreen > 0 && (
        <div className="space-y-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-muted">If something looks wrong</p>
            <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-cream">Is this normal?</h1>
          </div>
          {(guide.normal.text || guide.problem.text) && (
            <div className="grid gap-3 sm:grid-cols-2">
              {([['normal', 'Normal', 'text-accent'], ['problem', 'Problem', 'text-error']] as const).map(([key, label, color]) =>
                guide[key].text ? (
                  <div key={key} className="border border-ds-border bg-surface">
                    {guide[key].photoUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={guide[key].photoUrl} alt={label} className="aspect-video w-full object-cover" loading="lazy" />
                    )}
                    <div className="p-3 text-sm text-cream">
                      <span className={`mb-1 block font-mono text-[11px] uppercase tracking-wider ${color}`}>{key === 'normal' ? '✓ ' : '✕ '}{label}</span>
                      {guide[key].text}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}
          {guide.helpEmail && (
            <div className="border border-ds-border bg-surface px-4 py-3 text-sm text-cream">
              <b>Need help?</b> Write to <a className="font-mono text-accent underline" href={`mailto:${guide.helpEmail}`}>{guide.helpEmail}</a>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" className={ghostButton} onClick={() => go(total > 0 ? total : 0)}>Back</button>
            <button type="button" className={primaryButton} onClick={() => go(0)}>Start over</button>
          </div>
        </div>
      )}
    </div>
  )
}
