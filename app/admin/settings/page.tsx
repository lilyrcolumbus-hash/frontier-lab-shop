import { redirect } from 'next/navigation'
import { requireStoreAdmin } from '@/lib/require-store-admin'
import { SettingsForm } from '@/components/admin/SettingsForm'

export default async function AdminSettingsPage() {
  // The layout already gates /admin; this keeps the type honest rather than asserting.
  const admin = await requireStoreAdmin()
  if (!admin) redirect('/account')
  const { store } = admin

  return (
    <div className="max-w-md">
      <h1 className="font-body font-bold text-2xl text-cream mb-6">Settings</h1>
      <SettingsForm
        initial={{ shippingRate: store.shippingRate, freeShippingThreshold: store.freeShippingThreshold }}
      />
    </div>
  )
}
