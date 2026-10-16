import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { prisma } from '@/lib/prisma'
import { IS_DEMO } from '@/lib/site-mode'
import { restoreDemoCatalog, type DemoBaseline } from '@/lib/demo-restore'
import baseline from '@/prisma/demo-baseline.json'

// Writing back the whole catalog takes a few seconds; Hobby plans allow up to 60.
export const maxDuration = 60

/**
 * "Restore demo": puts the public demo back to the snapshot in prisma/demo-baseline.json. It exists only
 * on the demo deployment and only the demo account can call it, so on the real store this is a 404.
 */
export const POST = withStoreAdmin(async (_req, admin) => {
  if (!IS_DEMO || !admin.isDemo) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  try {
    const counts = await restoreDemoCatalog(prisma, baseline as unknown as DemoBaseline, admin.store.id)
    // Shop and product pages read the database on every visit, but the site texts and home sections are
    // cached, so refresh the whole site.
    revalidatePath('/', 'layout')
    return NextResponse.json({ ok: true, counts })
  } catch (error) {
    console.error('[demo reset] failed', error)
    return NextResponse.json({ error: 'Could not restore the demo. Please try again in a moment.' }, { status: 500 })
  }
})
