import { PageForm } from '@/components/admin/PageForm'

export default function NewPagePage() {
  return (
    <div>
      <h1 className="font-body font-bold text-2xl text-cream mb-6">Add page</h1>
      <PageForm
        initial={{
          slug: '',
          titleEn: '',
          titleEs: '',
          blocks: [],
          status: 'draft',
          metaTitle: '',
          metaDescription: '',
          showInFooter: false,
          sortOrder: 0,
        }}
      />
    </div>
  )
}
