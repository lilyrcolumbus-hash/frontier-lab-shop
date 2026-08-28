/**
 * One-time backfill (multi-tenant Phase 1): create the first Store row ("Frontier Lab"),
 * grant every ADMIN_EMAILS address ownership of it via StoreMember, then stamp storeId onto
 * every existing row across all 10 previously-global models. Re-runnable — upserts throughout,
 * and the storeId backfill only ever fills rows that are still null.
 */
import { createClient } from '@supabase/supabase-js'
import { prisma } from '../lib/prisma'

const STORE_SLUG = 'frontier-lab'
const STORE_NAME = 'Frontier Lab'

const SCOPED_MODELS = [
  'species',
  'product',
  'collection',
  'productVariant',
  'order',
  'orderItem',
  'growJournalEntry',
  'wishlistItem',
  'newsletterSubscriber',
  'review',
] as const

async function countNullByModel() {
  const counts: Record<string, number> = {}
  for (const model of SCOPED_MODELS) {
    // @ts-expect-error — dynamic model access, all 10 models share the storeId column
    counts[model] = await prisma[model].count({ where: { storeId: null } })
  }
  return counts
}

async function main() {
  // 1. Create (or reuse) the Frontier Lab store.
  const store = await prisma.store.upsert({
    where: { slug: STORE_SLUG },
    update: { name: STORE_NAME },
    create: { slug: STORE_SLUG, name: STORE_NAME },
  })
  console.log(`Store: ${store.slug} (${store.id})`)

  // 2. Grant ownership to every ADMIN_EMAILS address via the Supabase Admin API.
  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  if (adminEmails.length === 0) {
    console.warn('ADMIN_EMAILS is empty — no StoreMember rows will be created. Set it before running in a fresh environment.')
  } else {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    // listUsers paginates; ADMIN_EMAILS today has exactly 1 address, but loop pages defensively.
    let page = 1
    const matched = new Map<string, string>() // email -> user id
    while (matched.size < adminEmails.length) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
      if (error) throw error
      if (data.users.length === 0) break
      for (const u of data.users) {
        if (u.email && adminEmails.includes(u.email.toLowerCase())) {
          matched.set(u.email.toLowerCase(), u.id)
        }
      }
      page++
    }

    for (const email of adminEmails) {
      const userId = matched.get(email)
      if (!userId) {
        console.warn(`No Supabase auth user found for admin email ${email} — skipping StoreMember creation, run again once they've signed up.`)
        continue
      }
      await prisma.storeMember.upsert({
        where: { storeId_userId: { storeId: store.id, userId } },
        update: { role: 'owner' },
        create: { storeId: store.id, userId, role: 'owner' },
      })
      console.log(`StoreMember: ${email} (${userId}) -> owner of ${store.slug}`)
    }
  }

  // 3. Backfill storeId on every previously-global model.
  const before = await countNullByModel()
  console.log('Rows missing storeId before backfill:', before)

  for (const model of SCOPED_MODELS) {
    // @ts-expect-error — dynamic model access, all 10 models share the storeId column
    const result = await prisma[model].updateMany({ where: { storeId: null }, data: { storeId: store.id } })
    console.log(`${model}: backfilled ${result.count} row(s)`)
  }

  const after = await countNullByModel()
  console.log('Rows missing storeId after backfill:', after)

  const stillNull = Object.values(after).some((c) => c > 0)
  if (stillNull) {
    console.error('Some rows still have a null storeId — do NOT proceed to making storeId required until this is 0 across the board.')
    process.exit(1)
  }
  console.log('All scoped rows now have a storeId. Safe to push storeId as required next.')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
