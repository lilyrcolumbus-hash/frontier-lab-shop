'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Button } from '@/components/ui/Button'

export function Newsletter() {
  const t = useTranslations('home.newsletter')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    await new Promise((r) => setTimeout(r, 900))
    setStatus('success')
  }

  return (
    <section className="py-28 bg-surface border-t border-ds-border relative overflow-hidden">
      {/* Ambient warm glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <ScrollReveal className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
        {/* Glowing mushroom icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-amber/20 bg-amber/[0.06] mb-8 animate-pulse-soft">
          <span className="text-4xl">🍄</span>
        </div>

        <h2 className="font-heading text-4xl sm:text-5xl text-cream font-bold mb-4">
          {t('title')}
        </h2>
        <p className="font-accent italic text-cream-muted text-xl mb-10 leading-relaxed">
          {t('subtitle')}
        </p>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'backOut' }}
              className="bg-amber/10 border border-amber/25 rounded-2xl py-8 px-10 glow-amber"
            >
              <p className="text-amber font-heading text-2xl glow-amber-text">✓ {t('success')}</p>
              <p className="text-cream-muted text-sm mt-2 font-mono">Welcome to the forest network.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('placeholder')}
                required
                aria-label="Email address"
                className="flex-1 bg-elevated border border-ds-border rounded-xl px-5 py-3.5 text-cream placeholder:text-cream-muted/40 font-body text-base focus:outline-none focus:ring-2 focus:ring-amber/35 focus:border-amber/40 transition-all duration-200"
              />
              <Button
                type="submit"
                isLoading={status === 'loading'}
                size="md"
                className="sm:w-auto w-full"
              >
                {t('cta')}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        {status !== 'success' && (
          <p className="mt-5 text-xs text-cream-muted/40 font-mono">{t('privacy')}</p>
        )}

        <div className="flex items-center justify-center gap-4 mt-10 text-xs text-cream-muted/35 font-mono">
          <span>12K+ subscribers</span>
          <span className="w-1 h-1 rounded-full bg-amber/40" />
          <span>Weekly drops</span>
          <span className="w-1 h-1 rounded-full bg-amber/40" />
          <span>No spam</span>
        </div>
      </ScrollReveal>
    </section>
  )
}
