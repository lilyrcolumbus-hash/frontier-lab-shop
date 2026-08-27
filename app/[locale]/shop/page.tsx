import { Suspense } from 'react'
import { setRequestLocale } from 'next-intl/server'
import { ShopBrowser } from '@/components/shop/ShopBrowser'
import { prisma } from '@/lib/prisma'
import { toProduct } from '@/lib/product-mappers'

// Reads live from the DB, editable via /admin — must not be frozen at build time.
export const dynamic = 'force-dynamic'

export default async function ShopPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)

  const rows = await prisma.product.findMany({
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
