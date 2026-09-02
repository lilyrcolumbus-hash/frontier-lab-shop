/**
 * Runtime theme.
 *
 * The palette lives in CSS custom properties as RGB channel triples ("61 110 69") rather than
 * hex, because Tailwind's opacity modifiers — `bg-accent/30`, used all over this codebase —
 * need `rgb(var(--c) / <alpha-value>)` to work. Every token has a default in globals.css, so a
 * store that has customised nothing renders exactly as the site ships.
 */

export const THEME_TOKENS = [
  { key: 'accent', label: 'Primary', hint: 'Buttons, links and highlights', fallback: '#3D6E45' },
  { key: 'amber', label: 'Secondary', hint: 'Accents and premium calls to action', fallback: '#9E6820' },
  { key: 'ink', label: 'Text', hint: 'Headings and body copy', fallback: '#1C2018' },
  { key: 'inkMuted', label: 'Muted text', hint: 'Secondary copy and labels', fallback: '#566458' },
  { key: 'bg', label: 'Page background', hint: 'The base colour behind everything', fallback: '#F0F2F0' },
  { key: 'surface', label: 'Cards', hint: 'Panels, cards and raised areas', fallback: '#F8F9F8' },
  { key: 'elevated', label: 'Wells', hint: 'Table headers and inset areas', fallback: '#E8ECEA' },
  { key: 'border', label: 'Borders', hint: 'Dividers and outlines', fallback: '#D2D8D2' },
] as const

export type ThemeTokenKey = (typeof THEME_TOKENS)[number]['key']

/** The Store columns holding each override, so one place decides the mapping. */
export const THEME_COLUMNS: Record<ThemeTokenKey, string> = {
  accent: 'themeAccent',
  amber: 'themeAmber',
  ink: 'themeInk',
  inkMuted: 'themeInkMuted',
  bg: 'themeBg',
  surface: 'themeSurface',
  elevated: 'themeElevated',
  border: 'themeBorder',
}

/** The CSS variable each token drives. */
const CSS_VAR: Record<ThemeTokenKey, string> = {
  accent: '--c-accent',
  amber: '--c-amber',
  ink: '--c-cream',
  inkMuted: '--c-muted',
  bg: '--c-bg',
  surface: '--c-surface',
  elevated: '--c-elevated',
  border: '--c-border',
}

export function isHexColour(value: string): boolean {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())
}

/** "#3D6E45" → "61 110 69". Returns null for anything that is not a hex colour. */
export function hexToChannels(hex: string): string | null {
  const value = hex.trim()
  if (!isHexColour(value)) return null
  const raw = value.slice(1)
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw
  const int = parseInt(full, 16)
  return `${(int >> 16) & 255} ${(int >> 8) & 255} ${int & 255}`
}

export type ThemeOverrides = Partial<Record<ThemeTokenKey, string>>

/**
 * Builds the `:root` block that overrides the defaults.
 *
 * Returns an empty string when nothing is customised, so the page ships no extra style at all.
 * Values that are not valid hex are skipped rather than written through — this string goes into
 * a <style> tag, and only "r g b" ever reaches it.
 */
export function buildThemeCss(overrides: ThemeOverrides): string {
  const declarations = THEME_TOKENS.flatMap(({ key }) => {
    const value = overrides[key]
    if (!value) return []
    const channels = hexToChannels(value)
    return channels ? [`${CSS_VAR[key]}: ${channels};`] : []
  })

  return declarations.length ? `:root{${declarations.join('')}}` : ''
}
