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
          <div className="relative overflow-hidden rounded-3xl border border-accent/15">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#040e0c] via-[#071210] to-[#0c071a]" />
            <div className="absolute inset-0 mycelium-bg" />

            {/* Glowing orbs */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/8 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-violet/8 rounded-full blur-[100px] pointer-events-none" />

            {/* Decorative rings */}
            <div className="absolute right-[-50px] top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
              {[180, 130, 80].map((r, i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-accent/10"
                  style={{
                    width: r * 2,
                    height: r * 2,
                    top: -r,
                    right: -r,
                    animationDelay: `${i * 0.4}s`,
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 py-16 px-8 sm:px-16 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="text-center lg:text-left space-y-4 max-w-lg">
                <span className="inline-flex items-center gap-2 font-mono text-accent text-xs uppercase tracking-[0.2em]">
                  <span className="w-4 h-px bg-accent" />
                  Species Quiz
                </span>
                <h2 className="font-display text-5xl sm:text-6xl text-cream tracking-wide leading-none">
                  {t('title')}
                </h2>
                <p className="font-body text-cream-muted text-lg leading-relaxed">
                  {t('subtitle')}
                </p>

                {/* Mini question preview */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {QUESTIONS.map((q, i) => (
                    <motion.span
                      key={q}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.4, ease: 'backOut' }}
                      className="inline-block text-xs font-mono text-cream-muted/70 px-3 py-1.5 rounded-full border border-ds-border bg-surface/50"
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
                    className="min-w-[220px] bg-accent text-bg font-bold border-0 hover:bg-accent-hover glow-cyan transition-all duration-300 hover:scale-[1.04] hover:shadow-glow-cyan"
                  >
                    🍄 {t('cta')}
                  </Button>
                </Link>
                <p className="text-xs text-cream-muted/50 font-mono">Takes &lt; 2 minutes</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
