import { NextResponse } from 'next/server'
import { z } from 'zod'
import { stripe } from '@/lib/stripe'
import { withStoreAdmin } from '@/lib/with-store-admin'

const updateDiscountSchema = z.object({ active: z.boolean() })

export const PATCH = withStoreAdmin<{ params: { id: string } }>(async (req, _admin, { params }) => {
  const body = await req.json().catch(() => null)
  const parsed = updateDiscountSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid update' }, { status: 400 })
  }

  const promotionCode = await stripe.promotionCodes.update(params.id, { active: parsed.data.active })
  return NextResponse.json({ discount: { id: promotionCode.id, active: promotionCode.active } })
}, { requireOwner: true })
