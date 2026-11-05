import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'

// Every field is optional: the screen sends only what the person changed.
const updateSchema = z.object({
  nameEn: z.string().trim().min(1).max(80).optional(),
  nameEs: z.string().trim().min(1).max(80).optional(),
  descriptionEn: z.string().trim().max(200).optional(),
  descriptionEs: z.string().trim().max(200).optional(),
  showInMenu: z.boolean().optional(),
  // The three product-page blocks. null = follow the category (subcategory) / off (category).
  showPacketContents: z.boolean().nullable().optional(),
  showViabilityGuarantee: z.boolean().nullable().optional(),
  showFreshnessBlock: z.boolean().nullable().optional(),
  move: z.enum(['up', 'down']).optional(),
})

export const PATCH = withStoreAdmin<{ params: { id: string } }>(
  async (req, { store }, { params }) => {
    const parsed = updateSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid category' }, { status: 400 })
    }
    const existing = await prisma.shopCategory.findFirst({ where: { id: params.id, storeId: store.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { move, ...fields } = parsed.data

    if (fields.nameEn !== undefined) {
      const siblings = await prisma.shopCategory.findMany({ where: { storeId: store.id, parentId: existing.parentId, NOT: { id: existing.id } } })
      if (siblings.some((s) => s.nameEn.toLowerCase() === fields.nameEn!.toLowerCase())) {
        return NextResponse.json({ error: `There is already one called "${fields.nameEn}" here` }, { status: 409 })
      }
    }

    const category = await prisma.shopCategory.update({ where: { id: existing.id }, data: fields })

    // The product rows keep the subcategory name as text too (MCP and the CSV read it), so a rename has
    // to reach them. A product in a category with no subcategory stores the category name there instead.
    if (fields.nameEn !== undefined && fields.nameEn !== existing.nameEn) {
      if (existing.parentId) {
        await prisma.product.updateMany({ where: { storeId: store.id, subcategoryId: existing.id }, data: { subcategory: fields.nameEn } })
      } else {
        await prisma.product.updateMany({ where: { storeId: store.id, categoryId: existing.id, subcategoryId: null }, data: { subcategory: fields.nameEn } })
      }
    }

    if (move) {
      const siblings = await prisma.shopCategory.findMany({
        where: { storeId: store.id, parentId: existing.parentId },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      })
      const index = siblings.findIndex((s) => s.id === existing.id)
      const target = move === 'up' ? index - 1 : index + 1
      if (index >= 0 && target >= 0 && target < siblings.length) {
        const order = siblings.map((s) => s.id)
        ;[order[index], order[target]] = [order[target], order[index]]
        // Renumber the whole list so ties and gaps cannot build up.
        await prisma.$transaction(order.map((id, position) => prisma.shopCategory.update({ where: { id }, data: { sortOrder: position } })))
      }
    }

    return NextResponse.json({ category })
  },
  { requireOwner: true }
)

export const DELETE = withStoreAdmin<{ params: { id: string } }>(
  async (_req, { store }, { params }) => {
    const existing = await prisma.shopCategory.findFirst({
      where: { id: params.id, storeId: store.id },
      include: { _count: { select: { products: true, subProducts: true, children: true } } },
    })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const inUse = existing._count.products + existing._count.subProducts
    if (existing._count.children > 0) {
      return NextResponse.json({ error: 'Delete or move its subcategories first.' }, { status: 409 })
    }
    if (inUse > 0) {
      return NextResponse.json({ error: `${inUse} product${inUse === 1 ? ' is' : 's are'} in it. Move ${inUse === 1 ? 'it' : 'them'} to another category first.` }, { status: 409 })
    }

    await prisma.shopCategory.delete({ where: { id: existing.id } })
    return NextResponse.json({ ok: true })
  },
  { requireOwner: true }
)
