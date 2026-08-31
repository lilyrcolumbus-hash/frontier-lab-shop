import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { recordOrderEvent } from '@/lib/order-events'

// Cancelling and refunding go through POST /resolve, which also moves the money and the stock.
// Accepting them here would let an order be marked refunded without the customer being paid.
const ORDER_STATUSES = ['pending', 'paid', 'fulfilled'] as const

const updateOrderSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  trackingNumber: z.string().trim().max(120).optional().nullable(),
})

export const GET = withStoreAdmin<{ params: { id: string } }>(async (_req, { store }, { params }) => {
  const order = await prisma.order.findUnique({ where: { id: params.id }, include: { items: true } })
  if (!order || order.storeId !== store.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ order })
})

export const PATCH = withStoreAdmin<{ params: { id: string } }>(async (req, { store, user }, { params }) => {
  const body = await req.json().catch(() => null)
  const parsed = updateOrderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid order update', details: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.order.findUnique({ where: { id: params.id } })
  if (!existing || existing.storeId !== store.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const order = await prisma.order.update({
    where: { id: params.id },
    data: parsed.data,
    include: { items: true },
  })

  // Only log what actually changed — a save that changed nothing should not add noise.
  if (order.status !== existing.status) {
    await recordOrderEvent({
      orderId: order.id,
      storeId: store.id,
      type: 'status',
      message: `Status changed from ${existing.status} to ${order.status}`,
      actorEmail: user.email,
    })
  }
  if ((order.trackingNumber ?? '') !== (existing.trackingNumber ?? '')) {
    await recordOrderEvent({
      orderId: order.id,
      storeId: store.id,
      type: 'tracking',
      message: order.trackingNumber ? `Tracking number set to ${order.trackingNumber}` : 'Tracking number removed',
      actorEmail: user.email,
    })
  }

  return NextResponse.json({ order })
})
