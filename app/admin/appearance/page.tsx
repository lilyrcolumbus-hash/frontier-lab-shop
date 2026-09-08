import { redirect } from 'next/navigation'
import { requireStoreAdmin } from '@/lib/require-store-admin'
import { getHomeLayout, HOME_SECTIONS } from '@/lib/home-sections'
import { HomeLayoutEditor } from '@/components/admin/HomeLayoutEditor'

export default async function AdminAppearancePage() {
  const admin = await requireStoreAdmin()
  if (!admin) redirect('/account')

  const layout = await getHomeLayout()
  const sections = layout.map((section) => ({
    ...section,
    ...HOME_SECTIONS.find((s) => s.key === section.key)!,
  }))

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading font-medium text-2xl text-cream mb-2">Home page</h1>
      <p className="text-sm text-cream-muted mb-6">
        Choose which sections appear on your home page and in what order. Colours live in
        Settings; the words in each section live in Content.
      </p>
      <HomeLayoutEditor initial={sections} />
    </div>
  )
}
