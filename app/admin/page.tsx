import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireStoreAdmin } from '@/lib/require-store-admin'
import { formatPrice } from '@/lib/utils'

export default async function AdminDashboardPage() {
  const admin = await requireStoreAdmin()
  if (!admin) redirect('/account')

  const storeId = admin.store.id

  const [orderCount, revenueAgg, items] = await Promise.all([
    prisma.order.count({ where: { storeId } }),
    prisma.order.aggregate({ where: { storeId }, _sum: { total: true } }),
    prisma.orderItem.findMany({ where: { storeId }, select: { name: true, price: true, quantity: true } }),
  ])

  const revenue = revenueAgg._sum.total ?? 0
  const avgOrderValue = orderCount > 0 ? Math.round(revenue / orderCount) : 0

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
    .slice(0, 5)

  const tiles = [
    { label: 'Revenue (all time)', value: formatPrice(revenue) },
    { label: 'Orders', value: String(orderCount) },
    { label: 'Average order value', value: formatPrice(avgOrderValue) },
  ]

  return (
    <div>
      <h1 className="font-body font-bold text-2xl text-cream mb-6">Analytics</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {tiles.map((t) => (
          <div key={t.label} className="bg-surface border border-ds-border rounded-xl p-5">
            <div className="text-xs font-medium text-cream-muted uppercase tracking-wider mb-1.5">{t.label}</div>
            <div className="text-2xl font-bold text-cream">{t.value}</div>
          </div>
        ))}
      </div>

      <h2 className="font-body font-semibold text-lg text-cream mb-3">Top products</h2>
      {topProducts.length === 0 ? (
        <div className="border border-ds-border rounded-xl bg-surface py-16 text-center text-cream-muted text-sm">
          No sales yet — top products will show up here once orders come in.
        </div>
      ) : (
        <div className="border border-ds-border rounded-xl bg-surface overflow-hidden">
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
