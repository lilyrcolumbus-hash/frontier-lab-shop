/**
 * Restores the DEMO database from prisma/demo-baseline.json: the terminal version of the "Restore demo"
 * button in the demo admin. It also fills a brand new, empty demo database (after `prisma db push`).
 * Never touches the real store: it only reads the snapshot file and writes to DEMO_DATABASE_URL.
 *
 *   set -a; source .env.demo; set +a
 *   npx tsx scripts/restore-demo.ts
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PrismaClient } from '@prisma/client'
import { restoreDemoCatalog, type DemoBaseline } from '../lib/demo-restore'

const STORE_SLUG = 'frontier-lab'

async function main() {
  const url = process.env.DEMO_DIRECT_URL ?? process.env.DEMO_DATABASE_URL
  if (!url) {
    console.error('Set DEMO_DIRECT_URL (or DEMO_DATABASE_URL) from .env.demo.')
    process.exit(1)
  }
  if (url === process.env.DATABASE_URL) {
    console.error('The demo URL equals DATABASE_URL (the real store). Refusing to run.')
    process.exit(1)
  }

  const baseline = JSON.parse(readFileSync(join(__dirname, '..', 'prisma', 'demo-baseline.json'), 'utf8')) as DemoBaseline
  const db = new PrismaClient({ datasources: { db: { url } } })
  try {
    const store = await db.store.upsert({
      where: { slug: STORE_SLUG },
      update: {},
      create: { slug: STORE_SLUG, name: 'Frontier Lab' },
    })
    const counts = await restoreDemoCatalog(db, baseline, store.id)
    const [orders, profiles] = await Promise.all([db.order.count(), db.customerProfile.count()])
    console.log(`Restored demo store ${store.slug}:`, counts)
    console.log(`Orders: ${orders}, customer profiles: ${profiles} (both must be 0). Snapshot taken ${baseline.exportedAt}.`)
  } finally {
    await db.$disconnect()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
