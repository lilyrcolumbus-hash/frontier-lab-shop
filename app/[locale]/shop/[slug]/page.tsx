import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ProductDetailClient } from '@/components/shop/ProductDetailClient'
import { ProductCard } from '@/components/shop/ProductCard'
import { getProduct, getProductRow, getProductsBySlugs, productSeo } from '@/lib/fl/products'
import { photoUrl } from '@/lib/fl/client'
import { toProduct } from '@/lib/fl/mappers'
import { SITE_URL, localizedPath } from '@/lib/site-url'

// Reads live from the DB, editable via /admin — must not be frozen at build time.
export const dynamic = 'force-dynamic'

/** Trims to a length search engines actually display, cutting on a word boundary. */
function truncate(text: string, max: number): string {
  const plain = text.replace(/\s+/g, ' ').trim()
  if (plain.length <= max) return plain
  const cut = plain.slice(0, max)
  return `${cut.slice(0, cut.lastIndexOf(' ')) || cut}…`
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string }
}): Promise<Metadata> {
  const row = await getProductRow(params.slug)
  if (!row) return {}
  const product = toProduct(row, photoUrl)

  const isSpanish = params.locale === 'es'
  const name = isSpanish ? product.name.es : product.name.en
  const description = isSpanish ? product.description.es : product.description.en

  // The admin's search-listing override wins; otherwise the product's own copy is the honest default.
  const seo = productSeo(row, isSpanish ? 'es' : 'en')
  const title = seo.title || name
  const summary = seo.description || truncate(description, 160)
  const path = localizedPath(params.locale, `/shop/${params.slug}`)

  return {
    title,
    description: summary,
    alternates: {
      canonical: path,
      languages: {
        en: `/shop/${params.slug}`,
        es: `/es/shop/${params.slug}`,
      },
    },
    openGraph: {
      type: 'website',
      title,
      description: summary,
      url: `${SITE_URL}${path}`,
      images: product.images.length ? [{ url: product.images[0], alt: product.imageAlts?.[0] || name }] : undefined,
    },
  }
}

export default async function ProductPage({ params }: { params: { slug: string; locale: string } }) {
  setRequestLocale(params.locale)

  const product = await getProduct(params.slug)
  if (!product) notFound()

  // Related products are stored as slugs. A draft or deleted slug simply drops out of the row
  // rather than rendering a dead card, and the admin's chosen order is preserved.
  const related = await getProductsBySlugs(product.relatedProducts)

  const t = await getTranslations({ locale: params.locale, namespace: 'shop.product' })

  return (
    <>
      <ProductDetailClient product={product} />

      {related.length > 0 && (
        <section className="border-t border-ds-border bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
            <h2 className="font-heading font-medium text-2xl sm:text-3xl tracking-tight text-cream mb-8">
              {t('related')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((candidate) => (
                <ProductCard key={candidate.id} product={candidate} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
