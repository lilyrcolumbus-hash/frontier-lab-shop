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
    ],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '2–3 weeks', fruitingTempF: '55–65°F', fruitingTempC: '13–18°C', idealSubstrate: 'Hardwood sawdust, straw, coffee grounds', expectedYield: '1–3 flushes, 25% biological efficiency', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['beginner', 'oyster', 'organic'], relatedProducts: ['beginners-grow-kit-bundle'],
  },
}

const LC_HOW_TO_USE_STEPS = [
  'Remove syringe from refrigerator 1–2 hours before use to warm to room temperature.',
  'Shake gently to suspend the mycelium uniformly throughout the nutrient broth.',
  'Sterilize the injection port of your grain bag or jar lid with the included alcohol swab. Let dry.',
  'Insert the 16G needle and inject 1–2cc per pound of grain substrate.',
  'Recap the needle. Refrigerate remaining culture — shelf life up to 2 months refrigerated.',
  'Incubate at 70–75°F away from direct light. Agitate the bag gently after 3–5 days to redistribute mycelium.',
  'Expect full colonization in 5–10 days. Transfer to bulk substrate once grain is fully colonized.',
]

const LC_PRODUCTS: Record<string, Product> = {
  'lions-mane-liquid-culture': {
    id: 'lc1', slug: 'lions-mane-liquid-culture',
    name: { en: "Lion's Mane Liquid Culture Syringe", es: 'Jeringa de Cultivo Líquido Melena de León' },
    description: {
      en: "shrooms Culture Bank — 10cc of live Hericium erinaceus mycelium suspended in nutrient broth. Lab-isolated for purity and vigor, this culture colonizes grain spawn in 5–10 days — up to 3× faster than spores.\n\nEach packet includes: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Best used within 2 months.",
      es: "shrooms Culture Bank — 10cc de micelio vivo de Hericium erinaceus suspendido en caldo nutritivo. Aislado en laboratorio para pureza y vigor, coloniza spawn de grano en 5–10 días — hasta 3× más rápido que esporas.\n\nCada paquete incluye: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms. Refrigerar al recibir. Usar en un máximo de 2 meses.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'lions-mane',
    price: 1700, compareAtPrice: 1900,
    variants: [{ id: 'lc1v', name: '10cc', price: 1700, stock: 40, sku: 'LML-10CC' }],
    images: ['https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=800'],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: '5–10 days', fruitingTempF: '65–75°F', fruitingTempC: '18–24°C', idealSubstrate: 'Supplemented hardwood sawdust', expectedYield: '200–400g per flush', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'liquid-culture', 'lions-mane'], relatedProducts: ['lions-mane-fruiting-block'],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
  },
  'blue-oyster-liquid-culture': {
    id: 'lc2', slug: 'blue-oyster-liquid-culture',
    name: { en: 'Blue Oyster Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Ostra Azul' },
    description: {
      en: "shrooms Culture Bank — 10cc of live Pleurotus ostreatus mycelium suspended in nutrient broth. Lab-isolated for purity and vigor, this culture colonizes grain spawn in 5–10 days — up to 3× faster than spores.\n\nEach packet includes: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Best used within 2 months.",
      es: "shrooms Culture Bank — 10cc de micelio vivo de Pleurotus ostreatus suspendido en caldo nutritivo. Coloniza en 5–10 días.\n\nCada paquete incluye: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'blue-oyster',
    price: 1700, compareAtPrice: 1900,
    variants: [{ id: 'lc2v', name: '10cc', price: 1700, stock: 50, sku: 'BOL-10CC' }],
    images: ['https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=800'],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '5–10 days', fruitingTempF: '55–65°F', fruitingTempC: '13–18°C', idealSubstrate: 'Hardwood sawdust, straw', expectedYield: '1–3 flushes, 25% BE', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['beginner', 'liquid-culture', 'oyster'], relatedProducts: ['blue-oyster-grain-spawn'],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
  },
  'pink-oyster-liquid-culture': {
    id: 'lc3', slug: 'pink-oyster-liquid-culture',
    name: { en: 'Pink Oyster Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Ostra Rosa' },
    description: {
      en: "shrooms Culture Bank — 10cc of live Pleurotus djamor mycelium suspended in nutrient broth. Lab-isolated for purity and vigor, this culture colonizes grain spawn in 5–10 days — up to 3× faster than spores.\n\nEach packet includes: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Best used within 2 months.",
      es: "shrooms Culture Bank — 10cc de micelio vivo de Pleurotus djamor suspendido en caldo nutritivo. Coloniza en 5–10 días.\n\nCada paquete incluye: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'pink-oyster',
    price: 1700, compareAtPrice: 1900,
    variants: [{ id: 'lc3v', name: '10cc', price: 1700, stock: 40, sku: 'POL-10CC' }],
    images: ['https://images.unsplash.com/photo-1773600149997-2b6af77031d7?w=800'],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '5–10 days', fruitingTempF: '65–85°F', fruitingTempC: '18–29°C', idealSubstrate: 'Straw, hardwood sawdust', expectedYield: '1–3 flushes', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'liquid-culture', 'oyster'], relatedProducts: [],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
  },
  'yellow-oyster-liquid-culture': {
    id: 'lc4', slug: 'yellow-oyster-liquid-culture',
    name: { en: 'Yellow Oyster Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Ostra Amarilla' },
    description: {
      en: "shrooms Culture Bank — 10cc of live Pleurotus citrinopileatus mycelium suspended in nutrient broth. Lab-isolated for purity and vigor, this culture colonizes grain spawn in 5–10 days — up to 3× faster than spores.\n\nEach packet includes: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Best used within 2 months.",
      es: "shrooms Culture Bank — 10cc de micelio vivo de Pleurotus citrinopileatus suspendido en caldo nutritivo. Coloniza en 5–10 días.\n\nCada paquete incluye: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'yellow-oyster',
    price: 1700, compareAtPrice: 1900,
    variants: [{ id: 'lc4v', name: '10cc', price: 1700, stock: 35, sku: 'YOL-10CC' }],
    images: ['https://images.unsplash.com/photo-1748118869505-e75f25812a70?w=800'],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '5–10 days', fruitingTempF: '65–80°F', fruitingTempC: '18–27°C', idealSubstrate: 'Straw, hardwood sawdust', expectedYield: '1–3 flushes', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'liquid-culture', 'oyster'], relatedProducts: [],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
  },
  'reishi-liquid-culture': {
    id: 'lc5', slug: 'reishi-liquid-culture',
    name: { en: 'Reishi Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Reishi' },
    description: {
      en: "shrooms Culture Bank — 10cc of live Ganoderma lucidum mycelium suspended in nutrient broth. Lab-isolated for purity and vigor, this culture colonizes grain spawn in 5–10 days — up to 3× faster than spores.\n\nEach packet includes: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Best used within 2 months.",
      es: "shrooms Culture Bank — 10cc de micelio vivo de Ganoderma lucidum suspendido en caldo nutritivo. Coloniza en 5–10 días.\n\nCada paquete incluye: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'reishi',
    price: 1700, compareAtPrice: 1900,
    variants: [{ id: 'lc5v', name: '10cc', price: 1700, stock: 30, sku: 'REL-10CC' }],
    images: ['https://images.unsplash.com/photo-1748118869505-e75f25812a70?w=800'],
    cultivationSpecs: { difficulty: 'advanced', colonizationTime: '5–10 days (on grain)', fruitingTempF: '70–80°F', fruitingTempC: '21–27°C', idealSubstrate: 'Hardwood logs or sawdust', expectedYield: '1 flush (medicinal)', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'liquid-culture', 'reishi'], relatedProducts: ['reishi-dual-extract-tincture'],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
  },
  'shiitake-liquid-culture': {
    id: 'lc6', slug: 'shiitake-liquid-culture',
    name: { en: 'Shiitake Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Shiitake' },
    description: {
      en: "shrooms Culture Bank — 10cc of live Lentinula edodes mycelium suspended in nutrient broth. Lab-isolated for purity and vigor, this culture colonizes grain spawn in 5–10 days — up to 3× faster than spores.\n\nEach packet includes: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Best used within 2 months.",
      es: "shrooms Culture Bank — 10cc de micelio vivo de Lentinula edodes suspendido en caldo nutritivo. Coloniza en 5–10 días.\n\nCada paquete incluye: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'shiitake',
    price: 1700, compareAtPrice: 1900,
    variants: [{ id: 'lc6v', name: '10cc', price: 1700, stock: 45, sku: 'SHL-10CC' }],
    images: ['https://images.unsplash.com/photo-1773600149997-2b6af77031d7?w=800'],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: '5–10 days (on grain)', fruitingTempF: '55–75°F', fruitingTempC: '13–24°C', idealSubstrate: 'Hardwood sawdust or oak logs', expectedYield: 'Multiple flushes', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['edible', 'liquid-culture', 'shiitake'], relatedProducts: ['shiitake-log-kit'],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
  },
  'turkey-tail-liquid-culture': {
    id: 'lc7', slug: 'turkey-tail-liquid-culture',
    name: { en: 'Turkey Tail Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Cola de Pavo' },
    description: {
      en: "shrooms Culture Bank — 10cc of live Trametes versicolor mycelium suspended in nutrient broth. Lab-isolated for purity and vigor, this culture colonizes grain spawn in 5–10 days — up to 3× faster than spores.\n\nEach packet includes: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Best used within 2 months.",
      es: "shrooms Culture Bank — 10cc de micelio vivo de Trametes versicolor suspendido en caldo nutritivo. Coloniza en 5–10 días.\n\nCada paquete incluye: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'turkey-tail',
    price: 1700, compareAtPrice: 1900,
    variants: [{ id: 'lc7v', name: '10cc', price: 1700, stock: 30, sku: 'TTL-10CC' }],
    images: ['https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=800'],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: '5–10 days (on grain)', fruitingTempF: '60–75°F', fruitingTempC: '15–24°C', idealSubstrate: 'Hardwood logs or supplemented sawdust', expectedYield: 'Medicinal — polypore brackets', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'liquid-culture', 'turkey-tail'], relatedProducts: [],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
  },
  'maitake-liquid-culture': {
    id: 'lc8', slug: 'maitake-liquid-culture',
    name: { en: 'Maitake Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Maitake' },
    description: {
      en: "shrooms Culture Bank — 10cc of live Grifola frondosa mycelium suspended in nutrient broth. Lab-isolated for purity and vigor, this culture colonizes grain spawn in 5–10 days — up to 3× faster than spores.\n\nEach packet includes: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Best used within 2 months.",
      es: "shrooms Culture Bank — 10cc de micelio vivo de Grifola frondosa suspendido en caldo nutritivo. Coloniza en 5–10 días.\n\nCada paquete incluye: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'maitake',
    price: 1700, compareAtPrice: 1900,
    variants: [{ id: 'lc8v', name: '10cc', price: 1700, stock: 25, sku: 'MAL-10CC' }],
    images: ['https://images.unsplash.com/photo-1748118869505-e75f25812a70?w=800'],
    cultivationSpecs: { difficulty: 'advanced', colonizationTime: '5–10 days (on grain)', fruitingTempF: '55–65°F', fruitingTempC: '13–18°C', idealSubstrate: 'Hardwood logs or oak sawdust', expectedYield: 'Variable — dense frond clusters', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'edible', 'liquid-culture', 'maitake'], relatedProducts: [],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
  },
}

const TABS = ['description', 'howToUse', 'science', 'reviews'] as const

export default function ProductPage({ params }: { params: { slug: string } }) {
  const locale = useLocale() as 'en' | 'es'
  const t = useTranslations('shop.product')
  const tc = useTranslations('common')

  const product = PRODUCTS[params.slug] ?? LC_PRODUCTS[params.slug]
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
                {product.howToUseSteps ? (
                  product.howToUseSteps.map((step, i) => (
                    <p key={i}>{i + 1}. {step}</p>
                  ))
                ) : (
                  <>
                    <p>1. Sterilize your substrate (hardwood sawdust bags work best).</p>
                    <p>2. Allow substrate to cool to room temperature before inoculating.</p>
                    <p>3. In a sterile environment, mix grain spawn into substrate at 10–20% rate.</p>
                    <p>4. Seal bag and colonize at 70–75°F for 2–3 weeks until fully white.</p>
                    <p>5. Introduce fruiting conditions: fresh air exchange + 85–95% humidity.</p>
                    <p>6. Harvest mushrooms just as the veil begins to separate from the cap edges.</p>
                  </>
                )}
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
