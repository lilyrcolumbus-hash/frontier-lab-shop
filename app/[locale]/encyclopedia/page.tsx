'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { SpeciesCard } from '@/components/encyclopedia/SpeciesCard'
import { SpeciesFilter } from '@/components/encyclopedia/SpeciesFilter'
import type { Species } from '@/types/species'

// Static seed data — will come from DB in production
const SPECIES_DATA: Species[] = [
  {
    id: '1', slug: 'blue-oyster', commonName: 'Blue Oyster', scientificName: 'Pleurotus ostreatus',
    family: 'Pleurotaceae', order: 'Agaricales', type: 'edible', difficulty: 'beginner',
    substrate: ['hardwood sawdust', 'straw', 'coffee grounds'],
    colonizationWeeks: { min: 2, max: 3 }, fruitingTempF: { min: 55, max: 65 }, fruitingTempC: { min: 13, max: 18 },
    expectedFlushes: 3, biologicalEfficiency: '25%', betaGlucanContent: 'High', indoorOutdoor: 'both',
    description: { en: 'The most beginner-friendly mushroom. Fast colonizer, produces stunning fan-shaped clusters.', es: 'El hongo más amigable para principiantes. Colonizador rápido, produce impresionantes racimos en abanico.' },
    cultivationNotes: { en: 'Thrives on hardwood sawdust and straw. Easy to fruit in any humidity tent.', es: 'Prospera en serrín de madera dura y paja. Fácil de fructificar en cualquier tienda de humedad.' },
    medicalNotes: { en: 'High in beta-glucans, lovastatin, and ergothioneine.', es: 'Alto en beta-glucanos, lovastatina y ergotionina.' },
    cookingNotes: { en: 'Mild, slightly sweet. Excellent sautéed or roasted.', es: 'Suave, ligeramente dulce. Excelente salteado o asado.' },
    lookalikes: [], imageUrl: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=400',
  },
  {
    id: '2', slug: 'lions-mane', commonName: "Lion's Mane", scientificName: 'Hericium erinaceus',
    family: 'Hericiaceae', order: 'Russulales', type: 'medicinal', difficulty: 'intermediate',
    substrate: ['hardwood sawdust'],
    colonizationWeeks: { min: 3, max: 4 }, fruitingTempF: { min: 65, max: 75 }, fruitingTempC: { min: 18, max: 24 },
    expectedFlushes: 2, biologicalEfficiency: '17%', betaGlucanContent: 'Very High', indoorOutdoor: 'indoor',
    description: { en: 'Cascading white spines with powerful neuroprotective compounds. The brain mushroom.', es: 'Espinas blancas en cascada con poderosos compuestos neuroprotectores. El hongo del cerebro.' },
    cultivationNotes: { en: 'Requires high humidity and fresh air exchange. Sensitive to CO2 buildup.', es: 'Requiere alta humedad e intercambio de aire fresco. Sensible a la acumulación de CO2.' },
    medicalNotes: { en: 'Contains hericenones and erinacines that stimulate NGF synthesis.', es: 'Contiene hericenones y erinacinas que estimulan la síntesis de NGF.' },
    cookingNotes: { en: 'Seafood-like texture. Best seared in butter over high heat.', es: 'Textura similar a los mariscos. Mejor sellado en mantequilla a fuego alto.' },
    lookalikes: ['Hericium coralloides'], imageUrl: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400',
  },
  {
    id: '3', slug: 'shiitake', commonName: 'Shiitake', scientificName: 'Lentinula edodes',
    family: 'Marasmiaceae', order: 'Agaricales', type: 'edible', difficulty: 'intermediate',
    substrate: ['hardwood sawdust', 'oak logs'],
    colonizationWeeks: { min: 8, max: 52 }, fruitingTempF: { min: 55, max: 75 }, fruitingTempC: { min: 13, max: 24 },
    expectedFlushes: 10, biologicalEfficiency: '60%', betaGlucanContent: 'High', indoorOutdoor: 'both',
    description: { en: "World's second most cultivated mushroom. Rich umami flavor, loved in Asian cuisine for 1,000+ years.", es: 'El segundo hongo más cultivado del mundo. Rico sabor umami, amado en la cocina asiática por más de 1,000 años.' },
    cultivationNotes: { en: 'On logs: 6–12 months colonization. On sawdust: 8–12 weeks. Requires cold shocking to fruit.', es: 'En troncos: 6-12 meses de colonización. En serrín: 8-12 semanas. Requiere choque de frío para fructificar.' },
    medicalNotes: { en: 'Contains lentinan (immune-boosting beta-glucan) and eritadenine (cholesterol reducing).', es: 'Contiene lentinan (beta-glucano potenciador del sistema inmune) y eritadenina (reductor del colesterol).' },
    cookingNotes: { en: 'Remove tough stems. Excellent in ramen, stir-fries, duxelles, and pasta.', es: 'Retira los tallos duros. Excelente en ramen, salteados, duxelles y pasta.' },
    lookalikes: [], imageUrl: 'https://images.unsplash.com/photo-1585155784229-aff921ccfa12?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1585155784229-aff921ccfa12?w=400',
  },
  {
    id: '4', slug: 'reishi', commonName: 'Reishi', scientificName: 'Ganoderma lucidum',
    family: 'Ganodermataceae', order: 'Polyporales', type: 'medicinal', difficulty: 'advanced',
    substrate: ['hardwood logs', 'hardwood stumps'],
    colonizationWeeks: { min: 12, max: 16 }, fruitingTempF: { min: 70, max: 80 }, fruitingTempC: { min: 21, max: 27 },
    expectedFlushes: 1, biologicalEfficiency: '8%', betaGlucanContent: 'Extremely High', indoorOutdoor: 'both',
    description: { en: "The 'Mushroom of Immortality.' 2,000 years of use in Chinese medicine. Consumed as tincture.", es: 'El "Hongo de la Inmortalidad". 2,000 años de uso en la medicina china. Se consume como tintura.' },
    cultivationNotes: { en: 'Long colonization (12–16 weeks), warm temperatures, high CO2 during colonization.', es: 'Larga colonización (12-16 semanas), temperaturas cálidas, alto CO2 durante la colonización.' },
    medicalNotes: { en: '400+ bioactive compounds: ganoderic acids, polysaccharides, immunomodulators.', es: 'Más de 400 compuestos bioactivos: ácidos ganodéricos, polisacáridos, inmunomoduladores.' },
    cookingNotes: { en: 'Not edible raw (extremely bitter). Use as dual-extract tincture or powder.', es: 'No comestible crudo (extremadamente amargo). Usar como tintura de doble extracción o polvo.' },
    lookalikes: ['Ganoderma applanatum'], imageUrl: 'https://images.unsplash.com/photo-1504470695779-75300268aa0e?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504470695779-75300268aa0e?w=400',
  },
  {
    id: '5', slug: 'wine-cap', commonName: 'Wine Cap', scientificName: 'Stropharia rugosoannulata',
    family: 'Strophariaceae', order: 'Agaricales', type: 'edible', difficulty: 'beginner',
    substrate: ['wood chips', 'straw', 'garden beds'],
    colonizationWeeks: { min: 4, max: 6 }, fruitingTempF: { min: 50, max: 70 }, fruitingTempC: { min: 10, max: 21 },
    expectedFlushes: 99, biologicalEfficiency: 'Perennial', betaGlucanContent: 'Moderate', indoorOutdoor: 'outdoor',
    description: { en: 'The garden giant. Scatter spawn on wood chips and harvest for years. Perennial soil builder.', es: 'El gigante del jardín. Esparce spawn en astillas de madera y cosecha durante años. Constructor de suelo perenne.' },
    cultivationNotes: { en: 'No sterilization needed. Broadcast on wood chips in shaded area. Fruits spring and fall.', es: 'No necesita esterilización. Esparce en astillas de madera en área sombreada. Fructifica en primavera y otoño.' },
    medicalNotes: { en: 'Rich in ergothioneine and B vitamins. Excellent soil bioremediation.', es: 'Rico en ergotionina y vitaminas B. Excelente biorremediación del suelo.' },
    cookingNotes: { en: 'Mild, nutty. Button stage is best. Sauté, grill, or use on pizza.', es: 'Suave, con sabor a nuez. La etapa de botón es la mejor. Saltear, asar a la parrilla o usar en pizza.' },
    lookalikes: ['Cortinarius (Webcaps — deadly)'], imageUrl: 'https://images.unsplash.com/photo-1541904031027-00d5c22f7cf2?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541904031027-00d5c22f7cf2?w=400',
  },
]

