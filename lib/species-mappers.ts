import type { Species as PrismaSpecies } from '@prisma/client'
import type { SpeciesData, SpeciesBenefit } from '@/lib/species-data'

export function toSpeciesData(row: PrismaSpecies): SpeciesData {
  return {
    id: row.id,
    slug: row.slug,
    commonName: row.commonName,
    scientificName: row.scientificName,
    family: row.family,
    order: row.order,
    type: row.type as SpeciesData['type'],
    difficulty: row.difficulty as SpeciesData['difficulty'],
    substrate: row.substrate,
    colonizationWeeks: { min: row.colonizationWeeksMin, max: row.colonizationWeeksMax },
    fruitingTempF: { min: row.fruitingTempFMin, max: row.fruitingTempFMax },
    fruitingTempC: { min: row.fruitingTempCMin, max: row.fruitingTempCMax },
    expectedFlushes: row.expectedFlushes,
    biologicalEfficiency: row.biologicalEfficiency,
    betaGlucanContent: row.betaGlucanContent,
    indoorOutdoor: row.indoorOutdoor as SpeciesData['indoorOutdoor'],
    description: { en: row.descriptionEn, es: row.descriptionEs },
    cultivationNotes: { en: row.cultivationNotesEn, es: row.cultivationNotesEs },
    medicalNotes: { en: row.medicalNotesEn, es: row.medicalNotesEs },
    cookingNotes: { en: row.cookingNotesEn, es: row.cookingNotesEs },
    lookalikes: row.lookalikes,
    imageUrl: row.imageUrl,
    thumbnailUrl: row.thumbnailUrl,
    openartPrompt: row.openartPrompt ?? undefined,
    keyBenefits: (row.keyBenefits as unknown as SpeciesBenefit[]) ?? [],
  }
}
