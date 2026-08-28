import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'

const ORDER_STATUSES = ['pending', 'paid', 'fulfilled', 'cancelled', 'refunded'] as const

const updateOrderSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  trackingNumber: z.string().trim().max(120).optional().nullable(),
})

export const GET = withStoreAdmin<{ params: { id: string } }>(async (_req, { store }, { params }) => {
  const order = await prisma.order.findUnique({ where: { id: params.id }, include: { items: true } })
  if (!order || order.storeId !== store.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ order })
})

export const PATCH = withStoreAdmin<{ params: { id: string } }>(async (req, { store }, { params }) => {
  const body = await req.json().catch(() => null)
  const parsed = updateOrderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid order update', details: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.order.findUnique({ where: { id: params.id } })
  if (!existing || existing.storeId !== store.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const order = await prisma.order.update({
    where: { id: params.id },
    data: parsed.data,
    include: { items: true },
  })

  return NextResponse.json({ order })
})
