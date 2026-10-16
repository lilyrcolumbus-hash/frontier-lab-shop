import { Prisma, type PrismaClient } from '@prisma/client'

/**
 * The public demo can be edited by anyone who opens the one-click demo admin, so it needs a way back to
 * a known state. This file holds that: a snapshot shape (`DemoBaseline`), a reader that builds a snapshot
 * from a store, and `restoreDemoCatalog`, which wipes the demo catalog and writes the snapshot back.
 *
 * Only public catalog and site content is ever in a snapshot. Orders, customers, reviews, subscribers,
 * staff, tokens, gift cards and tax rates (which point at a Stripe account) are never read or written.
 */

type Row = Record<string, unknown>

export interface DemoBaseline {
  version: 1
  exportedAt: string
  species: Row[]
  collections: (Row & { productIds: string[] })[]
  products: Row[]
  variants: Row[]
  pages: Row[]
  posts: Row[]
  homeSections: Row[]
  siteContent: Row[]
  emailTemplates: Row[]
  shippingZones: Row[]
  shippingRates: Row[]
}

export interface DemoRestoreCounts {
  species: number
  collections: number
  products: number
  variants: number
  pages: number
}

// Json columns read back as JsonValue, but the create input rejects a plain null: dropping the key
// stores null instead.
const jsonFields = new Map<string, string[]>()
for (const model of Prisma.dmmf.datamodel.models) {
  jsonFields.set(model.name, model.fields.filter((field) => field.type === 'Json').map((field) => field.name))
}

function forStore<R>(model: string, row: Row, storeId: string): R {
  const out: Row = { ...row, storeId }
  for (const field of jsonFields.get(model) ?? []) {
    if (out[field] === null) delete out[field]
  }
  return out as unknown as R
}

function withoutStore(row: Row): Row {
  const { storeId: _storeId, ...rest } = row
  return rest
}

/** Reads the public catalog and site content of one store into a snapshot. Read-only. */
export async function buildBaseline(source: PrismaClient, storeId: string): Promise<DemoBaseline> {
  const where = { storeId }
  const [species, collections, products, variants, pages, posts, homeSections, siteContent, emailTemplates, zones, rates] =
    await Promise.all([
      source.species.findMany({ where }),
      source.collection.findMany({ where, include: { products: { select: { id: true } } } }),
      source.product.findMany({ where }),
      source.productVariant.findMany({ where }),
      source.page.findMany({ where }),
      source.post.findMany({ where: { storeId, status: 'active' } }),
      source.homeSection.findMany({ where }),
      source.siteContent.findMany({ where }),
      source.emailTemplate.findMany({ where }),
      source.shippingZone.findMany({ where }),
      source.shippingRate.findMany({ where }),
    ])

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    species: species.map((row) => withoutStore(row)),
    collections: collections.map(({ products: linked, ...row }) => ({
      ...withoutStore(row),
      productIds: linked.map((product) => product.id),
    })),
    products: products.map((row) => withoutStore(row)),
    variants: variants.map((row) => withoutStore(row)),
    pages: pages.map((row) => withoutStore(row)),
    posts: posts.map((row) => withoutStore(row)),
    homeSections: homeSections.map((row) => withoutStore(row)),
    siteContent: siteContent.map((row) => withoutStore(row)),
    emailTemplates: emailTemplates.map((row) => withoutStore(row)),
    shippingZones: zones.map((row) => withoutStore(row)),
    shippingRates: rates.map((row) => withoutStore(row)),
  }
}

/**
 * Replaces the demo catalog with the snapshot, in one transaction: if anything fails, the demo keeps
 * the state it had. Products cascade to their variants and wishlist rows, and the product/collection
 * join rows go with either side, so the delete order only has to respect species and shipping.
 */
export async function restoreDemoCatalog(
  db: PrismaClient,
  baseline: DemoBaseline,
  storeId: string
): Promise<DemoRestoreCounts> {
  await db.$transaction(
    async (tx) => {
      await tx.shippingRate.deleteMany({ where: { storeId } })
      await tx.shippingZone.deleteMany({ where: { storeId } })
      await tx.emailTemplate.deleteMany({ where: { storeId } })
      await tx.siteContent.deleteMany({ where: { storeId } })
      await tx.homeSection.deleteMany({ where: { storeId } })
      await tx.post.deleteMany({ where: { storeId } })
      await tx.page.deleteMany({ where: { storeId } })
      await tx.product.deleteMany({ where: { storeId } })
      await tx.collection.deleteMany({ where: { storeId } })
      await tx.species.deleteMany({ where: { storeId } })

      await tx.species.createMany({
        data: baseline.species.map((row) => forStore<Prisma.SpeciesCreateManyInput>('Species', row, storeId)),
      })
      await tx.collection.createMany({
        data: baseline.collections.map(({ productIds: _productIds, ...row }) =>
          forStore<Prisma.CollectionCreateManyInput>('Collection', row, storeId)
        ),
      })
      await tx.product.createMany({
        data: baseline.products.map((row) => forStore<Prisma.ProductCreateManyInput>('Product', row, storeId)),
      })
      await tx.productVariant.createMany({
        data: baseline.variants.map((row) =>
          forStore<Prisma.ProductVariantCreateManyInput>('ProductVariant', row, storeId)
        ),
      })
      for (const collection of baseline.collections) {
        if (collection.productIds.length === 0) continue
        await tx.collection.update({
          where: { id: String(collection.id) },
          data: { products: { connect: collection.productIds.map((id) => ({ id })) } },
        })
      }
      await tx.page.createMany({
        data: baseline.pages.map((row) => forStore<Prisma.PageCreateManyInput>('Page', row, storeId)),
      })
      await tx.post.createMany({
        data: baseline.posts.map((row) => forStore<Prisma.PostCreateManyInput>('Post', row, storeId)),
      })
      await tx.homeSection.createMany({
        data: baseline.homeSections.map((row) =>
          forStore<Prisma.HomeSectionCreateManyInput>('HomeSection', row, storeId)
        ),
      })
      await tx.siteContent.createMany({
        data: baseline.siteContent.map((row) =>
          forStore<Prisma.SiteContentCreateManyInput>('SiteContent', row, storeId)
        ),
      })
      await tx.emailTemplate.createMany({
        data: baseline.emailTemplates.map((row) =>
          forStore<Prisma.EmailTemplateCreateManyInput>('EmailTemplate', row, storeId)
        ),
      })
      await tx.shippingZone.createMany({
        data: baseline.shippingZones.map((row) =>
          forStore<Prisma.ShippingZoneCreateManyInput>('ShippingZone', row, storeId)
        ),
      })
      await tx.shippingRate.createMany({
        data: baseline.shippingRates.map((row) =>
          forStore<Prisma.ShippingRateCreateManyInput>('ShippingRate', row, storeId)
        ),
      })
    },
    { maxWait: 10_000, timeout: 50_000 }
  )

  return {
    species: baseline.species.length,
    collections: baseline.collections.length,
    products: baseline.products.length,
    variants: baseline.variants.length,
    pages: baseline.pages.length,
  }
}
