'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useCartStore } from '@/lib/cart-store'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export default function CartPage() {
  const locale = useLocale()
  const { items, removeItem, updateQty, total } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, locale }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Something went wrong')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-cream-muted/30 mx-auto mb-6">
            <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          <h1 className="font-heading font-medium text-3xl text-cream mb-3">
            {locale === 'es' ? 'Tu carrito está vacío' : 'Your cart is empty'}
          </h1>
          <p className="text-cream-muted mb-8">
            {locale === 'es' ? 'Explora nuestra tienda para encontrar tu kit perfecto.' : 'Explore our shop to find your perfect grow kit.'}
          </p>
          <Link href="/shop">
            <Button size="lg">{locale === 'es' ? 'Ir a la tienda' : 'Browse Shop'}</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-heading font-medium text-3xl tracking-tight text-cream mb-10">
          {locale === 'es' ? 'Tu Carrito' : 'Your Cart'}
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Items */}
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 p-5 bg-surface border border-ds-border rounded-none">
                <div className="w-20 h-20 rounded-none overflow-hidden flex-shrink-0 bg-elevated">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-medium text-cream">{item.name}</p>
                  <p className="font-body font-semibold text-accent mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => updateQty(item.productId, item.variantId, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center rounded-full border border-ds-border text-cream-muted hover:text-cream transition-colors">−</button>
                    <span className="text-sm text-cream w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.productId, item.variantId, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded-full border border-ds-border text-cream-muted hover:text-cream transition-colors">+</button>
                    <button onClick={() => removeItem(item.productId, item.variantId)} className="ml-auto text-xs text-cream-muted hover:text-red-400 transition-colors">
                      {locale === 'es' ? 'Eliminar' : 'Remove'}
                    </button>
                  </div>
                </div>
                <p className="font-heading font-medium text-cream text-right flex-shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-surface border border-ds-border rounded-none p-6 sticky top-24">
              <h2 className="font-heading font-medium text-lg text-cream mb-4">
                {locale === 'es' ? 'Resumen' : 'Order Summary'}
              </h2>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-cream-muted">
                  <span>{locale === 'es' ? 'Subtotal' : 'Subtotal'}</span>
                  <span className="text-cream">{formatPrice(total())}</span>
                </div>
                <div className="flex justify-between text-cream-muted">
                  <span>{locale === 'es' ? 'Envío' : 'Shipping'}</span>
                  <span className="text-accent">{locale === 'es' ? 'Calculado al pagar' : 'Calculated at checkout'}</span>
                </div>
                <div className="border-t border-ds-border pt-3 flex justify-between font-heading font-medium text-cream text-base">
                  <span>Total</span>
                  <span>{formatPrice(total())}</span>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm mb-4">{error}</p>
              )}

              <Button fullWidth size="lg" onClick={handleCheckout} isLoading={loading}>
                {locale === 'es' ? 'Pagar ahora' : 'Checkout'}
              </Button>

              <Link href="/shop" className="block text-center text-sm text-cream-muted hover:text-cream transition-colors mt-4">
                {locale === 'es' ? '← Seguir comprando' : '← Continue shopping'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
