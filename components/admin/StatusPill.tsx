const STYLES: Record<string, string> = {
  active: 'bg-accent-dim text-accent',
  draft: 'bg-elevated text-cream-muted',
  archived: 'bg-error/10 text-error',
  // Order statuses
  pending: 'bg-elevated text-cream-muted',
  paid: 'bg-accent-dim text-accent',
  fulfilled: 'bg-amber-dim text-amber',
  cancelled: 'bg-error/10 text-error',
  refunded: 'bg-silver-dim text-silver',
}

const LABELS: Record<string, string> = {
  active: 'Active',
  draft: 'Draft',
  archived: 'Archived',
  pending: 'Pending',
  paid: 'Paid',
  fulfilled: 'Fulfilled',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

export function StatusPill({ status }: { status: string }) {
  const style = STYLES[status] ?? STYLES.draft
  const label = LABELS[status] ?? status

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}
