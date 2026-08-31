import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireStoreAdmin } from '@/lib/require-store-admin'
import { formatPrice } from '@/lib/utils'
import { PrintButton } from '@/components/admin/PrintButton'

// A packing slip is what goes in the box, so it is printed on white with black text regardless
// of the admin's own palette — it must be legible on paper, not on screen.
export default async function PackingSlipPage({ params }: { params: { id: string } }) {
  const admin = await requireStoreAdmin()
  if (!admin) notFound()

  const order = await prisma.order.findUnique({ where: { id: params.id }, include: { items: true } })
  if (!order || order.storeId !== admin.store.id) notFound()

  // Store details come from Settings so a rename or a new support address never touches code.
  const store = admin.store
  const storeAddress = [store.addressLine1, store.city, store.state, store.postalCode]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="bg-white text-black rounded-xl p-10 max-w-3xl mx-auto print:p-0 print:rounded-none">
      <div className="print:hidden mb-6">
        <PrintButton />
      </div>

      <div className="flex justify-between items-start border-b border-black/20 pb-6 mb-6">
        <div>
          <p className="text-lg font-bold tracking-[0.18em]">{store.name.toUpperCase()}</p>
          {storeAddress && <p className="text-xs text-black/60 mt-1">{storeAddress}</p>}
        </div>
        <div className="text-right text-sm">
          <p className="font-semibold">Packing slip</p>
          <p className="text-black/70">Order #{order.id.slice(-8)}</p>
          <p className="text-black/70">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-black/60 mb-2">Ship to</p>
          <p>{order.shippingName}</p>
          <p>{order.shippingLine1}</p>
          {order.shippingLine2 && <p>{order.shippingLine2}</p>}
          <p>
            {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
          </p>
          <p>{order.shippingCountry}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-black/60 mb-2">Contact</p>
          <p>{order.email}</p>
          {order.trackingNumber && <p className="mt-2">Tracking: {order.trackingNumber}</p>}
        </div>
      </div>

      <table className="w-full text-sm mb-8">
        <thead>
          <tr className="border-b border-black/20">
            <th className="text-left py-2 text-[11px] uppercase tracking-[0.16em] text-black/60">Item</th>
            <th className="text-right py-2 text-[11px] uppercase tracking-[0.16em] text-black/60">Shipped</th>
            <th className="text-right py-2 text-[11px] uppercase tracking-[0.16em] text-black/60">Ordered</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} className="border-b border-black/10">
              <td className="py-2.5">{item.name}</td>
              <td className="py-2.5 text-right">{item.fulfilledQuantity}</td>
              <td className="py-2.5 text-right">{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end text-sm">
        <div className="w-56 space-y-1">
          <div className="flex justify-between text-black/70">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-black/70">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between font-semibold border-t border-black/20 pt-1">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <p className="mt-10 text-xs text-black/60 border-t border-black/10 pt-4">
        Thank you for your order.{store.supportEmail ? ` Questions? ${store.supportEmail}` : ''}
      </p>
    </div>
  )
}
