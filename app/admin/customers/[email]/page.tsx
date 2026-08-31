import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireStoreAdmin } from '@/lib/require-store-admin'
import { formatPrice } from '@/lib/utils'
import { StatusPill } from '@/components/admin/StatusPill'
import { CustomerProfileForm } from '@/components/admin/CustomerProfileForm'

export default async function AdminCustomerDetailPage({ params }: { params: { email: string } }) {
  const admin = await requireStoreAdmin()
  if (!admin) notFound()

  const email = decodeURIComponent(params.email).toLowerCase()

  const orders = await prisma.order.findMany({
    where: { storeId: admin.store.id, email },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })
  if (orders.length === 0) notFound()

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0)
  const averageOrder = Math.round(totalSpent / orders.length)
  const profile = await prisma.customerProfile.findUnique({
    where: { storeId_email: { storeId: admin.store.id, email } },
  })

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="font-body font-bold text-2xl text-cream">{email}</h1>
        <p className="text-sm text-cream-muted">
          {orders.length} order{orders.length === 1 ? '' : 's'} · {formatPrice(totalSpent)} lifetime value ·{' '}
          {formatPrice(averageOrder)} average order
        </p>
        {profile && profile.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {profile.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full border border-ds-border text-xs text-cream-muted">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-surface border border-ds-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-elevated text-cream-muted">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Order</th>
              <th className="text-left px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Date</th>
              <th className="text-right px-4 py-3 font-medium text-[11px] uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-ds-border hover:bg-elevated/40 transition-colors">
                <td className="px-4 py-3">
                  <a href={`/admin/orders/${o.id}`} className="font-mono text-xs text-accent hover:underline">
                    #{o.id.slice(-8)}
                  </a>
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={o.status} />
                </td>
                <td className="px-4 py-3 text-cream-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right text-cream">{formatPrice(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <CustomerProfileForm
          email={email}
          initialNotes={profile?.notes ?? ''}
          initialTags={profile?.tags ?? []}
        />
      </div>
    </div>
  )
}
