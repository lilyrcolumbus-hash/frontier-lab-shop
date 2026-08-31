import { CollectionForm } from '@/components/admin/CollectionForm'

export default function NewCollectionPage() {
  return (
    <div>
      <h1 className="font-body font-bold text-2xl text-cream mb-6">New collection</h1>
      <CollectionForm initial={{ slug: '', titleEn: '', titleEs: '', descriptionEn: '', descriptionEs: '', image: '', ruleField: '', ruleValue: '' }} />
    </div>
  )
}
