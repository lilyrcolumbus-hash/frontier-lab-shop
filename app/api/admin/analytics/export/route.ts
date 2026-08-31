import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { toCsv } from '@/lib/csv'
import { resolveRange } from '@/lib/analytics-range'

// One row per order, which is the level accountants and spreadsheets actually work at. Cancelled
// and refunded orders are included here — unlike the dashboard tiles — because a bookkeeping
// export needs to show them, and each row carries its status so they can be filtered out.
const COLUMNS = ['orderId', 'date', 'email', 'status', 'items', 'subtotal', 'shipping', 'tax', 'total']

export const GET = withStoreAdmin(async (req, { store }) => {
  const range = resolveRange(new URL(req.url).searchParams.get('range'))

  const orders = await prisma.order.findMany({
    where: {
      storeId: store.id,
      ...(range.from ? { createdAt: { gte: range.from, lte: range.to } } : {}),
    },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })

  const rows = orders.map((order) => ({
    orderId: order.id,
    date: order.createdAt.toISOString(),
    email: order.email,
    status: order.status,
    items: order.items.reduce((sum, i) => sum + i.quantity, 0),
    // Money stays in cents, the unit it is stored and charged in — a spreadsheet can divide.
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    total: order.total,
  }))

  const filename = `orders-${range.key}-${new Date().toISOString().slice(0, 10)}.csv`
  return new NextResponse(toCsv(rows, COLUMNS), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
})
