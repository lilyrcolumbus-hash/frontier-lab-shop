import { prisma } from '@/lib/prisma'
import { parseBlocks, type PageBlock } from '@/lib/page-blocks'

const STORE_SLUG = process.env.STORE_SLUG ?? 'frontier-lab'

export interface StorePage {
  slug: string
  title: string
  blocks: PageBlock[]
  metaTitle: string | null
  metaDescription: string | null
}

/**
 * A published page by slug, in the requested language.
 *
 * Returns null when there is no page — the caller decides whether that means a 404 or falling
 * back to copy that still lives in code, which is how the legal routes stay safe during the move.
 */
export async function getPage(slug: string, locale: string): Promise<StorePage | null> {
  try {
    const page = await prisma.page.findFirst({
      where: { slug, status: 'active', store: { slug: STORE_SLUG } },
    })
    if (!page) return null

    return {
      slug: page.slug,
      title: locale === 'es' ? page.titleEs : page.titleEn,
      blocks: parseBlocks(page.blocks),
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
    }
  } catch (err) {
    console.error('[pages] could not load page', slug, err)
    return null
  }
}

/** Published pages flagged for the footer, in the order the owner set. */
export async function getFooterPages(locale: string): Promise<{ slug: string; title: string }[]> {
  try {
    const pages = await prisma.page.findMany({
      where: { status: 'active', showInFooter: true, store: { slug: STORE_SLUG } },
      orderBy: [{ sortOrder: 'asc' }, { titleEn: 'asc' }],
      select: { slug: true, titleEn: true, titleEs: true },
    })
    return pages.map((p) => ({ slug: p.slug, title: locale === 'es' ? p.titleEs : p.titleEn }))
  } catch {
    return []
  }
}
