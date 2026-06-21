import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

const PHOTOS = [
  { id: 1, src: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=600', alt: 'Blue Oyster flush', user: '@mushroom_mike', species: 'Blue Oyster', tall: true },
  { id: 2, src: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=600', alt: "Lion's Mane", user: '@growwild_jen', species: "Lion's Mane", tall: false },
  { id: 3, src: 'https://images.unsplash.com/photo-1585155784229-aff921ccfa12?w=600', alt: 'Shiitake harvest', user: '@fungi_forager', species: 'Shiitake', tall: false },
  { id: 4, src: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600', alt: 'Forest walk', user: '@dirtyhands_ann', species: 'Wild', tall: true },
  { id: 5, src: 'https://images.unsplash.com/photo-1504470695779-75300268aa0e?w=600', alt: 'Reishi antler form', user: '@myco_lab_co', species: 'Reishi', tall: false },
  { id: 6, src: 'https://images.unsplash.com/photo-1541904031027-00d5c22f7cf2?w=600', alt: 'Wine Cap garden patch', user: '@garden_shrooms', species: 'Wine Cap', tall: false },
]

export default function GalleryPage() {
  const t = useTranslations('community.gallery')

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-surface border-b border-ds-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-bold text-cream">{t('title')}</h1>
            <p className="text-cream-muted mt-1">{t('subtitle')}</p>
          </div>
          <Button>{t('share')}</Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          {PHOTOS.map((photo) => (
            <div key={photo.id} className="break-inside-avoid relative group overflow-hidden rounded-2xl border border-ds-border cursor-pointer">
              <img
                src={photo.src}
                alt={photo.alt}
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${photo.tall ? 'h-72' : 'h-48'}`}
              />
              <div className="absolute inset-0 bg-bg/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1 p-4 text-center">
                <span className="text-xs font-medium text-moss uppercase tracking-wider">{photo.species}</span>
                <span className="text-sm font-body text-cream">{photo.alt}</span>
                <span className="text-xs text-cream-muted">{photo.user}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
