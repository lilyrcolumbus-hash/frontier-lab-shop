import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { HOME_SECTIONS, getHomeLayout } from '@/lib/home-sections'

const KEYS = HOME_SECTIONS.map((s) => s.key) as [string, ...string[]]

const layoutSchema = z.object({
  sections: z
    .array(z.object({ key: z.enum(KEYS), enabled: z.coerce.boolean(), sortOrder: z.coerce.number().int().min(0) }))
    .min(1),
})

export const GET = withStoreAdmin(async () => {
  return NextResponse.json({ sections: await getHomeLayout() })
})

export const PUT = withStoreAdmin(
  async (req, { store }) => {
    const body = await req.json().catch(() => null)
    const parsed = layoutSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid layout', details: parsed.error.flatten() }, { status: 400 })
    }

    // Upsert rather than replace: a key the code adds later simply has no row yet and falls
    // back to its shipped position until it is saved.
    for (const section of parsed.data.sections) {
      await prisma.homeSection.upsert({
        where: { storeId_key: { storeId: store.id, key: section.key } },
        update: { enabled: section.enabled, sortOrder: section.sortOrder },
        create: { storeId: store.id, key: section.key, enabled: section.enabled, sortOrder: section.sortOrder },
      })
    }

    revalidatePath('/', 'layout')
    return NextResponse.json({ ok: true })
  },
  { requireOwner: true }
)
