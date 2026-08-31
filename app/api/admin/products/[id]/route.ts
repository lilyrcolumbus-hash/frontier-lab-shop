import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'

const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1).max(100),
  sku: z.string().trim().min(1).max(60),
  price: z.coerce.number().int().min(0),
  stock: z.coerce.number().int().min(0),
  cost: z.coerce.number().int().min(0).optional().nullable(),
  weightGrams: z.coerce.number().int().min(0).optional().nullable(),
})

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
  imageAlts: z.array(z.string()).default([]),
  isOrganic: z.coerce.boolean().default(false),
  inStock: z.coerce.boolean().default(true),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  collectionIds: z.array(z.string()).default([]),
  relatedProducts: z.array(z.string()).default([]),
  metaTitle: z.string().trim().max(70).optional().nullable(),
  metaDescription: z.string().trim().max(160).optional().nullable(),
  taxable: z.coerce.boolean().default(true),
  variants: z.array(variantSchema).min(1).optional(),
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

  const { collectionIds, variants, ...updateData } = parsed.data
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

  // Variants are edited as one list: rows with an id are updated, rows without one are new,
  // and anything missing from the list was removed in the form. OrderItem stores variantId as a
  // plain string with no foreign key, so deleting a variant never breaks an existing order.
  if (variants) {
    const keptIds = variants.filter((v) => v.id).map((v) => v.id as string)
    await prisma.productVariant.deleteMany({
      where: { productId: params.id, ...(keptIds.length ? { id: { notIn: keptIds } } : {}) },
    })

    for (const variant of variants) {
      const data = {
        name: variant.name,
        // With a single variant the product price is the price — keeping them in sync avoids a
        // card showing one number and the buy button charging another. Multi-variant products
        // price each variant on its own, and the product price is the headline "from" figure.
        price: variants.length === 1 ? parsed.data.price : variant.price,
        stock: variant.stock,
        sku: variant.sku,
        cost: variant.cost ?? null,
        weightGrams: variant.weightGrams ?? null,
      }

      if (variant.id) {
        await prisma.productVariant.update({ where: { id: variant.id }, data })
      } else {
        await prisma.productVariant.create({ data: { ...data, storeId: store.id, productId: params.id } })
      }
    }
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
