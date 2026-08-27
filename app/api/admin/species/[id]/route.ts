import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/is-admin'

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

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return isAdmin(user?.email) ? user : null
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

  const species = await prisma.species.findUnique({ where: { id: params.id } })
  if (!species) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ species })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

  const body = await req.json().catch(() => null)
  const parsed = updateSpeciesSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid species', details: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.species.findUnique({ where: { id: params.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const species = await prisma.species.update({ where: { id: params.id }, data: parsed.data })
  return NextResponse.json({ species })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

  const existing = await prisma.species.findUnique({ where: { id: params.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const linkedProducts = await prisma.product.count({ where: { speciesId: params.id } })
  if (linkedProducts > 0) {
    return NextResponse.json(
      { error: `Cannot delete — ${linkedProducts} product(s) reference this species.` },
      { status: 409 }
    )
  }

  await prisma.species.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
