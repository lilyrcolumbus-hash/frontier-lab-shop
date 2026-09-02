'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function OrderEmailButton({ orderId, email }: { orderId: string; email: string }) {
  const router = useRouter()
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const resend = async () => {
    if (!window.confirm(`Send the order confirmation to ${email} again?`)) return
    setSending(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/email`, { method: 'POST' })
      const data = await res.json().catch(() => null)
      setMessage(
        res.ok ? { ok: true, text: `Sent to ${email}.` } : { ok: false, text: data?.error ?? 'Could not send the email.' }
      )
      if (res.ok) router.refresh()
    } catch {
      setMessage({ ok: false, text: 'Could not reach the server. Check your connection and try again.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={resend}
        disabled={sending}
        className="px-4 py-2 rounded-full border border-ds-border text-sm font-medium text-cream hover:bg-elevated transition-colors disabled:opacity-50"
      >
        {sending ? 'Sending…' : 'Resend confirmation email'}
      </button>
      {message && <p className={`text-xs ${message.ok ? 'text-accent' : 'text-error'}`}>{message.text}</p>}
    </div>
  )
}
