import type { Metadata } from 'next'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/navigation'
import { prisma } from '@/lib/prisma'
import { localizedPath, SITE_URL } from '@/lib/site-url'

// Posts are published from /admin/blog, so the index must reflect the database on each request.
export const dynamic = 'force-dynamic'

const STORE_SLUG = process.env.STORE_SLUG ?? 'frontier-lab'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const path = localizedPath(params.locale, '/blog')
  const title = params.locale === 'es' ? 'Blog' : 'Blog'
  return {
    title,
    alternates: { canonical: path, languages: { en: '/blog', es: '/es/blog' } },
    openGraph: { type: 'website', title, url: `${SITE_URL}${path}` },
  }
}

export default async function BlogIndexPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const isSpanish = params.locale === 'es'

  const posts = await prisma.post.findMany({
    where: { status: 'active', store: { slug: STORE_SLUG } },
    orderBy: [{ publishedAt: 'desc' }],
  })

  return (
    <div className="pt-20 min-h-screen">
      <div className="border-b border-ds-border bg-surface py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h1 className="font-heading font-medium text-3xl sm:text-4xl tracking-tight text-cream">Blog</h1>
          <p className="mt-3 text-cream-muted">
            {isSpanish ? 'Notas del laboratorio y del cultivo.' : 'Notes from the lab and the grow room.'}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {posts.length === 0 ? (
          <p className="text-cream-muted">
            {isSpanish ? 'Todavía no hay artículos.' : 'No articles yet.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                {post.coverImage ? (
                  <div className="relative aspect-[16/10] rounded-none overflow-hidden border border-ds-border mb-4">
                    <Image
                      src={post.coverImage}
                      alt={isSpanish ? post.titleEs : post.titleEn}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 380px"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] rounded-none border border-dashed border-ds-border bg-elevated mb-4" />
                )}
                <h2 className="font-body font-semibold text-lg text-cream group-hover:text-accent transition-colors">
                  {isSpanish ? post.titleEs : post.titleEn}
                </h2>
                {post.publishedAt && (
                  <p className="text-xs text-cream-muted/70 mt-1">
                    {new Date(post.publishedAt).toLocaleDateString(isSpanish ? 'es' : 'en')}
                  </p>
                )}
                <p className="text-sm text-cream-muted mt-2 line-clamp-3">
                  {isSpanish ? post.excerptEs || post.excerptEn : post.excerptEn}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
