export interface Species {
  id: string
  slug: string
  commonName: string
  scientificName: string
  family: string
  order: string
  type: 'edible' | 'medicinal' | 'toxic' | 'psychoactive' | 'wild-only'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  substrate: string[]
  colonizationWeeks: { min: number; max: number }
  fruitingTempF: { min: number; max: number }
  fruitingTempC: { min: number; max: number }
  expectedFlushes: number
  biologicalEfficiency: string
  betaGlucanContent: string
  indoorOutdoor: 'indoor' | 'outdoor' | 'both'
  description: Record<'en' | 'es', string>
  cultivationNotes: Record<'en' | 'es', string>
  medicalNotes: Record<'en' | 'es', string>
  cookingNotes: Record<'en' | 'es', string>
  lookalikes: string[]
  imageUrl: string
  thumbnailUrl: string
}

export const difficultyColors: Record<Species['difficulty'], string> = {
  beginner: 'bg-success/20 text-success border-success/30',
  intermediate: 'bg-warning/20 text-warning border-warning/30',
  advanced: 'bg-error/20 text-error border-error/30',
}

export const typeColors: Record<Species['type'], string> = {
  edible: 'bg-moss/20 text-moss border-moss/30',
  medicinal: 'bg-accent/20 text-accent border-accent/30',
  toxic: 'bg-error/20 text-error border-error/30',
  psychoactive: 'bg-warning/20 text-warning border-warning/30',
  'wild-only': 'bg-cream-muted/20 text-cream-muted border-cream-muted/30',
}
