import { getTranslations, setRequestLocale } from 'next-intl/server'
import { LabTour } from '@/components/lab/LabTour'
import { VideoMoment } from '@/components/ui/VideoMoment'
import { prisma } from '@/lib/prisma'
import { toProduct } from '@/lib/product-mappers'
import { LAB_SLUGS } from '@/lib/lab-tour'

// Reads live products, editable via /admin — must not be frozen at build time.
export const dynamic = 'force-dynamic'

export default async function LabPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)
  const t = await getTranslations('lab.page')

  const rows = await prisma.product.findMany({
    where: { slug: { in: LAB_SLUGS }, status: 'active' },
    include: { variants: true, species: true },
  })
  const products = rows.map(toProduct)

  return (
    <div className="pt-16 lg:pt-20">
      <VideoMoment
        src={t('videoUrl')}
        eyebrow={t('eyebrow')}
        headline={t('headline')}
        subtext={t('subtext')}
        align="center"
      />
      <LabTour products={products} />
    </div>
  )
}
