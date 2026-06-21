'use client'

import { useState, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { ProductCard } from '@/components/shop/ProductCard'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/product'

const PRODUCTS: Product[] = [
  {
    id: '1', slug: 'blue-oyster-grain-spawn',
    name: { en: 'Blue Oyster Grain Spawn', es: 'Spawn de Grano Ostra Azul' },
    description: { en: 'Premium Blue Oyster grain spawn on sterilized rye berries. Lab-tested, certified organic.', es: 'Spawn de grano premium de Ostra Azul en bayas de centeno esterilizadas.' },
    category: 'spawn', subcategory: 'Grain Spawn', species: 'blue-oyster',
    price: 1499, compareAtPrice: 1999,
    variants: [{ id: 'v1', name: 'Standard', price: 1499, stock: 50, sku: 'BOS-STD' }],
    images: ['https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=800'],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '2–3 weeks', fruitingTempF: '55–65°F', fruitingTempC: '13–18°C', idealSubstrate: 'Hardwood sawdust, straw', expectedYield: '1–3 flushes', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['beginner', 'oyster'], relatedProducts: [],
  },
  {
    id: '2', slug: 'lions-mane-fruiting-block',
    name: { en: "Lion's Mane Fruiting Block", es: 'Bloque Fructificante Melena de León' },
    description: { en: "Ready-to-fruit Lion's Mane block. Fully colonized — open and mist.", es: 'Bloque de Melena de León listo para fructificar. Completamente colonizado.' },
    category: 'kit', subcategory: 'Fruiting Blocks', species: 'lions-mane',
    price: 3499, compareAtPrice: undefined,
    variants: [{ id: 'v2', name: 'Standard', price: 3499, stock: 25, sku: 'LMB-STD' }],
    images: ['https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=800'],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: 'Already colonized', fruitingTempF: '65–75°F', fruitingTempC: '18–24°C', idealSubstrate: 'Supplemented hardwood', expectedYield: '200–400g', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'kit'], relatedProducts: [],
  },
  {
    id: '3', slug: 'beginners-grow-kit-bundle',
    name: { en: "Beginner's Complete Grow Kit", es: 'Kit de Cultivo Completo para Principiantes' },
    description: { en: "Everything to grow your first mushrooms: spawn, substrate, dome, mister, and guide.", es: 'Todo lo que necesitas para tu primer cultivo: spawn, sustrato, cúpula, atomizador y guía.' },
    category: 'bundle', subcategory: 'Beginner Bundles', species: 'blue-oyster',
    price: 4999, compareAtPrice: 6999,
    variants: [{ id: 'v3', name: 'Standard', price: 4999, stock: 30, sku: 'BKT-STD' }],
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '2–3 weeks', fruitingTempF: '55–65°F', fruitingTempC: '13–18°C', idealSubstrate: 'Included', expectedYield: '150–300g per flush', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'bundle', 'best-seller'], relatedProducts: [],
  },
  {
    id: '4', slug: 'shiitake-log-kit',
    name: { en: 'Shiitake Log Inoculation Kit', es: 'Kit de Inoculación de Tronco Shiitake' },
    description: { en: 'Grow Shiitake on oak logs. Includes plug spawn, wax, and full guide. Produces 3–5 years.', es: 'Cultiva Shiitake en troncos de roble. Incluye spawn en tacos, cera y guía completa.' },
    category: 'kit', subcategory: 'Log Kits', species: 'shiitake',
    price: 2999, compareAtPrice: undefined,
    variants: [{ id: 'v4', name: 'Standard', price: 2999, stock: 40, sku: 'SLK-STD' }],
    images: ['https://images.unsplash.com/photo-1585155784229-aff921ccfa12?w=800'],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: '6–12 months on logs', fruitingTempF: '55–75°F', fruitingTempC: '13–24°C', idealSubstrate: 'Oak logs', expectedYield: 'Perennial', indoorOutdoor: 'outdoor' },
    isOrganic: true, inStock: true, tags: ['shiitake', 'outdoor'], relatedProducts: [],
  },
  {
    id: '5', slug: 'reishi-dual-extract-tincture',
    name: { en: 'Reishi Dual-Extract Tincture', es: 'Tintura de Doble Extracción de Reishi' },
    description: { en: '2oz dual-extract tincture. Organic Ganoderma lucidum fruiting bodies. 50:1 concentration.', es: 'Tintura de doble extracción de 60ml. Cuerpos fructificantes orgánicos de Ganoderma lucidum. Concentración 50:1.' },
    category: 'wellness', subcategory: 'Tinctures',
    price: 3999, compareAtPrice: undefined,
    variants: [{ id: 'v5', name: '2oz', price: 3999, stock: 60, sku: 'RDT-2OZ' }],
    images: ['https://images.unsplash.com/photo-1504470695779-75300268aa0e?w=800'],
    isOrganic: true, inStock: true, tags: ['reishi', 'wellness', 'tincture'], relatedProducts: [],
  },
]

const CATEGORIES = ['all', 'kit', 'spawn', 'substrate', 'equipment', 'wellness', 'bundle'] as const

export default function ShopPage() {
  const t = useTranslations('shop')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState('featured')

  const filtered = useMemo(() => {
    let items = activeCategory === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory)
    if (sortBy === 'price-low') items = [...items].sort((a, b) => a.price - b.price)
    if (sortBy === 'price-high') items = [...items].sort((a, b) => b.price - a.price)
    return items
  }, [activeCategory, sortBy])

  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <div className="bg-surface border-b border-ds-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-5xl sm:text-6xl font-bold text-cream mb-3">{t('title')}</h1>
          <p className="text-cream-muted text-lg">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  activeCategory === cat
                    ? 'bg-accent text-cream'
                    : 'bg-elevated text-cream-muted hover:text-cream border border-ds-border'
                )}
              >
                {t(`filters.${cat === 'all' ? 'all' : cat === 'kit' ? 'kit' : cat === 'spawn' ? 'spawn' : cat === 'substrate' ? 'substrate' : cat === 'equipment' ? 'equipment' : cat === 'wellness' ? 'wellness' : 'bundle'}`)}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-elevated border border-ds-border rounded-xl px-3 py-2 text-sm text-cream focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            <option value="featured">{t('filters.sortFeatured')}</option>
            <option value="price-low">{t('filters.sortPriceLow')}</option>
            <option value="price-high">{t('filters.sortPriceHigh')}</option>
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
