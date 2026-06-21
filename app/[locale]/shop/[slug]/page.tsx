'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { notFound } from 'next/navigation'
import { ProductGallery } from '@/components/shop/ProductGallery'
import { CultivationSpecs } from '@/components/shop/CultivationSpecs'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types/product'

const PRODUCTS: Record<string, Product> = {
  'blue-oyster-grain-spawn': {
    id: '1', slug: 'blue-oyster-grain-spawn',
    name: { en: 'Blue Oyster Grain Spawn', es: 'Spawn de Grano Ostra Azul' },
    description: { en: 'Premium Blue Oyster grain spawn on sterilized rye berries. Lab-tested for contamination, certified organic, and ready to inoculate any hardwood substrate. Each bag contains vigorous, fully-colonized mycelium ready to transfer.\n\nOur spawn is produced in a positive-pressure laboratory environment with HEPA filtration. Each batch is tested for contaminants before shipping.', es: 'Spawn de grano premium de Ostra Azul en bayas de centeno esterilizadas. Probado en laboratorio para contaminación, certificado orgánico.' },
    category: 'spawn', subcategory: 'Grain Spawn', species: 'blue-oyster',
    price: 1499, compareAtPrice: 1999,
    variants: [
      { id: 'v1-sm', name: '1 lb', price: 1499, stock: 50, sku: 'BOS-1LB' },
      { id: 'v1-md', name: '5 lbs', price: 5999, stock: 30, sku: 'BOS-5LB' },
      { id: 'v1-lg', name: '10 lbs', price: 9999, stock: 15, sku: 'BOS-10LB' },
    ],
    images: [
      'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=800',
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800',
    ],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '2–3 weeks', fruitingTempF: '55–65°F', fruitingTempC: '13–18°C', idealSubstrate: 'Hardwood sawdust, straw, coffee grounds', expectedYield: '1–3 flushes, 25% biological efficiency', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['beginner', 'oyster', 'organic'], relatedProducts: ['beginners-grow-kit-bundle'],
  },
}

const TABS = ['description', 'howToUse', 'science', 'reviews'] as const

export default function ProductPage({ params }: { params: { slug: string } }) {
  const locale = useLocale() as 'en' | 'es'
  const t = useTranslations('shop.product')
  const tc = useTranslations('common')

  const product = PRODUCTS[params.slug]
  if (!product) notFound()

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('description')

  const name = product.name[locale]
  const description = product.description[locale]
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > selectedVariant.price

  return (
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
            <ProductGallery images={product.images} alt={name} />
          </div>

          {/* Product info */}
          <div className="space-y-6">
            <div>
              {product.species && (
                <p className="font-mono-lab text-sm text-cream-muted italic mb-2">
                  {product.species.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </p>
              )}
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-cream">{name}</h1>

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
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-4xl font-bold text-cream">{formatPrice(selectedVariant.price)}</span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-cream-muted line-through">{formatPrice(product.compareAtPrice!)}</span>
                  <Badge variant="accent">Save {Math.round((1 - selectedVariant.price / product.compareAtPrice!) * 100)}%</Badge>
                </>
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
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
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
                <div className="flex items-center border border-ds-border rounded-xl overflow-hidden">
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
            <div className="flex flex-col sm:flex-row gap-3">
              <Button fullWidth size="lg" disabled={!product.inStock}>
                {product.inStock ? `${t('addToCart')} — ${formatPrice(selectedVariant.price * quantity)}` : tc('outOfStock')}
              </Button>
              <Button variant="outline" size="lg" className="sm:w-auto">
                ♡ {t('addToWishlist')}
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 py-4 border-t border-ds-border">
              {[
                { icon: '🌿', label: t('trustOrganic') },
                { icon: '⚡', label: t('trustShipping') },
                { icon: '🛡️', label: t('trustGuarantee') },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-sm text-cream-muted">
                  <span>{b.icon}</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>

            {/* Cultivation Specs */}
            {product.cultivationSpecs && (
              <CultivationSpecs specs={product.cultivationSpecs} />
            )}
          </div>
        </div>

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
            {activeTab === 'description' && (
              <div className="space-y-4">
                {description.split('\n\n').map((para, i) => (
                  <p key={i} className="text-cream-muted leading-relaxed">{para}</p>
                ))}
              </div>
            )}
            {activeTab === 'howToUse' && (
              <div className="space-y-4 text-cream-muted">
                <p>1. Sterilize your substrate (hardwood sawdust bags work best).</p>
                <p>2. Allow substrate to cool to room temperature before inoculating.</p>
                <p>3. In a sterile environment, mix grain spawn into substrate at 10–20% rate.</p>
                <p>4. Seal bag and colonize at 70–75°F for 2–3 weeks until fully white.</p>
                <p>5. Introduce fruiting conditions: fresh air exchange + 85–95% humidity.</p>
                <p>6. Harvest mushrooms just as the veil begins to separate from the cap edges.</p>
              </div>
            )}
            {activeTab === 'science' && (
              <div className="space-y-4 text-cream-muted">
                <p>Pleurotus ostreatus produces significant quantities of lovastatin, a natural statin compound. Research indicates 30% dry weight protein content with all essential amino acids.</p>
                <p>Beta-glucan content: 25–30% dry weight (primarily β-1,3 and β-1,6 glucans). These compounds are primary immunomodulators and have been studied extensively for their therapeutic potential.</p>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <p className="text-cream-muted">Reviews coming soon. Be the first to leave a review.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
