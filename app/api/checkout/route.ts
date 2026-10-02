import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { getCurrentStore } from '@/lib/current-store'
import { resolveShippingRates, cartWeightGrams } from '@/lib/shipping'
import { resolveTaxRateIds } from '@/lib/tax'
import type { CartItem } from '@/types/product'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

// Portfolio demo mode: this site is shown as a code sample, not a live store, while the real
// domain is being sorted out. Checkout is disabled server-side (not just hidden in the UI) so
// no request — scripted or otherwise — can reach the real, live-mode Stripe account. Flip this
// off only once the site is actually reopened for real customers.
const PORTFOLIO_DEMO_MODE = true

export async function POST(req: NextRequest) {
  if (PORTFOLIO_DEMO_MODE) {
    return NextResponse.json(
      { error: 'This is a portfolio demo project — checkout is disabled.' },
      { status: 403 }
    )
  }
  try {
    const { items, locale }: { items: CartItem[]; locale: string } = await req.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const lang = locale === 'es' ? 'es' : 'en'
    const origin = req.headers.get('origin') ?? 'http://localhost:3000'

    // Read before the line items are built: they are priced in the store's currency and carry
    // its tax rates.
    const store = await getCurrentStore()
    const storeCurrency = store.currency || 'usd'
    const taxRateIds = await resolveTaxRateIds(stripe)

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
            currency: storeCurrency,
            unit_amount: variant.price,
            product_data: {
              name: lang === 'es' ? variant.product.nameEs : variant.product.nameEn,
              images: variant.product.images[0] ? [variant.product.images[0]] : [],
              metadata: { productId: variant.productId, variantId: variant.id },
            },
          },
          quantity: item.quantity,
          // Empty unless the store configured rates, in which case Stripe adds the tax itself.
          ...(taxRateIds.length ? { tax_rates: taxRateIds } : {}),
        }
      })
    )

    // Shipping comes from the store's own settings, and the subtotal is the one just computed
    // from canonical prices — never the cart's. A discount code cannot reach the shipping rate
    // (Stripe discounts the subtotal only), so a free-shipping offer has to be decided here.
    const subtotal = lineItems.reduce((sum, line) => sum + line.price_data.unit_amount * line.quantity, 0)

    const countries = ['US', 'CA', 'MX']
    const weightGrams = await cartWeightGrams(
      items.map((i) => ({ variantId: i.variantId, quantity: i.quantity, price: 0 }))
    )
    const zonedRates = await resolveShippingRates({ countries, subtotal, weightGrams })

    // Zones win when the store has defined them; otherwise the flat rate and threshold apply.
    const shipsFree = store.freeShippingThreshold > 0 && subtotal >= store.freeShippingThreshold
    const flatRate = {
      name: shipsFree ? 'Free Shipping' : 'Standard Shipping',
      amount: shipsFree ? 0 : store.shippingRate,
      minDays: 3,
      maxDays: 5,
    }
    const rates = zonedRates && !shipsFree ? zonedRates : [flatRate]


    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'MX'] },
      allow_promotion_codes: true,
      shipping_options: rates.map((rate) => ({
        shipping_rate_data: {
          type: 'fixed_amount' as const,
          fixed_amount: { amount: rate.amount, currency: storeCurrency },
          display_name: rate.name,
          delivery_estimate: {
            minimum: { unit: 'business_day' as const, value: rate.minDays },
            maximum: { unit: 'business_day' as const, value: rate.maxDays },
          },
        },
      })),
      success_url: `${origin}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/cart`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
