import { prisma } from '@/lib/prisma'
import { slugFromName } from '@/lib/shop-categories'

/**
 * Turns what a caller sends about a product's category into the links and the old text columns the
 * product row stores. Two kinds of caller:
 *  - the admin form sends the ids it picked from the category tree;
 *  - MCP and the CSV import still send plain text (`category: "substrate"`, `subcategory: "Grain Bags"`).
 * Either way the row ends up with categoryId, subcategoryId and the matching `category` (slug) and
 * `subcategory` (name) text, so everything that still reads the text keeps working.
 */

/** The old `spawn` category is Culture Bank now. */
const LEGACY_ALIAS: Record<string, string> = { spawn: 'culture-bank' }

export interface CategoryInput {
  categoryId?: string | null
  subcategoryId?: string | null
  category?: string | null
  subcategory?: string | null
}

export interface CategoryLinks {
  categoryId: string
  subcategoryId: string | null
  category: string
  subcategory: string
}

/** A problem with what the caller picked: the message is safe to show them. */
export class CategoryError extends Error {}

export async function resolveProductCategory(storeId: string, input: CategoryInput): Promise<CategoryLinks> {
  let top
  if (input.categoryId) {
    top = await prisma.shopCategory.findFirst({ where: { id: input.categoryId, storeId, parentId: null } })
    if (!top) throw new CategoryError('That category no longer exists. Pick another one.')
  } else if (input.category) {
    const slug = LEGACY_ALIAS[input.category] ?? slugFromName(input.category)
    top = await prisma.shopCategory.findFirst({ where: { storeId, parentId: null, slug } })
    if (!top) throw new CategoryError(`There is no category "${input.category}". Create it in Categories first.`)
  } else {
    throw new CategoryError('Pick a category.')
  }

  let sub = null
  if (input.subcategoryId) {
    sub = await prisma.shopCategory.findFirst({ where: { id: input.subcategoryId, storeId, parentId: top.id } })
    if (!sub) throw new CategoryError('That subcategory does not belong to the chosen category.')
  } else if (input.subcategory?.trim()) {
    const text = input.subcategory.trim()
    const slug = slugFromName(text)
    const siblings = await prisma.shopCategory.findMany({ where: { storeId, parentId: top.id } })
    sub = siblings.find((s) => s.slug === slug || s.nameEn.toLowerCase() === text.toLowerCase()) ?? null
    if (!sub && slug) {
      // Text from MCP or a CSV that nobody has a row for: add it, out of the menu, so it is not lost.
      const last = siblings.reduce((max, s) => Math.max(max, s.sortOrder), -1)
      sub = await prisma.shopCategory.create({
        data: { storeId, parentId: top.id, slug, nameEn: text, nameEs: text, sortOrder: last + 1, showInMenu: false },
      })
    }
  }

  return {
    categoryId: top.id,
    subcategoryId: sub?.id ?? null,
    category: top.slug,
    // A category with no subcategories has nothing to put here, and the column is required.
    subcategory: sub?.nameEn ?? top.nameEn,
  }
}
