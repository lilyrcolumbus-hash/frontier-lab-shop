import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { GuideViewer } from '@/components/guide/GuideViewer'
import { prisma } from '@/lib/prisma'
import type { Guide } from '@/lib/guide'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string; locale: string }
}

async function loadGuide(slug: string) {
  const row = await prisma.product.findFirst({
    where: { status: 'active', guide: { path: ['slug'], equals: slug } },
    select: { nameEn: true, guide: true },
  })
  return row ? { name: row.nameEn, guide: row.guide as unknown as Guide } : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await loadGuide(params.slug)
  if (!found) return {}
  return { title: `${found.name}: instructions`, description: found.guide.intro || undefined }
}

export default async function GuidePage({ params }: Props) {
  setRequestLocale(params.locale)
  const found = await loadGuide(params.slug)
  if (!found) notFound()

  // Products the "What you need" list links to; only the ones that exist and are on sale.
  const linkSlugs = found.guide.needs.map((need) => need.linkSlug).filter(Boolean)
  const linked = linkSlugs.length
    ? await prisma.product.findMany({ where: { slug: { in: linkSlugs }, status: 'active' }, select: { slug: true, nameEn: true } })
    : []
  const linkNames = Object.fromEntries(linked.map((product) => [product.slug, product.nameEn]))
  const safeGuide: Guide = {
    ...found.guide,
    needs: found.guide.needs.map((need) => (need.linkSlug && !linkNames[need.linkSlug] ? { ...need, linkSlug: '' } : need)),
  }

  return <GuideViewer productName={found.name} guide={safeGuide} linkNames={linkNames} />
}
