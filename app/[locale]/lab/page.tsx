import { setRequestLocale } from 'next-intl/server'
import { LabTour } from '@/components/lab/LabTour'
import { VideoMoment } from '@/components/ui/VideoMoment'

export default async function LabPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)

  return (
    <div className="pt-16 lg:pt-20">
      <VideoMoment
        src="/video/garden-farm.mp4"
        eyebrow="Step Inside"
        headline="A closer look at what commercial-scale cultivation actually looks like"
        subtext="Racks of mushrooms at every stage of the grow cycle. Explore each room below to see how yours gets made, start to finish."
        align="center"
      />
      <LabTour />
    </div>
  )
}
