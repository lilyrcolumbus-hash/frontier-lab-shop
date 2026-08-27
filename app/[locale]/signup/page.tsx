'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, Link } from '@/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'

export default function SignUpPage() {
  const t = useTranslations('account')
  const locale = useLocale()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, locale },
        emailRedirectTo: `${window.location.origin}/${locale}/account`,
      },
    })

    if (signUpError) {
      setError(signUpError.message.toLowerCase().includes('already') ? t('emailInUse') : t('registerError'))
      setLoading(false)
      return
    }

    if (subscribeToNewsletter) {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      }).catch(() => {})
    }

    setLoading(false)

    // Supabase requires email confirmation before a session is issued (no `session` on the
    // response yet) — show a "check your email" state instead of redirecting into a page that
    // would just show the sign-in form again with no explanation.
    if (!data.session) {
      setSubmitted(true)
      return
    }

    router.push('/account')
    router.refresh()
  }

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="bg-surface border-b border-ds-border py-16 text-center">
          <h1 className="font-heading text-5xl font-bold text-cream mb-3">{t('signUp')}</h1>
        </div>
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-elevated rounded-2xl border border-ds-border p-8 text-center space-y-2">
            <p className="text-accent">✓ {t('verificationSent')}</p>
            <Link href="/account" className="text-sm text-accent hover:text-accent-hover font-medium">
              {t('backToSignIn')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-surface border-b border-ds-border py-16 text-center">
        <h1 className="font-heading text-5xl font-bold text-cream mb-3">{t('signUp')}</h1>
        <p className="text-cream-muted">{t('createAccountSubtitle')}</p>
      </div>

      <div className="max-w-md mx-auto px-4 py-16">
        <form onSubmit={handleSubmit} className="bg-elevated rounded-2xl border border-ds-border p-8 space-y-5">
          <div className="space-y-4">
            <Input
              label={t('name')}
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label={t('email')}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <PasswordInput
              label={t('password')}
              placeholder="••••••••"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <label className="flex items-start gap-2.5 text-sm text-cream-muted cursor-pointer">
            <input
              type="checkbox"
              checked={subscribeToNewsletter}
              onChange={(e) => setSubscribeToNewsletter(e.target.checked)}
              className="mt-0.5 rounded border-ds-border"
            />
            {locale === 'es'
              ? 'Quiero recibir novedades por correo (sin spam, puedo darme de baja cuando quiera).'
              : "I'd like to receive updates by email (no spam, unsubscribe anytime)."}
          </label>

          {error && <p className="text-sm text-error">{error}</p>}

          <Button type="submit" fullWidth size="lg" isLoading={loading}>
            {t('signUp')}
          </Button>

          <p className="text-center text-sm text-cream-muted">
            {t('alreadyHaveAccount')}{' '}
            <Link href="/account" className="text-accent hover:text-accent-hover transition-colors font-medium">
              {t('signIn')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
