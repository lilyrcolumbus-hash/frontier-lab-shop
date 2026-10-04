import { redirect } from 'next/navigation'
import { requireStoreAdmin } from '@/lib/require-store-admin'
import { AdminShell } from '@/components/admin/AdminShell'
import { StoreTheme } from '@/components/StoreTheme'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireStoreAdmin()

  if (!admin) {
    // Without ?next, /account has no idea she was trying to reach /admin — she'd sign in
    // successfully and land on the plain customer account page instead of the panel.
    redirect('/account?next=/admin')
  }

  return (
    <AdminShell storeName={admin.store.name} userEmail={admin.user.email ?? ''} role={admin.role} isDemo={admin.isDemo}>
      <StoreTheme />
      {children}
    </AdminShell>
  )
}
