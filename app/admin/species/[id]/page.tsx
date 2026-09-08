import { notFound } from 'next/navigation'
import { SpeciesForm } from '@/components/admin/SpeciesForm'
import { prisma } from '@/lib/prisma'

export default async function EditSpeciesPage({ params }: { params: { id: string } }) {
  const species = await prisma.species.findUnique({ where: { id: params.id } })
  if (!species) notFound()

  return (
    <div>
      <h1 className="font-heading font-medium text-2xl text-cream mb-6">Edit species</h1>
      <SpeciesForm
        speciesId={species.id}
        initial={{
          commonName: species.commonName,
          scientificName: species.scientificName,
          family: species.family,
          order: species.order,
          type: species.type,
          difficulty: species.difficulty,
          substrate: species.substrate,
          colonizationWeeksMin: species.colonizationWeeksMin,
          colonizationWeeksMax: species.colonizationWeeksMax,
          fruitingTempFMin: species.fruitingTempFMin,
          fruitingTempFMax: species.fruitingTempFMax,
          fruitingTempCMin: species.fruitingTempCMin,
          fruitingTempCMax: species.fruitingTempCMax,
          expectedFlushes: species.expectedFlushes,
          biologicalEfficiency: species.biologicalEfficiency,
          betaGlucanContent: species.betaGlucanContent,
          indoorOutdoor: species.indoorOutdoor,
          descriptionEn: species.descriptionEn,
          descriptionEs: species.descriptionEs,
          cultivationNotesEn: species.cultivationNotesEn,
          cultivationNotesEs: species.cultivationNotesEs,
          medicalNotesEn: species.medicalNotesEn,
          medicalNotesEs: species.medicalNotesEs,
          cookingNotesEn: species.cookingNotesEn,
          cookingNotesEs: species.cookingNotesEs,
          lookalikes: species.lookalikes,
          imageUrl: species.imageUrl,
          thumbnailUrl: species.thumbnailUrl,
        }}
      />
    </div>
  )
}
