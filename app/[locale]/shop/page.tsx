import { Suspense } from 'react'
import { setRequestLocale } from 'next-intl/server'
import { ShopBrowser } from '@/components/shop/ShopBrowser'
import { prisma } from '@/lib/prisma'
import { toProduct } from '@/lib/product-mappers'

// Reads live from the DB, editable via /admin — must not be frozen at build time.
export const dynamic = 'force-dynamic'

export default async function ShopPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)

  // Category/subcategory (not Collection membership) still drives the shop's existing filter
  // pills here — they're carefully-tuned UX (e.g. the substrate pipeline view intentionally
  // blends in category:'kit' Fruiting Blocks as its 3rd stage) and stay in sync with Collections
  // by construction (prisma/migrate-collections.ts built each Collection from these same fields).
  // Real Collections are what the /admin panel manages; wiring the public filter UI to read from
  // them instead is a separate, later change, not bundled in here to avoid regressing that UX.
  const rows = await prisma.product.findMany({
    where: { status: 'active' },
    include: { variants: true, species: true },
    orderBy: { createdAt: 'asc' },
  })
  const products = rows.map(toProduct)

  return (
    <Suspense fallback={null}>
      <ShopBrowser products={products} />
    </Suspense>
  )
}
