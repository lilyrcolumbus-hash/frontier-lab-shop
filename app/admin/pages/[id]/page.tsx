import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireStoreAdmin } from '@/lib/require-store-admin'
import { PageForm } from '@/components/admin/PageForm'
import { parseBlocks } from '@/lib/page-blocks'

export default async function EditPagePage({ params }: { params: { id: string } }) {
  const admin = await requireStoreAdmin()
  if (!admin) notFound()

  const page = await prisma.page.findFirst({ where: { id: params.id, storeId: admin.store.id } })
  if (!page) notFound()

  return (
    <div>
      <h1 className="font-heading font-medium text-2xl text-cream mb-6">Edit page</h1>
      <PageForm
        pageId={page.id}
        initial={{
          slug: page.slug,
          titleEn: page.titleEn,
          titleEs: page.titleEs,
          blocks: parseBlocks(page.blocks),
          status: page.status as 'draft' | 'active',
          metaTitle: page.metaTitle ?? '',
          metaDescription: page.metaDescription ?? '',
          showInFooter: page.showInFooter,
          sortOrder: page.sortOrder,
        }}
      />
    </div>
  )
}
