import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'

const PAGE_SIZE = 25

export const GET = withStoreAdmin(async (req, { store }) => {
  const page = Math.max(1, parseInt(new URL(req.url).searchParams.get('page') ?? '1', 10) || 1)

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { storeId: store.id },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where: { storeId: store.id } }),
  ])

  return NextResponse.json({ orders, total, page, pageSize: PAGE_SIZE })
})
