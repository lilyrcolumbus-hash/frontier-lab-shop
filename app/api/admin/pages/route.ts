import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { blocksSchema } from '@/lib/page-blocks'

const pageSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'Use lower-case letters, numbers and dashes'),
  titleEn: z.string().trim().min(1).max(200),
  titleEs: z.string().trim().min(1).max(200),
  blocks: blocksSchema.default([]),
  status: z.enum(['draft', 'active']).default('draft'),
  metaTitle: z.string().trim().max(70).optional().nullable(),
  metaDescription: z.string().trim().max(160).optional().nullable(),
  showInFooter: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
})

export const GET = withStoreAdmin(async (_req, { store }) => {
  const pages = await prisma.page.findMany({
    where: { storeId: store.id },
    orderBy: [{ sortOrder: 'asc' }, { titleEn: 'asc' }],
  })
  return NextResponse.json({ pages })
})

export const POST = withStoreAdmin(
  async (req, { store }) => {
    const body = await req.json().catch(() => null)
    const parsed = pageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid page', details: parsed.error.flatten() }, { status: 400 })
    }

    const existing = await prisma.page.findFirst({ where: { storeId: store.id, slug: parsed.data.slug } })
    if (existing) {
      return NextResponse.json({ error: 'A page with this address already exists' }, { status: 409 })
    }

    const page = await prisma.page.create({
      data: { ...parsed.data, blocks: parsed.data.blocks as never, storeId: store.id },
    })
    revalidatePath('/', 'layout')
    return NextResponse.json({ page })
  },
  { requireOwner: true }
)
