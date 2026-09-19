/**
 * Reads from the "FL Admin" Supabase project — the database the new admin panel edits.
 *
 * Everything here uses the PUBLIC anon key, so what a visitor can read is decided by
 * row level security in that database (only live products, live species, live posts…),
 * not by this code. That is the point of the design: there is no service-role key in
 * the storefront's read path, and a bug here can't expose a draft.
 *
 * The URL and key are the same NEXT_PUBLIC_SUPABASE_* variables customer sign-in already
 * uses, so the storefront talks to ONE project. On a Vercel preview they point at FL
 * Admin; production keeps pointing at the old project until the cutover.
 */

export class FlError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message)
    this.name = 'FlError'
  }
}

function config(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new FlError('NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set')
  return { url, key }
}

/** A slug as the admin creates them. Checked before one is put in a filter, so a crafted URL can't add operators. */
export const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/
export const isSlug = (value: string): boolean => value.length <= 120 && SLUG.test(value)

/**
 * One read. `select` is always an explicit column list — never `*` — so a column added
 * to a table later (a cost, a private note) can't start leaking into the storefront.
 * Always fresh: an edit in the admin shows on the next page view, as it did with Prisma.
 */
export async function flGet<T>(
  table: string,
  query: { select: string; filters?: Record<string, string>; order?: string; limit?: number },
): Promise<T[]> {
  const { url, key } = config()
  const params = new URLSearchParams({ select: query.select, ...query.filters })
  if (query.order) params.set('order', query.order)
  if (query.limit) params.set('limit', String(query.limit))

  const res = await fetch(`${url}/rest/v1/${table}?${params.toString()}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new FlError(`Reading ${table} failed (${res.status})`, res.status)
  return (await res.json()) as T[]
}

/**
 * An image reference from the admin → something a browser can load. A "/…" path is a file
 * in the storefront's own public folder, an https URL is used as is, and anything else is
 * a file the admin uploaded to the product-photos bucket.
 */
export function photoUrl(entry: string): string {
  if (entry.startsWith('/') || entry.startsWith('http')) return entry
  return `${config().url}/storage/v1/object/public/product-photos/${entry}`
}
