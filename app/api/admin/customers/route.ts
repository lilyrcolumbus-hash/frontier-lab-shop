import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { createAdminClient } from '@/lib/supabase/admin'

export const GET = withStoreAdmin(async (_req, { store }) => {
  const grouped = await prisma.order.groupBy({
    by: ['email'],
    where: { storeId: store.id },
    _sum: { total: true },
    _count: { _all: true },
    _max: { createdAt: true },
    orderBy: { _max: { createdAt: 'desc' } },
  })

  // Cross-reference against real Supabase accounts to badge registered vs. guest checkout —
  // best-effort: if the Admin API call fails, still return the order-derived list.
  const registeredEmails = new Set<string>()
  try {
    const supabase = createAdminClient()
    let page = 1
    while (true) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
      if (error) break
      for (const u of data.users) {
        if (u.email) registeredEmails.add(u.email.toLowerCase())
      }
      if (data.users.length < 200) break
      page++
    }
  } catch {
    // Admin API unavailable — proceed with orders-only data.
  }

  // Tags come from the admin's own notes; a customer with none simply has no profile row.
  const profiles = await prisma.customerProfile.findMany({
    where: { storeId: store.id },
    select: { email: true, tags: true },
  })
  const tagsByEmail = new Map(profiles.map((p) => [p.email, p.tags]))

  const customers = grouped.map((g) => ({
    email: g.email,
    orderCount: g._count._all,
    totalSpent: g._sum.total ?? 0,
    lastOrderAt: g._max.createdAt,
    registered: registeredEmails.has(g.email.toLowerCase()),
    tags: tagsByEmail.get(g.email) ?? [],
  }))

  return NextResponse.json({ customers })
})
