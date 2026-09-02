import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'

const moveSchema = z.object({
  variantId: z.string().min(1),
  toLocationId: z.string().min(1),
  quantity: z.coerce.number().int().min(1),
})

/** Transfers stock of one variant from this location to another. */
export const POST = withStoreAdmin<{ params: { id: string } }>(
  async (req, { store }, { params }) => {
    const body = await req.json().catch(() => null)
    const parsed = moveSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid transfer', details: parsed.error.flatten() }, { status: 400 })
    }

    const { variantId, toLocationId, quantity } = parsed.data
    if (toLocationId === params.id) {
      return NextResponse.json({ error: 'Choose a different destination.' }, { status: 400 })
    }

    const [from, to] = await Promise.all([
      prisma.location.findFirst({ where: { id: params.id, storeId: store.id } }),
      prisma.location.findFirst({ where: { id: toLocationId, storeId: store.id } }),
    ])
    if (!from || !to) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const source = await prisma.inventoryLevel.findUnique({
      where: { variantId_locationId: { variantId, locationId: from.id } },
    })
    if (!source || source.quantity < quantity) {
      return NextResponse.json(
        { error: `Only ${source?.quantity ?? 0} units of that item are at ${from.name}.` },
        { status: 400 }
      )
    }

    // Both sides move together: a transfer that half-applied would invent or destroy stock.
    await prisma.$transaction([
      prisma.inventoryLevel.update({
        where: { variantId_locationId: { variantId, locationId: from.id } },
        data: { quantity: { decrement: quantity } },
      }),
      prisma.inventoryLevel.upsert({
        where: { variantId_locationId: { variantId, locationId: to.id } },
        update: { quantity: { increment: quantity } },
        create: { storeId: store.id, variantId, locationId: to.id, quantity },
      }),
    ])

    // The variant's own total is unchanged — moving stock does not create or consume any.
    return NextResponse.json({ ok: true })
  },
  { requireOwner: true }
)

export const DELETE = withStoreAdmin<{ params: { id: string } }>(
  async (_req, { store }, { params }) => {
    const location = await prisma.location.findFirst({ where: { id: params.id, storeId: store.id } })
    if (!location) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (location.isDefault) {
      return NextResponse.json({ error: 'The default location cannot be deleted.' }, { status: 409 })
    }

    const held = await prisma.inventoryLevel.aggregate({
      where: { locationId: location.id },
      _sum: { quantity: true },
    })
    if ((held._sum.quantity ?? 0) > 0) {
      return NextResponse.json(
        { error: 'Move the stock out of this location before deleting it.' },
        { status: 409 }
      )
    }

    await prisma.location.delete({ where: { id: location.id } })
    return NextResponse.json({ ok: true })
  },
  { requireOwner: true }
)
