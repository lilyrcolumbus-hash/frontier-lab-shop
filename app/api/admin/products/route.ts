import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/is-admin'

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
  isOrganic: z.coerce.boolean().default(false),
  inStock: z.coerce.boolean().default(true),
  tags: z.array(z.string()).default([]),
  sku: z.string().trim().min(1).max(60),
  stock: z.coerce.number().int().min(0).default(0),
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

  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ products })
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

  const body = await req.json().catch(() => null)
  const parsed = createProductSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid product', details: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.product.findUnique({ where: { slug: parsed.data.slug } })
  if (existing) {
    return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 409 })
  }

  const { sku, stock, ...productData } = parsed.data
  const product = await prisma.product.create({
    data: {
      ...productData,
      relatedProducts: [],
      price: parsed.data.price,
      variants: {
        create: [{ name: 'Default', price: parsed.data.price, stock, sku }],
      },
    },
    include: { variants: true },
  })

  return NextResponse.json({ product })
}
