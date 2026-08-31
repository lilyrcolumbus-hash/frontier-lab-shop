/**
 * Minimal CSV reader/writer for the product import and export.
 *
 * Hand-rolled rather than pulled from npm because the format here is narrow and fully known:
 * one header row, quoted fields, doubled quotes for a literal quote. A parser that silently
 * mangles a description containing a comma would corrupt the catalog, so it is explicit.
 */

export function toCsv(rows: Record<string, string | number | null>[], columns: string[]): string {
  const escape = (value: string | number | null): string => {
    const text = value === null || value === undefined ? '' : String(value)
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  const header = columns.map(escape).join(',')
  const body = rows.map((row) => columns.map((column) => escape(row[column] ?? '')).join(','))
  return [header, ...body].join('\r\n')
}

/** Splits one CSV line, honouring quoted fields that contain commas or escaped quotes. */
function parseLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"'
          i += 1
        } else {
          inQuotes = false
        }
      } else {
        current += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      fields.push(current)
      current = ''
    } else {
      current += char
    }
  }
  fields.push(current)
  return fields
}

/** Parses a whole CSV into objects keyed by the header row. Blank lines are skipped. */
export function fromCsv(text: string): Record<string, string>[] {
  // A quoted field can legally contain a newline, so the file is walked character by character
  // to find the real row boundaries rather than split on \n.
  const lines: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '""'
        i += 1
        continue
      }
      inQuotes = !inQuotes
      current += char
      continue
    }
    if (!inQuotes && (char === '\n' || char === '\r')) {
      if (text[i] === '\r' && text[i + 1] === '\n') i += 1
      lines.push(current)
      current = ''
      continue
    }
    current += char
  }
  if (current) lines.push(current)

  const rows = lines.filter((line) => line.trim() !== '')
  if (rows.length === 0) return []

  const header = parseLine(rows[0]).map((h) => h.trim())
  return rows.slice(1).map((line) => {
    const fields = parseLine(line)
    return Object.fromEntries(header.map((key, index) => [key, (fields[index] ?? '').trim()]))
  })
}
