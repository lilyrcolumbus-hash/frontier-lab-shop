import { useTranslations } from 'next-intl'
import { SpeciesFinder } from '@/components/tools/SpeciesFinder'

export default function SpeciesFinderPage() {
  const t = useTranslations('tools.finder')
  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-surface border-b border-ds-border py-16 text-center">
        <p className="font-body font-light uppercase tracking-[0.2em] text-moss text-sm mb-3">DirtyShrooms Tools</p>
        <h1 className="font-heading text-5xl font-bold text-cream mb-3">🔍 {t('title')}</h1>
        <p className="text-cream-muted text-lg max-w-lg mx-auto">{t('subtitle')}</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SpeciesFinder />
      </div>
    </div>
  )
}
