import { Prisma } from '@prisma/client'
import { z } from 'zod'

// The product page text (how to use, science, FAQ) is edited in the admin in English. The shop
// is bilingual, so older products still carry real Spanish text: it is kept when the English
// text did not change, and only copied from English when the admin actually edited it.

export const BENEFIT_ICONS = ['brain', 'shield', 'heart', 'leaf', 'activity', 'zap', 'sun', 'droplet'] as const

const growingSchema = z.object({
  difficulty: z.string().max(30),
  colonizationTime: z.string().trim().max(100),
  fruitingTempF: z.string().trim().max(100),
  fruitingTempC: z.string().trim().max(100),
  idealSubstrate: z.string().trim().max(200),
  expectedYield: z.string().trim().max(200),
  indoorOutdoor: z.string().max(30),
})

const bagSchema = z.object({
  bagSize: z.string().trim().max(100),
  sterilization: z.string().trim().max(200),
  moisture: z.string().trim().max(100),
  colonizationEstimate: z.string().trim().max(200),
  recommendedInoculation: z.string().trim().max(200),
  shelfLife: z.string().trim().max(100),
})

export const productContentFields = {
  keyBenefits: z
    .array(z.object({ icon: z.enum(BENEFIT_ICONS), label: z.string().trim().min(1).max(80), detail: z.string().trim().min(1).max(400) }))
    .max(8)
    .optional(),
  growing: growingSchema.optional(),
  bag: bagSchema.optional(),
  howToUse: z.array(z.string().max(1000)).max(30).optional(),
  science: z.string().max(20000).optional(),
  faqs: z
    .array(z.object({ question: z.string().trim().min(1).max(300), answer: z.string().trim().min(1).max(2000) }))
    .max(30)
    .optional(),
}

interface ContentInput {
  keyBenefits?: { icon: (typeof BENEFIT_ICONS)[number]; label: string; detail: string }[]
  growing?: z.infer<typeof growingSchema>
  bag?: z.infer<typeof bagSchema>
  howToUse?: string[]
  science?: string
  faqs?: { question: string; answer: string }[]
}

interface ExistingContent {
  scienceContent: unknown
  faqs: unknown
}

type Localized = { en: string; es: string }

export function contentUpdate(input: ContentInput, existing?: ExistingContent) {
  const data: {
    howToUseSteps?: Prisma.InputJsonValue | typeof Prisma.DbNull
    scienceContent?: Prisma.InputJsonValue | typeof Prisma.DbNull
    faqs?: Prisma.InputJsonValue | typeof Prisma.DbNull
    keyBenefits?: Prisma.InputJsonValue | typeof Prisma.DbNull
    grainBagSpecs?: Prisma.InputJsonValue | typeof Prisma.DbNull
    specsDifficulty?: string | null
    specsColonizationTime?: string | null
    specsFruitingTempF?: string | null
    specsFruitingTempC?: string | null
    specsIdealSubstrate?: string | null
    specsExpectedYield?: string | null
    specsIndoorOutdoor?: string | null
  } = {}

  if (input.howToUse !== undefined) {
    const steps = input.howToUse.map((step) => step.trim()).filter(Boolean)
    data.howToUseSteps = steps.length ? steps : Prisma.DbNull
  }

  if (input.science !== undefined) {
    const text = input.science.trim()
    const current = existing?.scienceContent as Localized | null | undefined
    if (!text) data.scienceContent = Prisma.DbNull
    else data.scienceContent = current?.en === text ? current : { en: text, es: text }
  }

  if (input.faqs !== undefined) {
    const current = (existing?.faqs ?? []) as { q: Localized; a: Localized }[]
    data.faqs = input.faqs.length
      ? input.faqs.map((faq, index) => {
          const before = current[index]
          return {
            q: before?.q?.en === faq.question ? before.q : { en: faq.question, es: faq.question },
            a: before?.a?.en === faq.answer ? before.a : { en: faq.answer, es: faq.answer },
          }
        })
      : Prisma.DbNull
  }

  if (input.keyBenefits !== undefined) {
    data.keyBenefits = input.keyBenefits.length ? input.keyBenefits : Prisma.DbNull
  }

  // An empty box means "not filled in", stored as null so the page hides that block.
  const blank = (value: string) => (value.trim() ? value.trim() : null)
  if (input.growing !== undefined) {
    const g = input.growing
    data.specsDifficulty = blank(g.difficulty)
    data.specsColonizationTime = blank(g.colonizationTime)
    data.specsFruitingTempF = blank(g.fruitingTempF)
    data.specsFruitingTempC = blank(g.fruitingTempC)
    data.specsIdealSubstrate = blank(g.idealSubstrate)
    data.specsExpectedYield = blank(g.expectedYield)
    data.specsIndoorOutdoor = blank(g.indoorOutdoor)
  }
  if (input.bag !== undefined) {
    data.grainBagSpecs = Object.values(input.bag).some((value) => value.trim()) ? input.bag : Prisma.DbNull
  }

  return data
}
