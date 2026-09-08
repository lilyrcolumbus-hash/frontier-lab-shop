'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'

export default function ResetPasswordPage() {
  const t = useTranslations('account')
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError(t('resetExpired'))
      return
    }
    setSuccess(true)
    setTimeout(() => router.push('/account'), 2000)
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-surface border-b border-ds-border py-16 text-center">
        <h1 className="font-heading text-5xl font-bold text-cream mb-3">{t('resetPasswordTitle')}</h1>
      </div>

      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-elevated rounded-none border border-ds-border p-8 space-y-5">
          {success ? (
            <p className="text-sm text-accent text-center">✓ {t('resetSuccess')}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <PasswordInput
                label={t('newPassword')}
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
          )}

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
