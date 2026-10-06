'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'
import { SCENE_LAYOUT } from '@/lib/lab-tour'
import type { Product } from '@/types/product'

interface GardenProduct {
  id: string
  slug: string
  name: string
  nameEs: string
  description: string
  descriptionEs: string
  price: number
  compareAtPrice?: number
  image: string
  badge?: string
  badgeEs?: string
  variantId: string
}

interface Hotspot {
  id: string
  x: number
  y: number
  label: string
  product: GardenProduct
}

interface Scene {
  id: string
  name: string
  nameEs: string
  subtitle: string
  subtitleEs: string
  bg: string
  hotspots: Hotspot[]
}

function HotspotPin({ label, isActive }: { label: string; isActive: boolean }) {
  return (
    <div className="relative flex items-center justify-center w-10 h-10">
      <span className="absolute inset-0 rounded-full bg-amber/40 animate-ping" />
      <span
        className="absolute inset-0 rounded-full bg-amber/20 animate-ping"
        style={{ animationDelay: '0.7s' }}
      />
      <div
        className={cn(
          'relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold font-mono transition-all duration-200',
          isActive
            ? 'bg-amber border-amber text-bg scale-125 shadow-[0_0_20px_rgba(212,145,58,0.9)]'
            : 'bg-bg/80 backdrop-blur-sm border-amber text-amber hover:bg-amber hover:text-bg shadow-[0_0_10px_rgba(212,145,58,0.5)]'
        )}
      >
        {label}
      </div>
    </div>
  )
}

