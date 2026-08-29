'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * Shared loader for the admin list pages.
 *
 * Every list page used to do `fetch(...).then(r => r.json()).then(d => setX(d.x ?? []))`,
 * which had two real failure modes: a request that never settles (cold serverless start,
 * a database that is waking up) left the page stuck on "Loading…" forever, and a 401/403/500
 * response was swallowed into an empty array — the page then claimed there was no data when
 * the real problem was authorization or an outage. This surfaces both instead.
 */
export function useAdminList<T>(url: string, key: string, timeoutMs = 20000) {
  const [data, setData] = useState<T[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    setData(null)
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) })
      const body = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(body?.error ?? `Request failed (${response.status})`)
      }
      setData((body?.[key] as T[]) ?? [])
    } catch (caught) {
      const isTimeout = caught instanceof DOMException && caught.name === 'TimeoutError'
      setError(
        isTimeout
          ? 'This is taking longer than expected. The server may be waking up — try again.'
          : caught instanceof Error
            ? caught.message
            : 'Something went wrong.'
      )
    }
  }, [url, key, timeoutMs])

  useEffect(() => {
    void load()
  }, [load])

  return { data, error, reload: load }
}
