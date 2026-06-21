import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
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
    <Card hover className="overflow-hidden group flex flex-col">
      <Link href={`/shop/${product.slug}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative h-52 bg-surface overflow-hidden flex-shrink-0">
          {product.images[0] && (
            <img
              src={product.images[0]}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            {product.isOrganic && (
              <Badge variant="success" size="sm">{tc('organic')}</Badge>
            )}
            {hasDiscount && (
              <Badge variant="accent" size="sm">-{discountPct}%</Badge>
            )}
            {!product.inStock && (
              <Badge variant="default" size="sm">{tc('outOfStock')}</Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 gap-3">
          <div className="flex-1">
            <p className="text-xs text-cream-muted uppercase tracking-wide mb-1">{product.subcategory}</p>
            <h3 className="font-heading text-base font-semibold text-cream leading-snug">{name}</h3>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-xl font-bold text-cream">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-cream-muted line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5">
        <Button
          fullWidth
          variant="primary"
          size="sm"
          disabled={!product.inStock}
        >
          {product.inStock ? t('addToCart') : tc('outOfStock')}
        </Button>
      </div>
    </Card>
  )
}
