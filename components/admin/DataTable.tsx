export type DataTableColumn<T> = {
  key: string
  header: string
  render: (row: T) => React.ReactNode
  align?: 'left' | 'right'
}

type DataTableProps<T extends { id: string }> = {
  columns: DataTableColumn<T>[]
  rows: T[]
  rowHref?: (row: T) => string
  emptyLabel: string
}

export function Thumbnail({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="w-10 h-10 rounded-lg bg-elevated border border-ds-border flex items-center justify-center text-cream-muted flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="w-10 h-10 rounded-lg object-cover border border-ds-border flex-shrink-0" />
  )
}

export function DataTable<T extends { id: string }>({ columns, rows, rowHref, emptyLabel }: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="border border-ds-border rounded-xl bg-surface py-16 text-center text-cream-muted text-sm">
        {emptyLabel}
      </div>
    )
  }

  return (
    <div className="border border-ds-border rounded-xl bg-surface overflow-hidden overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-elevated text-cream-muted">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 font-medium text-[11px] uppercase tracking-wider ${col.align === 'right' ? 'text-right' : 'text-left'}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-ds-border hover:bg-elevated/40 transition-colors">
              {columns.map((col, i) => (
                <td key={col.key} className={`px-4 py-3 ${col.align === 'right' ? 'text-right' : ''}`}>
                  {i === 0 && rowHref ? (
                    <a href={rowHref(row)} className="hover:underline">
                      {col.render(row)}
                    </a>
                  ) : (
                    col.render(row)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
