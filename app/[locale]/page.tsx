import { Fragment } from 'react'
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
import { getHomeLayout, type HomeSectionKey } from '@/lib/home-sections'

export const metadata: Metadata = {
  title: { absolute: 'Frontier Lab — Wild Genetics. Grown in Our Lab.' },
  description:
    "The world's most complete mushroom platform. Premium grow kits, spawn, and the deepest mushroom encyclopedia. Cultivate. Learn. Connect.",
}

// The order and visibility of the sections are stored per store, so this reads the database.
export const dynamic = 'force-dynamic'

// The key each section is known by in /admin/appearance. Adding a section here is a code change
// on purpose: a section is a real component, not something the panel can invent.
const SECTION_COMPONENTS: Record<HomeSectionKey, React.ReactNode> = {
  hero: <Hero />,
  trust: <TrustBar />,
  growJourney: <GrowJourney />,
  videoWild: (
    <VideoMoment
      src="/video/wild-forest.mp4"
      eyebrow="Wild Genetics"
      headline="Real strains, sourced from where mushrooms actually grow"
      subtext="Every Culture Bank syringe starts as a wild-collected strain, isolated and verified in our lab — not a generic culture reused for every species."
    />
  ),
  wild: <WildSection />,
  species: <SpeciesSpotlight />,
  quiz: <QuizTeaser />,
  academy: <AcademyPreview />,
  gallery: <CommunityGallery />,
  newsletter: <Newsletter />,
}

export default async function HomePage() {
  const layout = await getHomeLayout()

  return (
    <>
      {layout
        .filter((section) => section.enabled)
        .map((section) => (
          // A Fragment, not a div: several sections are full-bleed or rely on being direct
          // siblings, so wrapping them would change the layout the site already has.
          <Fragment key={section.key}>{SECTION_COMPONENTS[section.key]}</Fragment>
        ))}
    </>
  )
}
