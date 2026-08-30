import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/admin/ProductForm'
import { prisma } from '@/lib/prisma'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id }, include: { collections: true, variants: true } })
  if (!product) notFound()

  return (
    <div>
      <h1 className="font-body font-bold text-2xl text-cream mb-6">Edit product</h1>
      <ProductForm
        productId={product.id}
        initial={{
          nameEn: product.nameEn,
          nameEs: product.nameEs,
          descriptionEn: product.descriptionEn,
          descriptionEs: product.descriptionEs,
          category: product.category,
          subcategory: product.subcategory,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          images: product.images,
          imageAlts: product.imageAlts,
          isOrganic: product.isOrganic,
          inStock: product.inStock,
          tags: product.tags,
          status: product.status as 'draft' | 'active' | 'archived',
          collectionIds: product.collections.map((c) => c.id),
          sku: product.variants[0]?.sku ?? '',
          stock: product.variants[0]?.stock ?? 0,
        }}
      />
    </div>
  )
}
