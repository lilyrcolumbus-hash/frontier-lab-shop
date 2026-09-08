import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireStoreAdmin } from '@/lib/require-store-admin'
import { SettingsForm } from '@/components/admin/SettingsForm'

export default async function AdminSettingsPage() {
  // The layout already gates /admin; this keeps the type honest rather than asserting.
  const admin = await requireStoreAdmin()
  if (!admin) redirect('/account')

  const store = await prisma.store.findUniqueOrThrow({
    where: { id: admin.store.id },
    select: {
      name: true,
      supportEmail: true,
      addressLine1: true,
      addressLine2: true,
      city: true,
      state: true,
      postalCode: true,
      country: true,
      shippingRate: true,
      freeShippingThreshold: true,
      lowStockThreshold: true,
      currency: true,
      domain: true,
      themeAccent: true,
      themeAmber: true,
      themeInk: true,
      themeInkMuted: true,
      themeBg: true,
      themeSurface: true,
      themeElevated: true,
      themeBorder: true,
    },
  })

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading font-medium text-2xl text-cream mb-6">Settings</h1>
      <SettingsForm initial={store} />
    </div>
  )
}
