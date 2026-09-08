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
  /** Omit to render a plain table — only the lists that support bulk actions pass this. */
  selection?: {
    selectedIds: string[]
    onChange: (ids: string[]) => void
  }
}

export function Thumbnail({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) {
    return (
      <div
        title="No image yet"
        className="w-10 h-10 rounded-none bg-elevated border border-dashed border-ds-border flex items-center justify-center text-cream-muted/40 flex-shrink-0"
      >
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
    <img src={src} alt={alt} className="w-10 h-10 rounded-none object-cover border border-ds-border flex-shrink-0" />
  )
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  rowHref,
  emptyLabel,
  selection,
}: DataTableProps<T>) {
  const selectedIds = selection?.selectedIds ?? []
  // "All" means all rows currently visible, which is what the shopper of this table sees —
  // a filtered list must not silently select rows that are not on screen.
  const allSelected = rows.length > 0 && rows.every((row) => selectedIds.includes(row.id))

  const toggleRow = (id: string) =>
    selection?.onChange(selectedIds.includes(id) ? selectedIds.filter((s) => s !== id) : [...selectedIds, id])

  const toggleAll = () => selection?.onChange(allSelected ? [] : rows.map((row) => row.id))

  if (rows.length === 0) {
    return (
      <div className="border border-ds-border rounded-none bg-surface py-16 text-center text-cream-muted text-sm">
        {emptyLabel}
      </div>
    )
  }

  return (
    <div className="border border-ds-border rounded-none bg-surface overflow-hidden overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-elevated text-cream-muted">
          <tr>
            {selection && (
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Select all rows"
                  className="accent-accent"
                />
              </th>
            )}
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
              {selection && (
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={() => toggleRow(row.id)}
                    aria-label={`Select row ${row.id}`}
                    className="accent-accent"
                  />
                </td>
              )}
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
