'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter } from '@/navigation'
import { formatPrice } from '@/lib/utils'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  trackingNumber: string | null
  items: OrderItem[]
}

export default function OrdersPage() {
  const t = useTranslations('account')
  const locale = useLocale()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[] | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/account')
      return
    }
    if (status === 'authenticated') {
      fetch('/api/account/orders')
        .then((r) => r.json())
        .then((data) => setOrders(data.orders ?? []))
        .catch(() => setOrders([]))
    }
  }, [status, router])

  if (status === 'loading' || !session?.user) {
    return <div className="pt-20 min-h-screen" />
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-surface border-b border-ds-border py-16 text-center">
        <h1 className="font-heading text-5xl font-bold text-cream mb-3">{t('orders')}</h1>
        <Link href="/account" className="text-accent hover:text-accent-hover transition-colors text-sm">
          ← {t('title')}
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-16">
        {orders === null ? (
          <p className="text-cream-muted text-center">…</p>
        ) : orders.length === 0 ? (
          <div className="text-center space-y-4">
            <p className="text-cream-muted">
              {locale === 'es' ? 'Todavía no tenés pedidos.' : "You don't have any orders yet."}
            </p>
            <Link href="/shop" className="text-accent hover:text-accent-hover font-medium">
              {locale === 'es' ? 'Ir a la tienda →' : 'Go to shop →'}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-elevated rounded-2xl border border-ds-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-cream-muted">
                      {new Date(order.createdAt).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-cream-muted/60 font-mono uppercase tracking-wider mt-0.5">
                      {order.status}
                    </p>
                  </div>
                  <p className="text-cream font-bold">{formatPrice(order.total)}</p>
                </div>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-cream-muted">
                        {item.quantity}× {item.name}
                      </span>
                      <span className="text-cream-muted">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                {order.trackingNumber && (
                  <p className="text-xs text-cream-muted/60 mt-4 pt-4 border-t border-ds-border">
                    {locale === 'es' ? 'Seguimiento' : 'Tracking'}: {order.trackingNumber}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