export default function EncyclopediaPage() {
  const t = useTranslations('encyclopedia')

  const [filters, setFilters] = useState({ type: 'all', difficulty: 'all', search: '' })

  const filtered = useMemo(() => {
    return SPECIES_DATA.filter((s) => {
      if (filters.type !== 'all' && s.type !== filters.type) return false
      if (filters.difficulty !== 'all' && s.difficulty !== filters.difficulty) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        return (
          s.commonName.toLowerCase().includes(q) ||
          s.scientificName.toLowerCase().includes(q) ||
          s.substrate.some((sub) => sub.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [filters])

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <div className="bg-surface border-b border-ds-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-body font-light uppercase tracking-[0.2em] text-moss text-sm mb-3">
            DirtyShrooms Encyclopedia
          </p>
          <h1 className="font-heading text-5xl sm:text-6xl font-bold text-cream mb-4">
            {t('title')}
          </h1>
          <p className="text-cream-muted text-lg max-w-xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filter */}
          <aside className="lg:w-64 flex-shrink-0">
            <SpeciesFilter filters={filters} onChange={setFilters} />
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-cream-muted text-sm">
                Showing <span className="text-cream font-medium">{filtered.length}</span> species
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <span className="text-5xl block mb-4">🔍</span>
                <p className="text-cream-muted">No species match your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((species) => (
                  <SpeciesCard key={species.id} species={species} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
