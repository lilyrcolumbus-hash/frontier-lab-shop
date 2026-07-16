import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { TrustBar } from '@/components/home/TrustBar'
import { GrowJourney } from '@/components/home/GrowJourney'
import { SpeciesSpotlight } from '@/components/home/SpeciesSpotlight'
import { WildSection } from '@/components/home/WildSection'
import { QuizTeaser } from '@/components/home/QuizTeaser'
import { AcademyPreview } from '@/components/home/AcademyPreview'
import { CommunityGallery } from '@/components/home/CommunityGallery'
import { Newsletter } from '@/components/home/Newsletter'
import { VideoMoment } from '@/components/ui/VideoMoment'

export const metadata: Metadata = {
  title: { absolute: 'Frontier Lab — Wild Genetics. Lab Verified.' },
  description:
    "The world's most complete mushroom platform. Premium grow kits, spawn, and the deepest mushroom encyclopedia. Cultivate. Learn. Connect.",
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <GrowJourney />
      <VideoMoment
        src="/video/wild-forest.mp4"
        eyebrow="Wild Genetics"
        headline="Real strains, sourced from where mushrooms actually grow"
        subtext="Every Culture Bank syringe starts as a wild-collected strain, isolated and verified in our lab — not a generic culture reused for every species."
      />
      <WildSection />
      <SpeciesSpotlight />
      <QuizTeaser />
      <AcademyPreview />
      <CommunityGallery />
      <Newsletter />
    </>
  )
}
