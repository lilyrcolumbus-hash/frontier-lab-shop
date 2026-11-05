import { prisma } from '@/lib/prisma'
import { getCurrentStoreId } from '@/lib/current-store'

/**
 * The category tree the shop menu, the shop tabs and the product page read. It is managed in
 * /admin/categories (see components/admin/CategoriesManager.tsx). Two levels: a category and its
 * subcategories.
 */

export interface Bilingual {
  en: string
  es: string
}

/** The three product-page blocks a category can switch on. null = inherit (subcategory) / off (category). */
export interface CategoryBlocks {
  packetContents: boolean | null
  viabilityGuarantee: boolean | null
  freshness: boolean | null
}

export interface ShopCategoryNode {
  id: string
  slug: string
  name: Bilingual
  description: Bilingual
  showInMenu: boolean
  sortOrder: number
  blocks: CategoryBlocks
  children: ShopCategoryNode[]
}

export interface ResolvedBlocks {
  packetContents: boolean
  viabilityGuarantee: boolean
  freshness: boolean
}

const NO_BLOCKS: CategoryBlocks = { packetContents: null, viabilityGuarantee: null, freshness: null }

/**
 * What the shop had before categories became editable. Used when the table does not exist yet or is
 * empty (for example, the code is live before the database was migrated), so the menu and tabs keep
 * working exactly as they did.
 */
const node = (slug: string, en: string, es: string, descEn: string, descEs: string, sortOrder: number, blocks: CategoryBlocks = NO_BLOCKS, children: ShopCategoryNode[] = []): ShopCategoryNode => ({
  id: `legacy-${slug}`,
  slug,
  name: { en, es },
  description: { en: descEn, es: descEs },
  showInMenu: true,
  sortOrder,
  blocks,
  children,
})
const child = (slug: string, en: string, es: string, sortOrder: number, blocks: CategoryBlocks = NO_BLOCKS) => node(slug, en, es, '', '', sortOrder, blocks)

export const LEGACY_TREE: ShopCategoryNode[] = [
  node('culture-bank', 'Culture Bank', 'Banco de Cultivos', 'Live liquid cultures — 8 species, lab isolated', 'Cultivos líquidos vivos — 8 especies, aislados en laboratorio', 0,
    { packetContents: null, viabilityGuarantee: true, freshness: true },
    [child('liquid-culture', 'Liquid Culture', 'Cultivo Líquido', 0, { packetContents: true, viabilityGuarantee: null, freshness: null })]),
  node('substrate', 'Substrates', 'Sustratos', 'Sterilized bags, straw, custom mixes', 'Bolsas esterilizadas, paja, mezclas personalizadas', 1,
    { packetContents: null, viabilityGuarantee: true, freshness: null },
    [child('grain-bags', 'Grain Bags', 'Bolsas de Grano', 0), child('bulk-substrate', 'Bulk Substrate', 'Sustrato a Granel', 1)]),
  node('kit', 'Grow Kits', 'Kits de Cultivo', 'Beginner kits, fruiting blocks, outdoor setups', 'Kits para principiantes, bloques fructificantes, kits exteriores', 2,
    { packetContents: null, viabilityGuarantee: true, freshness: null },
    [child('fruiting-blocks', 'Fruiting Blocks', 'Bloques Fructificantes', 0), child('all-in-one', 'All-in-One', 'Todo en Uno', 1)]),
  node('equipment', 'Lab Equipment', 'Equipo de Laboratorio', 'Monotubs, Martha tents, tools', 'Monotubs, tiendas Martha, herramientas', 3,
    { packetContents: null, viabilityGuarantee: false, freshness: null },
    [child('jar-lids', 'Jar Lids', 'Tapas para Frascos', 0)]),
  node('wellness', 'Wellness', 'Bienestar', 'Tinctures, capsules, coffee, dried', 'Tinturas, cápsulas, café, deshidratados', 4, { packetContents: null, viabilityGuarantee: true, freshness: null }),
  node('bundle', 'Bundles & Deals', 'Packs y Ofertas', '', '', 5, { packetContents: null, viabilityGuarantee: true, freshness: null }),
]

