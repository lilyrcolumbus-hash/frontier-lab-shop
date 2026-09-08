'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import { useCartStore } from '@/lib/cart-store'
import { ProductGallery } from '@/components/shop/ProductGallery'
import { CultivationSpecs } from '@/components/shop/CultivationSpecs'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types/product'

const TABS = ['description', 'howToUse', 'science', 'faq', 'reviews'] as const

export function ProductDetailClient({ product }: { product: Product }) {
  const locale = useLocale() as 'en' | 'es'
  const t = useTranslations('shop.product')
  const tc = useTranslations('common')

  const { addItem, openCart } = useCartStore()

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('description')
  const [showSticky, setShowSticky] = useState(false)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const ctaRef = useRef<HTMLDivElement>(null)
  const magnetBtnRef = useRef<HTMLDivElement>(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 350, damping: 22 })
  const springY = useSpring(my, { stiffness: 350, damping: 22 })

  const handleMagnetMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.3)
    my.set((e.clientY - rect.top - rect.height / 2) * 0.3)
  }
  const handleMagnetLeave = () => { mx.set(0); my.set(0) }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name[locale],
      price: selectedVariant.price,
      quantity,
      image: product.images[0] ?? '',
    })
    openCart()
  }

  const handleRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = Date.now()
    setRipples(prev => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700)
  }

  useEffect(() => {
    const el = ctaRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const name = product.name[locale]
  const description = product.description[locale]
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > selectedVariant.price

  return (
    <>
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-cream-muted mb-8">
          <Link href="/shop" className="hover:text-cream transition-colors">{t('breadcrumb.shop')}</Link>
          <span>›</span>
          <span className="capitalize">{product.subcategory}</span>
          <span>›</span>
          <span className="text-cream">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div>
            <ProductGallery images={product.images} imageAlts={product.imageAlts} alt={name} />
          </div>

          {/* Product info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-cream">{name}</h1>
              {product.scientificName && (
                <p className="font-mono text-sm text-cream-muted italic mt-1">{product.scientificName}</p>
              )}

              {/* Rating placeholder */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-warning text-sm">★</span>
                  ))}
                </div>
                <span className="text-sm text-cream-muted">4.9 (127 {t('reviews')})</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <div className="flex items-baseline gap-3">
                <span className="font-body text-4xl font-bold tracking-tight text-cream">{formatPrice(selectedVariant.price)}</span>
                {hasDiscount && (
                  <span className="text-xl text-cream-muted/50 line-through font-normal">{formatPrice(product.compareAtPrice!)}</span>
                )}
              </div>
              {hasDiscount && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-none bg-accent/10 border border-accent/20 text-accent text-xs font-mono uppercase tracking-wider">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Save {Math.round((1 - selectedVariant.price / product.compareAtPrice!) * 100)}% — Launch price
                  </span>
                </div>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div>
                <p className="text-sm text-cream-muted mb-2">{t('variant')}</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-none text-sm font-medium border transition-colors ${
                        selectedVariant.id === v.id
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-ds-border text-cream-muted hover:border-accent/50 hover:text-cream'
                      }`}
                    >
                      {v.name} — {formatPrice(v.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm text-cream-muted mb-2">{t('quantity')}</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-ds-border rounded-none overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-cream-muted hover:text-cream hover:bg-elevated transition-colors text-lg"
                  >−</button>
                  <span className="px-6 py-3 text-cream font-medium min-w-[4rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-cream-muted hover:text-cream hover:bg-elevated transition-colors text-lg"
                  >+</button>
                </div>
                <span className="text-sm text-cream-muted">{selectedVariant.stock} in stock</span>
              </div>
            </div>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3">
              <motion.div
                ref={magnetBtnRef}
                className="flex-1 relative overflow-hidden rounded-none"
                style={{ x: springX, y: springY }}
                onMouseMove={handleMagnetMove}
                onMouseLeave={handleMagnetLeave}
                onClick={(e) => { handleRipple(e); handleAddToCart() }}
              >
                <Button fullWidth size="lg" disabled={!product.inStock}>
                  {product.inStock ? `${t('addToCart')} — ${formatPrice(selectedVariant.price * quantity)}` : tc('outOfStock')}
                </Button>
                {ripples.map(r => (
                  <motion.span
                    key={r.id}
                    className="absolute rounded-full bg-white/25 pointer-events-none"
                    style={{ left: r.x, top: r.y, translateX: '-50%', translateY: '-50%' }}
                    initial={{ width: 0, height: 0, opacity: 0.7 }}
                    animate={{ width: 320, height: 320, opacity: 0 }}
                    transition={{ duration: 0.65, ease: 'easeOut' }}
                  />
                ))}
              </motion.div>
              <Button variant="outline" size="lg" className="sm:w-auto">
                ♡ {t('addToWishlist')}
              </Button>
            </div>

            {/* LC packet contents */}
            {product.subcategory === 'Liquid Culture' && (
              <div className="rounded-none border border-ds-border overflow-hidden">
                <div className="px-4 py-2.5 bg-elevated border-b border-ds-border">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-muted">What&apos;s in the packet</p>
                </div>
                <div className="grid grid-cols-4 divide-x divide-ds-border bg-surface">
                  {[
                    {
                      label: '10cc\nSyringe',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4l5.5 5.5-9 9-3 .5.5-3 6-6z"/><path d="M12 6.5l5 5"/></svg>,
                    },
                    {
                      label: '16G\nNeedle',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="19" x2="19" y2="5"/><path d="M15 5h4v4"/></svg>,
                    },
                    {
                      label: 'Alcohol\nSwab',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7"/><path d="M9 12h6m-3-3v6"/></svg>,
                    },
                    {
                      label: 'Instruction\nCard',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="13" x2="13" y2="13"/></svg>,
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 28, scale: 0.88 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: '-5% 0px' }}
                      transition={{ delay: i * 0.14, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col items-center gap-2 py-4 px-1"
                    >
                      <div className="text-accent/50">{item.icon}</div>
                      <p className="font-mono text-[8px] uppercase tracking-wider text-cream-muted/60 text-center whitespace-pre-line leading-relaxed">{item.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Grain bag / all-in-one bag contents */}
            {(product.subcategory === 'Grain Bags' || product.subcategory === 'All-in-One Bags') && (
              <div className="rounded-none border border-ds-border overflow-hidden">
                <div className="px-4 py-2.5 bg-elevated border-b border-ds-border">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-muted">What&apos;s in the bag</p>
                </div>
                <div className="grid grid-cols-4 divide-x divide-ds-border bg-surface">
                  {[
                    {
                      label: product.subcategory === 'All-in-One Bags' ? "5lb\nMaster's Mix" : '3lb\nSterile Grain',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="7" width="16" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
                    },
                    {
                      label: '0.2μm\nFilter Patch',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>,
                    },
                    {
                      label: 'Self-Healing\nInjection Port',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="19" x2="19" y2="5"/><path d="M15 5h4v4"/></svg>,
                    },
                    {
                      label: 'Instruction\nCard',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="13" x2="13" y2="13"/></svg>,
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 28, scale: 0.88 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: '-5% 0px' }}
                      transition={{ delay: i * 0.14, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col items-center gap-2 py-4 px-1"
                    >
                      <div className="text-accent/50">{item.icon}</div>
                      <p className="font-mono text-[8px] uppercase tracking-wider text-cream-muted/60 text-center whitespace-pre-line leading-relaxed">{item.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Bulk substrate contents (no injection port — opened and hand-mixed with grain spawn) */}
            {product.subcategory === 'Bulk Substrate' && (
              <div className="rounded-none border border-ds-border overflow-hidden">
                <div className="px-4 py-2.5 bg-elevated border-b border-ds-border">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-muted">What&apos;s in the bag</p>
                </div>
                <div className="grid grid-cols-3 divide-x divide-ds-border bg-surface">
                  {[
                    {
                      label: '5lb\nSterile Substrate',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="7" width="16" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
                    },
                    {
                      label: '0.2μm\nFilter Patch',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>,
                    },
                    {
                      label: 'Instruction\nCard',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="13" x2="13" y2="13"/></svg>,
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 28, scale: 0.88 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: '-5% 0px' }}
                      transition={{ delay: i * 0.14, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col items-center gap-2 py-4 px-1"
                    >
                      <div className="text-accent/50">{item.icon}</div>
                      <p className="font-mono text-[8px] uppercase tracking-wider text-cream-muted/60 text-center whitespace-pre-line leading-relaxed">{item.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Fruiting block contents */}
            {product.subcategory === 'Fruiting Blocks' && (
              <div className="rounded-none border border-ds-border overflow-hidden">
                <div className="px-4 py-2.5 bg-elevated border-b border-ds-border">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-muted">What&apos;s in the box</p>
                </div>
                <div className="grid grid-cols-3 divide-x divide-ds-border bg-surface">
                  {[
                    {
                      label: '5lb\nColonized Block',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="7" width="16" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
                    },
                    {
                      label: 'Fruiting-Ready\nFilter Bag',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>,
                    },
                    {
                      label: 'Instruction\nCard',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="13" x2="13" y2="13"/></svg>,
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 28, scale: 0.88 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: '-5% 0px' }}
                      transition={{ delay: i * 0.14, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col items-center gap-2 py-4 px-1"
                    >
                      <div className="text-accent/50">{item.icon}</div>
                      <p className="font-mono text-[8px] uppercase tracking-wider text-cream-muted/60 text-center whitespace-pre-line leading-relaxed">{item.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-5 py-4 border-t border-ds-border">
              {[
                ...(product.isOrganic ? [{
                  label: t('trustOrganic'),
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                }] : []),
                {
                  label: t('trustShipping'),
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
                },
                {
                  label: t('trustGuarantee'),
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
                },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-sm text-cream-muted">
                  <span className="text-accent/60">{b.icon}</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>

            {/* Viability guarantee — living/biological products only, matches /terms exactly */}
            {product.category !== 'equipment' && (
              <div className="flex items-start gap-3 rounded-none border border-accent/25 bg-accent/5 px-4 py-3.5">
                <span className="text-accent flex-shrink-0 mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
                </span>
                <p className="text-sm text-cream-muted leading-relaxed">
                  <span className="text-cream font-medium">
                    {locale === 'es' ? 'Cultivo viable garantizado.' : 'Viable culture guaranteed.'}
                  </span>{' '}
                  {locale === 'es'
                    ? 'Si llega dañado, muerto o visiblemente contaminado, escríbenos dentro de las 48 horas con fotos y coordinamos reemplazo o reembolso.'
                    : "If it arrives damaged, dead, or visibly contaminated, contact us within 48 hours with photos and we'll arrange a replacement or refund."}
                </p>
              </div>
            )}

            {/* How we guarantee freshness — genetics/process, no fabricated dates or lot numbers */}
            {product.category === 'spawn' && (
              <div className="rounded-none border border-ds-border overflow-hidden">
                <div className="px-4 py-3 bg-elevated border-b border-ds-border">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream-muted">
                    {locale === 'es' ? 'Cómo garantizamos que llegue fresco' : 'How we guarantee it arrives fresh'}
                  </p>
                </div>
                <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-ds-border bg-surface">
                  {[
                    {
                      label: locale === 'es' ? 'Genética aislada en laboratorio' : 'Lab-isolated genetics',
                      detail: locale === 'es' ? 'Cada especie seleccionada por rasgos específicos, no colectada al azar en el bosque.' : 'Each species selected for specific traits, not randomly wild-collected.',
                    },
                    {
                      label: locale === 'es' ? 'Nuestro propio laboratorio' : 'Grown in our own lab',
                      detail: locale === 'es' ? 'Técnica estéril, sin subcontratar el cultivo a terceros.' : 'Sterile technique, not outsourced to a third party.',
                    },
                    {
                      label: locale === 'es' ? 'Envío rápido' : 'Ships fast',
                      detail: locale === 'es' ? 'Sale en 24h — menos tiempo en tránsito, más viabilidad al llegar.' : 'Ships within 24h — less time in transit, more viability on arrival.',
                    },
                  ].map((item) => (
                    <div key={item.label} className="p-4 flex flex-col gap-1.5">
                      <p className="text-sm text-cream font-medium">{item.label}</p>
                      <p className="text-xs text-cream-muted leading-relaxed">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {product.category === 'substrate' && product.subcategory === 'Grain Bags' && (
              <div className="rounded-none border border-ds-border overflow-hidden">
                <div className="px-4 py-3 bg-elevated border-b border-ds-border">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream-muted">
                    {locale === 'es' ? 'Cómo garantizamos que llegue estéril' : 'How we guarantee it arrives sterile'}
                  </p>
                </div>
                <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-ds-border bg-surface">
                  {[
                    {
                      label: locale === 'es' ? 'Autoclave a 15 PSI' : 'Autoclaved at 15 PSI',
                      detail: locale === 'es' ? 'Esterilización comercial real, no solo pasteurizado.' : 'Real commercial-grade sterilization, not just pasteurized.',
                    },
                    {
                      label: locale === 'es' ? 'Probado por lote' : 'Batch-tested',
                      detail: locale === 'es' ? 'Verificado con indicadores biológicos antes de enviar, no solo por presión/temperatura.' : 'Verified with biological indicators before shipping, not just pressure/temp logs.',
                    },
                    {
                      label: locale === 'es' ? 'Parche filtrante 0.2 micras' : '0.2-micron filter patch',
                      detail: locale === 'es' ? 'Deja pasar aire, bloquea contaminantes después de esterilizar.' : 'Lets air exchange through, blocks contaminants after sterilization.',
                    },
                  ].map((item) => (
                    <div key={item.label} className="p-4 flex flex-col gap-1.5">
                      <p className="text-sm text-cream font-medium">{item.label}</p>
                      <p className="text-xs text-cream-muted leading-relaxed">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cultivation Specs */}
            {product.cultivationSpecs && (
              <CultivationSpecs specs={product.cultivationSpecs} />
            )}

            {/* Grain Bag Specs */}
            {product.grainBagSpecs && (
              <div className="rounded-none border border-ds-border overflow-hidden">
                <div className="px-4 py-3 bg-elevated border-b border-ds-border">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream-muted">{product.subcategory === 'Grain Bags' ? 'Grain Bag Specs' : 'Substrate Specs'}</p>
                </div>
                <div className="grid grid-cols-2 divide-x divide-y divide-ds-border">
                  {[
                    { label: 'Bag Size', value: product.grainBagSpecs.bagSize, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="7" width="16" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> },
                    { label: 'Colonization', value: product.grainBagSpecs.colonizationEstimate, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
                    { label: 'Sterilization', value: product.grainBagSpecs.sterilization, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
                    { label: 'Moisture', value: product.grainBagSpecs.moisture, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg> },
                    { label: 'Recommended Inoculation', value: product.grainBagSpecs.recommendedInoculation, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4l5.5 5.5-9 9-3 .5.5-3 6-6z"/><path d="M12 6.5l5 5"/></svg> },
                    { label: 'Shelf Life', value: product.grainBagSpecs.shelfLife, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
                  ].map((row, i) => (
                    <motion.div
                      key={row.label}
                      className="flex flex-col gap-1.5 p-4 bg-surface"
                      initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
                      whileInView={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
                      viewport={{ once: true, margin: '-10% 0px' }}
                      transition={{ duration: 0.5, delay: 0.12 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="text-accent/55">{row.icon}</div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream-muted/50">{row.label}</p>
                      <p className="text-sm text-cream font-medium leading-snug">{row.value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Benefits */}
        {product.keyBenefits && product.keyBenefits.length > 0 && (
          <div className="mt-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cream-muted mb-6">Key Benefits</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {product.keyBenefits.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-none border border-ds-border bg-surface p-5 space-y-3"
                >
                  <div className="w-9 h-9 rounded-none bg-accent/8 flex items-center justify-center text-accent">
                    {b.icon === 'brain' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>}
                    {b.icon === 'shield' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
                    {b.icon === 'heart' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}
                    {b.icon === 'leaf' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>}
                    {b.icon === 'activity' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
                    {b.icon === 'zap' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>}
                    {b.icon === 'sun' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>}
                    {b.icon === 'droplet' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>}
                  </div>
                  <div>
                    <p className="font-body font-semibold text-cream text-sm mb-1">{b.label}</p>
                    <p className="text-cream-muted text-xs leading-relaxed">{b.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mt-16">
          <div className="border-b border-ds-border mb-8">
            <div className="flex gap-1 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-accent text-accent'
                      : 'border-transparent text-cream-muted hover:text-cream'
                  }`}
                >
                  {t(`tabs.${tab}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeTab === 'description' && (
                  <div className="space-y-4">
                    {description.split('\n\n').map((para, i) => (
                      <p key={i} className="text-cream-muted leading-relaxed">{para}</p>
                    ))}
                  </div>
                )}
                {activeTab === 'howToUse' && (
                  <div className="space-y-3">
                    {(product.howToUseSteps ?? [
                      'Sterilize your substrate (hardwood sawdust bags work best).',
                      'Allow substrate to cool to room temperature before inoculating.',
                      'In a sterile environment, mix grain spawn into substrate at 10–20% rate.',
                      'Seal bag and colonize at 70–75°F for 2–3 weeks until fully white.',
                      'Introduce fruiting conditions: fresh air exchange + 85–95% humidity.',
                      'Harvest mushrooms just as the veil begins to separate from the cap edges.',
                    ]).map((step, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-[10px] flex items-center justify-center mt-0.5">{i + 1}</span>
                        <p className="text-cream-muted leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'science' && (
                  <div className="space-y-4 text-cream-muted">
                    {product.scienceContent ? (
                      product.scienceContent[locale].split('\n\n').map((para, i) => (
                        <p key={i} className="leading-relaxed">{para}</p>
                      ))
                    ) : (
                      <p>Detailed scientific research available soon.</p>
                    )}
                  </div>
                )}
                {activeTab === 'faq' && (
                  <div className="space-y-6">
                    {product.faqs && product.faqs.length > 0 ? (
                      product.faqs.map((faq, i) => (
                        <div key={i} className="border-b border-ds-border pb-5 last:border-b-0 last:pb-0">
                          <p className="text-cream font-medium mb-2">{faq.q[locale]}</p>
                          <p className="text-cream-muted leading-relaxed text-sm">{faq.a[locale]}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-cream-muted">{locale === 'es' ? 'Preguntas frecuentes próximamente.' : 'FAQ coming soon.'}</p>
                    )}
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <p className="text-cream-muted">Reviews coming soon. Be the first to leave a review.</p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>

    {/* Sticky CTA */}
    <AnimatePresence>
      {showSticky && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-xl border-t border-ds-border"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-body font-semibold text-cream text-sm truncate">{name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-accent font-bold text-sm">{formatPrice(selectedVariant.price)}</span>
                {hasDiscount && (
                  <span className="text-xs text-cream-muted/45 line-through">{formatPrice(product.compareAtPrice!)}</span>
                )}
              </div>
            </div>
            <Button size="md" disabled={!product.inStock} className="flex-shrink-0" onClick={handleAddToCart}>
              {product.inStock ? t('addToCart') : tc('outOfStock')}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}
