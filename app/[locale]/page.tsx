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
      <WildSection />
      <SpeciesSpotlight />
      <QuizTeaser />
      <AcademyPreview />
      <CommunityGallery />
      <Newsletter />
    </>
  )
}
