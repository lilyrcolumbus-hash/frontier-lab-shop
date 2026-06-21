'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Button } from '@/components/ui/Button'

export function Newsletter() {
  const t = useTranslations('home.newsletter')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    await new Promise((r) => setTimeout(r, 900))
    setStatus('success')
  }

  return (
    <section className="py-28 bg-surface border-t border-ds-border relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute -top-40 left-1/4 w-96 h-96 bg-accent/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-violet/[0.05] rounded-full blur-[100px] pointer-events-none" />

      <ScrollReveal className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
        {/* Glowing icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-accent/20 bg-accent/[0.06] mb-8 glow-cyan-sm">
          <span className="text-4xl">🍄</span>
        </div>

        <h2 className="font-display text-5xl sm:text-6xl text-cream tracking-wide mb-4">
          {t('title')}
        </h2>
        <p className="font-body text-cream-muted text-lg mb-10 leading-relaxed">
          {t('subtitle')}
        </p>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'backOut' }}
              className="bg-accent/10 border border-accent/30 rounded-2xl py-8 px-10 glow-cyan"
            >
              <p className="text-accent font-heading text-2xl glow-cyan-text">✓ {t('success')}</p>
              <p className="text-cream-muted text-sm mt-2 font-mono">Welcome to the mycelium network.</p>
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
                className="flex-1 bg-elevated border border-ds-border rounded-xl px-5 py-3.5 text-cream placeholder:text-cream-muted/50 font-body text-base focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 transition-all duration-200"
              />
              <Button
                type="submit"
                isLoading={status === 'loading'}
                size="md"
                className="sm:w-auto w-full bg-accent text-bg font-bold border-0 hover:bg-accent-hover glow-cyan transition-all"
              >
                {t('cta')}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        {status !== 'success' && (
          <p className="mt-5 text-xs text-cream-muted/50 font-mono">{t('privacy')}</p>
        )}

        {/* Social proof dots */}
        <div className="flex items-center justify-center gap-4 mt-10 text-xs text-cream-muted/40 font-mono">
          <span>12K+ subscribers</span>
          <span className="w-1 h-1 rounded-full bg-cream-muted/30" />
          <span>Weekly drops</span>
          <span className="w-1 h-1 rounded-full bg-cream-muted/30" />
          <span>No spam</span>
        </div>
      </ScrollReveal>
    </section>
  )
}
