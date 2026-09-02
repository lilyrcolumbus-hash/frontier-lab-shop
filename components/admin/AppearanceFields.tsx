'use client'

import { THEME_TOKENS, type ThemeTokenKey } from '@/lib/theme'

export type ThemeValues = Record<ThemeTokenKey, string>

/**
 * Colour pickers for the storefront palette.
 *
 * Each row shows the shipped default until the owner picks something, so an untouched store
 * reads as "using the original" rather than as a blank field.
 */
export function AppearanceFields({
  values,
  onChange,
}: {
  values: ThemeValues
  onChange: (key: ThemeTokenKey, value: string) => void
}) {
  const anyCustomised = THEME_TOKENS.some(({ key }) => values[key])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-medium text-cream">Appearance</h2>
        <p className="text-xs text-cream-muted/70 mt-1">
          The colours your customers see. Leave one untouched to keep the colour the site ships
          with. Changes apply to the live site as soon as you save.
        </p>
      </div>

      <div className="space-y-3">
        {THEME_TOKENS.map(({ key, label, hint, fallback }) => {
          const current = values[key] || fallback
          const isCustom = Boolean(values[key])

          return (
            <div key={key} className="flex items-center gap-3">
              <input
                type="color"
                aria-label={label}
                value={current}
                onChange={(e) => onChange(key, e.target.value.toUpperCase())}
                className="w-10 h-10 rounded-lg border border-ds-border bg-surface cursor-pointer flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm text-cream">{label}</p>
                <p className="text-xs text-cream-muted/70 truncate">{hint}</p>
              </div>

              <code className="text-xs text-cream-muted font-mono">{current}</code>

              {isCustom && (
                <button
                  type="button"
                  onClick={() => onChange(key, '')}
                  className="text-xs text-cream-muted hover:text-cream underline whitespace-nowrap"
                >
                  Reset
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="rounded-lg border border-ds-border p-4" style={previewStyle(values)}>
        <p className="text-[11px] uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--p-muted)' }}>
          Preview
        </p>
        <p className="text-base font-semibold mb-1" style={{ color: 'var(--p-ink)' }}>
          Lion&apos;s Mane Liquid Culture
        </p>
        <p className="text-sm mb-3" style={{ color: 'var(--p-muted)' }}>
          $17.99
        </p>
        <div className="flex gap-2">
          <span
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: 'var(--p-accent)', color: 'var(--p-surface)' }}
          >
            Add to cart
          </span>
          <span
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: 'var(--p-amber)', color: 'var(--p-surface)' }}
          >
            Save 10%
          </span>
        </div>
      </div>

      {anyCustomised && (
        <button
          type="button"
          onClick={() => THEME_TOKENS.forEach(({ key }) => onChange(key, ''))}
          className="text-xs text-cream-muted hover:text-cream underline"
        >
          Reset every colour to the original
        </button>
      )}
    </div>
  )
}

/** The preview paints itself with the chosen colours, not the admin's own palette. */
function previewStyle(values: ThemeValues): React.CSSProperties {
  const pick = (key: ThemeTokenKey) =>
    values[key] || THEME_TOKENS.find((t) => t.key === key)!.fallback

  return {
    background: pick('bg'),
    borderColor: pick('border'),
    ['--p-accent' as string]: pick('accent'),
    ['--p-amber' as string]: pick('amber'),
    ['--p-ink' as string]: pick('ink'),
    ['--p-muted' as string]: pick('inkMuted'),
    ['--p-surface' as string]: pick('surface'),
  }
}
