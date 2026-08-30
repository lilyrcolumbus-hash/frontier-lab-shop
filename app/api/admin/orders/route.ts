import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import type { Prisma } from '@prisma/client'

const PAGE_SIZE = 25
const FILTERABLE_STATUSES = ['pending', 'paid', 'fulfilled', 'cancelled', 'refunded']

/** Parses a `YYYY-MM-DD` value from a date input; anything else is ignored rather than rejected. */
function parseDay(value: string | null, endOfDay: boolean): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`)
  return Number.isNaN(date.getTime()) ? null : date
}

export const GET = withStoreAdmin(async (req, { store }) => {
  const params = new URL(req.url).searchParams
  const page = Math.max(1, parseInt(params.get('page') ?? '1', 10) || 1)

  const status = params.get('status')
  const from = parseDay(params.get('from'), false)
  const to = parseDay(params.get('to'), true)

  const where: Prisma.OrderWhereInput = { storeId: store.id }
  if (status && FILTERABLE_STATUSES.includes(status)) {
    where.status = status
  }
  if (from || to) {
    where.createdAt = { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) }
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
  ])

  return NextResponse.json({ orders, total, page, pageSize: PAGE_SIZE })
})
