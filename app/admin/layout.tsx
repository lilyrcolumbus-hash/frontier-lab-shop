import { redirect } from 'next/navigation'
import { requireStoreAdmin } from '@/lib/require-store-admin'
import { AdminShell } from '@/components/admin/AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireStoreAdmin()

  if (!admin) {
    redirect('/account')
  }

  return (
    <AdminShell storeName={admin.store.name} userEmail={admin.user.email ?? ''} role={admin.role}>
      {children}
    </AdminShell>
  )
}
