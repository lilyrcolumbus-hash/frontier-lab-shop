/**
 * Writes prisma/demo-baseline.json: a snapshot of the real store's PUBLIC catalog and site content that
 * the demo's "Restore demo" button writes back. Read-only on the real database. Re-run it when the real
 * catalog changes and commit the new file.
 *
 *   set -a; source .env.local; set +a
 *   npx tsx scripts/export-demo-baseline.ts
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { PrismaClient } from '@prisma/client'
import { buildBaseline } from '../lib/demo-restore'

const STORE_SLUG = 'frontier-lab'
const PRIVATE_EMAIL = 'lyhoffllc.info@gmail.com'
const PUBLIC_EMAIL = 'codebake.SaaS@outlook.com'

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('Set DATABASE_URL (the real store, from .env.local).')
    process.exit(1)
  }
  const db = new PrismaClient()
  try {
    const store = await db.store.findUniqueOrThrow({ where: { slug: STORE_SLUG } })
    const baseline = await buildBaseline(db, store.id)
    // This file is committed to a public repository, whose single public contact email is the CodeBake
    // one. The legal pages in the real database still carry the owner's Gmail, so it is swapped here,
    // in the demo copy only (the real store is not touched).
    const text = JSON.stringify(baseline, null, 1).split(PRIVATE_EMAIL).join(PUBLIC_EMAIL)
    const file = join(__dirname, '..', 'prisma', 'demo-baseline.json')
    writeFileSync(file, text + '\n')
    console.log(
      `Wrote ${file}: ${baseline.products.length} products, ${baseline.variants.length} variants, ` +
        `${baseline.species.length} species, ${baseline.collections.length} collections, ${baseline.pages.length} pages, ` +
        `${baseline.posts.length} posts, ${baseline.siteContent.length} text overrides`
    )
  } finally {
    await db.$disconnect()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
