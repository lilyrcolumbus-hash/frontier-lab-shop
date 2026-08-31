import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { fromCsv } from '@/lib/csv'

/** Reads an optional integer cell. An empty cell means "leave as is", not zero. */
function optionalInt(value: string | undefined): number | null | undefined {
  if (value === undefined || value.trim() === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.round(parsed) : null
}

function optionalBool(value: string | undefined): boolean | undefined {
  if (value === undefined || value.trim() === '') return undefined
  return ['true', '1', 'yes'].includes(value.trim().toLowerCase())
}

/**
 * Updates existing products and variants from a CSV.
 *
 * Deliberately update-only: creating a product needs description, images and the rich content
 * a spreadsheet cannot carry, and a typo in a slug column would silently spawn junk products.
 * Rows are matched by variantId or sku, and a row that matches nothing is reported back rather
 * than ignored, so a bad file is visible instead of half-applied.
 */
export const POST = withStoreAdmin(async (req, { store }) => {
  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Attach a CSV file.' }, { status: 400 })
  }
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: 'That file is larger than 2MB.' }, { status: 400 })
  }

  const rows = fromCsv(await file.text())
  if (rows.length === 0) {
    return NextResponse.json({ error: 'That file has no rows.' }, { status: 400 })
  }

  let updatedVariants = 0
  const updatedProducts = new Set<string>()
  const skipped: string[] = []

  for (const [index, row] of rows.entries()) {
    const line = index + 2 // +1 for the header, +1 because humans count from one

    const variant = row.variantId
      ? await prisma.productVariant.findUnique({ where: { id: row.variantId }, include: { product: true } })
      : row.sku
        ? await prisma.productVariant.findUnique({ where: { sku: row.sku }, include: { product: true } })
        : null

    if (!variant || variant.storeId !== store.id) {
      skipped.push(`Row ${line}: no variant matched ${row.variantId || row.sku || '(no id or sku)'}`)
      continue
    }

    const variantData = {
      name: row.variantName?.trim() || undefined,
      price: optionalInt(row.variantPrice) ?? undefined,
      stock: optionalInt(row.stock) ?? undefined,
      cost: optionalInt(row.cost),
      weightGrams: optionalInt(row.weightGrams),
    }
    await prisma.productVariant.update({ where: { id: variant.id }, data: variantData })
    updatedVariants += 1

    const productData = {
      nameEn: row.name?.trim() || undefined,
      price: optionalInt(row.price) ?? undefined,
      compareAtPrice: optionalInt(row.compareAtPrice),
      status: ['draft', 'active', 'archived'].includes(row.status) ? row.status : undefined,
      inStock: optionalBool(row.inStock),
      taxable: optionalBool(row.taxable),
      metaTitle: row.metaTitle?.trim() || undefined,
      metaDescription: row.metaDescription?.trim() || undefined,
    }
    if (Object.values(productData).some((value) => value !== undefined)) {
      await prisma.product.update({ where: { id: variant.productId }, data: productData })
      updatedProducts.add(variant.productId)
    }
  }

  return NextResponse.json({
    updatedVariants,
    updatedProducts: updatedProducts.size,
    skipped,
  })
})
