import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'

const bulkSchema = z.object({
  productIds: z.array(z.string().min(1)).min(1).max(200),
  action: z.discriminatedUnion('type', [
    z.object({ type: z.literal('status'), status: z.enum(['draft', 'active', 'archived']) }),
    z.object({ type: z.literal('inStock'), inStock: z.coerce.boolean() }),
    // A percentage keeps relative pricing intact across products that cost different amounts.
    z.object({ type: z.literal('priceAdjust'), percent: z.coerce.number().min(-90).max(500) }),
    z.object({ type: z.literal('addCollection'), collectionId: z.string().min(1) }),
    z.object({ type: z.literal('removeCollection'), collectionId: z.string().min(1) }),
    // Deleting is irreversible, so it carries its own confirmation word rather than sharing a
    // shape with the reversible actions above.
    z.object({ type: z.literal('delete'), confirm: z.literal('DELETE') }),
  ]),
})

/** Applies one change to many products at once — the bulk actions from the products table. */
export const POST = withStoreAdmin(async (req, { store }) => {
  const body = await req.json().catch(() => null)
  const parsed = bulkSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid bulk edit', details: parsed.error.flatten() }, { status: 400 })
  }

  const { productIds, action } = parsed.data

  // Scope the ids to this store before touching anything — an id from another tenant must not
  // be edited, and must not make the whole request fail either.
  const owned = await prisma.product.findMany({
    where: { id: { in: productIds }, storeId: store.id },
    select: { id: true, price: true },
  })
  if (owned.length === 0) {
    return NextResponse.json({ error: 'None of those products belong to this store.' }, { status: 404 })
  }
  const ownedIds = owned.map((p) => p.id)

  switch (action.type) {
    case 'status':
      await prisma.product.updateMany({ where: { id: { in: ownedIds } }, data: { status: action.status } })
      break

    case 'inStock':
      await prisma.product.updateMany({ where: { id: { in: ownedIds } }, data: { inStock: action.inStock } })
      break

    case 'priceAdjust': {
      // Each product gets its own new price, so this cannot be one updateMany. The single
      // variant of a product follows its price, matching the rule in the product form.
      const factor = 1 + action.percent / 100
      for (const product of owned) {
        const price = Math.max(0, Math.round(product.price * factor))
        await prisma.product.update({ where: { id: product.id }, data: { price } })
        const variants = await prisma.productVariant.findMany({ where: { productId: product.id } })
        if (variants.length === 1) {
          await prisma.productVariant.update({ where: { id: variants[0].id }, data: { price } })
        } else {
          for (const variant of variants) {
            await prisma.productVariant.update({
              where: { id: variant.id },
              data: { price: Math.max(0, Math.round(variant.price * factor)) },
            })
          }
        }
      }
      break
    }

    case 'delete': {
      // Variants first: OrderItem holds variantId as a plain string with no foreign key, so a
      // past order keeps its record of what was sold even after the product is gone.
      await prisma.productVariant.deleteMany({ where: { productId: { in: ownedIds } } })
      await prisma.product.deleteMany({ where: { id: { in: ownedIds } } })
      break
    }

    case 'addCollection':
    case 'removeCollection': {
      const collection = await prisma.collection.findFirst({
        where: { id: action.collectionId, storeId: store.id },
        select: { id: true },
      })
      if (!collection) {
        return NextResponse.json({ error: 'That collection does not belong to this store.' }, { status: 404 })
      }
      await prisma.collection.update({
        where: { id: collection.id },
        data: {
          products:
            action.type === 'addCollection'
              ? { connect: ownedIds.map((id) => ({ id })) }
              : { disconnect: ownedIds.map((id) => ({ id })) },
        },
      })
      break
    }
  }

  return NextResponse.json({ updated: ownedIds.length })
})
