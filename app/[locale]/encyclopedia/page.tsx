import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { EncyclopediaBrowser } from '@/components/encyclopedia/EncyclopediaBrowser'
import { VideoMoment } from '@/components/ui/VideoMoment'
import { listSpecies } from '@/lib/fl/species'

// Reads live from the DB, editable via /admin — must not be frozen at build time.
export const dynamic = 'force-dynamic'

export default async function EncyclopediaPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('encyclopedia')

  const speciesList = await listSpecies()

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <div className="bg-surface border-b border-ds-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-3">
            Frontier Lab Encyclopedia
          </p>
          <h1 className="font-heading font-medium text-4xl sm:text-5xl tracking-tight text-cream mb-4">
            {t('title')}
          </h1>
          <p className="text-cream-muted text-lg max-w-xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      <VideoMoment
        src="/video/grow-journey.mp4"
        eyebrow="Eight Species, One Standard"
        headline="Every profile below is grounded in real bioactive compounds, not vague wellness claims"
        subtext="Beta-glucans, ganoderic acids, cordycepin — we name the actual compound behind every benefit we list."
        align="center"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EncyclopediaBrowser speciesList={speciesList} />
      </div>
    </div>
  )
}
