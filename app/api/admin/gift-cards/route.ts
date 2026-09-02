import { NextResponse } from 'next/server'
import { z } from 'zod'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { generateGiftCardCode } from '@/lib/gift-cards'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

const createSchema = z.object({
  amount: z.coerce.number().int().min(100).max(100000),
  note: z.string().trim().max(200).default(''),
  expiresAt: z.string().trim().optional(),
})

export const GET = withStoreAdmin(async (_req, { store }) => {
  const giftCards = await prisma.giftCard.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ giftCards })
})

export const POST = withStoreAdmin(
  async (req, { store }) => {
    const body = await req.json().catch(() => null)
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid gift card', details: parsed.error.flatten() }, { status: 400 })
    }

    const { amount, note, expiresAt } = parsed.data
    const code = generateGiftCardCode()

    // The card is redeemed at checkout, where the only thing that can reduce a total is a Stripe
    // promotion code — so each card is backed by a fixed-amount coupon carrying the same code.
    // Stripe then enforces single use, and the row here records the balance for the owner.
    let stripeFailed: string | null = null
    try {
      const coupon = await stripe.coupons.create({
        amount_off: amount,
        currency: store.currency || 'usd',
        duration: 'once',
        name: `Gift card ${code}`,
      })
      await stripe.promotionCodes.create({
        coupon: coupon.id,
        code: code.replace(/-/g, ''),
        max_redemptions: 1,
        ...(expiresAt ? { expires_at: Math.floor(new Date(expiresAt).getTime() / 1000) } : {}),
      })
    } catch (err) {
      stripeFailed = err instanceof Error ? err.message : 'Stripe rejected the gift card'
    }

    if (stripeFailed) {
      // Nothing is stored when Stripe refused: a card that cannot be redeemed is worse than none.
      return NextResponse.json({ error: `Could not create the gift card — ${stripeFailed}` }, { status: 502 })
    }

    const giftCard = await prisma.giftCard.create({
      data: {
        storeId: store.id,
        code,
        initialAmount: amount,
        balance: amount,
        note,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })

    return NextResponse.json({ giftCard })
  },
  { requireOwner: true }
)
