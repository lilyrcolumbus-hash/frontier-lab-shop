'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Button } from '@/components/ui/Button'

const QUESTIONS = [
  'Experience level?',
  'Indoor or outdoor?',
  'Edible or medicinal?',
  'Climate zone?',
]

export function QuizTeaser() {
  const t = useTranslations('home.quiz')

  return (
    <section className="py-16 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl border border-amber/10">
            {/* Dark forest interior */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#060B05] via-[#08100A] to-[#0B0916]" />
            <div className="absolute inset-0 forest-bg" />

            {/* Warm floor glow */}
            <div className="absolute -bottom-10 left-1/3 w-96 h-48 bg-amber/8 rounded-full blur-[80px] pointer-events-none" />
            {/* Canopy glow */}
            <div className="absolute -top-10 right-1/3 w-64 h-32 bg-accent/6 rounded-full blur-[60px] pointer-events-none" />

            {/* Fairy ring decoration */}
            <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 pointer-events-none">
              {[160, 110, 65].map((r, i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-amber/8"
                  style={{ width: r * 2, height: r * 2, top: -r, right: -r }}
                />
              ))}
            </div>

            <div className="relative z-10 py-16 px-8 sm:px-16 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="text-center lg:text-left space-y-4 max-w-lg">
                <span className="font-accent italic text-amber/70 text-base">
                  Find your perfect species
                </span>
                <h2 className="font-display text-5xl sm:text-6xl text-cream tracking-wide leading-none">
                  {t('title')}
                </h2>
                <p className="font-body text-cream-muted text-lg leading-relaxed">
                  {t('subtitle')}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {QUESTIONS.map((q, i) => (
                    <motion.span
                      key={q}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.4, ease: 'backOut' }}
                      className="inline-block text-xs font-mono text-cream-muted/60 px-3 py-1.5 rounded-full border border-ds-border bg-surface/40"
                    >
                      {i + 1}. {q}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="flex-shrink-0 text-center space-y-4">
                <Link href="/quiz">
                  <Button
                    size="lg"
                    className="min-w-[220px] bg-amber text-bg font-semibold border-0 glow-amber hover:bg-amber-bright transition-all duration-300 hover:scale-[1.04]"
                  >
                    🍄 {t('cta')}
                  </Button>
                </Link>
                <p className="text-xs text-cream-muted/40 font-mono">Takes &lt; 2 minutes</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
