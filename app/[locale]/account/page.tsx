'use client'

import { Suspense, useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useRouter, Link } from '@/navigation'
import { useSupabaseUser } from '@/components/providers/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

function VerifyBanner() {
  const t = useTranslations('account')
  const searchParams = useSearchParams()
  const verifyParam = searchParams.get('verify')
  const { user, loading } = useSupabaseUser()

  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleResend = async () => {
    if (!user?.email) return
    setResendStatus('sending')
    const supabase = createClient()
    await supabase.auth.resend({ type: 'signup', email: user.email }).catch(() => {})
    setResendStatus('sent')
  }

  if (loading || !user) return null

  if (verifyParam === 'success') {
    return (
      <div className="max-w-md mx-auto px-4 pt-8">
        <div className="bg-accent/10 border border-accent/25 rounded-xl px-4 py-3.5">
          <p className="text-sm text-accent">✓ {t('verifySuccess')}</p>
        </div>
      </div>
    )
  }

  const emailVerified = Boolean(user.email_confirmed_at)
  if (emailVerified) return null

  return (
    <div className="max-w-md mx-auto px-4 pt-8">
      <div className="bg-amber/10 border border-amber/25 rounded-xl px-4 py-3.5 space-y-2">
        <p className="text-sm text-cream">
          {verifyParam === 'expired' ? t('verifyExpired') : t('verifyEmailPrompt')}
        </p>
        {resendStatus === 'sent' ? (
          <p className="text-sm text-accent">{t('verificationSent')}</p>
        ) : (
          <button
            onClick={handleResend}
            disabled={resendStatus === 'sending'}
            className="text-sm text-accent hover:text-accent-hover font-medium disabled:opacity-50"
          >
            {t('resendVerification')}
          </button>
        )}
      </div>
    </div>
  )
}

export default function AccountPage() {
  const t = useTranslations('account')
  const locale = useLocale()
  const router = useRouter()
  const { user, loading } = useSupabaseUser()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFormLoading(true)
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setFormLoading(false)
    if (signInError) {
      setError(t('invalidCredentials'))
      return
    }
    router.refresh()
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleGoogleSignIn = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/${locale}/account` },
    })
  }

  if (loading) {
    return <div className="pt-20 min-h-screen" />
  }

  if (user) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="bg-surface border-b border-ds-border py-16 text-center">
          <h1 className="font-heading text-5xl font-bold text-cream mb-3">{t('title')}</h1>
          <p className="text-cream-muted">
            {t('signedInAs')} {user.email}
          </p>
        </div>

        <Suspense fallback={null}>
          <VerifyBanner />
        </Suspense>

        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-elevated rounded-2xl border border-ds-border p-8 space-y-4">
            <div className="space-y-3">
              {[
                { label: t('orders'), href: '/account/orders' },
                { label: t('journal'), href: '/tools/grow-journal' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-3 rounded-xl border border-ds-border text-cream hover:border-accent/40 hover:bg-accent/5 transition-colors"
                >
                  {item.label}
                  <span className="text-cream-muted">→</span>
                </Link>
              ))}
            </div>
            <Button fullWidth variant="outline" size="lg" onClick={handleSignOut}>
              {t('signOut')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-surface border-b border-ds-border py-16 text-center">
        <h1 className="font-heading text-5xl font-bold text-cream mb-3">{t('signIn')}</h1>
        <p className="text-cream-muted">{t('welcomeBack')}</p>
      </div>

      <div className="max-w-md mx-auto px-4 py-16">
        <form onSubmit={handleSignIn} className="bg-elevated rounded-2xl border border-ds-border p-8 space-y-5">
          <div className="space-y-4">
            <Input
              label={t('email')}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label={t('password')}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-right -mt-2">
            <Link href="/forgot-password" className="text-sm text-accent hover:text-accent-hover transition-colors">
              {t('forgotPassword')}
            </Link>
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          <Button type="submit" fullWidth size="lg" isLoading={formLoading}>
            {t('signIn')}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ds-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-elevated px-3 text-cream-muted">or</span>
            </div>
          </div>

          <Button type="button" fullWidth variant="outline" size="lg" onClick={handleGoogleSignIn}>
            {t('continueWithGoogle')}
          </Button>

          <p className="text-center text-sm text-cream-muted">
            {t('noAccount')}{' '}
            <Link href="/signup" className="text-accent hover:text-accent-hover transition-colors font-medium">
              {t('signUp')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
