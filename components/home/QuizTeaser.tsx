import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

export function QuizTeaser() {
  const t = useTranslations('home.quiz')

  return (
    <section className="py-6 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-3xl border border-ds-border"
          style={{ backgroundColor: '#1E3828' }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-moss/5 rounded-full blur-3xl" />
            {/* Decorative fungal pattern */}
            <svg className="absolute right-0 top-0 h-full opacity-5" viewBox="0 0 300 300" fill="none">
              <circle cx="200" cy="150" r="120" stroke="#C45E2A" strokeWidth="1" strokeDasharray="4 8" />
              <circle cx="200" cy="150" r="80" stroke="#4A7C59" strokeWidth="1" strokeDasharray="2 6" />
              <circle cx="200" cy="150" r="40" stroke="#C45E2A" strokeWidth="1" />
            </svg>
          </div>

          <div className="relative z-10 py-16 px-8 sm:px-16 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="text-center sm:text-left space-y-3">
              <p className="font-body font-light uppercase tracking-[0.2em] text-moss text-sm">
                Species Quiz
              </p>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-cream">
                {t('title')}
              </h2>
              <p className="font-body text-cream-muted text-lg">{t('subtitle')}</p>
            </div>
            <div className="flex-shrink-0">
              <Link href="/quiz">
                <Button size="lg" className="min-w-[200px]">
                  🍄 {t('cta')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
