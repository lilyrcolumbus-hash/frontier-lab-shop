/**
 * One-time migration: hardcoded catalog (lib/species-data.ts, lib/shop-list-data.ts,
 * lib/shop-detail-data.ts) → the real Product/Species Prisma tables. Run once via:
 *   npx tsx --env-file=.env.local prisma/migrate-catalog.ts
 * Safe to re-run — it deletes existing Product/Species rows first (there's no real order/
 * wishlist data referencing them yet, confirmed before writing this).
 */
import { prisma } from '../lib/prisma'
import { SPECIES_LIST } from '../lib/species-data'
import { PRODUCTS as LIST_PRODUCTS } from '../lib/shop-list-data'
import {
  PRODUCTS as EQ_PRODUCTS,
  LC_PRODUCTS,
  GRAIN_PRODUCTS,
  FRUITING_PRODUCTS,
  BULK_PRODUCTS,
} from '../lib/shop-detail-data'
import type { Product } from '../types/product'

async function main() {
  // Historical script — already ran once (Session 27). Kept compiling (storeId threaded
  // through) rather than deleted, but do not re-run: it deletes existing Product/Species rows
  // first, which would also wipe the Collection links and storeId backfill already in place.
  const store = await prisma.store.upsert({
    where: { slug: 'frontier-lab' },
    update: {},
    create: { slug: 'frontier-lab', name: 'Frontier Lab' },
  })

  // Merge the 5 detail-page records (richer content) as the canonical source, keyed by slug.
  const detailBySlug = new Map<string, Product>()
  for (const map of [EQ_PRODUCTS, LC_PRODUCTS, GRAIN_PRODUCTS, FRUITING_PRODUCTS, BULK_PRODUCTS]) {
    for (const [slug, product] of Object.entries(map)) detailBySlug.set(slug, product)
  }

  // Sanity check: every slug in the list page should exist in the detail merge.
  const missing = LIST_PRODUCTS.filter((p) => !detailBySlug.has(p.slug)).map((p) => p.slug)
  if (missing.length) {
    throw new Error(`Products present in shop list but missing from shop detail: ${missing.join(', ')}`)
  }

  console.log(`Migrating ${SPECIES_LIST.length} species and ${LIST_PRODUCTS.length} products...`)

  // Clear existing (stale seed) rows. Products first — Species has no onDelete cascade from Product.
  await prisma.wishlistItem.deleteMany({})
  await prisma.productVariant.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.species.deleteMany({})

  const slugToSpeciesId = new Map<string, string>()

  for (const s of SPECIES_LIST) {
    const created = await prisma.species.create({
      data: {
        storeId: store.id,
        slug: s.slug,
        commonName: s.commonName,
        scientificName: s.scientificName,
        family: s.family,
        order: s.order,
        type: s.type,
        difficulty: s.difficulty,
        substrate: s.substrate,
        colonizationWeeksMin: s.colonizationWeeks.min,
        colonizationWeeksMax: s.colonizationWeeks.max,
        fruitingTempFMin: s.fruitingTempF.min,
        fruitingTempFMax: s.fruitingTempF.max,
        fruitingTempCMin: s.fruitingTempC.min,
        fruitingTempCMax: s.fruitingTempC.max,
        expectedFlushes: s.expectedFlushes,
        biologicalEfficiency: s.biologicalEfficiency,
        betaGlucanContent: s.betaGlucanContent,
        indoorOutdoor: s.indoorOutdoor,
        descriptionEn: s.description.en,
        descriptionEs: s.description.es,
        cultivationNotesEn: s.cultivationNotes.en,
        cultivationNotesEs: s.cultivationNotes.es,
        medicalNotesEn: s.medicalNotes.en,
        medicalNotesEs: s.medicalNotes.es,
        cookingNotesEn: s.cookingNotes.en,
        cookingNotesEs: s.cookingNotes.es,
        lookalikes: s.lookalikes,
        imageUrl: s.imageUrl,
        thumbnailUrl: s.thumbnailUrl,
        openartPrompt: s.openartPrompt ?? null,
        keyBenefits: s.keyBenefits as object[],
      },
    })
    slugToSpeciesId.set(s.slug, created.id)
  }

  for (const p of LIST_PRODUCTS) {
    const detail = detailBySlug.get(p.slug)!
    // relatedProducts drift found between list/detail during exploration — prefer whichever
    // is longer (more complete), rather than silently picking one and losing links.
    const relatedProducts =
      detail.relatedProducts.length >= p.relatedProducts.length ? detail.relatedProducts : p.relatedProducts

    await prisma.product.create({
      data: {
        storeId: store.id,
        slug: p.slug,
        nameEn: p.name.en,
        nameEs: p.name.es,
        descriptionEn: detail.description.en,
        descriptionEs: detail.description.es,
        category: p.category,
        subcategory: p.subcategory,
        speciesId: p.species ? (slugToSpeciesId.get(p.species) ?? null) : null,
        scientificName: p.scientificName ?? null,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        images: detail.images.length ? detail.images : p.images,
        isOrganic: p.isOrganic,
        inStock: p.inStock,
        tags: p.tags,
        relatedProducts,
        specsDifficulty: detail.cultivationSpecs?.difficulty ?? null,
        specsColonizationTime: detail.cultivationSpecs?.colonizationTime ?? null,
        specsFruitingTempF: detail.cultivationSpecs?.fruitingTempF ?? null,
        specsFruitingTempC: detail.cultivationSpecs?.fruitingTempC ?? null,
        specsIdealSubstrate: detail.cultivationSpecs?.idealSubstrate ?? null,
        specsExpectedYield: detail.cultivationSpecs?.expectedYield ?? null,
        specsIndoorOutdoor: detail.cultivationSpecs?.indoorOutdoor ?? null,
        howToUseSteps: detail.howToUseSteps ?? undefined,
        faqs: detail.faqs ?? undefined,
        scienceContent: detail.scienceContent ?? undefined,
        keyBenefits: detail.keyBenefits ?? undefined,
        grainBagSpecs: detail.grainBagSpecs ?? undefined,
        variants: {
          create: detail.variants.map((v) => ({
            storeId: store.id,
            name: v.name,
            price: v.price,
            // The old Prisma column can't hold "not tracked"; that only exists in FL Admin.
            stock: v.stock ?? 0,
            sku: v.sku,
          })),
        },
      },
    })
  }

  const speciesCount = await prisma.species.count()
  const productCount = await prisma.product.count()
  const variantCount = await prisma.productVariant.count()
  console.log(`Done. species=${speciesCount} products=${productCount} variants=${variantCount}`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
