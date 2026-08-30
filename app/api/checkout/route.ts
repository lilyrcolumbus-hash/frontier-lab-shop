import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import type { CartItem } from '@/types/product'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

export async function POST(req: NextRequest) {
  try {
    const { items, locale }: { items: CartItem[]; locale: string } = await req.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const lang = locale === 'es' ? 'es' : 'en'
    const origin = req.headers.get('origin') ?? 'http://localhost:3000'

    // Never trust price/name from the client cart — look up the canonical record for every
    // line item server-side before creating the Checkout Session (price-tampering fix).
    const lineItems = await Promise.all(
      items.map(async (item) => {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        })

        if (!variant || variant.productId !== item.productId) {
          throw new Error('One of the items in your cart is no longer available.')
        }
        if (!variant.product.inStock) {
          throw new Error(`${variant.product.nameEn} is currently out of stock.`)
        }
        // Guard the quantity too, not just the on/off flag — otherwise a cart holding more
        // units than exist would check out fine and drive stock negative on the webhook.
        if (variant.stock < item.quantity) {
          throw new Error(
            variant.stock > 0
              ? `Only ${variant.stock} left of ${variant.product.nameEn}.`
              : `${variant.product.nameEn} is currently out of stock.`
          )
        }

        return {
          price_data: {
            currency: 'usd',
            unit_amount: variant.price,
            product_data: {
              name: lang === 'es' ? variant.product.nameEs : variant.product.nameEn,
              images: variant.product.images[0] ? [variant.product.images[0]] : [],
              metadata: { productId: variant.productId, variantId: variant.id },
            },
          },
          quantity: item.quantity,
        }
      })
    )

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'MX'] },
      allow_promotion_codes: true,
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 999, currency: 'usd' },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ],
      success_url: `${origin}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/cart`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
