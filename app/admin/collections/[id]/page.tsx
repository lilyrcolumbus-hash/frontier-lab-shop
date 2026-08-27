import { notFound } from 'next/navigation'
import { CollectionForm } from '@/components/admin/CollectionForm'
import { prisma } from '@/lib/prisma'

export default async function EditCollectionPage({ params }: { params: { id: string } }) {
  const collection = await prisma.collection.findUnique({ where: { id: params.id } })
  if (!collection) notFound()

  return (
    <div>
      <h1 className="font-body font-bold text-2xl text-cream mb-6">Edit collection</h1>
      <CollectionForm
        collectionId={collection.id}
        initial={{
          titleEn: collection.titleEn,
          titleEs: collection.titleEs,
          descriptionEn: collection.descriptionEn ?? '',
          descriptionEs: collection.descriptionEs ?? '',
          image: collection.image ?? '',
        }}
      />
    </div>
  )
}
