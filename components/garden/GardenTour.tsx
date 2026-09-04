'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'

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

const SCENES: Scene[] = [
  {
    id: 'grow-room',
    name: 'Grow Room',
    nameEs: 'Sala de Cultivo',
    subtitle: 'Where the magic begins',
    subtitleEs: 'Donde comienza la magia',
    // Lion's Mane — the featured species of this scene (see hs-2 below).
    bg: 'https://images.unsplash.com/photo-1625286535466-68a6d71e4568?w=1920&h=1080&q=90&auto=format&fit=crop',
    hotspots: [
      {
        id: 'hs-1',
        x: 28, y: 48,
        label: '1',
        product: {
          id: '3', slug: 'beginners-grow-kit-bundle',
          name: "Beginner's Complete Grow Kit",
          nameEs: 'Kit de Cultivo Completo para Principiantes',
          description: 'Everything to grow your first mushrooms: spawn, substrate, dome, mister, and step-by-step guide.',
          descriptionEs: 'Todo lo que necesitas para tu primer cultivo: spawn, sustrato, cúpula, atomizador y guía paso a paso.',
          price: 4999, compareAtPrice: 6999,
          image: 'https://images.unsplash.com/photo-1726177972571-0427e1d7d9db?w=600&q=85&auto=format&fit=crop',
          badge: 'Best Seller', badgeEs: 'Más Vendido',
        },
      },
      {
        id: 'hs-2',
        x: 68, y: 42,
        label: '2',
        product: {
          id: '2', slug: 'lions-mane-fruiting-block',
          name: "Lion's Mane Fruiting Block",
          nameEs: 'Bloque Fructificante Melena de León',
          description: "Ready-to-fruit Lion's Mane block. Fully colonized — just open and mist twice daily.",
          descriptionEs: 'Bloque de Melena de León listo para fructificar. Completamente colonizado — abre y nebuliza dos veces al día.',
          price: 3499,
          image: 'https://images.unsplash.com/photo-1625286535466-68a6d71e4568?w=600&q=85&auto=format&fit=crop',
          badge: 'Popular', badgeEs: 'Popular',
        },
      },
    ],
  },
  {
    id: 'spawn-lab',
    name: 'Spawn Lab',
    nameEs: 'Laboratorio de Spawn',
    subtitle: 'Inoculate & colonize',
    subtitleEs: 'Inocula y coloniza',
    bg: 'https://images.unsplash.com/photo-1726177972571-0427e1d7d9db?w=1920&h=1080&q=90&auto=format&fit=crop',
    hotspots: [
      {
        id: 'hs-3',
        x: 38, y: 52,
        label: '1',
        product: {
          id: 'bs2', slug: 'blue-oyster-bulk-substrate',
          name: 'Blue Oyster Sterile Bulk Substrate',
          nameEs: 'Sustrato a Granel Esterilizado Ostra Azul',
          description: 'Sterile, autoclaved hardwood substrate for growers who already have colonized grain spawn on hand — just open and mix.',
          descriptionEs: 'Sustrato de madera dura esterilizado en autoclave para cultivadores que ya tienen grain spawn colonizado — solo abrir y mezclar.',
          price: 2299, compareAtPrice: 2799,
          image: 'https://images.unsplash.com/photo-1726177972571-0427e1d7d9db?w=600&q=85&auto=format&fit=crop',
          badge: 'Organic', badgeEs: 'Orgánico',
        },
      },
      {
        id: 'hs-4',
        x: 68, y: 38,
        label: '2',
        product: {
          id: '4', slug: 'shiitake-log-kit',
          name: 'Shiitake Log Inoculation Kit',
          nameEs: 'Kit de Inoculación de Tronco Shiitake',
          description: 'Grow Shiitake on oak logs. Includes plug spawn, wax, and full guide. Produces 3–5 years.',
          descriptionEs: 'Cultiva Shiitake en troncos de roble. Incluye spawn en tacos, cera y guía completa. Produce 3–5 años.',
          price: 2999,
          image: 'https://images.unsplash.com/photo-1755108906864-fdaadb8ab5f1?w=600&q=85&auto=format&fit=crop',
          badge: 'Outdoor', badgeEs: 'Exterior',
        },
      },
    ],
  },
  {
    id: 'fruiting-room',
    name: 'Fruiting Room',
    nameEs: 'Sala de Fructificación',
    subtitle: 'Watch them emerge',
    subtitleEs: 'Obsérvalos crecer',
    // Shiitake — the featured species of this scene (see hs-5 below).
    bg: 'https://images.unsplash.com/photo-1755108906864-fdaadb8ab5f1?w=1920&h=1080&q=90&auto=format&fit=crop',
    hotspots: [
      {
        id: 'hs-5',
        x: 52, y: 44,
        label: '1',
        product: {
          id: '4', slug: 'shiitake-log-kit',
          name: 'Shiitake Log Inoculation Kit',
          nameEs: 'Kit de Inoculación de Tronco Shiitake',
          description: 'Grow Shiitake on oak logs. Includes plug spawn, wax, and full guide. Produces 3–5 years.',
          descriptionEs: 'Cultiva Shiitake en troncos de roble. Incluye spawn en tacos, cera y guía completa. Produce 3–5 años.',
          price: 2999,
          image: 'https://images.unsplash.com/photo-1755108906864-fdaadb8ab5f1?w=600&q=85&auto=format&fit=crop',
        },
      },
      {
        id: 'hs-5b',
        x: 30, y: 60,
        label: '2',
        product: {
          id: '2', slug: 'lions-mane-fruiting-block',
          name: "Lion's Mane Fruiting Block",
          nameEs: 'Bloque Fructificante Melena de León',
          description: "Ready-to-fruit Lion's Mane block. Fully colonized — just open and mist twice daily.",
          descriptionEs: 'Bloque de Melena de León listo para fructificar. Completamente colonizado.',
          price: 3499,
          image: 'https://images.unsplash.com/photo-1625286535466-68a6d71e4568?w=600&q=85&auto=format&fit=crop',
        },
      },
    ],
  },
  {
    id: 'apothecary',
    name: 'Apothecary',
    nameEs: 'Apotecaria',
    subtitle: 'Ancient remedies, modern science',
    subtitleEs: 'Remedios ancestrales, ciencia moderna',
    // Reishi — the featured species of this scene (see hs-6 below).
    bg: 'https://images.unsplash.com/photo-1786122622924-118eb20d8850?w=1920&h=1080&q=90&auto=format&fit=crop',
    hotspots: [
      {
        id: 'hs-6',
        x: 48, y: 50,
        label: '1',
        product: {
          id: '5', slug: 'reishi-dual-extract-tincture',
          name: 'Reishi Dual-Extract Tincture',
          nameEs: 'Tintura de Doble Extracción de Reishi',
          description: '2oz dual-extract tincture. Organic Ganoderma lucidum fruiting bodies. 50:1 concentration.',
          descriptionEs: 'Tintura de doble extracción de 60ml. Cuerpos fructificantes orgánicos de Ganoderma lucidum. Concentración 50:1.',
          price: 3999,
          image: 'https://images.unsplash.com/photo-1786122622924-118eb20d8850?w=600&q=85&auto=format&fit=crop',
          badge: 'Medicinal', badgeEs: 'Medicinal',
        },
      },
    ],
  },
]

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

