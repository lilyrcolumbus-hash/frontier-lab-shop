import { requireStoreAdmin } from '@/lib/require-store-admin'
import { createClient } from '@/lib/supabase/server'
import { AdminShell } from '@/components/admin/AdminShell'
import { AdminLogin } from '@/components/admin/AdminLogin'
import { StoreTheme } from '@/components/StoreTheme'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireStoreAdmin()

  if (!admin) {
    // The admin has its own sign-in, separate from the customer account pages.
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return <AdminLogin signedInEmail={user?.email ?? null} />
  }

  return (
    <AdminShell storeName={admin.store.name} userEmail={admin.user.email ?? ''} role={admin.role} isDemo={admin.isDemo}>
      <StoreTheme />
      {children}
    </AdminShell>
  )
}
