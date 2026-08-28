import { redirect } from 'next/navigation'
import Link from 'next/link'
import { requireStoreAdmin } from '@/lib/require-store-admin'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireStoreAdmin()

  if (!admin) {
    redirect('/account')
  }

  return (
    <div className="min-h-screen bg-bg text-cream">
      <div className="border-b border-ds-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-body font-bold tracking-tight">{admin.store.name} Admin</span>
            <nav className="flex gap-4 text-sm">
              <Link href="/admin/products" className="text-cream-muted hover:text-cream transition-colors">
                Products
              </Link>
              <Link href="/admin/species" className="text-cream-muted hover:text-cream transition-colors">
                Species
              </Link>
              <Link href="/admin/collections" className="text-cream-muted hover:text-cream transition-colors">
                Collections
              </Link>
            </nav>
          </div>
          <span className="text-xs text-cream-muted">{admin.user.email}</span>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-10">{children}</div>
    </div>
  )
}