export function LabTour({ products }: { products: Product[] }) {
  const locale = useLocale() as 'en' | 'es'
  const es = locale === 'es'
  const t = useTranslations('lab.tour')
  const { addItem, openCart } = useCartStore()

  // The pins point at real catalog products. A product that is archived or missing simply gets no
  // pin, so a link on this page can never lead to a 404. The text fields exist in both languages
  // because the panel below reads them that way; both hold the visitor's current language.
  const scenes: Scene[] = useMemo(() => {
    const bySlug = new Map(products.map((product) => [product.slug, product]))
    return SCENE_LAYOUT.map((layout) => {
      const name = t(`scenes.${layout.id}.name`)
      const subtitle = t(`scenes.${layout.id}.subtitle`)
      const hotspots: Hotspot[] = []
      layout.hotspots.forEach((spot) => {
        const product = bySlug.get(spot.slug)
        const variant = product?.variants[0]
        if (!product || !variant) return
        const badge = product.isOrganic ? t('organic') : undefined
        hotspots.push({
          id: spot.id,
          x: spot.x,
          y: spot.y,
          label: String(hotspots.length + 1),
          product: {
            id: product.id,
            slug: product.slug,
            name: product.name[locale],
            nameEs: product.name[locale],
            description: product.description[locale],
            descriptionEs: product.description[locale],
            price: variant.price,
            compareAtPrice: product.compareAtPrice && product.compareAtPrice > variant.price ? product.compareAtPrice : undefined,
            image: product.images[0] ?? '',
            badge,
            badgeEs: badge,
            variantId: variant.id,
          },
        })
      })
      return { id: layout.id, name, nameEs: name, subtitle, subtitleEs: subtitle, bg: t(`scenes.${layout.id}.image`), hotspots }
    }).filter((scene) => scene.hotspots.length > 0)
  }, [products, locale, t])

  const [sceneIdx, setSceneIdx] = useState(0)
  const [direction, setDirection] = useState(1)
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null)

  const scene = scenes[sceneIdx] ?? scenes[0]

  const goTo = useCallback((idx: number, dir?: number) => {
    setDirection(dir ?? (idx > sceneIdx ? 1 : -1))
    setActiveHotspot(null)
    setSceneIdx(idx)
  }, [sceneIdx])

  const goNext = useCallback(() => goTo((sceneIdx + 1) % scenes.length, 1), [goTo, sceneIdx])
  const goPrev = useCallback(() => goTo((sceneIdx - 1 + scenes.length) % scenes.length, -1), [goTo, sceneIdx])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveHotspot(null)
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  const sceneVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: -dir * 80 }),
  }

  const trust = [t('trust1'), t('trust2'), t('trust3')]

  return (
    <div
      className="relative w-full overflow-hidden bg-bg"
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      {/* Scenes */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={sceneIdx}
          custom={direction}
          variants={sceneVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <img
            src={scene.bg}
            alt={es ? scene.nameEs : scene.name}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-bg/55 via-transparent to-bg/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg/30 via-transparent to-transparent" />

          {/* Mobile overlay when panel is open */}
          {activeHotspot && (
            <div
              className="sm:hidden absolute inset-0 bg-bg/60 z-10"
              onClick={() => setActiveHotspot(null)}
            />
          )}

          {/* Hotspots */}
          {scene.hotspots.map((hs) => (
            <button
              key={hs.id}
              style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-20"
              onClick={() => setActiveHotspot(activeHotspot?.id === hs.id ? null : hs)}
              aria-label={`${es ? 'Ver' : 'View'} ${es ? hs.product.nameEs : hs.product.name}`}
            >
              <HotspotPin label={hs.label} isActive={activeHotspot?.id === hs.id} />
              {/* Desktop tooltip */}
              <div className="hidden sm:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                <div className="bg-bg/95 backdrop-blur-md border border-amber/25 rounded-none px-3 py-2 text-xs text-cream font-medium shadow-xl">
                  {es ? hs.product.nameEs : hs.product.name}
                </div>
                <div className="w-2 h-2 bg-bg/95 border-b border-r border-amber/25 rotate-45 mx-auto -mt-1" />
              </div>
            </button>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Scene label — top left */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
        <p className="text-amber/60 text-[10px] uppercase tracking-[0.25em] font-mono mb-1.5">
          {es ? 'Escena' : 'Scene'} {sceneIdx + 1} / {scenes.length}
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={sceneIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-cream drop-shadow-lg">
              {es ? scene.nameEs : scene.name}
            </h2>
            <p className="text-cream/60 text-sm mt-1.5 drop-shadow font-body">
              {es ? scene.subtitleEs : scene.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hotspot hint (first scene only) */}
      {sceneIdx === 0 && !activeHotspot && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute top-6 right-6 z-20 pointer-events-none hidden sm:flex items-center gap-2"
        >
          <div className="w-5 h-5 rounded-full border border-amber/50 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-amber/70" />
          </div>
          <span className="text-cream/50 text-xs font-body">
            {es ? 'Toca los puntos para ver productos' : 'Click pins to discover products'}
          </span>
        </motion.div>
      )}

      {/* Navigation — bottom center */}
      <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-4">
        <button
          onClick={goPrev}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-bg/70 backdrop-blur-sm border border-amber/20 text-amber hover:bg-amber/15 hover:border-amber/40 transition-all"
          aria-label={es ? 'Escena anterior' : 'Previous scene'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {scenes.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className={cn(
                'rounded-full transition-all duration-300',
                i === sceneIdx
                  ? 'w-7 h-2.5 bg-amber shadow-[0_0_8px_rgba(212,145,58,0.7)]'
                  : 'w-2.5 h-2.5 bg-cream/25 hover:bg-cream/50'
              )}
              aria-label={`${es ? 'Ir a escena' : 'Go to scene'} ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-bg/70 backdrop-blur-sm border border-amber/20 text-amber hover:bg-amber/15 hover:border-amber/40 transition-all"
          aria-label={es ? 'Siguiente escena' : 'Next scene'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Scene name strip at bottom — desktop */}
      <div className="hidden lg:flex absolute bottom-20 inset-x-0 z-20 items-center justify-center gap-1 pointer-events-none">
        {scenes.map((s, i) => (
          <span
            key={s.id}
            className={cn(
              'text-[10px] uppercase tracking-widest font-mono transition-all duration-300 px-2',
              i === sceneIdx ? 'text-amber' : 'text-cream/25'
            )}
          >
            {es ? s.nameEs : s.name}
          </span>
        ))}
      </div>

      {/* Product panel */}
      <AnimatePresence>
        {activeHotspot && (
          <motion.aside
            key={activeHotspot.id}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="absolute right-0 top-0 bottom-0 w-full sm:w-80 z-30 flex flex-col"
          >
            <div className="absolute inset-0 bg-bg/96 backdrop-blur-2xl border-l border-amber/12" />

            <div className="relative z-10 flex flex-col h-full">
              {/* Panel header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse-soft" />
                  <span className="text-[10px] text-amber/60 uppercase tracking-[0.2em] font-mono">
                    {es ? 'Producto Destacado' : 'Featured Product'}
                  </span>
                </div>
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-surface border border-ds-border text-cream-muted hover:text-amber hover:border-amber/30 transition-colors"
                  aria-label={es ? 'Cerrar' : 'Close'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Product image */}
              <div className="relative mx-4 h-48 rounded-none overflow-hidden flex-shrink-0">
                <img
                  src={activeHotspot.product.image}
                  alt={es ? activeHotspot.product.nameEs : activeHotspot.product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/40 via-transparent to-transparent" />
                {activeHotspot.product.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-none text-xs font-semibold bg-amber text-bg shadow-lg">
                    {es ? activeHotspot.product.badgeEs : activeHotspot.product.badge}
                  </span>
                )}
              </div>

              {/* Product info */}
              <div className="flex-1 px-5 py-4 flex flex-col gap-3 overflow-y-auto">
                <div>
                  <h3 className="font-heading text-lg font-bold text-cream leading-snug">
                    {es ? activeHotspot.product.nameEs : activeHotspot.product.name}
                  </h3>
                  <p className="text-cream/55 text-sm mt-2 leading-relaxed font-body">
                    {es ? activeHotspot.product.descriptionEs : activeHotspot.product.description}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2.5 pt-1">
                  <span className="font-heading text-2xl font-bold text-cream">
                    {formatPrice(activeHotspot.product.price)}
                  </span>
                  {activeHotspot.product.compareAtPrice && (
                    <span className="text-sm text-cream/35 line-through font-body">
                      {formatPrice(activeHotspot.product.compareAtPrice)}
                    </span>
                  )}
                  {activeHotspot.product.compareAtPrice && (
                    <span className="text-xs text-accent font-semibold ml-1">
                      -{Math.round((1 - activeHotspot.product.price / activeHotspot.product.compareAtPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {trust.map((label) => (
                    <span
                      key={label}
                      className="text-[11px] text-amber/65 border border-amber/18 rounded-none px-2.5 py-1 font-body"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="px-5 pb-6 pt-3 border-t border-ds-border flex flex-col gap-2.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const { product } = activeHotspot
                    addItem({
                      productId: product.id,
                      variantId: product.variantId,
                      name: product.name,
                      price: product.price,
                      quantity: 1,
                      image: product.image,
                    })
                    openCart()
                  }}
                  className="w-full py-3.5 rounded-none bg-amber text-bg font-semibold text-sm hover:bg-amber-bright transition-colors shadow-[0_4px_20px_rgba(212,145,58,0.35)] active:scale-[0.98]">
                  {es ? 'Agregar al Carrito' : 'Add to Cart'}
                </button>
                <Link
                  href={`/shop/${activeHotspot.product.slug}`}
                  className="w-full py-3 rounded-none border border-amber/25 text-amber text-sm font-medium text-center hover:bg-amber/8 hover:border-amber/40 transition-colors font-body"
                >
                  {es ? 'Ver Producto Completo →' : 'View Full Product →'}
                </Link>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
