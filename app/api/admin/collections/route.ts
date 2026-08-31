import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { RULE_FIELDS, syncAutomaticCollection } from '@/lib/collection-rules'

const createCollectionSchema = z.object({
  slug: z.string().trim().min(1).max(200),
  titleEn: z.string().trim().min(1).max(200),
  titleEs: z.string().trim().min(1).max(200),
  descriptionEn: z.string().trim().max(2000).optional().nullable(),
  descriptionEs: z.string().trim().max(2000).optional().nullable(),
  image: z.string().trim().max(500).optional().nullable(),
  // An empty rule keeps the collection manual — both fields must be set together.
  ruleField: z.enum(RULE_FIELDS).optional().nullable(),
  ruleValue: z.string().trim().max(120).optional().nullable(),
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

  const { ruleField, ruleValue, ...rest } = parsed.data
  // A rule needs both halves; one without the other would silently match everything.
  const isAutomatic = Boolean(ruleField && ruleValue)

  const collection = await prisma.collection.create({
    data: {
      ...rest,
      storeId: store.id,
      ruleField: isAutomatic ? ruleField : null,
      ruleValue: isAutomatic ? ruleValue : null,
    },
  })
  if (isAutomatic) await syncAutomaticCollection(collection.id)

  return NextResponse.json({ collection })
})
