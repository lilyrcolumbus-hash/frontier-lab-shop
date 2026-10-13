/**
 * Copies the public catalog and site content from the REAL database into the empty DEMO database,
 * so the public demo shows the real products, species, pages and texts with no customer data.
 *
 * Reads from SOURCE (the real store, read-only: only findMany is ever called on it) and writes to
 * TARGET (the demo). Never copied: orders, order items/events, customers, reviews, newsletter
 * subscribers, grow journals, wishlists, store members, MCP tokens, gift cards, tax rates (they point
 * at the real Stripe account), locations and inventory levels.
 *
 * Re-runnable: it clears the demo catalog tables first, then copies again.
 *
 *   set -a; source .env.local; source .env.demo; set +a
 *   DATABASE_URL="$DEMO_DATABASE_URL" DIRECT_URL="$DEMO_DIRECT_URL" npx prisma db push
 *   npx tsx scripts/clone-catalog-to-demo.ts
 */
import { Prisma, PrismaClient } from '@prisma/client'

const SOURCE_URL = process.env.DATABASE_URL
const TARGET_URL = process.env.DEMO_DATABASE_URL
const STORE_SLUG = 'frontier-lab'

function hostOf(url: string): string {
  return new URL(url).hostname
}

if (!SOURCE_URL || !TARGET_URL) {
  console.error('Set DATABASE_URL (real store, from .env.local) and DEMO_DATABASE_URL (from .env.demo).')
  process.exit(1)
}
if (hostOf(SOURCE_URL) === hostOf(TARGET_URL) && SOURCE_URL.split('/').pop() === TARGET_URL.split('/').pop()) {
  console.error('SOURCE and TARGET point at the same database. Refusing to run.')
  process.exit(1)
}

const source = new PrismaClient({ datasources: { db: { url: SOURCE_URL } } })
const target = new PrismaClient({ datasources: { db: { url: TARGET_URL } } })

// Json columns reject a plain null in createMany; omitting the key stores null instead.
const jsonFields = new Map<string, string[]>()
for (const model of Prisma.dmmf.datamodel.models) {
  jsonFields.set(model.name, model.fields.filter((f) => f.type === 'Json').map((f) => f.name))
}

function build(model: string, row: Record<string, unknown>, storeId: string): Record<string, unknown> {
  const out: Record<string, unknown> = { ...row, storeId }
  for (const field of jsonFields.get(model) ?? []) {
    if (out[field] === null) delete out[field]
  }
  return out
}

// Rows without Json columns keep their own type.
function clean<T extends Record<string, unknown>>(model: string, row: T, storeId: string): T {
  return build(model, row, storeId) as T
}

// Rows with Json columns: Prisma reads them as JsonValue but its create input rejects a null one, so
// the null keys are dropped in build() and the result is typed as the create input.
function cleanInput<R>(model: string, row: Record<string, unknown>, storeId: string): R {
  return build(model, row, storeId) as unknown as R
}

