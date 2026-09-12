'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthProvider, useSupabaseUser } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'

function AuthorizeInner() {
  const params = useSearchParams()
  const { user, loading } = useSupabaseUser()

  const clientId = params.get('client_id') ?? ''
  const redirectUri = params.get('redirect_uri') ?? ''
  const state = params.get('state') ?? ''
  const codeChallenge = params.get('code_challenge') ?? ''
  const codeChallengeMethod = params.get('code_challenge_method') ?? 'S256'
  const responseType = params.get('response_type') ?? ''

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const missingParams = !clientId || !redirectUri || !codeChallenge || responseType !== 'code'

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (signInError) setError('Invalid email or password.')
  }

  const handleAllow = async () => {
    setError('')
    setBusy(true)
    const res = await fetch('/api/mcp/authorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        redirect_uri: redirectUri,
        code_challenge: codeChallenge,
        code_challenge_method: codeChallengeMethod,
      }),
    }).catch(() => null)
    const data = await res?.json().catch(() => null)
    setBusy(false)
    if (!res?.ok || !data?.redirectUrl) {
      setError(data?.error ?? 'Could not authorize the connector. Try again.')
      return
    }
    const redirect = new URL(data.redirectUrl)
    if (state) redirect.searchParams.set('state', state)
    window.location.href = redirect.toString()
  }

  if (missingParams) {
    return (
      <p className="text-cream-muted text-sm">
        This link is missing required parameters — go back to claude.ai and try adding the
        connector again.
      </p>
    )
  }

  if (loading) return null

  if (!user) {
    return (
      <form onSubmit={handleSignIn} className="space-y-4 w-full max-w-sm">
        <h1 className="font-heading text-2xl text-cream">Sign in to connect Frontier Lab</h1>
        <p className="text-sm text-cream-muted">Claude is requesting access to your store&rsquo;s admin.</p>
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <Button type="submit" fullWidth disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    )
  }

  return (
    <div className="space-y-4 w-full max-w-sm">
      <h1 className="font-heading text-2xl text-cream">Allow Claude to access Frontier Lab?</h1>
      <p className="text-sm text-cream-muted">
        Signed in as {user.email}. This grants read and write access to products, orders,
        customers, and discounts in your admin.
      </p>
      {error && <p className="text-sm text-error">{error}</p>}
      <Button onClick={handleAllow} disabled={busy} fullWidth>
        {busy ? 'Connecting…' : 'Allow'}
      </Button>
    </div>
  )
}

export default function McpAuthorizePage() {
  return (
    // This route lives outside app/[locale], the only place <AuthProvider> is normally mounted
    // (app/[locale]/layout.tsx) — without its own provider here, useSupabaseUser() falls back to
    // the context's static default ({ user: null, loading: true }) forever, and the page renders
    // a permanent blank screen since `loading` never becomes false.
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center px-4 bg-bg">
        <Suspense fallback={null}>
          <AuthorizeInner />
        </Suspense>
      </div>
    </AuthProvider>
  )
}
