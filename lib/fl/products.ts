import type { Product } from '@/types/product'
import { flGet, isSlug, photoUrl } from '@/lib/fl/client'
import { toProduct, productSeo, type FlProductRow } from '@/lib/fl/mappers'

/**
 * Products as visitors see them. Row level security already hides anything that isn't live,
 * so "active" is not re-checked here — asking for a draft simply returns nothing.
 */
const COLUMNS =
  'slug,category,subcategory,species_slug,scientific_name,name,description,price,compare_at_price,sku,is_organic,tags,related_products,seo,photos,stock,details'

export async function listProducts(): Promise<Product[]> {
  const rows = await flGet<FlProductRow>('products', { select: COLUMNS, order: 'position.asc,slug.asc' })
  return rows.map((row) => toProduct(row, photoUrl))
}

/** The raw row, for callers that need the search-listing fields as well as the product. */
export async function getProductRow(slug: string): Promise<FlProductRow | null> {
  if (!isSlug(slug)) return null
  const [row] = await flGet<FlProductRow>('products', { select: COLUMNS, filters: { slug: `eq.${slug}` }, limit: 1 })
  return row ?? null
}

export async function getProduct(slug: string): Promise<Product | null> {
  const row = await getProductRow(slug)
  return row ? toProduct(row, photoUrl) : null
}

/** Live products for a list of slugs, in the order asked for; a draft or deleted slug just drops out. */
export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  const valid = slugs.filter(isSlug)
  if (valid.length === 0) return []
  const rows = await flGet<FlProductRow>('products', { select: COLUMNS, filters: { slug: `in.(${valid.join(',')})` } })
  return valid
    .map((slug) => rows.find((row) => row.slug === slug))
    .filter((row): row is FlProductRow => Boolean(row))
    .map((row) => toProduct(row, photoUrl))
}

/** Slugs with their last-changed time, for the sitemap. */
export async function listProductSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  return flGet('products', { select: 'slug,updated_at', order: 'position.asc,slug.asc' })
}

export { productSeo }
