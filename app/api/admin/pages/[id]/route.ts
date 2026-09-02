import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { blocksSchema } from '@/lib/page-blocks'

const updateSchema = z.object({
  titleEn: z.string().trim().min(1).max(200),
  titleEs: z.string().trim().min(1).max(200),
  blocks: blocksSchema.default([]),
  status: z.enum(['draft', 'active']).default('draft'),
  metaTitle: z.string().trim().max(70).optional().nullable(),
  metaDescription: z.string().trim().max(160).optional().nullable(),
  showInFooter: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
})

export const GET = withStoreAdmin<{ params: { id: string } }>(async (_req, { store }, { params }) => {
  const page = await prisma.page.findFirst({ where: { id: params.id, storeId: store.id } })
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ page })
})

export const PATCH = withStoreAdmin<{ params: { id: string } }>(
  async (req, { store }, { params }) => {
    const body = await req.json().catch(() => null)
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid page', details: parsed.error.flatten() }, { status: 400 })
    }

    const existing = await prisma.page.findFirst({ where: { id: params.id, storeId: store.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const page = await prisma.page.update({
      where: { id: params.id },
      data: { ...parsed.data, blocks: parsed.data.blocks as never },
    })
    revalidatePath('/', 'layout')
    return NextResponse.json({ page })
  },
  { requireOwner: true }
)

export const DELETE = withStoreAdmin<{ params: { id: string } }>(
  async (_req, { store }, { params }) => {
    const existing = await prisma.page.findFirst({ where: { id: params.id, storeId: store.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.page.delete({ where: { id: params.id } })
    revalidatePath('/', 'layout')
    return NextResponse.json({ ok: true })
  },
  { requireOwner: true }
)
