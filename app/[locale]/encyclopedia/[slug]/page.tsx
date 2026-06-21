'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SpeciesTimeline } from '@/components/encyclopedia/SpeciesTimeline'
import type { Species } from '@/types/species'

// This data would come from the DB in production
const SPECIES_DB: Record<string, Species> = {
  'blue-oyster': {
    id: '1', slug: 'blue-oyster', commonName: 'Blue Oyster', scientificName: 'Pleurotus ostreatus',
    family: 'Pleurotaceae', order: 'Agaricales', type: 'edible', difficulty: 'beginner',
    substrate: ['Hardwood sawdust', 'Straw', 'Coffee grounds'], colonizationWeeks: { min: 2, max: 3 },
    fruitingTempF: { min: 55, max: 65 }, fruitingTempC: { min: 13, max: 18 }, expectedFlushes: 3,
    biologicalEfficiency: '25%', betaGlucanContent: 'High (25–30% dry weight)', indoorOutdoor: 'both',
    description: { en: 'The Blue Oyster mushroom is the most forgiving species for beginners. Native to temperate forests worldwide, Pleurotus ostreatus forms beautiful fan-shaped clusters with a blue-grey to cream coloring. It has a mild, slightly sweet flavor with a firm, meaty texture.', es: 'El hongo Ostra Azul es la especie más indulgente para principiantes. Nativo de bosques templados de todo el mundo, el Pleurotus ostreatus forma hermosos racimos en forma de abanico.' },
    cultivationNotes: { en: 'Blue Oysters thrive in a wide range of conditions. Pack substrate into bags, inoculate with grain spawn, and wait 2–3 weeks. Induce fruiting with fresh air and 85–95% humidity. Expect 3–4 flushes over 6–8 weeks.', es: 'Las Ostras Azules prosperan en una amplia gama de condiciones. Empaca el sustrato en bolsas, inocula con spawn de grano y espera 2-3 semanas.' },
    medicalNotes: { en: 'Rich in beta-glucans, ergothioneine, and lovastatin. Studies suggest cholesterol-lowering effects, immune modulation, and anti-inflammatory properties. High in protein (30% dry weight).', es: 'Rico en beta-glucanos, ergotionina y lovastatina. Los estudios sugieren efectos reductores del colesterol, modulación inmune y propiedades antiinflamatorias.' },
    cookingNotes: { en: 'Excellent sautéed in butter with garlic, roasted in the oven, or used as a seafood substitute. The firm texture holds up well to high heat. Pairs beautifully with thyme, white wine, and cream.', es: 'Excelente salteado en mantequilla con ajo, asado al horno o usado como sustituto de mariscos.' },
    lookalikes: [], imageUrl: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=400',
  },
  'lions-mane': {
    id: '2', slug: 'lions-mane', commonName: "Lion's Mane", scientificName: 'Hericium erinaceus',
    family: 'Hericiaceae', order: 'Russulales', type: 'medicinal', difficulty: 'intermediate',
    substrate: ['Hardwood sawdust'], colonizationWeeks: { min: 3, max: 4 },
    fruitingTempF: { min: 65, max: 75 }, fruitingTempC: { min: 18, max: 24 }, expectedFlushes: 2,
    biologicalEfficiency: '17%', betaGlucanContent: 'Very High', indoorOutdoor: 'indoor',
    description: { en: "Lion's Mane is one of the most visually striking and scientifically fascinating mushrooms. Its cascading white spines resemble a lion's mane. Revered in Traditional Chinese Medicine, modern science confirms powerful neuroprotective properties.", es: "La Melena de León es uno de los hongos más visualmente impactantes. Sus espinas blancas en cascada se asemejan a la melena de un león." },
    cultivationNotes: { en: "Requires high humidity (90–95%) and excellent fresh air exchange. Sensitive to CO2 buildup. Use enriched hardwood blocks. Maintain 65–75°F during fruiting.", es: "La Melena de León requiere alta humedad (90-95%) y excelente intercambio de aire fresco. Es sensible a la acumulación de CO2." },
    medicalNotes: { en: "Contains hericenones and erinacines that stimulate Nerve Growth Factor (NGF). Clinical studies show improvement in mild cognitive impairment, anxiety, and depression.", es: "Contiene hericenones y erinacinas que estimulan el Factor de Crecimiento Nervioso (NGF). Estudios clínicos muestran mejoras en deterioro cognitivo leve." },
    cookingNotes: { en: "Remarkable seafood-like texture — often compared to crab. Best sliced thick and seared in a very hot pan with butter. Superb in pasta or risotto.", es: "Textura similar a los mariscos, frecuentemente comparada con el cangrejo. Mejor cortado grueso y sellado en sartén muy caliente con mantequilla." },
    lookalikes: ['Hericium coralloides', 'Hericium americanum'],
    imageUrl: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400',
  },
  'shiitake': {
    id: '3', slug: 'shiitake', commonName: 'Shiitake', scientificName: 'Lentinula edodes',
    family: 'Marasmiaceae', order: 'Agaricales', type: 'edible', difficulty: 'intermediate',
    substrate: ['Hardwood sawdust', 'Oak logs'], colonizationWeeks: { min: 8, max: 52 },
    fruitingTempF: { min: 55, max: 75 }, fruitingTempC: { min: 13, max: 24 }, expectedFlushes: 10,
    biologicalEfficiency: '60%', betaGlucanContent: 'High (lentinan)', indoorOutdoor: 'both',
    description: { en: "Shiitake is the world's second most cultivated mushroom and cornerstone of East Asian cuisine for 1,000+ years. Its rich, smoky, umami flavor profile is unmatched.", es: "El Shiitake es el segundo hongo más cultivado del mundo y pilar de la cocina del este asiático durante más de 1,000 años." },
    cultivationNotes: { en: 'On logs: inoculate in spring, 6–12 months colonization, shock with cold water to fruit. On sawdust blocks: 8–12 weeks colonization. Requires cold shocking (50°F soak for 24h).', es: 'En troncos: inocula en primavera, 6-12 meses de colonización, shock con agua fría para fructificar.' },
    medicalNotes: { en: 'Contains lentinan (FDA Orphan Drug status cancer adjunct), eritadenine (reduces cholesterol), and AHCC (immune modulator).', es: 'Contiene lentinan (adyuvante para cáncer con estatus de Medicamento Huérfano FDA), eritadenina (reduce colesterol) y AHCC.' },
    cookingNotes: { en: 'The workhorse of umami cooking. Remove tough stems. Sauté in sesame oil, use in ramen broth, stir-fries, or risotto.', es: 'El caballo de batalla de la cocina umami. Retira los tallos duros. Saltea en aceite de sésamo, úsalo en caldo de ramen o risotto.' },
    lookalikes: [], imageUrl: 'https://images.unsplash.com/photo-1585155784229-aff921ccfa12?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1585155784229-aff921ccfa12?w=400',
  },
  'reishi': {
    id: '4', slug: 'reishi', commonName: 'Reishi', scientificName: 'Ganoderma lucidum',
    family: 'Ganodermataceae', order: 'Polyporales', type: 'medicinal', difficulty: 'advanced',
    substrate: ['Hardwood logs', 'Hardwood stumps'], colonizationWeeks: { min: 12, max: 16 },
    fruitingTempF: { min: 70, max: 80 }, fruitingTempC: { min: 21, max: 27 }, expectedFlushes: 1,
    biologicalEfficiency: '8%', betaGlucanContent: 'Extremely High', indoorOutdoor: 'both',
    description: { en: 'Reishi — the "Mushroom of Immortality" — revered in Chinese medicine for 2,000 years. Not edible raw but consumed as tincture, one of the most studied medicinal fungi on Earth.', es: 'El Reishi — el "Hongo de la Inmortalidad" — venerado en la medicina china durante 2,000 años. No comestible crudo, se consume como tintura.' },
    cultivationNotes: { en: 'Most demanding cultivated species. Long colonization at 75–80°F, high CO2 during colonization, fresh air during fruiting. Antler form under high CO2; cap form with FAE.', es: 'La especie cultivada más exigente. Larga colonización a 24-27°C, alto CO2 durante colonización, aire fresco durante fructificación.' },
    medicalNotes: { en: '400+ bioactive compounds: ganoderic acids (triterpenoids), polysaccharides, immunomodulating proteins. Evidence: immune enhancement, anti-tumor, adaptogen, blood pressure reduction.', es: 'Más de 400 compuestos bioactivos: ácidos ganodéricos (triterpenoides), polisacáridos, proteínas inmunomoduladoras.' },
    cookingNotes: { en: 'Extremely bitter — not consumed as food. Best as dual-extract tincture (hot water + alcohol) for full-spectrum benefits. Also as powder in coffee or smoothies.', es: 'Extremadamente amargo — no se consume como alimento. Mejor como tintura de doble extracción o en polvo para café o batidos.' },
    lookalikes: ['Ganoderma applanatum', 'Ganoderma tsugae'],
    imageUrl: 'https://images.unsplash.com/photo-1504470695779-75300268aa0e?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504470695779-75300268aa0e?w=400',
  },
  'wine-cap': {
    id: '5', slug: 'wine-cap', commonName: 'Wine Cap', scientificName: 'Stropharia rugosoannulata',
    family: 'Strophariaceae', order: 'Agaricales', type: 'edible', difficulty: 'beginner',
    substrate: ['Wood chips', 'Straw', 'Garden beds'], colonizationWeeks: { min: 4, max: 6 },
    fruitingTempF: { min: 50, max: 70 }, fruitingTempC: { min: 10, max: 21 }, expectedFlushes: 99,
    biologicalEfficiency: 'Perennial', betaGlucanContent: 'Moderate', indoorOutdoor: 'outdoor',
    description: { en: 'The Wine Cap — the Garden Giant — is effortless outdoor cultivation. Sprinkle spawn on wood chips and harvest for years. Integrates into permaculture food forests and builds soil.', es: 'El Vino Cap — el Gigante de Jardín — es el cultivo exterior sin esfuerzo. Esparce spawn en astillas de madera y cosecha durante años.' },
    cultivationNotes: { en: 'No sterilization needed. Broadcast spawn over 4–6 inch wood chip layer in shaded area. Keep moist. Fruits prolifically in spring and fall below 70°F. One inoculation = 5+ years of harvests.', es: 'No se necesita esterilización. Esparce spawn sobre capa de 10-15 cm de astillas en área sombreada. Mantén húmedo.' },
    medicalNotes: { en: 'Rich in ergothioneine and B vitamins. Excellent soil bioremediation agent — mycelium breaks down wood and concentrates nutrients.', es: 'Rico en ergotionina y vitaminas B. Excelente agente de biorremediación del suelo — el micelio descompone la madera y concentra nutrientes.' },
    cookingNotes: { en: 'Mild, slightly earthy and nutty. Button stage is most prized. Sauté, grill whole, use in omelets or pizza. Handle gently — bruises easily.', es: 'Suave, ligeramente terroso y con sabor a nuez. La etapa de botón es la más apreciada. Saltear, asar a la parrilla, usar en tortillas o pizza.' },
    lookalikes: ['Cortinarius (deadly Webcaps)', 'Amanita rubescens'],
    imageUrl: 'https://images.unsplash.com/photo-1541904031027-00d5c22f7cf2?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541904031027-00d5c22f7cf2?w=400',
  },
}

