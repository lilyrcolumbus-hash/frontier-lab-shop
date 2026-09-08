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
          <div className="relative overflow-hidden rounded-3xl border border-cream/10" style={{ backgroundColor: '#1A1F1C' }}>
            {/* Subtle studio ambient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream to-[#222820]" style={{ opacity: 1 }} />

            {/* Warm accent glow */}
            <div className="absolute -bottom-10 left-1/3 w-96 h-48 rounded-full blur-[80px] pointer-events-none" style={{ background: 'rgba(158,104,32,0.08)' }} />
            <div className="absolute -top-10 right-1/3 w-64 h-32 rounded-full blur-[60px] pointer-events-none" style={{ background: 'rgba(58,112,71,0.07)' }} />

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
                <span className="text-[11px] font-mono text-amber/55 uppercase tracking-[0.22em]">
                  Find your perfect species
                </span>
                <h2 className="font-heading font-medium text-3xl sm:text-4xl text-cream tracking-tight leading-tight">
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
                      className="inline-block text-xs font-mono px-3 py-1.5 rounded-none border" style={{ color: 'rgba(240,244,240,0.55)', borderColor: 'rgba(240,244,240,0.12)', background: 'rgba(240,244,240,0.05)' }}
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
                    className="min-w-[220px] bg-amber-bright font-semibold border-0 transition-all duration-300 hover:scale-[1.04]" style={{ color: '#F7F8F5' }}
                  >
                    {t('cta')}
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
