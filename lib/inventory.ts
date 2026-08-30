import { prisma } from '@/lib/prisma'

type SoldLine = { variantId: string; quantity: number }

/**
 * Moves stock for the lines of an order and keeps the product's `inStock` flag honest.
 *
 * `direction: -1` is a sale, `+1` puts the units back (a cancellation or refund). A product is
 * marked sold out once every one of its variants is at zero, and comes back the moment any
 * variant has units again — so restocking a refund also makes the product buyable again.
 *
 * Never throws: callers run this after money has already moved, and a wrong stock number is
 * fixable from the admin while a failed refund or a lost order is not.
 */
export async function moveInventory(lines: SoldLine[], direction: -1 | 1) {
  for (const line of lines) {
    if (!line.variantId || line.variantId === 'unknown') continue

    try {
      const variant = await prisma.productVariant.update({
        where: { id: line.variantId },
        data:
          direction === -1
            ? { stock: { decrement: line.quantity } }
            : { stock: { increment: line.quantity } },
        select: { productId: true },
      })

      const remaining = await prisma.productVariant.aggregate({
        where: { productId: variant.productId },
        _sum: { stock: true },
      })

      await prisma.product.update({
        where: { id: variant.productId },
        data: { inStock: (remaining._sum.stock ?? 0) > 0 },
      })
    } catch (err) {
      console.error(`Could not ${direction === -1 ? 'draw down' : 'restock'} variant`, line.variantId, err)
    }
  }
}
