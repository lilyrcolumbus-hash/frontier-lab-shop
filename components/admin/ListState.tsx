'use client'

/** Loading / error placeholder shared by the admin list pages. */
export function ListState({ error, onRetry }: { error: string | null; onRetry: () => void }) {
  if (!error) {
    return <p className="text-cream-muted">Loading…</p>
  }

  return (
    <div className="rounded-lg border border-ds-border bg-surface p-6">
      <p className="text-sm text-cream mb-1 font-medium">Could not load this page</p>
      <p className="text-sm text-cream-muted mb-4">{error}</p>
      <button
        type="button"
        onClick={onRetry}
        className="px-4 py-2 rounded-lg bg-cream text-surface text-sm font-semibold hover:bg-cream/90 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
