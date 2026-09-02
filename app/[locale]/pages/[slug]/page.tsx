import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { getPage } from '@/lib/pages'
import { BlockRenderer } from '@/components/pages/BlockRenderer'
import { SITE_URL, localizedPath } from '@/lib/site-url'

// Pages are created and published from /admin/pages, so this must not be frozen at build time.
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string }
}): Promise<Metadata> {
  const page = await getPage(params.slug, params.locale)
  if (!page) return {}

  const path = localizedPath(params.locale, `/pages/${params.slug}`)
  return {
    title: page.metaTitle?.trim() || page.title,
    description: page.metaDescription?.trim() || undefined,
    alternates: {
      canonical: path,
      languages: { en: `/pages/${params.slug}`, es: `/es/pages/${params.slug}` },
    },
    openGraph: { type: 'website', title: page.title, url: `${SITE_URL}${path}` },
  }
}

export default async function CustomPage({ params }: { params: { slug: string; locale: string } }) {
  setRequestLocale(params.locale)

  const page = await getPage(params.slug, params.locale)
  if (!page) notFound()

  return (
    <div className="pt-20 min-h-screen">
      <div className="border-b border-ds-border bg-surface py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-body font-bold text-3xl sm:text-4xl tracking-tight text-cream">{page.title}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <BlockRenderer blocks={page.blocks} locale={params.locale === 'es' ? 'es' : 'en'} />
      </div>
    </div>
  )
}
