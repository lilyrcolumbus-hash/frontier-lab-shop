import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { Species } from '@/types/species'
import { difficultyColors, typeColors } from '@/types/species'

const SEED_SPECIES: Pick<
  Species,
  'slug' | 'commonName' | 'scientificName' | 'difficulty' | 'type' | 'thumbnailUrl'
>[] = [
  { slug: 'blue-oyster', commonName: 'Blue Oyster', scientificName: 'Pleurotus ostreatus', difficulty: 'beginner', type: 'edible', thumbnailUrl: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=400' },
  { slug: 'lions-mane', commonName: "Lion's Mane", scientificName: 'Hericium erinaceus', difficulty: 'intermediate', type: 'medicinal', thumbnailUrl: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400' },
  { slug: 'shiitake', commonName: 'Shiitake', scientificName: 'Lentinula edodes', difficulty: 'intermediate', type: 'edible', thumbnailUrl: 'https://images.unsplash.com/photo-1585155784229-aff921ccfa12?w=400' },
  { slug: 'reishi', commonName: 'Reishi', scientificName: 'Ganoderma lucidum', difficulty: 'advanced', type: 'medicinal', thumbnailUrl: 'https://images.unsplash.com/photo-1504470695779-75300268aa0e?w=400' },
  { slug: 'wine-cap', commonName: 'Wine Cap', scientificName: 'Stropharia rugosoannulata', difficulty: 'beginner', type: 'edible', thumbnailUrl: 'https://images.unsplash.com/photo-1541904031027-00d5c22f7cf2?w=400' },
  { slug: 'blue-oyster', commonName: 'Chaga', scientificName: 'Inonotus obliquus', difficulty: 'advanced', type: 'medicinal', thumbnailUrl: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400' },
]

export function SpeciesSpotlight() {
  const t = useTranslations('home.spotlight')
  const tc = useTranslations('common')

  return (
    <section className="py-24 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <h2 className="font-heading text-4xl sm:text-5xl text-cream font-bold">
            {t('title')}
          </h2>
          <Link
            href="/encyclopedia"
            className="hidden sm:block text-sm font-medium text-accent hover:text-accent-hover transition-colors"
          >
            {t('viewEncyclopedia')}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEED_SPECIES.map((species) => (
            <Link key={`${species.slug}-${species.scientificName}`} href={`/encyclopedia/${species.slug}`}>
              <Card hover className="overflow-hidden group">
                {/* Image */}
                <div className="relative h-48 bg-surface overflow-hidden">
                  <img
                    src={species.thumbnailUrl}
                    alt={species.commonName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-elevated/80 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-cream">{species.commonName}</h3>
                      <p className="font-mono-lab text-xs text-cream-muted italic mt-0.5">{species.scientificName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge
                      variant={
                        species.difficulty === 'beginner' ? 'success' :
                        species.difficulty === 'intermediate' ? 'warning' : 'error'
                      }
                    >
                      {tc(species.difficulty)}
                    </Badge>
                    <Badge variant={species.type === 'medicinal' ? 'accent' : 'moss'}>
                      {tc(species.type)}
                    </Badge>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/encyclopedia"
            className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
          >
            {t('viewEncyclopedia')}
          </Link>
        </div>
      </div>
    </section>
  )
}
