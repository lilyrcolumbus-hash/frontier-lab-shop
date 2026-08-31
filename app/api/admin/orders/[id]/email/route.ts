import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { recordOrderEvent } from '@/lib/order-events'
import { sendOrderConfirmation } from '@/lib/order-email'

/** Re-sends the order confirmation — for a customer who lost it or whose inbox filtered it. */
export const POST = withStoreAdmin<{ params: { id: string } }>(async (_req, { store, user }, { params }) => {
  const order = await prisma.order.findUnique({ where: { id: params.id }, include: { items: true } })
  if (!order || order.storeId !== store.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const result = await sendOrderConfirmation({ ...order, orderId: order.id, storeName: store.name })
  if (!result.ok) {
    // Nothing is logged on failure: the timeline must not claim an email the customer never got.
    return NextResponse.json({ error: result.error }, { status: 502 })
  }

  await recordOrderEvent({
    orderId: order.id,
    storeId: store.id,
    type: 'email',
    message: `Confirmation email re-sent to ${order.email}`,
    actorEmail: user.email,
  })

  return NextResponse.json({ ok: true })
})
