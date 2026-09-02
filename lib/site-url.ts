/**
 * Absolute base URL of the storefront.
 *
 * Search engines and social previews need absolute URLs, so this has to be right: canonical
 * links, sitemap entries and Open Graph images are all built on top of it. Set
 * NEXT_PUBLIC_SITE_URL once a custom domain is connected — until then the Vercel production
 * URL is the real address of the store.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shrooms-lilyrcolumbus-hashs-projects.vercel.app'
).replace(/\/$/, '')

/**
 * The public base URL, preferring the domain set in /admin/settings.
 *
 * Async because it reads the store; SITE_URL stays available for the places that cannot await,
 * and is the fallback whenever no domain has been set.
 */
export async function getSiteUrl(): Promise<string> {
  try {
    const { prisma } = await import('@/lib/prisma')
    const store = await prisma.store.findUnique({
      where: { slug: process.env.STORE_SLUG ?? 'frontier-lab' },
      select: { domain: true },
    })
    return store?.domain ? `https://${store.domain.replace(/^https?:\/\//, '').replace(/\/$/, '')}` : SITE_URL
  } catch {
    return SITE_URL
  }
}

/** Locale-aware path — `en` is the default locale and carries no prefix (`localePrefix: 'as-needed'`). */
export function localizedPath(locale: string, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  return locale === 'en' ? clean : `/${locale}${clean}`
}
