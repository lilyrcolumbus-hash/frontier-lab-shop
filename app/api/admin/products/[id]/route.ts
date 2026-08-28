import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'

const updateProductSchema = z.object({
  nameEn: z.string().trim().min(1).max(200),
  nameEs: z.string().trim().min(1).max(200),
  descriptionEn: z.string().trim().min(1),
  descriptionEs: z.string().trim().min(1),
  category: z.enum(['kit', 'spawn', 'substrate', 'equipment', 'wellness', 'bundle']),
  subcategory: z.string().trim().min(1).max(100),
  price: z.coerce.number().int().min(0),
  compareAtPrice: z.coerce.number().int().min(0).optional().nullable(),
  images: z.array(z.string()).default([]),
  isOrganic: z.coerce.boolean().default(false),
  inStock: z.coerce.boolean().default(true),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  collectionIds: z.array(z.string()).default([]),
})

export const GET = withStoreAdmin<{ params: { id: string } }>(async (_req, { store }, { params }) => {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { variants: true, collections: true },
  })
  if (!product || product.storeId !== store.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ product })
})

export const PATCH = withStoreAdmin<{ params: { id: string } }>(async (req, { store }, { params }) => {
  const body = await req.json().catch(() => null)
  const parsed = updateProductSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid product', details: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.product.findUnique({ where: { id: params.id } })
  if (!existing || existing.storeId !== store.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { collectionIds, ...updateData } = parsed.data
  const ownedCollections = collectionIds.length
    ? await prisma.collection.findMany({ where: { id: { in: collectionIds }, storeId: store.id }, select: { id: true } })
    : []

  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      ...updateData,
      collections: { set: ownedCollections.map((c) => ({ id: c.id })) },
    },
    include: { variants: true, collections: true },
  })

  // Keep the default variant's price in sync with the product's headline price — this admin
  // form doesn't manage multiple variants per product yet (see CLAUDE.md Backlog).
  if (product.variants[0]) {
    await prisma.productVariant.update({ where: { id: product.variants[0].id }, data: { price: parsed.data.price } })
  }

  return NextResponse.json({ product })
})

export const DELETE = withStoreAdmin<{ params: { id: string } }>(async (_req, { store }, { params }) => {
  const existing = await prisma.product.findUnique({ where: { id: params.id } })
  if (!existing || existing.storeId !== store.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.productVariant.deleteMany({ where: { productId: params.id } })
  await prisma.product.delete({ where: { id: params.id } })

  return NextResponse.json({ ok: true })
})
