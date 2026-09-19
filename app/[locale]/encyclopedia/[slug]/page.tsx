import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ImagePlaceholder } from '@/components/encyclopedia/ImagePlaceholder'
import { getSpecies } from '@/lib/fl/species'
import type { SpeciesBenefit } from '@/lib/species-data'

// Reads live from the DB, editable via /admin — must not be frozen at build time.
export const dynamic = 'force-dynamic'

// ─── Benefit icon ─────────────────────────────────────────────────────────────

function BenefitIcon({ name }: { name: SpeciesBenefit['icon'] }) {
  const props = {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'w-5 h-5',
  }
  switch (name) {
    case 'brain':
      return (
        <svg {...props}>
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    case 'heart':
      return (
        <svg {...props}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )
    case 'leaf':
      return (
        <svg {...props}>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      )
    case 'activity':
      return (
        <svg {...props}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      )
    case 'zap':
      return (
        <svg {...props}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    case 'sun':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
        </svg>
      )
    case 'droplet':
      return (
        <svg {...props}>
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      )
  }
}

const ICON_COLOR: Record<SpeciesBenefit['icon'], string> = {
  brain:    'bg-cream-muted/15 text-cream-muted', // lavender banned — neutral, gold stays for the CTA/emphasis role only
  shield:   'bg-accent/15 text-accent',
  heart:    'bg-amber/15 text-amber',
  leaf:     'bg-moss/15 text-moss',
  activity: 'bg-accent/15 text-accent',
  zap:      'bg-amber/15 text-amber',
  sun:      'bg-amber/15 text-amber',
  droplet:  'bg-silver/15 text-silver',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SpeciesDetailPage({
  params,
}: {
  params: { slug: string; locale: string }
}) {
  setRequestLocale(params.locale)

  const locale = params.locale as 'en' | 'es'
  const species = await getSpecies(params.slug)
  if (!species) notFound()

  const hasImage = Boolean(species.imageUrl)

  return (
    <div className="pt-16 min-h-screen">
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      {hasImage ? (
        <div className="relative h-72 sm:h-96 overflow-hidden">
          <img
            src={species.imageUrl}
            alt={species.commonName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10">
            <div className="max-w-7xl mx-auto">
              <Link
                href="/encyclopedia"
                className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors mb-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Encyclopedia
              </Link>
              <h1 className="font-heading font-medium text-4xl sm:text-5xl text-white">
                {species.commonName}
              </h1>
              <p className="font-mono text-sm text-white/60 italic mt-1">{species.scientificName}</p>
            </div>
          </div>
        </div>
      ) : (
        /* No-image hero: name + prominent prompt placeholder */
        <div className="bg-elevated border-b border-ds-border pt-24 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/encyclopedia"
              className="inline-flex items-center gap-1.5 text-sm text-cream-muted hover:text-cream transition-colors mb-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Encyclopedia
            </Link>
            <h1 className="font-heading font-medium text-4xl sm:text-5xl text-cream">{species.commonName}</h1>
            <p className="font-mono text-sm text-cream-muted italic mt-1">{species.scientificName}</p>

            {species.openartPrompt && (
              <div className="mt-8 bg-amber/8 border-2 border-dashed border-amber/50 rounded-none p-6 max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-amber flex-shrink-0">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-amber">
                    Imagen pendiente — Generar en OpenArt · FLUX.1 · Photorealistic
                  </span>
                </div>
                <div className="bg-bg rounded-none p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber/60 mb-2">Prompt para {species.commonName}</p>
                  <p className="font-mono text-xs text-cream leading-relaxed">{species.openartPrompt}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Quick stats bar ────────────────────────────────────────────── */}
      <div className="bg-surface border-b border-ds-border sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-muted">Difficulty</span>
              <Badge
                variant={
                  species.difficulty === 'beginner'
                    ? 'success'
                    : species.difficulty === 'intermediate'
                    ? 'warning'
                    : 'error'
                }
                size="sm"
              >
                {species.difficulty.charAt(0).toUpperCase() + species.difficulty.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-muted">Type</span>
              <Badge variant={species.type === 'medicinal' ? 'accent' : 'moss'} size="sm">
                {species.type.charAt(0).toUpperCase() + species.type.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-2 hidden sm:flex">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-muted">Fruiting Temp</span>
              <span className="text-sm text-cream">
                {species.fruitingTempF.min}–{species.fruitingTempF.max}°F / {species.fruitingTempC.min}–{species.fruitingTempC.max}°C
              </span>
            </div>
            <div className="flex items-center gap-2 hidden sm:flex">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-muted">Environment</span>
              <span className="text-sm text-cream capitalize">
                {species.indoorOutdoor === 'both' ? 'Indoor & Outdoor' : species.indoorOutdoor}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── KEY BENEFITS — first section ───────────────────────────────── */}
        <section className="mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-1">Key Benefits</p>
          <h2 className="font-heading font-medium text-2xl sm:text-3xl tracking-tight text-cream mb-7">
            Why {species.commonName}?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {species.keyBenefits.map((benefit) => (
              <div
                key={benefit.label}
                className="bg-surface border border-ds-border rounded-none p-5 flex flex-col gap-3 hover:border-accent/40 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-none flex items-center justify-center flex-shrink-0 ${ICON_COLOR[benefit.icon]}`}
                >
                  <BenefitIcon name={benefit.icon} />
                </div>
                <div>
                  <p className="font-body font-semibold text-cream text-sm mb-1">{benefit.label}</p>
                  <p className="text-xs text-cream-muted leading-relaxed">{benefit.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Main content + sidebar ──────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left column — rich content */}
          <div className="flex-1 min-w-0 space-y-14">

            {/* About */}
            <section>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-moss mb-1">About</p>
              <h2 className="font-heading font-medium text-xl tracking-tight text-cream mb-4">
                What is {species.commonName}?
              </h2>
              <p className="text-cream-muted leading-relaxed text-base">{species.description[locale]}</p>
            </section>

            {/* Medicinal Properties */}
            <section className="bg-elevated rounded-none border border-ds-border p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-1">Science</p>
              <h2 className="font-heading font-medium text-xl tracking-tight text-cream mb-4">
                Medicinal Properties
              </h2>
              <p className="text-cream-muted leading-relaxed">{species.medicalNotes[locale]}</p>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-surface rounded-none p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-muted mb-1">
                    Beta-Glucan Content
                  </p>
                  <p className="text-cream font-medium text-sm">{species.betaGlucanContent}</p>
                </div>
                <div className="bg-surface rounded-none p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-muted mb-1">
                    Biological Efficiency
                  </p>
                  <p className="text-cream font-medium text-sm">{species.biologicalEfficiency}</p>
                </div>
              </div>
            </section>

            {/* Cultivation */}
            <section>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-moss mb-1">Cultivation</p>
              <h2 className="font-heading font-medium text-xl tracking-tight text-cream mb-4">How to Grow</h2>
              <p className="text-cream-muted leading-relaxed">{species.cultivationNotes[locale]}</p>
            </section>

            {/* Kitchen / Preparation */}
            <section>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-amber mb-1">
                {species.type === 'medicinal' ? 'Preparation' : 'Kitchen'}
              </p>
              <h2 className="font-heading font-medium text-xl tracking-tight text-cream mb-4">
                {species.type === 'medicinal' ? 'How to Use' : 'In the Kitchen'}
              </h2>
              <p className="text-cream-muted leading-relaxed">{species.cookingNotes[locale]}</p>
            </section>

            {/* Lookalikes — safety */}
            {species.lookalikes.length > 0 && (
              <section className="bg-amber/8 border border-amber/25 rounded-none p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-amber mb-1">Safety</p>
                <h2 className="font-heading font-medium text-xl tracking-tight text-cream mb-3">
                  Toxic Lookalikes
                </h2>
                <p className="text-sm text-amber mb-4">
                  Always verify identification before consuming wild mushrooms.
                </p>
                <ul className="space-y-2">
                  {species.lookalikes.map((l) => (
                    <li key={l} className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-amber mt-0.5 flex-shrink-0">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      <span className="font-mono text-sm text-cream-muted italic">{l}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="lg:w-72 flex-shrink-0 space-y-5">
            {/* Cultivation Specs */}
            <div className="bg-elevated rounded-none border border-ds-border p-6">
              <h3 className="font-body font-semibold text-cream mb-5">Cultivation Specs</h3>
              <dl className="space-y-4">
                {[
                  ['Substrate', species.substrate.join(', ')],
                  [
                    'Colonization',
                    `${species.colonizationWeeks.min}–${species.colonizationWeeks.max} weeks`,
                  ],
                  [
                    'Fruiting Temp',
                    `${species.fruitingTempF.min}–${species.fruitingTempF.max}°F / ${species.fruitingTempC.min}–${species.fruitingTempC.max}°C`,
                  ],
                  [
                    'Flushes',
                    species.expectedFlushes === 99
                      ? 'Perennial'
                      : species.expectedFlushes === 1
                      ? '1 main flush'
                      : `${species.expectedFlushes} flushes`,
                  ],
                  [
                    'Environment',
                    species.indoorOutdoor === 'both'
                      ? 'Indoor & Outdoor'
                      : species.indoorOutdoor.charAt(0).toUpperCase() + species.indoorOutdoor.slice(1),
                  ],
                ].map(([label, val]) => (
                  <div key={label}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-muted">
                      {label}
                    </dt>
                    <dd className="text-sm text-cream mt-0.5 leading-snug">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Taxonomy */}
            <div className="bg-elevated rounded-none border border-ds-border p-6">
              <h3 className="font-body font-semibold text-cream mb-5">Taxonomy</h3>
              <dl className="space-y-4">
                {[
                  ['Order', species.order],
                  ['Family', species.family],
                  ['Species', species.scientificName],
                ].map(([label, val]) => (
                  <div key={label}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-muted">
                      {label}
                    </dt>
                    <dd className="text-sm text-cream italic mt-0.5">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* CTAs */}
            <Link href="/tools/grow-journal" className="block">
              <Button fullWidth variant="outline">
                Add to Grow Journal
              </Button>
            </Link>
            <Link href={`/shop?species=${species.slug}`} className="block">
              <Button fullWidth>
                Shop {species.commonName} Products
              </Button>
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
