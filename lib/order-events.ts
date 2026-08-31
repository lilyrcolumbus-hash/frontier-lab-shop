import { prisma } from '@/lib/prisma'

type OrderEventType = 'placed' | 'status' | 'fulfilment' | 'tracking' | 'cancelled' | 'refunded' | 'email'

/**
 * Appends one entry to an order's history.
 *
 * Deliberately swallows its own failures: the timeline is a record of work that already
 * happened, so a logging problem must never undo a refund, a fulfilment, or a paid order.
 */
export async function recordOrderEvent(input: {
  orderId: string
  storeId: string
  type: OrderEventType
  message: string
  /** The admin who did it; omit when the system did (the Stripe webhook). */
  actorEmail?: string | null
}): Promise<void> {
  try {
    await prisma.orderEvent.create({
      data: {
        orderId: input.orderId,
        storeId: input.storeId,
        type: input.type,
        message: input.message,
        actorEmail: input.actorEmail ?? null,
      },
    })
  } catch (err) {
    console.error('[order-events] could not record event', { orderId: input.orderId, err })
  }
}
