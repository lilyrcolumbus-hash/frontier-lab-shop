// Pure conversions from FL Admin's rows to the shapes the storefront's components already
// expect. No I/O and no framework imports (types only), so scripts/check-fl-mappers.ts can
// run them under plain node against worked examples.
import type { Product, CultivationSpecs } from '@/types/product'
import type { SpeciesData, SpeciesBenefit } from '@/lib/species-data'

type Bilingual = { en?: string; es?: string }
/** Spanish falls back to English when it is empty, so a page is never blank in one language. */
const both = (value: Bilingual | null | undefined): Record<'en' | 'es', string> => ({
  en: value?.en ?? '',
  es: value?.es?.trim() ? value.es : (value?.en ?? ''),
})

/** 17.99 → 1799. The admin stores dollars; the storefront's price maths is in cents. */
export const toCents = (dollars: number | string): number => Math.round(Number(dollars) * 100)

export interface FlProductDetails {
  how_to_use_steps?: string[]
  key_benefits?: Product['keyBenefits']
  faqs?: Product['faqs']
  science_content?: Product['scienceContent']
  grain_bag_specs?: Product['grainBagSpecs']
  cultivation_specs?: CultivationSpecs
  image_alts?: string[]
  variant_name?: string
}

export interface FlProductRow {
  slug: string
  category: string
  subcategory: string | null
  species_slug: string | null
  scientific_name: string | null
  name: Bilingual
  description: Bilingual
  price: number | string
  compare_at_price: number | string | null
  sku: string | null
  is_organic: boolean
  tags: string[] | null
  related_products: string[] | null
  seo: { title?: Bilingual; description?: Bilingual } | null
  photos: string[] | null
  /** null = not tracked, always sells; a number is a real count and 0 is sold out. */
  stock: number | null
  details: FlProductDetails | null
}

/**
 * One row is one purchasable thing, so the product has exactly one variant whose id is the
 * slug. (Every product in the catalogue has one variant today; a product with several
 * would be several rows sharing a `variant_group`, which the storefront doesn't read yet.)
 */
export function toProduct(row: FlProductRow, photo: (entry: string) => string): Product {
  const details = row.details ?? {}
  const price = toCents(row.price)
  const tracked = row.stock !== null
  return {
    id: row.slug,
    slug: row.slug,
    name: both(row.name),
    description: both(row.description),
    category: row.category as Product['category'],
    subcategory: row.subcategory ?? '',
    species: row.species_slug ?? undefined,
    scientificName: row.scientific_name ?? undefined,
    price,
    compareAtPrice: row.compare_at_price === null ? undefined : toCents(row.compare_at_price),
    variants: [
      { id: row.slug, name: details.variant_name ?? 'Default', price, stock: tracked ? row.stock! : null, sku: row.sku ?? '' },
    ],
    images: (row.photos ?? []).map(photo),
    imageAlts: details.image_alts ?? [],
    cultivationSpecs: details.cultivation_specs,
    isOrganic: row.is_organic,
    inStock: !tracked || row.stock! > 0,
    tags: row.tags ?? [],
    relatedProducts: row.related_products ?? [],
    howToUseSteps: details.how_to_use_steps,
    faqs: details.faqs,
    scienceContent: details.science_content,
    keyBenefits: details.key_benefits,
    grainBagSpecs: details.grain_bag_specs,
  }
}

/** The admin's search-listing override wins; the caller falls back to the product's own copy. */
export function productSeo(row: Pick<FlProductRow, 'seo'>, locale: 'en' | 'es'): { title: string; description: string } {
  const pick = (value: Bilingual | undefined) => (value?.[locale] ?? value?.en ?? '').trim()
  return { title: pick(row.seo?.title), description: pick(row.seo?.description) }
}

export interface FlSpeciesRow {
  slug: string
  common_name: string
  scientific_name: string | null
  family: string | null
  taxonomic_order: string | null
  type: string | null
  difficulty: string | null
  substrate: string[] | null
  colonization_weeks_min: number | null
  colonization_weeks_max: number | null
  fruiting_temp_f_min: number | null
  fruiting_temp_f_max: number | null
  fruiting_temp_c_min: number | null
  fruiting_temp_c_max: number | null
  expected_flushes: number | null
  biological_efficiency: string | null
  beta_glucan_content: string | null
  indoor_outdoor: string | null
  description: Bilingual
  cultivation_notes: Bilingual
  medical_notes: Bilingual
  cooking_notes: Bilingual
  lookalikes: string[] | null
  image_url: string | null
  thumbnail_url: string | null
  openart_prompt: string | null
  key_benefits: SpeciesBenefit[] | null
}

export function toSpeciesData(row: FlSpeciesRow): SpeciesData {
  return {
    id: row.slug,
    slug: row.slug,
    commonName: row.common_name,
    scientificName: row.scientific_name ?? '',
    family: row.family ?? '',
    order: row.taxonomic_order ?? '',
    type: (row.type ?? 'edible') as SpeciesData['type'],
    difficulty: (row.difficulty ?? 'beginner') as SpeciesData['difficulty'],
    substrate: row.substrate ?? [],
    colonizationWeeks: { min: row.colonization_weeks_min ?? 0, max: row.colonization_weeks_max ?? 0 },
    fruitingTempF: { min: row.fruiting_temp_f_min ?? 0, max: row.fruiting_temp_f_max ?? 0 },
    fruitingTempC: { min: row.fruiting_temp_c_min ?? 0, max: row.fruiting_temp_c_max ?? 0 },
    expectedFlushes: row.expected_flushes ?? 0,
    biologicalEfficiency: row.biological_efficiency ?? '',
    betaGlucanContent: row.beta_glucan_content ?? '',
    indoorOutdoor: (row.indoor_outdoor ?? 'indoor') as SpeciesData['indoorOutdoor'],
    description: both(row.description),
    cultivationNotes: both(row.cultivation_notes),
    medicalNotes: both(row.medical_notes),
    cookingNotes: both(row.cooking_notes),
    lookalikes: row.lookalikes ?? [],
    imageUrl: row.image_url ?? '',
    thumbnailUrl: row.thumbnail_url ?? row.image_url ?? '',
    openartPrompt: row.openart_prompt ?? undefined,
    keyBenefits: row.key_benefits ?? [],
  }
}
