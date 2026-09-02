import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'

const locationSchema = z.object({
  name: z.string().trim().min(1).max(80),
  address: z.string().trim().max(300).default(''),
  isDefault: z.coerce.boolean().default(false),
})

export const GET = withStoreAdmin(async (_req, { store }) => {
  const locations = await prisma.location.findMany({
    where: { storeId: store.id },
    orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
  })

  // Stock held per location, so the list can show where things actually are.
  const totals = await prisma.inventoryLevel.groupBy({
    by: ['locationId'],
    where: { storeId: store.id },
    _sum: { quantity: true },
  })
  const byLocation = new Map(totals.map((t) => [t.locationId, t._sum.quantity ?? 0]))

  return NextResponse.json({
    locations: locations.map((l) => ({ ...l, units: byLocation.get(l.id) ?? 0 })),
  })
})

export const POST = withStoreAdmin(
  async (req, { store }) => {
    const body = await req.json().catch(() => null)
    const parsed = locationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid location', details: parsed.error.flatten() }, { status: 400 })
    }

    const count = await prisma.location.count({ where: { storeId: store.id } })
    // The first location is the default whatever the form said — stock has to live somewhere.
    const isDefault = count === 0 ? true : parsed.data.isDefault

    if (isDefault) {
      await prisma.location.updateMany({ where: { storeId: store.id }, data: { isDefault: false } })
    }

    const location = await prisma.location.create({
      data: { ...parsed.data, isDefault, storeId: store.id },
    })

    // A new default adopts the existing stock, so the totals the storefront already shows stay
    // true instead of every product suddenly reading as zero on hand somewhere.
    if (count === 0) {
      const variants = await prisma.productVariant.findMany({
        where: { storeId: store.id },
        select: { id: true, stock: true },
      })
      if (variants.length > 0) {
        await prisma.inventoryLevel.createMany({
          data: variants.map((v) => ({
            storeId: store.id,
            variantId: v.id,
            locationId: location.id,
            quantity: v.stock,
          })),
          skipDuplicates: true,
        })
      }
    }

    return NextResponse.json({ location })
  },
  { requireOwner: true }
)
