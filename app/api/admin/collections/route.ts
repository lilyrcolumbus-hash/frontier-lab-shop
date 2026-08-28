import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'

const createCollectionSchema = z.object({
  slug: z.string().trim().min(1).max(200),
  titleEn: z.string().trim().min(1).max(200),
  titleEs: z.string().trim().min(1).max(200),
  descriptionEn: z.string().trim().max(2000).optional().nullable(),
  descriptionEs: z.string().trim().max(2000).optional().nullable(),
  image: z.string().trim().max(500).optional().nullable(),
})

export const GET = withStoreAdmin(async (_req, { store }) => {
  const collections = await prisma.collection.findMany({
    where: { storeId: store.id },
    include: { _count: { select: { products: true } } },
    orderBy: { titleEn: 'asc' },
  })
  return NextResponse.json({ collections })
})

export const POST = withStoreAdmin(async (req, { store }) => {
  const body = await req.json().catch(() => null)
  const parsed = createCollectionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid collection', details: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.collection.findUnique({ where: { slug: parsed.data.slug } })
  if (existing) {
    return NextResponse.json({ error: 'A collection with this slug already exists' }, { status: 409 })
  }

  const collection = await prisma.collection.create({ data: { ...parsed.data, storeId: store.id } })
  return NextResponse.json({ collection })
})
