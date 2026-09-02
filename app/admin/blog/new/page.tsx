import { PostForm } from '@/components/admin/PostForm'

export default function NewPostPage() {
  return (
    <div>
      <h1 className="font-body font-bold text-2xl text-cream mb-6">Add post</h1>
      <PostForm
        initial={{
          slug: '',
          titleEn: '',
          titleEs: '',
          excerptEn: '',
          excerptEs: '',
          bodyEn: '',
          bodyEs: '',
          coverImage: '',
          status: 'draft',
          metaTitle: '',
          metaDescription: '',
        }}
      />
    </div>
  )
}
