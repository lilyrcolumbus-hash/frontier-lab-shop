import { prisma } from '@/lib/prisma'

/** next-intl's message tree: nested objects bottoming out in strings. */
export type Messages = { [key: string]: string | Messages }

/**
 * Site text lives in messages/en.json and messages/es.json. This layer lets the owner change
 * any of it from /admin without touching code: an edit is stored as one row keyed by the same
 * dotted path next-intl already uses, and merged over the file at request time.
 *
 * The files stay the source of truth for anything never edited, so a missing table, an empty
 * table, or a database outage all degrade to exactly the site as shipped.
 */

/** Flattens { a: { b: 'x' } } into { 'a.b': 'x' } — the key shape the admin and DB use. */
export function flattenMessages(messages: Messages, prefix = ''): Record<string, string> {
  const flat: Record<string, string> = {}
  for (const [key, value] of Object.entries(messages)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') {
      flat[path] = value
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(flat, flattenMessages(value, path))
    }
  }
  return flat
}

/** Writes one dotted path into a nested object, creating the objects along the way. */
function setPath(target: Messages, path: string, value: string): void {
  const parts = path.split('.')
  let node = target
  for (let i = 0; i < parts.length - 1; i += 1) {
    const part = parts[i]
    const next = node[part]
    // Never overwrite an existing branch with an object — a bad key must not delete real text.
    if (!next || typeof next !== 'object') return
    node = next
  }
  const leaf = parts[parts.length - 1]
  if (typeof node[leaf] === 'string') node[leaf] = value
}

// i18n runs on every request, so the overrides are held briefly in memory rather than queried
// each time. Each serverless instance keeps its own copy and refreshes on its own; an edit in
// the admin shows up within a minute, which the admin page says out loud.
const CACHE_TTL_MS = 60_000
let cache: { at: number; rows: { key: string; valueEn: string; valueEs: string }[] } | null = null

async function loadOverrides() {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.rows
  try {
    const rows = await prisma.siteContent.findMany({ select: { key: true, valueEn: true, valueEs: true } })
    cache = { at: Date.now(), rows }
    return rows
  } catch (err) {
    console.error('[site-content] could not load overrides, using the shipped text', err)
    return cache?.rows ?? []
  }
}

/** Drops the cache so the next request re-reads — called right after an admin saves. */
export function invalidateContentCache(): void {
  cache = null
}

export async function applyContentOverrides(messages: Messages, locale: string): Promise<Messages> {
  const rows = await loadOverrides()
  if (rows.length === 0) return messages

  // Clone before writing: the imported JSON module is shared across requests.
  const merged = JSON.parse(JSON.stringify(messages)) as Messages
  for (const row of rows) {
    const value = locale === 'es' ? row.valueEs : row.valueEn
    if (value) setPath(merged, row.key, value)
  }
  return merged
}
