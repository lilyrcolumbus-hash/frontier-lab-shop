import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireStoreAdmin } from '@/lib/require-store-admin'
import { PostForm } from '@/components/admin/PostForm'

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const admin = await requireStoreAdmin()
  if (!admin) notFound()

  const post = await prisma.post.findFirst({ where: { id: params.id, storeId: admin.store.id } })
  if (!post) notFound()

  return (
    <div>
      <h1 className="font-body font-bold text-2xl text-cream mb-6">Edit post</h1>
      <PostForm
        postId={post.id}
        initial={{
          slug: post.slug,
          titleEn: post.titleEn,
          titleEs: post.titleEs,
          excerptEn: post.excerptEn,
          excerptEs: post.excerptEs,
          bodyEn: post.bodyEn,
          bodyEs: post.bodyEs,
          coverImage: post.coverImage ?? '',
          status: post.status as 'draft' | 'active',
          metaTitle: post.metaTitle ?? '',
          metaDescription: post.metaDescription ?? '',
        }}
      />
    </div>
  )
}
