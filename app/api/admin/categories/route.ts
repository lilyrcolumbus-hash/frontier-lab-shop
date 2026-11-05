import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { slugFromName } from '@/lib/shop-categories'

const createSchema = z.object({
  name: z.string().trim().min(1, 'Give it a name').max(80),
  // Empty = a top-level category; otherwise the id of the category this is a subcategory of.
  parentId: z.string().optional().nullable(),
})

// Staff can read the tree (the product form needs it); only owners change it, because it decides the
// shop menu and tabs.
export const GET = withStoreAdmin(async (_req, { store }) => {
  const rows = await prisma.shopCategory.findMany({
    where: { storeId: store.id },
    include: { _count: { select: { products: true, subProducts: true, children: true } } },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  })
  const categories = rows.map(({ _count, ...row }) => ({
    ...row,
    productCount: row.parentId === null ? _count.products : _count.subProducts,
    childCount: _count.children,
  }))
  return NextResponse.json({ categories })
})

export const POST = withStoreAdmin(
  async (req, { store }) => {
    const parsed = createSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid category' }, { status: 400 })
    }
    const { name, parentId } = parsed.data

    if (parentId) {
      const parent = await prisma.shopCategory.findFirst({ where: { id: parentId, storeId: store.id } })
      if (!parent) return NextResponse.json({ error: 'The parent category was not found' }, { status: 404 })
      // Two levels only: a subcategory cannot have its own subcategories.
      if (parent.parentId) return NextResponse.json({ error: 'A subcategory cannot have subcategories' }, { status: 400 })
    }

    const slug = slugFromName(name)
    if (!slug) return NextResponse.json({ error: 'Use letters or numbers in the name' }, { status: 400 })

    // The database only enforces slug uniqueness under a parent, and top-level rows all have a null
    // parent, so the top-level check is made here.
    const siblings = await prisma.shopCategory.findMany({ where: { storeId: store.id, parentId: parentId ?? null } })
    if (siblings.some((s) => s.slug === slug || s.nameEn.toLowerCase() === name.toLowerCase())) {
      return NextResponse.json({ error: `There is already one called "${name}" here` }, { status: 409 })
    }

    const last = siblings.reduce((max, s) => Math.max(max, s.sortOrder), -1)
    const category = await prisma.shopCategory.create({
      data: {
        storeId: store.id,
        parentId: parentId ?? null,
        slug,
        nameEn: name,
        // The admin is English-only; the Spanish name starts as a copy and can be changed later.
        nameEs: name,
        sortOrder: last + 1,
        showInMenu: !parentId,
      },
    })
    return NextResponse.json({ category })
  },
  { requireOwner: true }
)
