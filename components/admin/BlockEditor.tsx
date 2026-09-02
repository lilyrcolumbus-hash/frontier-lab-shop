'use client'

import { BLOCK_LABELS, emptyBlock, type BlockType, type PageBlock } from '@/lib/page-blocks'

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-ds-border bg-bg text-sm text-cream placeholder:text-cream-muted/60'

/**
 * Builds a page out of blocks: add, reorder, remove.
 *
 * Each block edits both languages side by side, because the storefront is bilingual and the
 * Spanish version is customer content rather than admin interface.
 */
export function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: PageBlock[]
  onChange: (blocks: PageBlock[]) => void
}) {
  const update = (index: number, next: PageBlock) =>
    onChange(blocks.map((b, i) => (i === index ? next : b)))

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= blocks.length) return
    const next = [...blocks]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const remove = (index: number) => onChange(blocks.filter((_, i) => i !== index))
  const add = (type: BlockType) => onChange([...blocks, emptyBlock(type)])

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-cream-muted">Content</label>

      {blocks.length === 0 && (
        <p className="text-sm text-cream-muted/70">
          This page is empty. Add a block below to start building it.
        </p>
      )}

      {blocks.map((block, index) => (
        <div key={block.id} className="p-4 rounded-xl border border-ds-border bg-surface space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cream-muted">
              {BLOCK_LABELS[block.type]}
            </span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="text-xs text-cream-muted hover:text-cream disabled:opacity-30" aria-label="Move up">
                ↑
              </button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === blocks.length - 1} className="text-xs text-cream-muted hover:text-cream disabled:opacity-30" aria-label="Move down">
                ↓
              </button>
              <button type="button" onClick={() => remove(index)} className="text-xs text-error hover:underline">
                Remove
              </button>
            </div>
          </div>

          {block.type === 'heading' && (
            <>
              <select
                value={block.level}
                onChange={(e) => update(index, { ...block, level: e.target.value as 'h2' | 'h3' })}
                className="px-3 py-2 rounded-lg border border-ds-border bg-bg text-sm text-cream"
              >
                <option value="h2">Large heading</option>
                <option value="h3">Small heading</option>
              </select>
              <BilingualInput
                value={block.text}
                onChange={(text) => update(index, { ...block, text })}
              />
            </>
          )}

          {block.type === 'text' && (
            <BilingualInput
              multiline
              value={block.text}
              onChange={(text) => update(index, { ...block, text })}
              hint="Leave a blank line between paragraphs."
            />
          )}

          {block.type === 'quote' && (
            <>
              <BilingualInput multiline value={block.text} onChange={(text) => update(index, { ...block, text })} />
              <BilingualInput
                value={block.attribution}
                onChange={(attribution) => update(index, { ...block, attribution })}
                label="Attribution"
              />
            </>
          )}

          {block.type === 'image' && (
            <>
              <input
                type="text"
                value={block.url}
                onChange={(e) => update(index, { ...block, url: e.target.value })}
                placeholder="Image URL"
                className={inputClass}
              />
              <BilingualInput
                value={block.alt}
                onChange={(alt) => update(index, { ...block, alt })}
                label="Alt text"
              />
            </>
          )}

          {block.type === 'button' && (
            <>
              <BilingualInput value={block.label} onChange={(label) => update(index, { ...block, label })} label="Label" />
              <input
                type="text"
                value={block.href}
                onChange={(e) => update(index, { ...block, href: e.target.value })}
                placeholder="/shop"
                className={inputClass}
              />
            </>
          )}

          {block.type === 'divider' && (
            <p className="text-xs text-cream-muted/70">A horizontal line. Nothing to configure.</p>
          )}
        </div>
      ))}

      <div className="flex flex-wrap gap-2 pt-1">
        {(Object.keys(BLOCK_LABELS) as BlockType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => add(type)}
            className="px-3 py-1.5 rounded-lg border border-ds-border text-xs font-medium text-cream hover:bg-elevated transition-colors"
          >
            + {BLOCK_LABELS[type]}
          </button>
        ))}
      </div>
    </div>
  )
}

function BilingualInput({
  value,
  onChange,
  multiline,
  label,
  hint,
}: {
  value: { en: string; es: string }
  onChange: (value: { en: string; es: string }) => void
  multiline?: boolean
  label?: string
  hint?: string
}) {
  const Field = multiline ? 'textarea' : 'input'
  return (
    <div>
      {label && <label className="block text-xs font-medium text-cream-muted mb-1">{label}</label>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Field
          rows={multiline ? 5 : undefined}
          value={value.en}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            onChange({ ...value, en: e.target.value })
          }
          placeholder="English"
          className={inputClass}
        />
        <Field
          rows={multiline ? 5 : undefined}
          value={value.es}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            onChange({ ...value, es: e.target.value })
          }
          placeholder="Spanish"
          className={inputClass}
        />
      </div>
      {hint && <p className="text-xs text-cream-muted/70 mt-1">{hint}</p>}
    </div>
  )
}
