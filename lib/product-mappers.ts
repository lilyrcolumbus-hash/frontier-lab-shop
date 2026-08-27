import type { Product as PrismaProduct, ProductVariant as PrismaVariant, Species as PrismaSpecies } from '@prisma/client'
import type { Product, CultivationSpecs } from '@/types/product'

type ProductWithVariants = PrismaProduct & { variants: PrismaVariant[]; species?: PrismaSpecies | null }

export function toProduct(row: ProductWithVariants): Product {
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
    category: row.category as Product['category'],
    subcategory: row.subcategory,
    species: row.species?.slug,
    scientificName: row.scientificName ?? undefined,
    price: row.price,
    compareAtPrice: row.compareAtPrice ?? undefined,
    variants: row.variants.map((v) => ({ id: v.id, name: v.name, price: v.price, stock: v.stock, sku: v.sku })),
    images: row.images,
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
  }
}
