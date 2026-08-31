import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { recordOrderEvent } from '@/lib/order-events'

const fulfilSchema = z.object({
  /** One entry per line being shipped now — the running total already shipped, not a delta. */
  lines: z
    .array(z.object({ itemId: z.string().min(1), fulfilledQuantity: z.coerce.number().int().min(0) }))
    .min(1),
})

const CLOSED_STATUSES = ['cancelled', 'refunded']

/**
 * Records how many units of each line have shipped.
 *
 * Shopify calls this a fulfilment: an order with one line out of stock ships in two goes, and
 * stays open until every line has caught up. The order's own status is derived from the lines
 * rather than set by hand, so it can never claim to be fulfilled while something is unshipped.
 */
export const POST = withStoreAdmin<{ params: { id: string } }>(async (req, { store, user }, { params }) => {
  const body = await req.json().catch(() => null)
  const parsed = fulfilSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid fulfilment', details: parsed.error.flatten() }, { status: 400 })
  }

  const order = await prisma.order.findUnique({ where: { id: params.id }, include: { items: true } })
  if (!order || order.storeId !== store.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (CLOSED_STATUSES.includes(order.status)) {
    return NextResponse.json({ error: `This order is ${order.status} and can no longer ship.` }, { status: 409 })
  }

  // Validate every line before writing any of them: a request naming an item from another
  // order, or shipping more units than were bought, must change nothing at all.
  const updates: { id: string; fulfilledQuantity: number; name: string; ordered: number }[] = []
  for (const line of parsed.data.lines) {
    const item = order.items.find((i) => i.id === line.itemId)
    if (!item) {
      return NextResponse.json({ error: 'That item is not part of this order.' }, { status: 400 })
    }
    if (line.fulfilledQuantity > item.quantity) {
      return NextResponse.json(
        { error: `You cannot ship ${line.fulfilledQuantity} of ${item.name} — only ${item.quantity} were ordered.` },
        { status: 400 }
      )
    }
    updates.push({ id: item.id, fulfilledQuantity: line.fulfilledQuantity, name: item.name, ordered: item.quantity })
  }

  await prisma.$transaction(
    updates.map((u) =>
      prisma.orderItem.update({ where: { id: u.id }, data: { fulfilledQuantity: u.fulfilledQuantity } })
    )
  )

  const items = await prisma.orderItem.findMany({ where: { orderId: order.id } })
  const shipped = items.reduce((sum, i) => sum + i.fulfilledQuantity, 0)
  const ordered = items.reduce((sum, i) => sum + i.quantity, 0)

  // 'paid' is the resting state for an order that is paid for but not yet fully shipped;
  // an unpaid order stays pending until Stripe says otherwise.
  const status = shipped >= ordered ? 'fulfilled' : order.status === 'fulfilled' ? 'paid' : order.status
  const updated = await prisma.order.update({ where: { id: order.id }, data: { status }, include: { items: true } })

  await recordOrderEvent({
    orderId: order.id,
    storeId: store.id,
    type: 'fulfilment',
    message:
      shipped >= ordered
        ? `Marked as fully shipped (${shipped} of ${ordered} units)`
        : `Partially shipped — ${shipped} of ${ordered} units`,
    actorEmail: user.email,
  })

  return NextResponse.json({ order: updated })
})
