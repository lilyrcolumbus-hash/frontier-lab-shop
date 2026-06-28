'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale() as 'en' | 'es'
  const t = useTranslations('shop.product')
  const tc = useTranslations('common')

  const name = product.name[locale]
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
    : 0

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col h-full rounded-2xl overflow-hidden border border-ds-border bg-surface shadow-sm hover:shadow-[0_20px_60px_-8px_rgba(61,110,69,0.32)] hover:border-accent/30 transition-all duration-500"
    >
      <Link href={`/shop/${product.slug}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative h-56 bg-elevated overflow-hidden flex-shrink-0">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-elevated via-surface to-elevated" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -skew-x-12"
                animate={{ x: ['-120%', '120%'] }}
                transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
              />
              <div className="relative z-10 flex flex-col items-center gap-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="text-cream-muted/20">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream-muted/30">Photo coming soon</span>
              </div>
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            {product.isOrganic && <Badge variant="success" size="sm">{tc('organic')}</Badge>}
            {hasDiscount && <Badge variant="accent" size="sm">-{discountPct}%</Badge>}
            {!product.inStock && <Badge variant="default" size="sm">{tc('outOfStock')}</Badge>}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 gap-3">
          <div className="flex-1">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream-muted/50 mb-1.5">{product.subcategory}</p>
            <h3 className="font-body text-base font-semibold text-cream leading-snug">{name}</h3>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-body text-xl font-bold text-cream">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="text-sm text-cream-muted/50 line-through">{formatPrice(product.compareAtPrice!)}</span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5">
        <Button fullWidth variant="primary" size="sm" disabled={!product.inStock}>
          {product.inStock ? t('addToCart') : tc('outOfStock')}
        </Button>
      </div>
    </motion.div>
  )
}
