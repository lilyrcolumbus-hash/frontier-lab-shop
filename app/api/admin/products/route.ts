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
})

const createProductSchema = z.object({
  slug: z.string().trim().min(1).max(200),
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
  collectionIds: z.array(z.string()).default([]),
  relatedProducts: z.array(z.string()).default([]),
  variants: z.array(variantSchema).min(1, 'A product needs at least one variant'),
})

export const GET = withStoreAdmin(async (_req, { store }) => {
  const products = await prisma.product.findMany({
    where: { storeId: store.id },
    include: { variants: true, collections: { select: { id: true, titleEn: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ products })
})

export const POST = withStoreAdmin(async (req, { store }) => {
  const body = await req.json().catch(() => null)
  const parsed = createProductSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid product', details: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.product.findUnique({ where: { slug: parsed.data.slug } })
  if (existing) {
    return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 409 })
  }

  const { variants, collectionIds, ...productData } = parsed.data

  // Only connect collections that actually belong to this store — an id from another tenant
  // must silently not link, not error, so a guessed id can't leak a cross-tenant association.
  const ownedCollections = collectionIds.length
    ? await prisma.collection.findMany({ where: { id: { in: collectionIds }, storeId: store.id }, select: { id: true } })
    : []

  const product = await prisma.product.create({
    data: {
      ...productData,
      storeId: store.id,
      price: parsed.data.price,
      variants: {
        create: variants.map((v) => ({ storeId: store.id, name: v.name, price: v.price, stock: v.stock, sku: v.sku })),
      },
      collections: { connect: ownedCollections.map((c) => ({ id: c.id })) },
    },
    include: { variants: true, collections: true },
  })

  return NextResponse.json({ product })
})
