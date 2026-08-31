import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'

const settingsSchema = z.object({
  shippingRate: z.coerce.number().int().min(0),
  // 0 means the offer is off; any other value is the subtotal at which shipping becomes free.
  freeShippingThreshold: z.coerce.number().int().min(0),
})

export const GET = withStoreAdmin(async (_req, { store }) => {
  return NextResponse.json({
    settings: {
      shippingRate: store.shippingRate,
      freeShippingThreshold: store.freeShippingThreshold,
    },
  })
})

export const PATCH = withStoreAdmin(async (req, { store }) => {
  const body = await req.json().catch(() => null)
  const parsed = settingsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid settings', details: parsed.error.flatten() }, { status: 400 })
  }

  const updated = await prisma.store.update({ where: { id: store.id }, data: parsed.data })
  return NextResponse.json({
    settings: {
      shippingRate: updated.shippingRate,
      freeShippingThreshold: updated.freeShippingThreshold,
    },
  })
}, { requireOwner: true })
