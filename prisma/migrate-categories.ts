/**
 * One-time (and re-runnable) backfill for the editable category tree (see lib/shop-categories.ts):
 * creates the categories and subcategories the shop already had, then links every product to the
 * one its current category/subcategory text implies. Never deletes anything and never renames an
 * existing category: re-running only adds what is missing.
 *
 *   npx tsx prisma/migrate-categories.ts            # dry run: prints what it WOULD do, writes nothing
 *   npx tsx prisma/migrate-categories.ts --apply    # writes
 *
 * The database is whichever DATABASE_URL is in the environment, so for the demo site load
 * .env.demo first (set -a; source .env.demo; set +a).
 */
import { prisma } from '../lib/prisma'
import { LEGACY_TREE, slugFromName } from '../lib/shop-categories'

const APPLY = process.argv.includes('--apply')

/** The old category text -> the slug of the category that replaces it. `spawn` became Culture Bank. */
const LEGACY_CATEGORY_TO_SLUG: Record<string, string> = {
  spawn: 'culture-bank',
  substrate: 'substrate',
  kit: 'kit',
  equipment: 'equipment',
  wellness: 'wellness',
  bundle: 'bundle',
}

async function main() {
  console.log(APPLY ? 'APPLYING changes.' : 'DRY RUN: nothing will be written. Pass --apply to write.')
  const store = await prisma.store.findUniqueOrThrow({ where: { slug: process.env.STORE_SLUG ?? 'frontier-lab' } })

  // 1. The tree
  const idBySlug = new Map<string, string>()          // top-level slug -> id
  const subIdBy = new Map<string, string>()           // `${topSlug}/${subSlug}` -> id
  let created = 0
  for (const top of LEGACY_TREE) {
    let row = await prisma.shopCategory.findFirst({ where: { storeId: store.id, parentId: null, slug: top.slug } })
    if (!row) {
      created++
      console.log(`  + category ${top.slug}`)
      if (APPLY) {
        row = await prisma.shopCategory.create({
          data: {
            storeId: store.id, slug: top.slug, nameEn: top.name.en, nameEs: top.name.es,
            descriptionEn: top.description.en, descriptionEs: top.description.es, sortOrder: top.sortOrder, showInMenu: true,
            showPacketContents: top.blocks.packetContents, showViabilityGuarantee: top.blocks.viabilityGuarantee, showFreshnessBlock: top.blocks.freshness,
          },
        })
      }
    }
    // In a dry run nothing was created, so a placeholder id stands in and the linking below can be simulated.
    idBySlug.set(top.slug, row ? row.id : `dry:${top.slug}`)
    for (const sub of top.children) {
      let subRow = row ? await prisma.shopCategory.findFirst({ where: { storeId: store.id, parentId: row.id, slug: sub.slug } }) : null
      if (!subRow) {
        created++
        console.log(`  + subcategory ${top.slug}/${sub.slug}`)
        if (APPLY && row) {
          subRow = await prisma.shopCategory.create({
            data: {
              storeId: store.id, parentId: row.id, slug: sub.slug, nameEn: sub.name.en, nameEs: sub.name.es, sortOrder: sub.sortOrder,
              showInMenu: false,
              showPacketContents: sub.blocks.packetContents, showViabilityGuarantee: sub.blocks.viabilityGuarantee, showFreshnessBlock: sub.blocks.freshness,
            },
          })
        }
      }
      subIdBy.set(`${top.slug}/${sub.slug}`, subRow ? subRow.id : `dry:${top.slug}/${sub.slug}`)
    }
  }
  console.log(`${created} categories ${APPLY ? 'created' : 'to create'}.`)

  // 2. Link products
  const products = await prisma.product.findMany({ select: { id: true, slug: true, category: true, subcategory: true, categoryId: true, subcategoryId: true } })
  let linked = 0, already = 0, unmatched = 0
  for (const p of products) {
    if (p.categoryId && p.subcategoryId) { already++; continue }
    const topSlug = LEGACY_CATEGORY_TO_SLUG[p.category]
    const topId = topSlug ? idBySlug.get(topSlug) : undefined
    if (!topSlug || !topId) {
      unmatched++
      console.warn(`  ! no category for product ${p.slug} (${p.category} / ${p.subcategory})`)
      continue
    }
    const subSlug = slugFromName(p.subcategory)
    let subId = subIdBy.get(`${topSlug}/${subSlug}`)
    if (!subId && !APPLY) console.log(`  + subcategory ${topSlug}/${subSlug} (would be created from product ${p.slug})`)
    if (!subId && APPLY) {                          // a subcategory text nobody had a row for: create it, off the menu
      const row = await prisma.shopCategory.create({
        data: { storeId: store.id, parentId: topId, slug: subSlug, nameEn: p.subcategory, nameEs: p.subcategory, sortOrder: 99, showInMenu: false },
      })
      subId = row.id; subIdBy.set(`${topSlug}/${subSlug}`, subId)
      console.log(`  + subcategory ${topSlug}/${subSlug} (from product ${p.slug})`)
    }
    linked++
    console.log(`  ~ ${p.slug}: ${p.category}/${p.subcategory} -> ${topSlug}/${subSlug}`)
    if (APPLY) {
      // Only the links are added. The old `category` text is left alone on purpose: the storefront that is live
      // while this runs still reads it (`spawn` shows the freshness block). It is brought in line the next time
      // the product is saved, and until then `spawn` is understood as Culture Bank (lib/category-links.ts).
      await prisma.product.update({ where: { id: p.id }, data: { categoryId: topId, subcategoryId: subId ?? null } })
    }
  }
  console.log(`Products: ${linked} ${APPLY ? 'linked' : 'to link'}, ${already} already linked, ${unmatched} without a match (left untouched).`)
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
