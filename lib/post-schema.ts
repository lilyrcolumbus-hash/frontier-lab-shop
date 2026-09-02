import { z } from 'zod'

/** Shared by the create and update routes — Next.js route files may not export helpers. */
export const postSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'Use lower-case letters, numbers and dashes'),
  titleEn: z.string().trim().min(1).max(200),
  titleEs: z.string().trim().min(1).max(200),
  excerptEn: z.string().trim().max(500).default(''),
  excerptEs: z.string().trim().max(500).default(''),
  bodyEn: z.string().default(''),
  bodyEs: z.string().default(''),
  coverImage: z.string().trim().max(500).optional().nullable(),
  status: z.enum(['draft', 'active']).default('draft'),
  metaTitle: z.string().trim().max(70).optional().nullable(),
  metaDescription: z.string().trim().max(160).optional().nullable(),
})
