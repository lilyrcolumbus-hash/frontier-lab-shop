import { prisma } from '@/lib/prisma'

// The storefront (checkout, reviews, newsletter, grow journal) isn't multi-tenant-routed yet —
// today there's exactly one live storefront (Frontier Lab), selected by STORE_SLUG. Admin
// routes resolve their store from the signed-in user instead (see lib/require-store-admin.ts);
// this helper is only for customer-facing writes that have no admin session to read a store from.
const STORE_SLUG = process.env.STORE_SLUG ?? 'frontier-lab'

let cachedStoreId: string | null = null

export async function getCurrentStoreId(): Promise<string> {
  if (cachedStoreId) return cachedStoreId
  const store = await prisma.store.findUniqueOrThrow({ where: { slug: STORE_SLUG } })
  cachedStoreId = store.id
  return store.id
}

/**
 * The full store record, for settings the storefront needs at request time (shipping rate,
 * free-shipping threshold). Not cached like the id: these values are edited from /admin and a
 * stale copy would quietly charge the wrong shipping.
 */
export async function getCurrentStore() {
  return prisma.store.findUniqueOrThrow({ where: { slug: STORE_SLUG } })
}
