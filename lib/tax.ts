import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const STORE_SLUG = process.env.STORE_SLUG ?? 'frontier-lab'

/**
 * Sales tax at checkout.
 *
 * Stripe applies tax through TaxRate objects attached to line items, so the rates configured in
 * /admin/taxes are mirrored into Stripe on demand and the ids cached in memory for the life of
 * the instance. This is not Stripe Tax (which charges per transaction) — it is the store's own
 * fixed rates, which is what a single-jurisdiction seller actually needs.
 */

const cache = new Map<string, string>()

export async function resolveTaxRateIds(stripe: Stripe): Promise<string[]> {
  try {
    const rates = await prisma.taxRate.findMany({
      where: { enabled: true, store: { slug: STORE_SLUG } },
    })
    if (rates.length === 0) return []

    const ids: string[] = []
    for (const rate of rates) {
      // The key covers everything that defines the rate, so editing a percentage creates a new
      // Stripe TaxRate rather than silently reusing the old one — Stripe's are immutable.
      const key = `${rate.id}:${rate.basisPoints}:${rate.country}:${rate.state ?? ''}:${rate.name}`
      const cached = cache.get(key)
      if (cached) {
        ids.push(cached)
        continue
      }

      const created = await stripe.taxRates.create({
        display_name: rate.name,
        percentage: rate.basisPoints / 100,
        inclusive: false,
        country: rate.country || undefined,
        state: rate.state || undefined,
      })
      cache.set(key, created.id)
      ids.push(created.id)
    }
    return ids
  } catch (err) {
    // A tax lookup must never block a sale; an untaxed order can be corrected, a lost one cannot.
    console.error('[tax] could not resolve rates, checking out without tax', err)
    return []
  }
}
