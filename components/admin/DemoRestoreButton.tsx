'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * "Restore demo": puts the public demo back to its snapshot (products, species, collections, pages and
 * texts). Only rendered on the demo deployment. The loading state is cleared in `finally`, so a dropped
 * connection can never leave the button stuck, and a failure shows its real reason.
 */
export function DemoRestoreButton() {
  const router = useRouter()
  const [isRestoring, setIsRestoring] = useState(false)
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null)

  const handleRestore = async () => {
    if (!window.confirm('Restore the demo? Every change made in the demo admin will be undone.')) return
    setIsRestoring(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/demo/reset', { method: 'POST' })
      const body = await response.json().catch(() => null)
      if (!response.ok) {
        setMessage({ text: body?.error ?? 'Could not restore the demo.', isError: true })
        return
      }
      setMessage({ text: 'Demo restored.', isError: false })
      router.refresh()
    } catch {
      setMessage({ text: 'Could not reach the server. Check your connection and try again.', isError: true })
    } finally {
      setIsRestoring(false)
    }
  }

  return (
    <span className="inline-flex items-center gap-3">
      <button
        type="button"
        onClick={handleRestore}
        disabled={isRestoring}
        className="border border-cream bg-cream px-3 py-1 text-xs font-semibold text-bg disabled:opacity-60"
      >
        {isRestoring ? 'Restoring…' : 'Restore demo'}
      </button>
      {message && (
        <span role="status" className={message.isError ? 'text-xs text-error' : 'text-xs text-accent'}>
          {message.text}
        </span>
      )}
    </span>
  )
}
