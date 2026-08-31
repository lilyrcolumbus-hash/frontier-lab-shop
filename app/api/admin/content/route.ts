import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { flattenMessages, type Messages } from '@/lib/site-content'
import enMessages from '@/messages/en.json'
import esMessages from '@/messages/es.json'

const saveSchema = z.object({
  key: z.string().trim().min(1).max(200),
  valueEn: z.string().max(5000),
  valueEs: z.string().max(5000),
})

/** Every editable piece of site text, with the shipped default and any saved override. */
export const GET = withStoreAdmin(async (_req, { store }) => {
  const defaultsEn = flattenMessages(enMessages as Messages)
  const defaultsEs = flattenMessages(esMessages as Messages)

  const overrides = await prisma.siteContent.findMany({
    where: { storeId: store.id },
    select: { key: true, valueEn: true, valueEs: true },
  })
  const byKey = new Map(overrides.map((o) => [o.key, o]))

  const entries = Object.keys(defaultsEn).map((key) => {
    const override = byKey.get(key)
    return {
      key,
      // The section is the first segment — "home.hero.title" groups under "home".
      section: key.split('.')[0],
      defaultEn: defaultsEn[key],
      defaultEs: defaultsEs[key] ?? defaultsEn[key],
      valueEn: override?.valueEn ?? '',
      valueEs: override?.valueEs ?? '',
      edited: Boolean(override),
    }
  })

  return NextResponse.json({ entries })
})

export const PUT = withStoreAdmin(async (req, { store }) => {
  const body = await req.json().catch(() => null)
  const parsed = saveSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid content', details: parsed.error.flatten() }, { status: 400 })
  }

  const { key, valueEn, valueEs } = parsed.data

  // Only keys that exist in the shipped messages can be written — an arbitrary key would be
  // dead weight the site never reads, and lets the table fill with junk.
  const defaults = flattenMessages(enMessages as Messages)
  if (!(key in defaults)) {
    return NextResponse.json({ error: 'That text does not exist on the site.' }, { status: 400 })
  }

  // Clearing both boxes removes the override entirely and restores the shipped text.
  if (valueEn.trim() === '' && valueEs.trim() === '') {
    await prisma.siteContent.deleteMany({ where: { storeId: store.id, key } })
    // Storefront pages are cached with their text already rendered in, so they have to be
    // rebuilt for an edit to show. 'layout' covers every page under the root layout.
    revalidatePath('/', 'layout')
    return NextResponse.json({ reset: true })
  }

  const content = await prisma.siteContent.upsert({
    where: { storeId_key: { storeId: store.id, key } },
    update: { valueEn, valueEs },
    create: { storeId: store.id, key, valueEn, valueEs },
  })
  revalidatePath('/', 'layout')

  return NextResponse.json({ content })
})
