import { setRequestLocale } from 'next-intl/server'
import { GardenTour } from '@/components/garden/GardenTour'

export default async function GardenPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)

  return (
    <div className="pt-16 lg:pt-20">
      <GardenTour />
    </div>
  )
}
