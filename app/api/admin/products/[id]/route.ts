import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/is-admin'

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

  const product = await prisma.product.findUnique({ where: { id: params.id }, include: { variants: true } })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ product })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

  const body = await req.json().catch(() => null)
  const parsed = updateProductSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid product', details: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.product.findUnique({ where: { id: params.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const product = await prisma.product.update({
    where: { id: params.id },
    data: parsed.data,
    include: { variants: true },
  })

  // Keep the default variant's price in sync with the product's headline price — this admin
  // form doesn't manage multiple variants per product yet (see CLAUDE.md Backlog).
  if (product.variants[0]) {
    await prisma.productVariant.update({ where: { id: product.variants[0].id }, data: { price: parsed.data.price } })
  }

  return NextResponse.json({ product })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

  const existing = await prisma.product.findUnique({ where: { id: params.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.productVariant.deleteMany({ where: { productId: params.id } })
  await prisma.product.delete({ where: { id: params.id } })

  return NextResponse.json({ ok: true })
}
