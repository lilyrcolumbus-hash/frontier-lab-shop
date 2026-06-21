'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function Newsletter() {
  const t = useTranslations('home.newsletter')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    await new Promise((r) => setTimeout(r, 1000))
    setStatus('success')
  }

  return (
    <section className="py-24 bg-surface border-t border-ds-border">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-elevated rounded-full border border-ds-border mb-6">
          <span className="text-3xl">🍄</span>
        </div>

        <h2 className="font-heading text-4xl sm:text-5xl text-cream font-bold mb-3">
          {t('title')}
        </h2>
        <p className="font-body text-cream-muted text-lg mb-8">
          {t('subtitle')}
        </p>

        {status === 'success' ? (
          <div className="bg-success/10 border border-success/30 rounded-2xl py-6 px-8">
            <p className="text-success font-medium text-lg">✓ {t('success')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('placeholder')}
                required
                aria-label="Email address"
              />
            </div>
            <Button
              type="submit"
              isLoading={status === 'loading'}
              size="md"
              className="sm:w-auto w-full"
            >
              {t('cta')}
            </Button>
          </form>
        )}

        {status !== 'success' && (
          <p className="mt-4 text-sm text-cream-muted">{t('privacy')}</p>
        )}
      </div>
    </section>
  )
}
