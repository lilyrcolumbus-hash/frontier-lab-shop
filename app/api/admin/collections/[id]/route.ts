import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { RULE_FIELDS, syncAutomaticCollection } from '@/lib/collection-rules'

const updateCollectionSchema = z.object({
  titleEn: z.string().trim().min(1).max(200),
  titleEs: z.string().trim().min(1).max(200),
  descriptionEn: z.string().trim().max(2000).optional().nullable(),
  descriptionEs: z.string().trim().max(2000).optional().nullable(),
  image: z.string().trim().max(500).optional().nullable(),
  ruleField: z.enum(RULE_FIELDS).optional().nullable(),
  ruleValue: z.string().trim().max(120).optional().nullable(),
})

export const GET = withStoreAdmin<{ params: { id: string } }>(async (_req, { store }, { params }) => {
  const collection = await prisma.collection.findUnique({
    where: { id: params.id },
    include: { products: { select: { id: true, nameEn: true } } },
  })
  if (!collection || collection.storeId !== store.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ collection })
})

export const PATCH = withStoreAdmin<{ params: { id: string } }>(async (req, { store }, { params }) => {
  const body = await req.json().catch(() => null)
  const parsed = updateCollectionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid collection', details: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.collection.findUnique({ where: { id: params.id } })
  if (!existing || existing.storeId !== store.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { ruleField, ruleValue, ...rest } = parsed.data
  const isAutomatic = Boolean(ruleField && ruleValue)

  const collection = await prisma.collection.update({
    where: { id: params.id },
    data: { ...rest, ruleField: isAutomatic ? ruleField : null, ruleValue: isAutomatic ? ruleValue : null },
  })
  // Switching a manual collection to automatic replaces its membership; switching it back
  // leaves whatever the rule last selected, which the admin can then edit by hand.
  if (isAutomatic) await syncAutomaticCollection(collection.id)

  return NextResponse.json({ collection })
})

export const DELETE = withStoreAdmin<{ params: { id: string } }>(async (_req, { store }, { params }) => {
  const existing = await prisma.collection.findUnique({ where: { id: params.id } })
  if (!existing || existing.storeId !== store.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.collection.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
})
