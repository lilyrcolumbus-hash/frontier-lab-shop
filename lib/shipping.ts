import { prisma } from '@/lib/prisma'

const STORE_SLUG = process.env.STORE_SLUG ?? 'frontier-lab'

export interface CartLine {
  variantId: string
  quantity: number
  price: number
}

export interface ResolvedRate {
  name: string
  amount: number
  minDays: number
  maxDays: number
}

/**
 * Works out which rates apply to an order.
 *
 * A rate belongs to a zone (a set of countries) and may be bounded by subtotal and weight, which
 * is how "free over $75" and "heavy parcel" pricing are expressed. When a store has defined no
 * zones at all, the flat rate in Settings is used, so nothing breaks the day zones are added.
 */
export async function resolveShippingRates(input: {
  countries: string[]
  subtotal: number
  weightGrams: number
}): Promise<ResolvedRate[] | null> {
  try {
    const zones = await prisma.shippingZone.findMany({
      where: { store: { slug: STORE_SLUG } },
      include: { rates: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    })
    if (zones.length === 0) return null

    // Stripe collects the address after the session is created, so every country the store
    // ships to is considered and the shopper picks from what applies.
    const applicable = zones.filter((zone) => zone.countries.some((c) => input.countries.includes(c)))
    const rates = applicable.flatMap((zone) => zone.rates)

    const matching = rates.filter((rate) => {
      if (rate.minSubtotal !== null && input.subtotal < rate.minSubtotal) return false
      if (rate.maxSubtotal !== null && input.subtotal >= rate.maxSubtotal) return false
      if (rate.minWeightGrams !== null && input.weightGrams < rate.minWeightGrams) return false
      if (rate.maxWeightGrams !== null && input.weightGrams >= rate.maxWeightGrams) return false
      return true
    })

    if (matching.length === 0) return null

    return matching.map((rate) => ({
      name: rate.name,
      amount: rate.amount,
      minDays: rate.minDays,
      maxDays: rate.maxDays,
    }))
  } catch (err) {
    // Falling back to the flat rate is far better than a checkout that cannot be completed.
    console.error('[shipping] could not resolve zones, using the flat rate', err)
    return null
  }
}

/** Total shipping weight of a cart, from the weight recorded on each variant. */
export async function cartWeightGrams(lines: CartLine[]): Promise<number> {
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: lines.map((l) => l.variantId) } },
    select: { id: true, weightGrams: true },
  })
  const byId = new Map(variants.map((v) => [v.id, v.weightGrams ?? 0]))
  return lines.reduce((sum, line) => sum + (byId.get(line.variantId) ?? 0) * line.quantity, 0)
}
