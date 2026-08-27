import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/is-admin'

const updateCollectionSchema = z.object({
  titleEn: z.string().trim().min(1).max(200),
  titleEs: z.string().trim().min(1).max(200),
  descriptionEn: z.string().trim().max(2000).optional().nullable(),
  descriptionEs: z.string().trim().max(2000).optional().nullable(),
  image: z.string().trim().max(500).optional().nullable(),
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

  const collection = await prisma.collection.findUnique({
    where: { id: params.id },
    include: { products: { select: { id: true, nameEn: true } } },
  })
  if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ collection })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

  const body = await req.json().catch(() => null)
  const parsed = updateCollectionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid collection', details: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.collection.findUnique({ where: { id: params.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const collection = await prisma.collection.update({ where: { id: params.id }, data: parsed.data })
  return NextResponse.json({ collection })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

  const existing = await prisma.collection.findUnique({ where: { id: params.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.collection.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
