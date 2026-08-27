import { SpeciesForm } from '@/components/admin/SpeciesForm'

export default function NewSpeciesPage() {
  return (
    <div>
      <h1 className="font-body font-bold text-2xl text-cream mb-6">New species</h1>
      <SpeciesForm
        initial={{
          slug: '',
          commonName: '',
          scientificName: '',
          family: '',
          order: '',
          type: 'edible',
          difficulty: 'beginner',
          substrate: [],
          colonizationWeeksMin: 2,
          colonizationWeeksMax: 3,
          fruitingTempFMin: 55,
          fruitingTempFMax: 75,
          fruitingTempCMin: 13,
          fruitingTempCMax: 24,
          expectedFlushes: 3,
          biologicalEfficiency: '',
          betaGlucanContent: '',
          indoorOutdoor: 'indoor',
          descriptionEn: '',
          descriptionEs: '',
          cultivationNotesEn: '',
          cultivationNotesEs: '',
          medicalNotesEn: '',
          medicalNotesEs: '',
          cookingNotesEn: '',
          cookingNotesEs: '',
          lookalikes: [],
          imageUrl: '',
          thumbnailUrl: '',
        }}
      />
    </div>
  )
}
