import type { MetadataRoute } from 'next'
import { listProductSlugs } from '@/lib/fl/products'
import { listSpeciesSlugs } from '@/lib/fl/species'
import { SITE_URL, localizedPath } from '@/lib/site-url'

// The catalog is edited from /admin, so the sitemap is generated per request rather than
// frozen at build time — a product published today is listed today.
export const dynamic = 'force-dynamic'
export const revalidate = 0

const LOCALES = ['en', 'es'] as const

/** Pages that exist for both locales and are not driven by the database. */
const STATIC_PATHS = [
  '/', '/shop', '/encyclopedia', '/learn', '/lab', '/community',
  '/tools/grow-calculator', '/tools/species-finder',
  '/about', '/faq', '/contact', '/shipping', '/returns', '/track',
  '/careers', '/press', '/affiliates', '/privacy', '/terms',
]

function entry(path: string, lastModified?: Date): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${path}`,
    lastModified,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((locale) => [locale, `${SITE_URL}${localizedPath(locale, path)}`])
      ),
    },
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, species] = await Promise.all([
    listProductSlugs(),
    listSpeciesSlugs(),
  ])

  return [
    ...STATIC_PATHS.map((path) => entry(path)),
    ...products.map((p) => entry(`/shop/${p.slug}`, new Date(p.updated_at))),
    ...species.map((s) => entry(`/encyclopedia/${s.slug}`, new Date(s.updated_at))),
  ]
}
