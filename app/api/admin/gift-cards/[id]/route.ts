import { NextResponse } from 'next/server'
import { z } from 'zod'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

const patchSchema = z.object({ status: z.enum(['active', 'disabled']) })

export const PATCH = withStoreAdmin<{ params: { id: string } }>(
  async (req, { store }, { params }) => {
    const body = await req.json().catch(() => null)
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid change' }, { status: 400 })

    const card = await prisma.giftCard.findFirst({ where: { id: params.id, storeId: store.id } })
    if (!card) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Stripe is what actually accepts or refuses the code at checkout, so it has to change too.
    try {
      const codes = await stripe.promotionCodes.list({ code: card.code.replace(/-/g, ''), limit: 1 })
      if (codes.data[0]) {
        await stripe.promotionCodes.update(codes.data[0].id, { active: parsed.data.status === 'active' })
      }
    } catch (err) {
      console.error('[gift-cards] could not update the Stripe code', err)
      return NextResponse.json({ error: 'Could not update the card in Stripe. Nothing was changed.' }, { status: 502 })
    }

    const updated = await prisma.giftCard.update({ where: { id: card.id }, data: { status: parsed.data.status } })
    return NextResponse.json({ giftCard: updated })
  },
  { requireOwner: true }
)
