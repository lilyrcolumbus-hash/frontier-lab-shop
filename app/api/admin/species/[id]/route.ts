import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'

const updateSpeciesSchema = z.object({
  commonName: z.string().trim().min(1).max(200),
  scientificName: z.string().trim().min(1).max(200),
  family: z.string().trim().min(1).max(100),
  order: z.string().trim().min(1).max(100),
  type: z.enum(['edible', 'medicinal', 'toxic', 'psychoactive', 'wild-only']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  substrate: z.array(z.string()).default([]),
  colonizationWeeksMin: z.coerce.number().int().min(0),
  colonizationWeeksMax: z.coerce.number().int().min(0),
  fruitingTempFMin: z.coerce.number().int(),
  fruitingTempFMax: z.coerce.number().int(),
  fruitingTempCMin: z.coerce.number().int(),
  fruitingTempCMax: z.coerce.number().int(),
  expectedFlushes: z.coerce.number().int().min(0),
  biologicalEfficiency: z.string().trim().min(1).max(50),
  betaGlucanContent: z.string().trim().min(1).max(100),
  indoorOutdoor: z.enum(['indoor', 'outdoor', 'both']),
  descriptionEn: z.string().trim().min(1),
  descriptionEs: z.string().trim().min(1),
  cultivationNotesEn: z.string().trim().min(1),
  cultivationNotesEs: z.string().trim().min(1),
  medicalNotesEn: z.string().trim().min(1),
  medicalNotesEs: z.string().trim().min(1),
  cookingNotesEn: z.string().trim().min(1),
  cookingNotesEs: z.string().trim().min(1),
  lookalikes: z.array(z.string()).default([]),
  imageUrl: z.string().trim().min(1),
  thumbnailUrl: z.string().trim().min(1),
})

export const GET = withStoreAdmin<{ params: { id: string } }>(async (_req, { store }, { params }) => {
  const species = await prisma.species.findUnique({ where: { id: params.id } })
  if (!species || species.storeId !== store.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ species })
})

export const PATCH = withStoreAdmin<{ params: { id: string } }>(async (req, { store }, { params }) => {
  const body = await req.json().catch(() => null)
  const parsed = updateSpeciesSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid species', details: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.species.findUnique({ where: { id: params.id } })
  if (!existing || existing.storeId !== store.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const species = await prisma.species.update({ where: { id: params.id }, data: parsed.data })
  return NextResponse.json({ species })
})

export const DELETE = withStoreAdmin<{ params: { id: string } }>(async (_req, { store }, { params }) => {
  const existing = await prisma.species.findUnique({ where: { id: params.id } })
  if (!existing || existing.storeId !== store.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const linkedProducts = await prisma.product.count({ where: { speciesId: params.id } })
  if (linkedProducts > 0) {
    return NextResponse.json(
      { error: `Cannot delete — ${linkedProducts} product(s) reference this species.` },
      { status: 409 }
    )
  }

  await prisma.species.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
})
