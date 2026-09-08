'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import type { CartItem } from '@/types/product'
import { cn } from '@/lib/utils'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onRemove: (productId: string, variantId: string) => void
  onUpdateQty: (productId: string, variantId: string, qty: number) => void
}

export function CartDrawer({ isOpen, onClose, items, onRemove, onUpdateQty }: CartDrawerProps) {
  const t = useTranslations('shop.cart')

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed inset-y-0 right-0 w-full max-w-md bg-surface z-50 flex flex-col transition-transform duration-300 border-l border-ds-border',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label={t('title')}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-ds-border">
          <h2 className="font-heading text-xl font-semibold text-cream">{t('title')}</h2>
          <button
            onClick={onClose}
            className="p-2 text-cream-muted hover:text-cream rounded-none hover:bg-elevated transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <span className="text-6xl">🛒</span>
              <p className="font-heading text-xl text-cream">{t('empty')}</p>
              <p className="text-cream-muted">{t('emptySubtext')}</p>
              <Button onClick={onClose} variant="outline" size="sm">
                {t('shopNow')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 p-4 bg-elevated rounded-none border border-ds-border">
                  <div className="w-16 h-16 rounded-none overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-cream truncate">{item.name}</p>
                    <p className="text-sm font-heading font-semibold text-accent mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQty(item.productId, item.variantId, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full border border-ds-border text-cream-muted hover:text-cream text-lg leading-none"
                      >−</button>
                      <span className="text-sm text-cream w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQty(item.productId, item.variantId, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full border border-ds-border text-cream-muted hover:text-cream text-lg leading-none"
                      >+</button>
                      <button
                        onClick={() => onRemove(item.productId, item.variantId)}
                        className="ml-auto text-xs text-cream-muted hover:text-error transition-colors"
                      >
                        {t('remove')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-ds-border space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-cream-muted">{t('subtotal')}</p>
              <p className="font-heading text-xl font-bold text-cream">{formatPrice(subtotal)}</p>
            </div>
            <Link href="/cart" onClick={onClose}>
              <Button fullWidth size="lg">{t('checkout')}</Button>
            </Link>
            <button
              onClick={onClose}
              className="w-full text-sm text-cream-muted hover:text-cream transition-colors"
            >
              {t('continueShopping')}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
