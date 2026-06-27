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
        <div className="relative h-52 overflow-hidden flex-shrink-0 bg-elevated">
          {species.thumbnailUrl ? (
            <img
              src={species.thumbnailUrl}
              alt={species.commonName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-elevated">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-cream-muted/30">
                <path d="M32 8C18 8 8 18 8 28c0 4 4 6 8 6h5l-2 18h26l-2-18h5c4 0 8-2 8-6C56 18 46 8 32 8z" />
              </svg>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber/70">AI Image Pending</span>
            </div>
          )}
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
