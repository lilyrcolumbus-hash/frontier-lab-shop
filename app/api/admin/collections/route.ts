import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/is-admin'

const createCollectionSchema = z.object({
  slug: z.string().trim().min(1).max(200),
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

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

  const collections = await prisma.collection.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { titleEn: 'asc' },
  })
  return NextResponse.json({ collections })
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

  const body = await req.json().catch(() => null)
  const parsed = createCollectionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid collection', details: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.collection.findUnique({ where: { slug: parsed.data.slug } })
  if (existing) {
    return NextResponse.json({ error: 'A collection with this slug already exists' }, { status: 409 })
  }

  const collection = await prisma.collection.create({ data: parsed.data })
  return NextResponse.json({ collection })
}
