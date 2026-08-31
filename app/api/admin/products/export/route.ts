import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { toCsv } from '@/lib/csv'

// One row per variant, the same shape the import accepts, so an export can be edited in a
// spreadsheet and fed straight back in. Prices, costs and weights stay in their storage units
// (cents, grams) — converting them here would make a round trip lossy.
const COLUMNS = [
  'productId', 'slug', 'name', 'status', 'category', 'subcategory',
  'price', 'compareAtPrice', 'inStock', 'taxable', 'metaTitle', 'metaDescription',
  'variantId', 'variantName', 'sku', 'variantPrice', 'stock', 'cost', 'weightGrams',
]

export const GET = withStoreAdmin(async (_req, { store }) => {
  const products = await prisma.product.findMany({
    where: { storeId: store.id },
    include: { variants: true },
    orderBy: { nameEn: 'asc' },
  })

  const rows = products.flatMap((product) =>
    product.variants.map((variant) => ({
      productId: product.id,
      slug: product.slug,
      name: product.nameEn,
      status: product.status,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      inStock: product.inStock ? 'true' : 'false',
      taxable: product.taxable ? 'true' : 'false',
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      variantId: variant.id,
      variantName: variant.name,
      sku: variant.sku,
      variantPrice: variant.price,
      stock: variant.stock,
      cost: variant.cost,
      weightGrams: variant.weightGrams,
    }))
  )

  const filename = `products-${new Date().toISOString().slice(0, 10)}.csv`
  return new NextResponse(toCsv(rows, COLUMNS), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
})
