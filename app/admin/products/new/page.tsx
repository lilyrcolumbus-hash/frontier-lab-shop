import { ProductForm } from '@/components/admin/ProductForm'

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-body font-bold text-2xl text-cream mb-6">New product</h1>
      <ProductForm
        initial={{
          slug: '',
          nameEn: '',
          nameEs: '',
          descriptionEn: '',
          descriptionEs: '',
          category: 'spawn',
          subcategory: '',
          price: 0,
          compareAtPrice: null,
          images: [],
          isOrganic: false,
          inStock: true,
          tags: [],
          status: 'draft',
          collectionIds: [],
          sku: '',
          stock: 0,
        }}
      />
    </div>
  )
}
