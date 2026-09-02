import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'

const taxSchema = z.object({
  name: z.string().trim().min(1).max(80),
  country: z.string().trim().min(2).max(2).toUpperCase(),
  // Empty means the rate covers the whole country rather than one state.
  state: z.string().trim().max(10).optional().nullable(),
  // Percentage in basis points: 825 = 8.25%. Kept as an integer to avoid float drift.
  basisPoints: z.coerce.number().int().min(0).max(10000),
  enabled: z.coerce.boolean().default(true),
})

export const GET = withStoreAdmin(async (_req, { store }) => {
  const taxes = await prisma.taxRate.findMany({ where: { storeId: store.id }, orderBy: { name: 'asc' } })
  return NextResponse.json({ taxes })
})

export const POST = withStoreAdmin(
  async (req, { store }) => {
    const body = await req.json().catch(() => null)
    const parsed = taxSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid tax rate', details: parsed.error.flatten() }, { status: 400 })
    }

    const tax = await prisma.taxRate.create({
      data: { ...parsed.data, state: parsed.data.state || null, storeId: store.id },
    })
    return NextResponse.json({ tax })
  },
  { requireOwner: true }
)