type Row = {
  id: string
  slug: string
  nameEn: string
  nameEs: string
  descriptionEn: string
  descriptionEs: string
  parentId: string | null
  sortOrder: number
  showInMenu: boolean
  showPacketContents: boolean | null
  showViabilityGuarantee: boolean | null
  showFreshnessBlock: boolean | null
}

function toNode(row: Row): ShopCategoryNode {
  return {
    id: row.id,
    slug: row.slug,
    name: { en: row.nameEn, es: row.nameEs },
    description: { en: row.descriptionEn, es: row.descriptionEs },
    showInMenu: row.showInMenu,
    sortOrder: row.sortOrder,
    blocks: { packetContents: row.showPacketContents, viabilityGuarantee: row.showViabilityGuarantee, freshness: row.showFreshnessBlock },
    children: [],
  }
}

/** Builds the two-level tree from flat rows, ordered by sortOrder. Orphans are ignored. */
export function buildTree(rows: Row[]): ShopCategoryNode[] {
  const nodes = new Map(rows.map((r) => [r.id, toNode(r)]))
  const roots: ShopCategoryNode[] = []
  for (const r of rows) {
    const n = nodes.get(r.id)!
    if (r.parentId === null) roots.push(n)
    else nodes.get(r.parentId)?.children.push(n)
  }
  const bySort = (a: ShopCategoryNode, b: ShopCategoryNode) => a.sortOrder - b.sortOrder
  roots.sort(bySort)
  roots.forEach((r) => r.children.sort(bySort))
  return roots
}

/**
 * The tree for the live store. Falls back to LEGACY_TREE when the table is missing or empty so a
 * deploy that goes out before the migration can never take the menu down.
 */
export async function getShopCategoryTree(): Promise<ShopCategoryNode[]> {
  try {
    const storeId = await getCurrentStoreId()
    const rows = await prisma.shopCategory.findMany({ where: { storeId }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] })
    if (rows.length === 0) return LEGACY_TREE
    return buildTree(rows)
  } catch (error) {
    console.error('Could not load shop categories, using the built-in list:', error)
    return LEGACY_TREE
  }
}

/** Finds a top-level category by slug. */
export function findCategory(tree: ShopCategoryNode[], slug: string | null | undefined): ShopCategoryNode | undefined {
  if (!slug) return undefined
  return tree.find((c) => c.slug === slug)
}

/** Subcategory (if any) takes its own value; otherwise it inherits the category; otherwise off. */
export function resolveBlocks(category: ShopCategoryNode | undefined, subcategory: ShopCategoryNode | undefined): ResolvedBlocks {
  const pick = (key: keyof CategoryBlocks): boolean => subcategory?.blocks[key] ?? category?.blocks[key] ?? false
  return { packetContents: pick('packetContents'), viabilityGuarantee: pick('viabilityGuarantee'), freshness: pick('freshness') }
}

/**
 * What the product page showed before the blocks were switches, decided by the category text.
 * Used for a product that is not linked to the category tree yet, so nothing changes for it.
 */
export function legacyBlocks(categorySlug: string, subcategoryName: string): ResolvedBlocks {
  return {
    packetContents: subcategoryName === 'Liquid Culture',
    viabilityGuarantee: categorySlug !== 'equipment',
    freshness: categorySlug === 'spawn',
  }
}

/** "Liquid Culture & More!" -> "liquid-culture-more". */
export function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

/** One entry of the shop menu (header, mobile menu, footer), already in the visitor's language. */
export interface ShopMenuItem {
  slug: string
  label: string
  description: string
  href: string
}

export function shopMenuFrom(tree: ShopCategoryNode[], locale: 'en' | 'es'): ShopMenuItem[] {
  return tree
    .filter((c) => c.showInMenu)
    .map((c) => ({ slug: c.slug, label: c.name[locale], description: c.description[locale], href: `/shop?category=${c.slug}` }))
}
