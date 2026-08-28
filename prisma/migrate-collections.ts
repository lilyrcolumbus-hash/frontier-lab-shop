/**
 * One-time backfill (Session 27, Phase 2): mark all existing products as published, and
 * create real Collection rows matching the shop's existing filter pills, linking each
 * product to the collection its current category/subcategory implies. Re-runnable —
 * uses upserts and only ever adds product links, never removes.
 */
import { prisma } from '../lib/prisma'

const COLLECTIONS = [
  { slug: 'culture-bank', titleEn: 'Culture Bank', titleEs: 'Banco de Cultivo' },
  { slug: 'substrate', titleEn: 'Substrate', titleEs: 'Sustrato' },
  { slug: 'kit', titleEn: 'Grow Kits', titleEs: 'Kits de Cultivo' },
  { slug: 'equipment', titleEn: 'Equipment', titleEs: 'Equipo' },
  { slug: 'wellness', titleEn: 'Wellness', titleEs: 'Bienestar' },
]

function collectionSlugFor(category: string, subcategory: string): string | null {
  if (subcategory === 'Liquid Culture') return 'culture-bank'
  if (category === 'substrate') return 'substrate'
  if (category === 'kit') return 'kit'
  if (category === 'equipment') return 'equipment'
  if (category === 'wellness') return 'wellness'
  return null
}

async function main() {
  const store = await prisma.store.upsert({
    where: { slug: 'frontier-lab' },
    update: {},
    create: { slug: 'frontier-lab', name: 'Frontier Lab' },
  })

  const before = await prisma.product.count({ where: { status: 'active' } })
  const totalBefore = await prisma.product.count()

  // 1. Publish everything that already exists — nothing currently live should go dark.
  const activated = await prisma.product.updateMany({ data: { status: 'active' } })
  console.log(`Activated ${activated.count} products (was ${before}/${totalBefore} active before)`)

  // 2. Create the 5 collections (idempotent).
  const slugToId = new Map<string, string>()
  for (const c of COLLECTIONS) {
    const row = await prisma.collection.upsert({
      where: { slug: c.slug },
      update: { titleEn: c.titleEn, titleEs: c.titleEs },
      create: { ...c, storeId: store.id },
    })
    slugToId.set(c.slug, row.id)
  }

  // 3. Link every product to the collection its category/subcategory implies.
  const products = await prisma.product.findMany({ select: { id: true, category: true, subcategory: true } })
  let linked = 0
  let unmatched = 0
  for (const p of products) {
    const slug = collectionSlugFor(p.category, p.subcategory)
    if (!slug) {
      unmatched++
      console.warn(`No collection match for product ${p.id} (${p.category} / ${p.subcategory})`)
      continue
    }
    const collectionId = slugToId.get(slug)!
    await prisma.product.update({
      where: { id: p.id },
      data: { collections: { connect: { id: collectionId } } },
    })
    linked++
  }

  console.log(`Linked ${linked} products to collections, ${unmatched} unmatched`)

  const afterActive = await prisma.product.count({ where: { status: 'active' } })
  const collectionCounts = await Promise.all(
    COLLECTIONS.map(async (c) => ({
      slug: c.slug,
      count: await prisma.collection.findUnique({ where: { slug: c.slug }, include: { _count: { select: { products: true } } } }).then((r) => r?._count.products ?? 0),
    }))
  )
  console.log(`After: ${afterActive} active products.`, collectionCounts)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
