'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const t = useTranslations('shop.cart')

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-heading text-4xl font-bold text-cream mb-8">{t('title')}</h1>

        {/* Empty state */}
        <div className="text-center py-20">
          <span className="text-7xl block mb-6">🛒</span>
          <h2 className="font-heading text-3xl text-cream mb-3">{t('empty')}</h2>
          <p className="text-cream-muted text-lg mb-8">{t('emptySubtext')}</p>
          <Link href="/shop">
            <Button size="lg">🍄 {t('shopNow')}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
