import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireStoreAdmin } from '@/lib/require-store-admin'
import { formatPrice } from '@/lib/utils'
import { StatusPill } from '@/components/admin/StatusPill'
import { OrderStatusForm } from '@/components/admin/OrderStatusForm'
import { OrderTimeline } from '@/components/admin/OrderTimeline'
import { OrderFulfilmentForm } from '@/components/admin/OrderFulfilmentForm'
import { OrderEmailButton } from '@/components/admin/OrderEmailButton'

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const admin = await requireStoreAdmin()
  if (!admin) notFound()

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, events: { orderBy: { createdAt: 'desc' } } },
  })
  if (!order || order.storeId !== admin.store.id) notFound()

  const isClosed = order.status === 'cancelled' || order.status === 'refunded'

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-medium text-2xl text-cream">Order #{order.id.slice(-8)}</h1>
          <p className="text-sm text-cream-muted">
            {order.email} · {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/admin/orders/${order.id}/packing-slip`}
            className="px-4 py-2 rounded-full border border-ds-border text-sm font-medium text-cream hover:bg-elevated transition-colors"
          >
            Packing slip
          </a>
          <StatusPill status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-surface border border-ds-border rounded-none overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-elevated text-cream-muted">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Item</th>
                  <th className="text-left px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Qty</th>
                  <th className="text-left px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Shipped</th>
                  <th className="text-right px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-t border-ds-border">
                    <td className="px-4 py-3 flex items-center gap-3">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-none object-cover border border-ds-border" />
                      ) : null}
                      <span className="text-cream">{item.name}</span>
                    </td>
                    <td className="px-4 py-3 text-cream-muted">{item.quantity}</td>
                    <td className="px-4 py-3 text-cream-muted">
                      {item.fulfilledQuantity}
                      {item.fulfilledQuantity > 0 && item.fulfilledQuantity < item.quantity && (
                        <span className="ml-2 text-[11px] text-amber">partial</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-cream">{formatPrice(item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-surface border border-ds-border rounded-none p-5 space-y-1.5 text-sm">
            <div className="flex justify-between text-cream-muted">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-cream-muted">
              <span>Shipping</span>
              <span>{formatPrice(order.shipping)}</span>
            </div>
            <div className="flex justify-between text-cream-muted">
              <span>Tax</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between text-cream font-semibold pt-1.5 border-t border-ds-border">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="bg-surface border border-ds-border rounded-none p-5 space-y-1 text-sm">
            <h2 className="font-semibold text-cream mb-2">Shipping address</h2>
            <p className="text-cream-muted">{order.shippingName}</p>
            <p className="text-cream-muted">{order.shippingLine1}</p>
            {order.shippingLine2 && <p className="text-cream-muted">{order.shippingLine2}</p>}
            <p className="text-cream-muted">
              {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
            </p>
            <p className="text-cream-muted">{order.shippingCountry}</p>
          </div>
        </div>

        <div className="space-y-6">
          <OrderStatusForm
            orderId={order.id}
            initialStatus={order.status}
            initialTrackingNumber={order.trackingNumber}
          />

          <OrderFulfilmentForm
            orderId={order.id}
            items={order.items.map((i) => ({
              id: i.id,
              name: i.name,
              quantity: i.quantity,
              fulfilledQuantity: i.fulfilledQuantity,
            }))}
            disabled={isClosed}
          />

          <div className="bg-surface border border-ds-border rounded-none p-5">
            <h2 className="font-semibold text-cream text-sm mb-3">Customer email</h2>
            <OrderEmailButton orderId={order.id} email={order.email} />
          </div>

          <OrderTimeline events={order.events} />
        </div>
      </div>
    </div>
  )
}
