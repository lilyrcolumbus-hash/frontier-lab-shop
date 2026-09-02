import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { EMAIL_TEMPLATES } from '@/lib/email-templates'

const KEYS = EMAIL_TEMPLATES.map((t) => t.key) as [string, ...string[]]

const saveSchema = z.object({
  key: z.enum(KEYS),
  subjectEn: z.string().trim().max(200).default(''),
  subjectEs: z.string().trim().max(200).default(''),
  headingEn: z.string().trim().max(200).default(''),
  headingEs: z.string().trim().max(200).default(''),
  introEn: z.string().trim().max(2000).default(''),
  introEs: z.string().trim().max(2000).default(''),
  footerEn: z.string().trim().max(2000).default(''),
  footerEs: z.string().trim().max(2000).default(''),
})

export const GET = withStoreAdmin(async (_req, { store }) => {
  const rows = await prisma.emailTemplate.findMany({ where: { storeId: store.id } })
  const byKey = new Map(rows.map((r) => [r.key, r]))

  // The definitions come from code; the database only supplies what has been customised.
  const templates = EMAIL_TEMPLATES.map((definition) => ({
    key: definition.key,
    label: definition.label,
    description: definition.description,
    defaults: definition.defaults,
    saved: byKey.get(definition.key) ?? null,
  }))

  return NextResponse.json({ templates })
})

export const PUT = withStoreAdmin(
  async (req, { store }) => {
    const body = await req.json().catch(() => null)
    const parsed = saveSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid template', details: parsed.error.flatten() }, { status: 400 })
    }

    const { key, ...values } = parsed.data
    const template = await prisma.emailTemplate.upsert({
      where: { storeId_key: { storeId: store.id, key } },
      update: values,
      create: { storeId: store.id, key, ...values },
    })

    return NextResponse.json({ template })
  },
  { requireOwner: true }
)
