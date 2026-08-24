'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function ForgotPasswordPage() {
  const t = useTranslations('account')
  const locale = useLocale()

  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth
      .resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/${locale}/reset-password` })
      .catch(() => {})
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-surface border-b border-ds-border py-16 text-center">
        <h1 className="font-heading text-5xl font-bold text-cream mb-3">{t('forgotPasswordTitle')}</h1>
        <p className="text-cream-muted">{t('forgotPasswordSubtitle')}</p>
      </div>

      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-elevated rounded-2xl border border-ds-border p-8 space-y-5">
          {sent ? (
            <p className="text-sm text-accent">{t('resetLinkSent')}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label={t('email')}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" fullWidth size="lg" isLoading={loading}>
                {t('sendResetLink')}
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
