'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ADMIN_LOGIN_EMAIL } from '@/lib/admin-login'

// Standalone admin sign-in. It lives inside /admin on purpose: it has nothing to do with the
// customer account pages. The email is fixed; only the password is typed.
export function AdminLogin({ signedInEmail }: { signedInEmail: string | null }) {
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(
    signedInEmail ? `${signedInEmail} is signed in but has no admin access.` : '',
  )

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: ADMIN_LOGIN_EMAIL,
        password,
      })
      if (signInError) {
        setError('Wrong password.')
        return
      }
      window.location.reload()
    } catch {
      setError('Could not reach the server. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="font-body font-bold text-2xl tracking-tight text-cream">Admin</h1>
        <p className="text-sm text-cream-muted">{ADMIN_LOGIN_EMAIL}</p>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          autoFocus
          required
          className="w-full border border-border bg-surface px-3 py-2 text-cream"
        />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={isLoading || password.length === 0}
          className="w-full bg-black px-3 py-2 text-white disabled:opacity-50"
        >
          {isLoading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
