'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

function ResetPasswordForm() {
  const t = useTranslations('account')
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!token || !email) {
    return <p className="text-sm text-error text-center">{t('resetExpired')}</p>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email, password }),
    })
    setLoading(false)

    if (!res.ok) {
      setError(t('resetExpired'))
      return
    }
    setSuccess(true)
    setTimeout(() => router.push('/account'), 2000)
  }

  if (success) {
    return <p className="text-sm text-accent text-center">✓ {t('resetSuccess')}</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label={t('newPassword')}
        type="password"
        placeholder="••••••••"
        minLength={8}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-sm text-error">{error}</p>}
      <Button type="submit" fullWidth size="lg" isLoading={loading}>
        {t('resetPasswordTitle')}
      </Button>
    </form>
  )
}

export default function ResetPasswordPage() {
  const t = useTranslations('account')

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-surface border-b border-ds-border py-16 text-center">
        <h1 className="font-heading text-5xl font-bold text-cream mb-3">{t('resetPasswordTitle')}</h1>
      </div>

      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-elevated rounded-2xl border border-ds-border p-8 space-y-5">
          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>

          <p className="text-center text-sm text-cream-muted">
            <Link href="/account" className="text-accent hover:text-accent-hover transition-colors font-medium">
              ← {t('backToSignIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
