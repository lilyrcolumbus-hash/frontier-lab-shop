import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

const GALLERY_ITEMS = [
  { id: 1, src: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=400', alt: 'Blue Oyster harvest', species: 'Blue Oyster', user: '@mushroom_mike', tall: true },
  { id: 2, src: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400', alt: "Lion's Mane grow", species: "Lion's Mane", user: '@growwild_jen', tall: false },
  { id: 3, src: 'https://images.unsplash.com/photo-1585155784229-aff921ccfa12?w=400', alt: 'Shiitake flush', species: 'Shiitake', user: '@fungi_forager', tall: false },
  { id: 4, src: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400', alt: 'Forest find', species: 'Wild', user: '@dirtyhands_ann', tall: true },
  { id: 5, src: 'https://images.unsplash.com/photo-1504470695779-75300268aa0e?w=400', alt: 'Reishi antler', species: 'Reishi', user: '@myco_lab_co', tall: false },
  { id: 6, src: 'https://images.unsplash.com/photo-1541904031027-00d5c22f7cf2?w=400', alt: 'Wine Cap patch', species: 'Wine Cap', user: '@garden_shrooms', tall: false },
]

export function CommunityGallery() {
  const t = useTranslations('home.community')

  return (
    <section className="py-24 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-body font-light uppercase tracking-[0.2em] text-moss text-sm mb-2">
              Community
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl text-cream font-bold">
              {t('title')}
            </h2>
            <p className="text-cream-muted mt-2">{t('subtitle')}</p>
          </div>
          <Link
            href="/community/gallery"
            className="hidden sm:block"
          >
            <Button variant="outline" size="sm">{t('cta')}</Button>
          </Link>
        </div>

        {/* Masonry grid */}
        <div className="columns-2 sm:columns-3 gap-4 space-y-4">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid relative group overflow-hidden rounded-2xl border border-ds-border"
            >
              <img
                src={item.src}
                alt={item.alt}
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${item.tall ? 'h-72' : 'h-48'}`}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-bg/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1 p-4 text-center">
                <span className="text-xs font-medium text-moss uppercase tracking-wider">{item.species}</span>
                <span className="text-sm font-body text-cream">{item.alt}</span>
                <span className="text-xs text-cream-muted">{item.user}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/community/gallery">
            <Button variant="outline">{t('cta')}</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
