import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { moveInventory } from '@/lib/inventory'
import { withStoreAdmin } from '@/lib/with-store-admin'

const resolveSchema = z.object({ action: z.enum(['cancel', 'refund']) })

const CLOSED_STATUSES = ['cancelled', 'refunded']

/**
 * Cancels or refunds an order — the two actions that move money and inventory, which is why
 * they are separate endpoints instead of options in the status dropdown. Setting a status by
 * hand is bookkeeping; this actually refunds the customer in Stripe and puts the units back.
 */
export const POST = withStoreAdmin<{ params: { id: string } }>(async (req, { store }, { params }) => {
  const body = await req.json().catch(() => null)
  const parsed = resolveSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const order = await prisma.order.findUnique({ where: { id: params.id }, include: { items: true } })
  if (!order || order.storeId !== store.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  // Guard against a double click or a second tab restocking the same order twice.
  if (CLOSED_STATUSES.includes(order.status)) {
    return NextResponse.json({ error: `This order is already ${order.status}.` }, { status: 409 })
  }

  if (parsed.data.action === 'refund') {
    if (!order.stripePaymentIntentId) {
      return NextResponse.json(
        { error: 'This order has no Stripe payment to refund. Cancel it instead.' },
        { status: 400 }
      )
    }

    try {
      await stripe.refunds.create({ payment_intent: order.stripePaymentIntentId })
    } catch (err) {
      // Nothing is written when the refund fails, so the order stays exactly as it was and the
      // admin can retry — never mark an order refunded unless Stripe actually refunded it.
      console.error('Stripe refund failed for order', order.id, err)
      const message = err instanceof Error ? err.message : 'Stripe refused the refund'
      return NextResponse.json({ error: `Refund failed — ${message}` }, { status: 502 })
    }
  }

  const status = parsed.data.action === 'refund' ? 'refunded' : 'cancelled'
  const updated = await prisma.order.update({ where: { id: order.id }, data: { status } })

  // Put the units back on the shelf now that the order is not going out.
  await moveInventory(
    order.items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
    1
  )

  return NextResponse.json({ order: updated })
})
