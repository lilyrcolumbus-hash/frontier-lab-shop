import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'

const zoneSchema = z.object({
  name: z.string().trim().min(1).max(80),
  // Two-letter country codes, the same form Stripe collects an address in.
  countries: z.array(z.string().trim().length(2).toUpperCase()).min(1).max(200),
})

const rateSchema = z.object({
  zoneId: z.string().min(1),
  name: z.string().trim().min(1).max(80),
  amount: z.coerce.number().int().min(0),
  minSubtotal: z.coerce.number().int().min(0).optional().nullable(),
  maxSubtotal: z.coerce.number().int().min(0).optional().nullable(),
  minWeightGrams: z.coerce.number().int().min(0).optional().nullable(),
  maxWeightGrams: z.coerce.number().int().min(0).optional().nullable(),
  minDays: z.coerce.number().int().min(0).max(90).default(3),
  maxDays: z.coerce.number().int().min(0).max(90).default(5),
})

export const GET = withStoreAdmin(async (_req, { store }) => {
  const zones = await prisma.shippingZone.findMany({
    where: { storeId: store.id },
    include: { rates: { orderBy: { sortOrder: 'asc' } } },
    orderBy: { sortOrder: 'asc' },
  })
  return NextResponse.json({ zones })
})

export const POST = withStoreAdmin(
  async (req, { store }) => {
    const body = await req.json().catch(() => null)

    // One endpoint handles both, because a rate has no meaning without its zone.
    if (body?.kind === 'rate') {
      const parsed = rateSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid rate', details: parsed.error.flatten() }, { status: 400 })
      }
      const zone = await prisma.shippingZone.findFirst({ where: { id: parsed.data.zoneId, storeId: store.id } })
      if (!zone) return NextResponse.json({ error: 'That zone does not exist.' }, { status: 404 })

      const { zoneId, ...rate } = parsed.data
      const created = await prisma.shippingRate.create({ data: { ...rate, zoneId, storeId: store.id } })
      return NextResponse.json({ rate: created })
    }

    const parsed = zoneSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid zone', details: parsed.error.flatten() }, { status: 400 })
    }
    const zone = await prisma.shippingZone.create({ data: { ...parsed.data, storeId: store.id } })
    return NextResponse.json({ zone })
  },
  { requireOwner: true }
)