export function GardenTour() {
  const locale = useLocale()
  const es = locale === 'es'

  const [sceneIdx, setSceneIdx] = useState(0)
  const [direction, setDirection] = useState(1)
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null)

  const scene = SCENES[sceneIdx]

  const goTo = useCallback((idx: number, dir?: number) => {
    setDirection(dir ?? (idx > sceneIdx ? 1 : -1))
    setActiveHotspot(null)
    setSceneIdx(idx)
  }, [sceneIdx])

  const goNext = useCallback(() => goTo((sceneIdx + 1) % SCENES.length, 1), [goTo, sceneIdx])
  const goPrev = useCallback(() => goTo((sceneIdx - 1 + SCENES.length) % SCENES.length, -1), [goTo, sceneIdx])

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

  const trust = es
    ? ['Orgánico', 'Envío en 24h', 'Garantía 30 días']
    : ['Organic', 'Ships in 24h', '30-day guarantee']

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
                <div className="bg-bg/95 backdrop-blur-md border border-amber/25 rounded-xl px-3 py-2 text-xs text-cream font-medium shadow-xl">
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
          {es ? 'Escena' : 'Scene'} {sceneIdx + 1} / {SCENES.length}
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
          {SCENES.map((s, i) => (
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
        {SCENES.map((s, i) => (
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
              <div className="relative mx-4 h-48 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src={activeHotspot.product.image}
                  alt={es ? activeHotspot.product.nameEs : activeHotspot.product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/40 via-transparent to-transparent" />
                {activeHotspot.product.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber text-bg shadow-lg">
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
                      className="text-[11px] text-amber/65 border border-amber/18 rounded-full px-2.5 py-1 font-body"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="px-5 pb-6 pt-3 border-t border-ds-border flex flex-col gap-2.5 flex-shrink-0">
                <button className="w-full py-3.5 rounded-xl bg-amber text-bg font-semibold text-sm hover:bg-amber-bright transition-colors shadow-[0_4px_20px_rgba(212,145,58,0.35)] active:scale-[0.98]">
                  {es ? 'Agregar al Carrito' : 'Add to Cart'}
                </button>
                <Link
                  href={`/shop/${activeHotspot.product.slug}`}
                  className="w-full py-3 rounded-xl border border-amber/25 text-amber text-sm font-medium text-center hover:bg-amber/8 hover:border-amber/40 transition-colors font-body"
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