async function main() {
  const realStore = await source.store.findUniqueOrThrow({ where: { slug: STORE_SLUG } })

  // Clear the demo catalog (children first). Orders and customers do not exist in the demo.
  await target.shippingRate.deleteMany()
  await target.shippingZone.deleteMany()
  await target.emailTemplate.deleteMany()
  await target.siteContent.deleteMany()
  await target.homeSection.deleteMany()
  await target.post.deleteMany()
  await target.page.deleteMany()
  await target.productVariant.deleteMany()
  await target.product.deleteMany()
  await target.collection.deleteMany()
  await target.species.deleteMany()

  // The demo store keeps the real name and settings but none of the private details.
  const store = await target.store.upsert({
    where: { slug: STORE_SLUG },
    update: {},
    create: {
      slug: STORE_SLUG,
      name: realStore.name,
      supportEmail: realStore.supportEmail,
      country: realStore.country,
      currency: realStore.currency,
      shippingRate: realStore.shippingRate,
      freeShippingThreshold: realStore.freeShippingThreshold,
      lowStockThreshold: realStore.lowStockThreshold,
      themeAccent: realStore.themeAccent,
      themeAmber: realStore.themeAmber,
      themeInk: realStore.themeInk,
      themeInkMuted: realStore.themeInkMuted,
      themeBg: realStore.themeBg,
      themeSurface: realStore.themeSurface,
      themeElevated: realStore.themeElevated,
      themeBorder: realStore.themeBorder,
    },
  })
  console.log(`Demo store: ${store.slug} (${store.id})`)

  const species = await source.species.findMany({ where: { storeId: realStore.id } })
  await target.species.createMany({ data: species.map((r) => cleanInput<Prisma.SpeciesCreateManyInput>('Species', r, store.id)) })
  console.log(`species: ${species.length}`)

  // Collections first (without product links), then products, then link them.
  const collections = await source.collection.findMany({
    where: { storeId: realStore.id },
    include: { products: { select: { id: true } } },
  })
  await target.collection.createMany({
    data: collections.map(({ products: _products, ...rest }) => clean('Collection', rest, store.id)),
  })
  console.log(`collections: ${collections.length}`)

  const products = await source.product.findMany({ where: { storeId: realStore.id } })
  await target.product.createMany({ data: products.map((r) => cleanInput<Prisma.ProductCreateManyInput>('Product', r, store.id)) })
  console.log(`products: ${products.length}`)

  const variants = await source.productVariant.findMany({ where: { storeId: realStore.id } })
  await target.productVariant.createMany({ data: variants.map((r) => clean('ProductVariant', r, store.id)) })
  console.log(`variants: ${variants.length}`)

  for (const collection of collections) {
    if (collection.products.length === 0) continue
    await target.collection.update({
      where: { id: collection.id },
      data: { products: { connect: collection.products.map((p) => ({ id: p.id })) } },
    })
  }

  const pages = await source.page.findMany({ where: { storeId: realStore.id } })
  await target.page.createMany({ data: pages.map((r) => cleanInput<Prisma.PageCreateManyInput>('Page', r, store.id)) })
  console.log(`pages: ${pages.length}`)

  const posts = await source.post.findMany({ where: { storeId: realStore.id, status: 'active' } })
  await target.post.createMany({ data: posts.map((r) => clean('Post', r, store.id)) })
  console.log(`posts (published only): ${posts.length}`)

  const homeSections = await source.homeSection.findMany({ where: { storeId: realStore.id } })
  await target.homeSection.createMany({ data: homeSections.map((r) => clean('HomeSection', r, store.id)) })
  console.log(`home sections: ${homeSections.length}`)

  const content = await source.siteContent.findMany({ where: { storeId: realStore.id } })
  await target.siteContent.createMany({ data: content.map((r) => clean('SiteContent', r, store.id)) })
  console.log(`site text overrides: ${content.length}`)

  const templates = await source.emailTemplate.findMany({ where: { storeId: realStore.id } })
  await target.emailTemplate.createMany({ data: templates.map((r) => clean('EmailTemplate', r, store.id)) })
  console.log(`email templates: ${templates.length}`)

  const zones = await source.shippingZone.findMany({ where: { storeId: realStore.id } })
  await target.shippingZone.createMany({ data: zones.map((r) => clean('ShippingZone', r, store.id)) })
  const rates = await source.shippingRate.findMany({ where: { storeId: realStore.id } })
  await target.shippingRate.createMany({ data: rates.map((r) => clean('ShippingRate', r, store.id)) })
  console.log(`shipping zones: ${zones.length}, rates: ${rates.length}`)

  // Sanity check on the demo side.
  const [p, v, o, c] = await Promise.all([
    target.product.count(),
    target.productVariant.count(),
    target.order.count(),
    target.customerProfile.count(),
  ])
  console.log(`Demo now has ${p} products, ${v} variants, ${o} orders, ${c} customer profiles (orders and profiles must be 0).`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await source.$disconnect()
    await target.$disconnect()
  })
