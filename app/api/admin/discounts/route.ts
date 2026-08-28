import { NextResponse } from 'next/server'
import { z } from 'zod'
import { stripe } from '@/lib/stripe'
import { withStoreAdmin } from '@/lib/with-store-admin'

// Discounts live entirely in Stripe (no local model) — checkout already honors promotion codes
// via `allow_promotion_codes: true`, and Stripe is the only system that actually redeems them,
// so a local mirror would just be a second source of truth that can drift. Not store-scoped:
// today there's one shared Stripe account: a future per-store account needs Stripe Connect,
// deliberately out of scope here (see the multi-tenant plan).

const createDiscountSchema = z
  .object({
    code: z.string().trim().min(3).max(40).regex(/^[A-Z0-9_-]+$/i, 'Letters, numbers, - and _ only'),
    percentOff: z.coerce.number().min(1).max(100).optional(),
    amountOff: z.coerce.number().int().min(1).optional(),
    maxRedemptions: z.coerce.number().int().min(1).optional(),
    expiresAt: z.string().trim().optional(),
  })
  .refine((d) => d.percentOff || d.amountOff, { message: 'Set either a percent or a fixed amount off' })

export const GET = withStoreAdmin(async () => {
  const promotionCodes = await stripe.promotionCodes.list({ limit: 100, expand: ['data.coupon'] })

  const discounts = promotionCodes.data.map((pc) => {
    const coupon = pc.coupon
    return {
      id: pc.id,
      code: pc.code,
      active: pc.active,
      percentOff: coupon.percent_off,
      amountOff: coupon.amount_off,
      currency: coupon.currency,
      timesRedeemed: pc.times_redeemed,
      maxRedemptions: pc.max_redemptions,
      expiresAt: pc.expires_at ? new Date(pc.expires_at * 1000).toISOString() : null,
    }
  })

  return NextResponse.json({ discounts })
})

export const POST = withStoreAdmin(async (req) => {
  const body = await req.json().catch(() => null)
  const parsed = createDiscountSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid discount', details: parsed.error.flatten() }, { status: 400 })
  }

  const { code, percentOff, amountOff, maxRedemptions, expiresAt } = parsed.data

  const coupon = await stripe.coupons.create({
    percent_off: percentOff,
    amount_off: amountOff,
    currency: amountOff ? 'usd' : undefined,
    duration: 'forever',
  })

  try {
    const promotionCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: code.toUpperCase(),
      max_redemptions: maxRedemptions,
      expires_at: expiresAt ? Math.floor(new Date(expiresAt).getTime() / 1000) : undefined,
    })
    return NextResponse.json({ discount: { id: promotionCode.id, code: promotionCode.code } })
  } catch (err) {
    // Roll back the orphaned coupon if the promotion code failed (e.g. duplicate code).
    await stripe.coupons.del(coupon.id).catch(() => {})
    const message = err instanceof Error ? err.message : 'Could not create the discount code'
    return NextResponse.json({ error: message }, { status: 400 })
  }
})
