import { z } from 'zod'

// An "instructions guide" belongs to one product: a short intro, what the customer needs, any
// number of steps (each with any number of photos or videos), and an optional normal-vs-problem
// example. It is stored as one JSON value on the product and shown at /guide/<slug>, which is
// where the QR code on the label points (through the short address /g/<slug>).

export const GUIDE_BUCKET = 'guide-media'
export const GUIDE_STORAGE_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${GUIDE_BUCKET}/`

export const GUIDE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const
export const GUIDE_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'] as const
export const GUIDE_MAX_IMAGE_BYTES = 10 * 1024 * 1024
export const GUIDE_MAX_VIDEO_BYTES = 40 * 1024 * 1024

export interface GuideMedia {
  kind: 'photo' | 'video'
  url: string
  caption: string
  /** Short label shown on top of the item, for example "Mix now". Empty means none. */
  badge: string
}

export interface GuideStep {
  title: string
  text: string
  important: string
  media: GuideMedia[]
}

export interface GuideNeed {
  text: string
  /** Small tag next to the item, for example "Not included". */
  note: string
  /** Slug of one of our own products to link to, for example the syringe the customer must buy. */
  linkSlug: string
}

export interface GuideExample {
  text: string
  photoUrl: string
}

export interface Guide {
  slug: string
  intro: string
  needs: GuideNeed[]
  steps: GuideStep[]
  normal: GuideExample
  problem: GuideExample
  helpEmail: string
}

const mediaUrl = z.string().refine((value) => value === '' || value.startsWith(GUIDE_STORAGE_PREFIX), 'Media must be uploaded here')

const mediaSchema = z.object({
  kind: z.enum(['photo', 'video']),
  url: mediaUrl.refine((value) => value !== '', 'Missing file'),
  caption: z.string().trim().max(300),
  badge: z.string().trim().max(24),
})

const stepSchema = z.object({
  title: z.string().trim().min(1).max(80),
  text: z.string().trim().max(2000),
  important: z.string().trim().max(500),
  media: z.array(mediaSchema).max(20),
})

const exampleSchema = z.object({ text: z.string().trim().max(500), photoUrl: mediaUrl })

export const guideSchema = z.object({
  slug: z.string().trim().min(1).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Address must be lowercase letters, numbers and hyphens'),
  intro: z.string().trim().max(400),
  needs: z
    .array(z.object({ text: z.string().trim().min(1).max(200), note: z.string().trim().max(40), linkSlug: z.string().trim().max(200) }))
    .max(30),
  steps: z.array(stepSchema).max(30),
  normal: exampleSchema,
  problem: exampleSchema,
  helpEmail: z.string().trim().max(200),
})

export function emptyGuide(slug: string): Guide {
  return {
    slug,
    intro: '',
    needs: [],
    steps: [],
    normal: { text: '', photoUrl: '' },
    problem: { text: '', photoUrl: '' },
    helpEmail: '',
  }
}

/** Turns a product slug or name into a clean guide address. */
export function guideSlugFrom(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
