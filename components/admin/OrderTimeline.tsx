interface TimelineEvent {
  id: string
  type: string
  message: string
  actorEmail: string | null
  createdAt: Date
}

const DOT_COLOR: Record<string, string> = {
  placed: 'bg-accent',
  fulfilment: 'bg-accent',
  email: 'bg-silver',
  tracking: 'bg-silver',
  status: 'bg-amber',
  cancelled: 'bg-error',
  refunded: 'bg-error',
}

export function OrderTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="bg-surface border border-ds-border rounded-xl p-5">
      <h2 className="font-semibold text-cream text-sm mb-4">Timeline</h2>

      {events.length === 0 ? (
        <p className="text-sm text-cream-muted">Nothing has happened to this order yet.</p>
      ) : (
        <ol className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="flex gap-3">
              <span
                className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${DOT_COLOR[event.type] ?? 'bg-silver'}`}
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-sm text-cream">{event.message}</p>
                <p className="text-xs text-cream-muted/70 mt-0.5">
                  {new Date(event.createdAt).toLocaleString()}
                  {/* No actor means the system wrote it — the Stripe webhook, not a person. */}
                  {event.actorEmail ? ` · ${event.actorEmail}` : ' · system'}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
