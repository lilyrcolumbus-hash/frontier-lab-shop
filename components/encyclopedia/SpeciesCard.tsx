import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { Species } from '@/types/species'

interface SpeciesCardProps {
  species: Species
}

export function SpeciesCard({ species }: SpeciesCardProps) {
  const locale = useLocale() as 'en' | 'es'
  const tc = useTranslations('common')

  return (
    <Link href={`/encyclopedia/${species.slug}`}>
      <Card hover className="overflow-hidden group h-full flex flex-col">
        {/* Image */}
        <div className="relative h-52 overflow-hidden flex-shrink-0">
          <img
            src={species.thumbnailUrl}
            alt={species.commonName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-elevated/80 via-transparent to-transparent" />
          {/* Type badge overlay */}
          <div className="absolute top-3 right-3">
            <Badge
              variant={species.type === 'medicinal' ? 'accent' : species.type === 'toxic' ? 'error' : 'moss'}
              size="sm"
            >
              {tc(species.type)}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-2 flex-1">
          <div>
            <h3 className="font-heading text-xl font-semibold text-cream">{species.commonName}</h3>
            <p className="font-mono-lab text-xs text-cream-muted italic mt-0.5">{species.scientificName}</p>
          </div>

          <p className="text-sm text-cream-muted leading-relaxed line-clamp-2 flex-1">
            {species.description[locale]}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <Badge
              variant={
                species.difficulty === 'beginner' ? 'success' :
                species.difficulty === 'intermediate' ? 'warning' : 'error'
              }
              size="sm"
            >
              {tc(species.difficulty)}
            </Badge>
            <Badge variant="outline" size="sm">
              {tc(species.indoorOutdoor === 'indoor' ? 'indoor' : species.indoorOutdoor === 'outdoor' ? 'outdoor' : 'both')}
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  )
}
