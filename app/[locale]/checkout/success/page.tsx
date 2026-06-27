'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useCartStore } from '@/lib/cart-store'
import { Button } from '@/components/ui/Button'

export default function CheckoutSuccessPage() {
  const locale = useLocale()
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-accent">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <path d="M22 4L12 14.01l-3-3"/>
          </svg>
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-3">
          {locale === 'es' ? 'Pago confirmado' : 'Payment confirmed'}
        </p>
        <h1 className="font-body font-bold text-3xl sm:text-4xl tracking-tight text-cream mb-4">
          {locale === 'es' ? '¡Gracias por tu pedido!' : 'Thank you for your order!'}
        </h1>
        <p className="text-cream-muted text-lg mb-8">
          {locale === 'es'
            ? 'Recibirás un email de confirmación en breve. Tu kit será enviado en 1-2 días hábiles.'
            : "You'll receive a confirmation email shortly. Your kit ships within 1-2 business days."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop">
            <Button variant="primary" size="lg">
              {locale === 'es' ? 'Seguir comprando' : 'Continue shopping'}
            </Button>
          </Link>
          <Link href="/learn">
            <Button variant="outline" size="lg">
              {locale === 'es' ? 'Leer la guía' : 'Read the grow guide'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
