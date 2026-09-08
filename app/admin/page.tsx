import { redirect } from 'next/navigation'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { requireStoreAdmin } from '@/lib/require-store-admin'
import { formatPrice } from '@/lib/utils'
import { RANGE_OPTIONS, resolveRange, percentChange } from '@/lib/analytics-range'
import { AnalyticsRangePicker } from '@/components/admin/AnalyticsRangePicker'

// Reads live order data, so it must not be cached at build time.
export const dynamic = 'force-dynamic'

/** Totals for one window. Kept in one place so the current and previous periods can't diverge. */
async function totalsFor(storeId: string, from: Date | null, to: Date | null) {
  const where: Prisma.OrderWhereInput = {
    storeId,
    // Cancelled and refunded orders are not revenue — counting them would overstate every tile.
    status: { notIn: ['cancelled', 'refunded'] },
    ...(from || to ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
  }

  const [count, sum] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.aggregate({ where, _sum: { total: true } }),
  ])
  const revenue = sum._sum.total ?? 0
  return { count, revenue, avgOrderValue: count > 0 ? Math.round(revenue / count) : 0 }
}

function Delta({ change }: { change: number | null }) {
  if (change === null) return <span className="text-xs text-cream-muted/60">no prior period</span>
  const positive = change >= 0
  return (
    <span className={`text-xs font-medium ${positive ? 'text-accent' : 'text-error'}`}>
      {positive ? '▲' : '▼'} {Math.abs(change)}% vs previous
    </span>
  )
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: { range?: string }
}) {
  const admin = await requireStoreAdmin()
  if (!admin) redirect('/account')

  const storeId = admin.store.id
  const range = resolveRange(searchParams.range)

  const [current, previous, items] = await Promise.all([
    totalsFor(storeId, range.from, range.to),
    range.previousFrom ? totalsFor(storeId, range.previousFrom, range.previousTo) : Promise.resolve(null),
    prisma.orderItem.findMany({
      where: {
        storeId,
        order: {
          status: { notIn: ['cancelled', 'refunded'] },
          ...(range.from ? { createdAt: { gte: range.from, lte: range.to } } : {}),
        },
      },
      select: { name: true, price: true, quantity: true },
    }),
  ])

  const productRevenue = new Map<string, { qty: number; revenue: number }>()
  for (const item of items) {
    const cur = productRevenue.get(item.name) ?? { qty: 0, revenue: 0 }
    cur.qty += item.quantity
    cur.revenue += item.price * item.quantity
    productRevenue.set(item.name, cur)
  }
  const topProducts = [...productRevenue.entries()]
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)

  const tiles = [
    { label: 'Revenue', value: formatPrice(current.revenue), change: previous ? percentChange(current.revenue, previous.revenue) : null },
    { label: 'Orders', value: String(current.count), change: previous ? percentChange(current.count, previous.count) : null },
    { label: 'Average order value', value: formatPrice(current.avgOrderValue), change: previous ? percentChange(current.avgOrderValue, previous.avgOrderValue) : null },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-heading font-medium text-2xl text-cream">Analytics</h1>
        <div className="flex items-center gap-2">
          <AnalyticsRangePicker value={range.key} options={RANGE_OPTIONS} />
          <a
            href={`/api/admin/analytics/export?range=${range.key}`}
            className="px-4 py-2 rounded-none border border-ds-border text-sm font-medium text-cream hover:bg-elevated transition-colors"
          >
            Export CSV
          </a>
        </div>
      </div>

      <p className="text-sm text-cream-muted mb-4">
        {range.label}
        {range.key !== 'all' && ' · compared with the period immediately before'}. Cancelled and
        refunded orders are excluded.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {tiles.map((t) => (
          <div key={t.label} className="bg-surface border border-ds-border rounded-none p-5">
            <div className="text-xs font-medium text-cream-muted uppercase tracking-wider mb-1.5">{t.label}</div>
            <div className="text-2xl font-bold text-cream">{t.value}</div>
            <div className="mt-1.5">
              <Delta change={t.change} />
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-body font-semibold text-lg text-cream mb-3">Top products</h2>
      {topProducts.length === 0 ? (
        <div className="border border-ds-border rounded-none bg-surface py-16 text-center text-cream-muted text-sm">
          No sales in this period — top products will show up here once orders come in.
        </div>
      ) : (
        <div className="border border-ds-border rounded-none bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-elevated text-cream-muted">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Units sold</th>
                <th className="text-right px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p) => (
                <tr key={p.name} className="border-t border-ds-border">
                  <td className="px-4 py-3 text-cream">{p.name}</td>
                  <td className="px-4 py-3 text-cream-muted">{p.qty}</td>
                  <td className="px-4 py-3 text-right text-cream">{formatPrice(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
