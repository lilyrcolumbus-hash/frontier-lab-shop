import { Suspense } from 'react'
import { setRequestLocale } from 'next-intl/server'
import { ShopBrowser } from '@/components/shop/ShopBrowser'
import { listProducts } from '@/lib/fl/products'

// Reads live from the DB, editable via /admin — must not be frozen at build time.
export const dynamic = 'force-dynamic'

export default async function ShopPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)

  // Category/subcategory still drive the shop's filter pills — they're carefully-tuned UX (e.g.
  // the substrate pipeline view intentionally blends in category:'kit' Fruiting Blocks as its
  // 3rd stage). Only live products come back: row level security hides drafts.
  const products = await listProducts()

  return (
    <Suspense fallback={null}>
      <ShopBrowser products={products} />
    </Suspense>
  )
}
