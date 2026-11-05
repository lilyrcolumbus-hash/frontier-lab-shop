import type { Product as PrismaProduct, ProductVariant as PrismaVariant, Species as PrismaSpecies, ShopCategory as PrismaShopCategory } from '@prisma/client'
import type { Product, CultivationSpecs } from '@/types/product'
import { legacyBlocks } from '@/lib/shop-categories'

type ProductWithVariants = PrismaProduct & {
  variants: PrismaVariant[]
  species?: PrismaSpecies | null
  shopCategory?: PrismaShopCategory | null
  shopSubcategory?: PrismaShopCategory | null
}

/** The old `spawn` category is Culture Bank now; any other old text is already the slug. */
const LEGACY_CATEGORY_SLUG: Record<string, string> = { spawn: 'culture-bank' }

export function toProduct(row: ProductWithVariants): Product {
  const cat = row.shopCategory ?? null
  const sub = row.shopSubcategory ?? null
  const categorySlug = cat?.slug ?? LEGACY_CATEGORY_SLUG[row.category] ?? row.category
  // Linked to the tree: the subcategory's own switch wins, then its category's, otherwise off.
  // Not linked yet: the old rules, decided by the category text, so nothing changes for the product.
  const blocks = cat
    ? {
        packetContents: sub?.showPacketContents ?? cat.showPacketContents ?? false,
        viabilityGuarantee: sub?.showViabilityGuarantee ?? cat.showViabilityGuarantee ?? false,
        freshness: sub?.showFreshnessBlock ?? cat.showFreshnessBlock ?? false,
      }
    : legacyBlocks(categorySlug, row.subcategory)

  const hasSpecs = Boolean(
    row.specsDifficulty ||
      row.specsColonizationTime ||
      row.specsFruitingTempF ||
      row.specsFruitingTempC ||
      row.specsIdealSubstrate ||
      row.specsExpectedYield ||
      row.specsIndoorOutdoor
  )

  const cultivationSpecs: CultivationSpecs | undefined = hasSpecs
    ? {
        difficulty: (row.specsDifficulty ?? 'beginner') as CultivationSpecs['difficulty'],
        colonizationTime: row.specsColonizationTime ?? '',
        fruitingTempF: row.specsFruitingTempF ?? '',
        fruitingTempC: row.specsFruitingTempC ?? '',
        idealSubstrate: row.specsIdealSubstrate ?? '',
        expectedYield: row.specsExpectedYield ?? '',
        indoorOutdoor: (row.specsIndoorOutdoor ?? 'indoor') as CultivationSpecs['indoorOutdoor'],
      }
    : undefined

  return {
    id: row.id,
    slug: row.slug,
    name: { en: row.nameEn, es: row.nameEs },
    description: { en: row.descriptionEn, es: row.descriptionEs },
    category: categorySlug,
    subcategory: sub?.nameEn ?? row.subcategory,
    subcategorySlug: sub?.slug,
    categoryName: cat ? { en: cat.nameEn, es: cat.nameEs } : undefined,
    subcategoryName: sub ? { en: sub.nameEn, es: sub.nameEs } : undefined,
    blocks,
    species: row.species?.slug,
    scientificName: row.scientificName ?? undefined,
    price: row.price,
    compareAtPrice: row.compareAtPrice ?? undefined,
    variants: row.variants.map((v) => ({ id: v.id, name: v.name, price: v.price, stock: v.stock, sku: v.sku })),
    images: row.images,
    imageAlts: row.imageAlts,
    cultivationSpecs,
    isOrganic: row.isOrganic,
    inStock: row.inStock,
    tags: row.tags,
    relatedProducts: row.relatedProducts,
    howToUseSteps: (row.howToUseSteps as unknown as string[]) ?? undefined,
    faqs: (row.faqs as unknown as Product['faqs']) ?? undefined,
    scienceContent: (row.scienceContent as unknown as Product['scienceContent']) ?? undefined,
    keyBenefits: (row.keyBenefits as unknown as Product['keyBenefits']) ?? undefined,
    grainBagSpecs: (row.grainBagSpecs as unknown as Product['grainBagSpecs']) ?? undefined,
    guide: (row.guide as unknown as Product['guide']) ?? undefined,
  }
}