const TABS = ['overview', 'cultivation', 'nutrition', 'identification', 'kitchen', 'shop'] as const
type Tab = (typeof TABS)[number]

export default function SpeciesDetailPage({ params }: { params: { slug: string } }) {
  const locale = useLocale() as 'en' | 'es'
  const t = useTranslations('encyclopedia.species')
  const tc = useTranslations('common')

  const species = SPECIES_DB[params.slug]
  if (!species) notFound()

  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const timelineSteps = [
    { key: 'inoculation' as const, duration: 'Day 1', description: `Inoculate your sterilized ${species.substrate[0]} with grain spawn in a sterile environment.`, icon: '💉' },
    { key: 'colonization' as const, duration: `${species.colonizationWeeks.min}–${species.colonizationWeeks.max} weeks`, description: `Maintain ${species.fruitingTempF.min + 5}–${species.fruitingTempF.max + 5}°F and wait for full white colonization.`, icon: '🌐' },
    { key: 'fruiting' as const, duration: '1–2 weeks', description: `Introduce fresh air exchange, drop temp to ${species.fruitingTempF.min}–${species.fruitingTempF.max}°F, and maintain 85–95% humidity.`, icon: '🍄' },
    { key: 'harvest' as const, duration: 'Ongoing', description: `Harvest just before the veil breaks. Expect ${species.expectedFlushes === 99 ? 'perennial' : `${species.expectedFlushes}`} flush${species.expectedFlushes === 1 ? '' : 'es'}.`, icon: '✅' },
  ]

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero */}
      <div className="relative h-80 sm:h-96 overflow-hidden">
        <img src={species.imageUrl} alt={species.commonName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-12">
          <div className="max-w-7xl mx-auto">
            <Link href="/encyclopedia" className="text-sm text-cream-muted hover:text-cream transition-colors mb-4 inline-flex items-center gap-1">
              ← Encyclopedia
            </Link>
            <h1 className="font-heading text-4xl sm:text-6xl font-bold text-cream">{species.commonName}</h1>
            <p className="font-mono-lab text-base text-cream-muted italic mt-1">{species.scientificName}</p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="bg-surface border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-cream-muted uppercase tracking-wide">{t('quickStats.difficulty')}</span>
              <Badge variant={species.difficulty === 'beginner' ? 'success' : species.difficulty === 'intermediate' ? 'warning' : 'error'}>
                {tc(species.difficulty)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-cream-muted uppercase tracking-wide">{t('quickStats.edibility')}</span>
              <Badge variant={species.type === 'medicinal' ? 'accent' : species.type === 'edible' ? 'moss' : 'error'}>
                {tc(species.type)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-cream-muted uppercase tracking-wide">{t('quickStats.classification')}</span>
              <span className="text-sm font-mono-lab text-cream-muted">{species.family}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-cream-muted uppercase tracking-wide">Fruiting Temp</span>
              <span className="text-sm text-cream">{species.fruitingTempF.min}–{species.fruitingTempF.max}°F / {species.fruitingTempC.min}–{species.fruitingTempC.max}°C</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="flex gap-1 overflow-x-auto border-b border-ds-border mb-8 pb-0">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-accent text-accent'
                      : 'border-transparent text-cream-muted hover:text-cream'
                  }`}
                >
                  {t(`tabs.${tab}`)}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="prose-custom">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <p className="text-cream-muted leading-relaxed text-lg">{species.description[locale]}</p>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-cream mb-2">{t('naturalHabitat')}</h3>
                    <p className="text-cream-muted leading-relaxed">
                      Found in {species.substrate.join(', ').toLowerCase()}.
                      Grows {species.indoorOutdoor === 'both' ? 'both indoors and outdoors' : species.indoorOutdoor}.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'cultivation' && (
                <SpeciesTimeline steps={timelineSteps} />
              )}

              {activeTab === 'nutrition' && (
                <div className="space-y-6">
                  <p className="text-cream-muted leading-relaxed text-lg">{species.medicalNotes[locale]}</p>
                  <div className="bg-elevated rounded-2xl border border-ds-border p-6">
                    <h3 className="font-heading text-xl font-semibold text-cream mb-4">Key Compounds</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-surface rounded-xl p-4">
                        <p className="text-xs text-cream-muted uppercase tracking-wide mb-1">Beta-glucans</p>
                        <p className="text-cream font-medium">{species.betaGlucanContent}</p>
                      </div>
                      <div className="bg-surface rounded-xl p-4">
                        <p className="text-xs text-cream-muted uppercase tracking-wide mb-1">Biological Efficiency</p>
                        <p className="text-cream font-medium">{species.biologicalEfficiency}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'identification' && (
                <div className="space-y-6">
                  <div className="bg-elevated rounded-2xl border border-ds-border p-6">
                    <p className="text-sm text-warning mb-2 font-medium">{t('lookalikeWarning')}</p>
                  </div>
                  {species.lookalikes.length > 0 ? (
                    <div>
                      <h3 className="font-heading text-xl font-semibold text-cream mb-3">{t('lookalikes')}</h3>
                      <ul className="space-y-2">
                        {species.lookalikes.map((l) => (
                          <li key={l} className="flex items-start gap-2">
                            <span className="text-error mt-1">⚠️</span>
                            <span className="font-mono-lab text-sm text-cream-muted italic">{l}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-cream-muted">No toxic lookalikes documented for cultivated specimens.</p>
                  )}
                </div>
              )}

              {activeTab === 'kitchen' && (
                <div className="space-y-4">
                  <p className="text-cream-muted leading-relaxed text-lg">{species.cookingNotes[locale]}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    {['Sauté', 'Roast', 'Dried'].map((method) => (
                      <div key={method} className="bg-elevated rounded-xl border border-ds-border p-4 text-center">
                        <p className="text-lg mb-1">🍳</p>
                        <p className="text-sm font-medium text-cream">{method}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'shop' && (
                <div className="text-center py-10">
                  <Link href={`/shop?species=${species.slug}`}>
                    <Button size="lg">Shop {species.commonName} Products →</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0 space-y-6">
            {/* Taxonomy */}
            <div className="bg-elevated rounded-2xl border border-ds-border p-6">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4">{t('taxonomy')}</h3>
              <dl className="space-y-2">
                {[
                  ['Order', species.order],
                  ['Family', species.family],
                  ['Species', species.scientificName],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between gap-2">
                    <dt className="text-xs text-cream-muted uppercase tracking-wide">{label}</dt>
                    <dd className="text-sm text-cream font-mono-lab italic text-right">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Add to journal */}
            <Link href="/tools/grow-journal">
              <Button fullWidth variant="outline">{t('addToJournal')}</Button>
            </Link>

            {/* Shop CTA */}
            <Link href={`/shop?species=${species.slug}`}>
              <Button fullWidth>Shop {species.commonName} →</Button>
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
