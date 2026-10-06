'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ProductCard } from '@/components/shop/ProductCard'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/product'

const CATEGORIES = [
  { key: 'culture-bank' },
  { key: 'substrate' },
  { key: 'kit' },
  { key: 'equipment' },
  { key: 'wellness' },
  { key: 'all' },
] as const

type CategoryKey = typeof CATEGORIES[number]['key']
const CATEGORY_KEYS: readonly string[] = CATEGORIES.map((c) => c.key)

const SUBSTRATE_STAGES = [
  { id: 'grain', subcategory: 'Grain Bags' },
  { id: 'bulk', subcategory: 'Bulk Substrate' },
  { id: 'fruiting', subcategory: 'Fruiting Blocks' },
] as const

export function ShopBrowser({ products: PRODUCTS }: { products: Product[] }) {
  const t = useTranslations('shop')
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const speciesParam = searchParams.get('species')
  const [activeCategory, setActiveCategory] = useState<CategoryKey>(
    categoryParam && CATEGORY_KEYS.includes(categoryParam) ? (categoryParam as CategoryKey) : 'culture-bank'
  )
  const [sortBy, setSortBy] = useState('featured')
  const [substrateSubFilter, setSubstrateSubFilter] = useState<string>(SUBSTRATE_STAGES[0].subcategory)

  useEffect(() => {
    if (categoryParam && CATEGORY_KEYS.includes(categoryParam)) setActiveCategory(categoryParam as CategoryKey)
  }, [categoryParam])

  const speciesFiltered = useMemo(() => {
    if (!speciesParam) return []
    return PRODUCTS.filter((p) => p.species === speciesParam)
  }, [PRODUCTS, speciesParam])

  const speciesLabel = speciesParam?.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  const filtered = useMemo(() => {
    let items = PRODUCTS
    if (activeCategory === 'all') items = PRODUCTS
    else if (activeCategory === 'culture-bank') items = PRODUCTS.filter((p) => p.subcategory === 'Liquid Culture')
    else items = PRODUCTS.filter((p) => p.category === activeCategory)
    if (sortBy === 'price-low') items = [...items].sort((a, b) => a.price - b.price)
    if (sortBy === 'price-high') items = [...items].sort((a, b) => b.price - a.price)
    return items
  }, [PRODUCTS, activeCategory, sortBy])

  const substrateStageGroups = useMemo(() => {
    if (activeCategory !== 'substrate') return []
    return SUBSTRATE_STAGES.map((stage) => {
      let items = PRODUCTS.filter((p) => p.subcategory === stage.subcategory)
      if (sortBy === 'price-low') items = [...items].sort((a, b) => a.price - b.price)
      if (sortBy === 'price-high') items = [...items].sort((a, b) => b.price - a.price)
      return {
        ...stage,
        eyebrow: t(`browser.stages.${stage.id}.eyebrow`),
        title: t(`browser.stages.${stage.id}.title`),
        note: t(`browser.stages.${stage.id}.note`),
        items,
      }
    }).filter((group) => group.items.length > 0)
  }, [PRODUCTS, activeCategory, sortBy, t])

  if (speciesParam && speciesFiltered.length > 0) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="bg-surface border-b border-ds-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-3">{t('browser.speciesFilter')}</p>
            <h1 className="font-heading font-medium text-4xl text-cream tracking-tight mb-2">{speciesLabel}</h1>
            <p className="text-cream-muted">{t('browser.productsAcross', { count: speciesFiltered.length })}</p>
            <a href="/shop" className="inline-block mt-4 text-sm text-accent hover:underline">
              {t('browser.viewAll')}
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {speciesFiltered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen">
      {/* Culture Bank hero banner */}
      {activeCategory === 'culture-bank' && (
        <div className="bg-elevated border-b border-ds-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-2">{t('browser.cultureHero.eyebrow')}</p>
              <h1 className="font-heading font-medium text-3xl sm:text-4xl text-cream tracking-tight mb-2">{t('browser.cultureHero.title')}</h1>
              <p className="text-cream-muted max-w-md">{t('browser.cultureHero.body')}</p>
            </div>
            <div className="flex gap-6 flex-shrink-0">
              {[1, 2, 3].map((n) => [t(`browser.cultureHero.stat${n}Value`), t(`browser.cultureHero.stat${n}Label`)]).map(([val, label]) => (
                <div key={label} className="text-center">
                  <p className="font-heading font-medium text-2xl text-accent">{val}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-muted mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Default header for other categories */}
      {activeCategory !== 'culture-bank' && (
        <div className="bg-surface border-b border-ds-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading font-medium text-4xl text-cream tracking-tight mb-2">{t('title')}</h1>
            <p className="text-cream-muted">{t('subtitle')}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(({ key }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={cn(
                  'px-4 py-2 rounded-none text-sm font-medium whitespace-nowrap transition-colors',
                  activeCategory === key
                    ? 'bg-accent text-cream'
                    : 'bg-elevated text-cream-muted hover:text-cream border border-ds-border'
                )}
              >
                {t(`browser.categories.${key}`)}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-elevated border border-ds-border rounded-none px-3 py-2 text-sm text-cream focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            <option value="featured">{t('filters.sortFeatured')}</option>
            <option value="price-low">{t('filters.sortPriceLow')}</option>
            <option value="price-high">{t('filters.sortPriceHigh')}</option>
          </select>
        </div>

        {/* Grid */}
        {activeCategory === 'culture-bank' ? (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-1">{t('browser.cultureSection.eyebrow')}</p>
                <h2 className="font-heading font-medium text-2xl text-cream tracking-tight">{t('browser.cultureSection.title')}</h2>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-sm text-cream-muted">
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {t('browser.cultureSection.point1')}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  {t('browser.cultureSection.point2')}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : activeCategory === 'substrate' ? (
          <div>
            {/* Sub-filter pills — pick one stage instead of scrolling through all of them */}
            <div className="flex gap-2 overflow-x-auto pb-1 mb-8">
              {substrateStageGroups.map((group) => (
                <button
                  key={group.subcategory}
                  onClick={() => setSubstrateSubFilter(group.subcategory)}
                  className={cn(
                    'px-4 py-2 rounded-none text-sm font-medium whitespace-nowrap transition-colors border',
                    substrateSubFilter === group.subcategory
                      ? 'bg-cream text-bg border-cream'
                      : 'bg-surface text-cream-muted hover:text-cream border-ds-border'
                  )}
                >
                  {group.title}
                </button>
              ))}
            </div>

            {(() => {
              const active = substrateStageGroups.find((g) => g.subcategory === substrateSubFilter) ?? substrateStageGroups[0]
              if (!active) return null
              return (
                <div>
                  <div className="mb-6">
                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-1">{active.eyebrow}</p>
                    <h2 className="font-heading font-medium text-2xl text-cream tracking-tight">{active.title}</h2>
                    <p className="text-cream-muted text-sm mt-1 max-w-xl">{active.note}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {active.items.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
