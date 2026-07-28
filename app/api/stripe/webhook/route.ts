import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature'
    console.error('Stripe webhook signature verification failed:', message)
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  try {
    await recordOrder(session)
  } catch (err) {
    console.error('Failed to record order for session', session.id, err)
    return NextResponse.json({ error: 'Failed to record order' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function recordOrder(session: Stripe.Checkout.Session) {
  const paymentIntentId =
    typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id

  const existing = paymentIntentId
    ? await prisma.order.findFirst({ where: { stripePaymentIntentId: paymentIntentId } })
    : null
  if (existing) return // already recorded (webhook retry)

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ['data.price.product'],
    limit: 100,
  })

  const shipping = session.shipping_details ?? session.customer_details
  const address = shipping?.address

  await prisma.order.create({
    data: {
      email: session.customer_details?.email ?? 'unknown@frontierlab.com',
      status: 'paid',
      subtotal: session.amount_subtotal ?? 0,
      shipping: session.total_details?.amount_shipping ?? 0,
      tax: session.total_details?.amount_tax ?? 0,
      total: session.amount_total ?? 0,
      stripePaymentIntentId: paymentIntentId,
      shippingName: shipping?.name ?? '',
      shippingLine1: address?.line1 ?? '',
      shippingLine2: address?.line2 ?? undefined,
      shippingCity: address?.city ?? '',
      shippingState: address?.state ?? '',
      shippingPostalCode: address?.postal_code ?? '',
      shippingCountry: address?.country ?? '',
      items: {
        create: lineItems.data.map((item) => {
          const product = item.price?.product as Stripe.Product | undefined
          const metadata = product?.metadata ?? {}
          return {
            productId: metadata.productId ?? 'unknown',
            variantId: metadata.variantId ?? 'unknown',
            name: item.description ?? product?.name ?? 'Unknown item',
            price: item.price?.unit_amount ?? 0,
            quantity: item.quantity ?? 1,
            image: product?.images?.[0] ?? '',
          }
        }),
      },
    },
  })
}
