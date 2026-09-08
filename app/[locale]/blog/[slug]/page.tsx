import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { prisma } from '@/lib/prisma'
import { localizedPath, SITE_URL } from '@/lib/site-url'

export const dynamic = 'force-dynamic'

const STORE_SLUG = process.env.STORE_SLUG ?? 'frontier-lab'

async function loadPost(slug: string) {
  return prisma.post.findFirst({ where: { slug, status: 'active', store: { slug: STORE_SLUG } } })
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string }
}): Promise<Metadata> {
  const post = await loadPost(params.slug)
  if (!post) return {}

  const isSpanish = params.locale === 'es'
  const title = post.metaTitle?.trim() || (isSpanish ? post.titleEs : post.titleEn)
  const description = post.metaDescription?.trim() || (isSpanish ? post.excerptEs : post.excerptEn) || undefined
  const path = localizedPath(params.locale, `/blog/${params.slug}`)

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: { en: `/blog/${params.slug}`, es: `/es/blog/${params.slug}` },
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${SITE_URL}${path}`,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string; locale: string } }) {
  setRequestLocale(params.locale)

  const post = await loadPost(params.slug)
  if (!post) notFound()

  const isSpanish = params.locale === 'es'
  const body = (isSpanish ? post.bodyEs : post.bodyEn) || post.bodyEn

  return (
    <div className="pt-20 min-h-screen">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-heading font-medium text-3xl sm:text-4xl tracking-tight text-cream">
          {isSpanish ? post.titleEs : post.titleEn}
        </h1>
        {post.publishedAt && (
          <p className="text-sm text-cream-muted mt-3">
            {new Date(post.publishedAt).toLocaleDateString(isSpanish ? 'es' : 'en')}
          </p>
        )}

        {post.coverImage && (
          <div className="relative aspect-[16/9] rounded-none overflow-hidden border border-ds-border my-8">
            <Image src={post.coverImage} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
          </div>
        )}

        {/* The editor is a plain textarea, so a blank line starts a new paragraph. */}
        <div className="space-y-4 mt-8">
          {body.split(/\n{2,}/).map((paragraph, i) => (
            <p key={i} className="text-cream-muted leading-relaxed whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  )
}
