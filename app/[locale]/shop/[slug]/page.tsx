import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { ProductDetailClient } from '@/components/shop/ProductDetailClient'
import { prisma } from '@/lib/prisma'
import { toProduct } from '@/lib/product-mappers'

// Reads live from the DB, editable via /admin — must not be frozen at build time.
export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: { slug: string; locale: string } }) {
  setRequestLocale(params.locale)

  const row = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { variants: true, species: true },
  })
  if (!row || row.status !== 'active') notFound()

  return <ProductDetailClient product={toProduct(row)} />
}
