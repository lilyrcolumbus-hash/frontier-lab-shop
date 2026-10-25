import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/admin/ProductForm'
import { prisma } from '@/lib/prisma'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id }, include: { collections: true, variants: true } })
  if (!product) notFound()

  return (
    <div>
      <h1 className="font-heading font-medium text-2xl text-cream mb-6">Edit product</h1>
      <ProductForm
        productId={product.id}
        initial={{
          slug: product.slug,
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
          taxable: product.taxable,
          relatedProducts: product.relatedProducts ?? [],
          howToUse: (product.howToUseSteps as string[] | null) ?? [],
          science: (product.scienceContent as { en?: string } | null)?.en ?? '',
          keyBenefits: (product.keyBenefits as { icon: 'brain' | 'shield' | 'heart' | 'leaf' | 'activity' | 'zap' | 'sun' | 'droplet'; label: string; detail: string }[] | null) ?? [],
          growing: {
            difficulty: product.specsDifficulty ?? '',
            colonizationTime: product.specsColonizationTime ?? '',
            fruitingTempF: product.specsFruitingTempF ?? '',
            fruitingTempC: product.specsFruitingTempC ?? '',
            idealSubstrate: product.specsIdealSubstrate ?? '',
            expectedYield: product.specsExpectedYield ?? '',
            indoorOutdoor: product.specsIndoorOutdoor ?? '',
          },
          bag: {
            bagSize: (product.grainBagSpecs as { bagSize?: string } | null)?.bagSize ?? '',
            sterilization: (product.grainBagSpecs as { sterilization?: string } | null)?.sterilization ?? '',
            moisture: (product.grainBagSpecs as { moisture?: string } | null)?.moisture ?? '',
            colonizationEstimate: (product.grainBagSpecs as { colonizationEstimate?: string } | null)?.colonizationEstimate ?? '',
            recommendedInoculation: (product.grainBagSpecs as { recommendedInoculation?: string } | null)?.recommendedInoculation ?? '',
            shelfLife: (product.grainBagSpecs as { shelfLife?: string } | null)?.shelfLife ?? '',
          },
          faqs: ((product.faqs as { q: { en: string }; a: { en: string } }[] | null) ?? []).map((faq) => ({
            question: faq.q.en,
            answer: faq.a.en,
          })),
          metaTitle: product.metaTitle ?? '',
          metaDescription: product.metaDescription ?? '',
          variants: product.variants.map((v) => ({
            id: v.id,
            name: v.name,
            sku: v.sku,
            price: v.price,
            stock: v.stock,
            cost: v.cost === null ? '' : String(v.cost),
            weightGrams: v.weightGrams === null ? '' : String(v.weightGrams),
          })),
        }}
      />
    </div>
  )
}
