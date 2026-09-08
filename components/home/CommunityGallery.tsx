'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const GALLERY_ITEMS = [
  { id: 1,  src: 'https://drzwclnecktguodpokir.supabase.co/storage/v1/object/public/product-images/1788523252817-blue-oyster.png', alt: 'Blue Oyster first flush',  species: 'Blue Oyster',  user: '@mushroom_mike',    tall: true  },
  { id: 2,  src: 'https://drzwclnecktguodpokir.supabase.co/storage/v1/object/public/product-images/1788523252817-blue-oyster.png', alt: 'Blue Oyster cluster close-up', species: 'Blue Oyster',  user: '@growwild_jen',    tall: false },
  { id: 3,  src: 'https://images.unsplash.com/photo-1773600149997-2b6af77031d7?w=600&h=440&q=85&auto=format&fit=crop', alt: 'Pink Oyster cluster flush',     species: 'Pink Oyster',  user: '@spore.garden',    tall: false },
  { id: 4,  src: 'https://images.unsplash.com/photo-1748118869505-e75f25812a70?w=600&h=760&q=85&auto=format&fit=crop', alt: 'Golden Oyster golden cluster',  species: 'Golden Oyster', user: '@spore.ann',    tall: true  },
  { id: 5,  src: 'https://images.unsplash.com/photo-1773600149997-2b6af77031d7?w=600&h=440&q=85&auto=format&fit=crop', alt: 'Pink Oyster first flush',       species: 'Pink Oyster',  user: '@fungi_forager',   tall: false },
  { id: 6,  src: 'https://images.unsplash.com/photo-1748118869505-e75f25812a70?w=600&h=440&q=85&auto=format&fit=crop', alt: 'Golden Oyster golden fan',      species: 'Golden Oyster', user: '@myco_lab_co',    tall: false },
  { id: 7,  src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=800&q=85&auto=format&fit=crop', alt: 'Enchanted forest light rays',   species: 'Wild Find',    user: '@forestwalker',   tall: true  },
  { id: 8,  src: 'https://drzwclnecktguodpokir.supabase.co/storage/v1/object/public/product-images/1788523252817-blue-oyster.png', alt: 'Oyster pinning stage', species: 'Blue Oyster', user: '@ohio_grows',  tall: false },
  { id: 9,  src: 'https://drzwclnecktguodpokir.supabase.co/storage/v1/object/public/product-images/1788523252817-blue-oyster.png', alt: 'Blue Oyster fan detail',        species: 'Blue Oyster',  user: '@macro_myco',    tall: false },
  { id: 10, src: 'https://images.unsplash.com/photo-1773600149997-2b6af77031d7?w=600&h=680&q=85&auto=format&fit=crop', alt: 'Pink Oyster dense cluster',    species: 'Pink Oyster',  user: '@log_grower',     tall: true  },
  { id: 11, src: 'https://images.unsplash.com/photo-1748118869505-e75f25812a70?w=600&h=440&q=85&auto=format&fit=crop', alt: 'Golden Oyster fan form',       species: 'Golden Oyster', user: '@spore_prints',  tall: false },
  { id: 12, src: 'https://drzwclnecktguodpokir.supabase.co/storage/v1/object/public/product-images/1788523252817-blue-oyster.png', alt: 'Blue Oyster full flush',        species: 'Blue Oyster',  user: '@spore.co',       tall: false },
]

export function CommunityGallery() {
  const t = useTranslations('home.community')
  const gridRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(gridRef, { once: true, margin: '-10% 0px' })

  return (
    <section className="py-28 bg-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="flex items-end justify-between mb-16">
          <div>
            <div className="section-divider mb-4" />
            <h2 className="font-heading font-medium text-3xl sm:text-4xl text-cream tracking-tight">
              {t('title')}
            </h2>
            <p className="text-cream-muted mt-3 text-lg max-w-md">{t('subtitle')}</p>
          </div>
          <Link
            href="/community/gallery"
            className="hidden sm:flex items-center gap-2 text-sm font-mono text-accent hover:text-cream transition-colors"
          >
            {t('cta')} →
          </Link>
        </ScrollReveal>

        {/* Masonry grid */}
        <div ref={gridRef} className="columns-2 sm:columns-3 gap-4 space-y-4">
          {GALLERY_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="break-inside-avoid relative group overflow-hidden rounded-none border border-ds-border cursor-pointer"
            >
              <img
                src={item.src}
                alt={item.alt}
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${item.tall ? 'h-72' : 'h-48'}`}
              />
              {/* Dark gradient always */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-bg/75 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col items-center justify-center gap-1.5 p-4 text-center">
                <span className="text-xs font-mono text-accent uppercase tracking-widest">{item.species}</span>
                <span className="text-sm font-body font-medium text-cream">{item.alt}</span>
                <span className="text-xs text-cream-muted font-mono">{item.user}</span>
              </div>

              {/* Bottom glow line on hover */}
              <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link href="/community/gallery" className="text-sm font-mono text-accent">
            {t('cta')} →
          </Link>
        </div>
      </div>
    </section>
  )
}
