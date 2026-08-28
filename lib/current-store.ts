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
