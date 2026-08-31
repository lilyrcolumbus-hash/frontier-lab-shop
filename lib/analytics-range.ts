export type RangeKey = '7d' | '30d' | '90d' | '12m' | 'all'

export const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
  { key: '90d', label: 'Last 90 days' },
  { key: '12m', label: 'Last 12 months' },
  { key: 'all', label: 'All time' },
]

const DAYS: Record<Exclude<RangeKey, 'all'>, number> = { '7d': 7, '30d': 30, '90d': 90, '12m': 365 }

export interface ResolvedRange {
  key: RangeKey
  label: string
  from: Date | null
  to: Date
  /** The equally long window immediately before, for a like-for-like comparison. */
  previousFrom: Date | null
  previousTo: Date | null
}

export function resolveRange(input: string | null | undefined, now = new Date()): ResolvedRange {
  const key = (RANGE_OPTIONS.find((o) => o.key === input)?.key ?? '30d') as RangeKey
  const label = RANGE_OPTIONS.find((o) => o.key === key)!.label

  if (key === 'all') {
    // Nothing to compare against: "all time" has no earlier period by definition.
    return { key, label, from: null, to: now, previousFrom: null, previousTo: null }
  }

  const days = DAYS[key]
  const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  const previousTo = from
  const previousFrom = new Date(from.getTime() - days * 24 * 60 * 60 * 1000)
  return { key, label, from, to: now, previousFrom, previousTo }
}

/** Percentage change against the previous period; null when there is nothing to compare to. */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null
  return Math.round(((current - previous) / previous) * 100)
}
