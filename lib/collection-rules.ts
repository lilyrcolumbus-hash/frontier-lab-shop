import { prisma } from '@/lib/prisma'

export const RULE_FIELDS = ['category', 'subcategory', 'tag'] as const
export type RuleField = (typeof RULE_FIELDS)[number]

/**
 * Rebuilds an automatic collection's membership from its rule.
 *
 * `set` rather than `connect`: the rule is the definition of the collection, so a product that
 * no longer matches has to leave. A manual collection (no rule) is never touched.
 */
export async function syncAutomaticCollection(collectionId: string): Promise<number> {
  const collection = await prisma.collection.findUnique({ where: { id: collectionId } })
  if (!collection?.ruleField || !collection.ruleValue) return 0

  const value = collection.ruleValue
  const where =
    collection.ruleField === 'tag'
      ? { storeId: collection.storeId, tags: { has: value } }
      : collection.ruleField === 'subcategory'
        ? { storeId: collection.storeId, subcategory: value }
        : { storeId: collection.storeId, category: value }

  const matching = await prisma.product.findMany({ where, select: { id: true } })
  await prisma.collection.update({
    where: { id: collection.id },
    data: { products: { set: matching.map((p) => ({ id: p.id })) } },
  })
  return matching.length
}

/** Re-runs every automatic collection in a store — called after a product's fields change. */
export async function syncAutomaticCollectionsForStore(storeId: string): Promise<void> {
  const automatic = await prisma.collection.findMany({
    where: { storeId, NOT: { ruleField: null } },
    select: { id: true },
  })
  for (const collection of automatic) {
    await syncAutomaticCollection(collection.id)
  }
}
