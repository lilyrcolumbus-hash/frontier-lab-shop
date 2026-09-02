import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'

const patchSchema = z.object({ enabled: z.coerce.boolean() })

export const PATCH = withStoreAdmin<{ params: { id: string } }>(
  async (req, { store }, { params }) => {
    const body = await req.json().catch(() => null)
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid change' }, { status: 400 })

    const existing = await prisma.taxRate.findFirst({ where: { id: params.id, storeId: store.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const tax = await prisma.taxRate.update({ where: { id: params.id }, data: parsed.data })
    return NextResponse.json({ tax })
  },
  { requireOwner: true }
)

export const DELETE = withStoreAdmin<{ params: { id: string } }>(
  async (_req, { store }, { params }) => {
    const existing = await prisma.taxRate.findFirst({ where: { id: params.id, storeId: store.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.taxRate.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  },
  { requireOwner: true }
)
