import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { moveInventory } from '@/lib/inventory'
import { recordOrderEvent } from '@/lib/order-events'
import { syncAutomaticCollectionsForStore } from '@/lib/collection-rules'
import { resolveRange, percentChange } from '@/lib/analytics-range'
import { createAdminClient } from '@/lib/supabase/admin'
import type { McpAdminContext } from '@/lib/mcp/tokens'

// Every tool below mirrors the business logic already used by the equivalent app/api/admin/*
// route — only the transport changes (MCP + bearer token instead of HTTP + cookie). Money
// amounts cross this boundary in dollars (not cents) for a chat interface's sake; they are
// converted to/from the cents the database and Stripe actually use at the edges.

const toCents = (dollars: number) => Math.round(dollars * 100)
const toDollars = (cents: number) => Math.round(cents) / 100

function ok(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] }
}

function fail(message: string) {
  return { content: [{ type: 'text' as const, text: message }], isError: true }
}

/** Every tool call arrives already authenticated by withMcpAuth — this just narrows the type. */
function requireAdmin(extra: unknown): McpAdminContext {
  if (!extra || typeof extra !== 'object') throw new Error('MCP tool called without an authenticated session')
  return extra as McpAdminContext
}

const CATEGORIES = ['kit', 'spawn', 'substrate', 'equipment', 'wellness', 'bundle'] as const
const PRODUCT_STATUSES = ['draft', 'active', 'archived'] as const
const ORDER_STATUSES = ['pending', 'paid', 'fulfilled'] as const

function productSummary(p: {
  id: string
  slug: string
  nameEn: string
  category: string
  subcategory: string
  status: string
  price: number
  compareAtPrice: number | null
  inStock: boolean
  variants: { id: string; name: string; sku: string; price: number; stock: number }[]
  collections: { id: string; titleEn: string }[]
}) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.nameEn,
    category: p.category,
    subcategory: p.subcategory,
    status: p.status,
    price: toDollars(p.price),
    compareAtPrice: p.compareAtPrice != null ? toDollars(p.compareAtPrice) : null,
    inStock: p.inStock,
    variants: p.variants.map((v) => ({ id: v.id, name: v.name, sku: v.sku, price: toDollars(v.price), stock: v.stock })),
    collections: p.collections.map((c) => ({ id: c.id, title: c.titleEn })),
  }
}

async function findProduct(storeId: string, idOrSlug: string) {
  return prisma.product.findFirst({
    where: { storeId, OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    include: { variants: true, collections: { select: { id: true, titleEn: true } } },
  })
}

export function registerTools(server: McpServer) {
  // ── Products ────────────────────────────────────────────────────────────────────────────
  server.registerTool(
    'list_products',
    {
      title: 'List products',
      description: 'List the store\'s products, optionally filtered by status or a name search.',
      inputSchema: z.object({
        status: z.enum(PRODUCT_STATUSES).optional(),
        search: z.string().trim().min(1).max(100).optional(),
      }),
    },
    async ({ status, search }, ctx) => {
      const admin = requireAdmin(ctx.http?.authInfo?.extra)
      const products = await prisma.product.findMany({
        where: {
          storeId: admin.storeId,
          ...(status ? { status } : {}),
          ...(search ? { nameEn: { contains: search, mode: 'insensitive' } } : {}),
        },
        include: { variants: true, collections: { select: { id: true, titleEn: true } } },
        orderBy: { createdAt: 'desc' },
      })
      return ok({ products: products.map(productSummary) })
    }
  )

  server.registerTool(
    'get_product',
    {
      title: 'Get product',
      description: 'Get one product by its id or slug, with full detail.',
      inputSchema: z.object({ idOrSlug: z.string().trim().min(1) }),
    },
    async ({ idOrSlug }, ctx) => {
      const admin = requireAdmin(ctx.http?.authInfo?.extra)
      const product = await findProduct(admin.storeId, idOrSlug)
      if (!product) return fail(`No product found for "${idOrSlug}".`)
      return ok({ product: productSummary(product) })
    }
  )

  server.registerTool(
    'create_product',
    {
      title: 'Create product',
      description:
        'Create a new product with one starting variant. It is created as a draft, invisible on the storefront until published with update_product.',
      inputSchema: z.object({
        slug: z.string().trim().min(1).max(200),
        nameEn: z.string().trim().min(1).max(200),
        nameEs: z.string().trim().min(1).max(200),
        descriptionEn: z.string().trim().min(1),
        descriptionEs: z.string().trim().min(1),
        category: z.enum(CATEGORIES),
        subcategory: z.string().trim().min(1).max(100),
        price: z.number().min(0),
        compareAtPrice: z.number().min(0).optional(),
        isOrganic: z.boolean().default(false),
        inStock: z.boolean().default(true),
        tags: z.array(z.string()).default([]),
        variantName: z.string().trim().min(1).max(100).default('Default'),
        variantSku: z.string().trim().min(1).max(60),
        variantStock: z.number().int().min(0).default(0),
      }),
    },
    async (input, ctx) => {
      const admin = requireAdmin(ctx.http?.authInfo?.extra)

      const existing = await prisma.product.findUnique({ where: { slug: input.slug } })
      if (existing) return fail(`A product with the slug "${input.slug}" already exists.`)

      const priceCents = toCents(input.price)
      const product = await prisma.product.create({
        data: {
          storeId: admin.storeId,
          slug: input.slug,
          nameEn: input.nameEn,
          nameEs: input.nameEs,
          descriptionEn: input.descriptionEn,
          descriptionEs: input.descriptionEs,
          category: input.category,
          subcategory: input.subcategory,
          price: priceCents,
          compareAtPrice: input.compareAtPrice != null ? toCents(input.compareAtPrice) : null,
          isOrganic: input.isOrganic,
          inStock: input.inStock,
          tags: input.tags,
          images: [],
          imageAlts: [],
          relatedProducts: [],
          variants: {
            create: [
              {
                storeId: admin.storeId,
                name: input.variantName,
                sku: input.variantSku,
                price: priceCents,
                stock: input.variantStock,
              },
            ],
          },
        },
        include: { variants: true, collections: { select: { id: true, titleEn: true } } },
      })

      await syncAutomaticCollectionsForStore(admin.storeId)
      return ok({ product: productSummary(product) })
    }
  )

  server.registerTool(
    'update_product',
    {
      title: 'Update product',
      description:
        'Partially update a product — only the fields you pass are changed. Set status to "active" to publish it. stock/sku/variantPrice apply to the first variant only; products with more than one variant need the admin UI for the rest.',
      inputSchema: z.object({
        idOrSlug: z.string().trim().min(1),
        nameEn: z.string().trim().min(1).max(200).optional(),
        nameEs: z.string().trim().min(1).max(200).optional(),
        descriptionEn: z.string().trim().min(1).optional(),
        descriptionEs: z.string().trim().min(1).optional(),
        category: z.enum(CATEGORIES).optional(),
        subcategory: z.string().trim().min(1).max(100).optional(),
        price: z.number().min(0).optional(),
        compareAtPrice: z.number().min(0).nullable().optional(),
        isOrganic: z.boolean().optional(),
        inStock: z.boolean().optional(),
        status: z.enum(PRODUCT_STATUSES).optional(),
        tags: z.array(z.string()).optional(),
        metaTitle: z.string().trim().max(70).nullable().optional(),
        metaDescription: z.string().trim().max(160).nullable().optional(),
        stock: z.number().int().min(0).optional(),
        sku: z.string().trim().min(1).max(60).optional(),
      }),
    },
    async (input, ctx) => {
      const admin = requireAdmin(ctx.http?.authInfo?.extra)
      const existing = await findProduct(admin.storeId, input.idOrSlug)
      if (!existing) return fail(`No product found for "${input.idOrSlug}".`)

      const data: Record<string, unknown> = {}
      if (input.nameEn !== undefined) data.nameEn = input.nameEn
      if (input.nameEs !== undefined) data.nameEs = input.nameEs
      if (input.descriptionEn !== undefined) data.descriptionEn = input.descriptionEn
      if (input.descriptionEs !== undefined) data.descriptionEs = input.descriptionEs
      if (input.category !== undefined) data.category = input.category
      if (input.subcategory !== undefined) data.subcategory = input.subcategory
      if (input.price !== undefined) data.price = toCents(input.price)
      if (input.compareAtPrice !== undefined) {
        data.compareAtPrice = input.compareAtPrice != null ? toCents(input.compareAtPrice) : null
      }
      if (input.isOrganic !== undefined) data.isOrganic = input.isOrganic
      if (input.inStock !== undefined) data.inStock = input.inStock
      if (input.status !== undefined) data.status = input.status
      if (input.tags !== undefined) data.tags = input.tags
      if (input.metaTitle !== undefined) data.metaTitle = input.metaTitle
      if (input.metaDescription !== undefined) data.metaDescription = input.metaDescription

      const product = await prisma.product.update({
        where: { id: existing.id },
        data,
        include: { variants: true, collections: { select: { id: true, titleEn: true } } },
      })

      if ((input.stock !== undefined || input.sku !== undefined) && product.variants[0]) {
        await prisma.productVariant.update({
          where: { id: product.variants[0].id },
          data: {
            ...(input.stock !== undefined ? { stock: input.stock } : {}),
            ...(input.sku !== undefined ? { sku: input.sku } : {}),
          },
        })
      }

      await syncAutomaticCollectionsForStore(admin.storeId)
      const fresh = await findProduct(admin.storeId, product.id)
      return ok({ product: productSummary(fresh!) })
    }
  )

  // ── Species ─────────────────────────────────────────────────────────────────────────────
  server.registerTool(
    'list_species',
    { title: 'List species', description: 'List every species in the encyclopedia.', inputSchema: z.object({}) },
    async (_input, ctx) => {
      const admin = requireAdmin(ctx.http?.authInfo?.extra)
      const species = await prisma.species.findMany({ where: { storeId: admin.storeId }, orderBy: { commonName: 'asc' } })
      return ok({ species: species.map((s) => ({ id: s.id, slug: s.slug, commonName: s.commonName, scientificName: s.scientificName, type: s.type, difficulty: s.difficulty })) })
    }
  )

  server.registerTool(
    'get_species',
    {
      title: 'Get species',
      description: 'Get one species by its id or slug, with full detail.',
      inputSchema: z.object({ idOrSlug: z.string().trim().min(1) }),
    },
    async ({ idOrSlug }, ctx) => {
      const admin = requireAdmin(ctx.http?.authInfo?.extra)
      const species = await prisma.species.findFirst({ where: { storeId: admin.storeId, OR: [{ id: idOrSlug }, { slug: idOrSlug }] } })
      if (!species) return fail(`No species found for "${idOrSlug}".`)
      return ok({ species })
    }
  )

  // ── Collections ─────────────────────────────────────────────────────────────────────────
  server.registerTool(
    'list_collections',
    { title: 'List collections', description: 'List the store\'s collections with their product counts.', inputSchema: z.object({}) },
    async (_input, ctx) => {
      const admin = requireAdmin(ctx.http?.authInfo?.extra)
      const collections = await prisma.collection.findMany({
        where: { storeId: admin.storeId },
        include: { _count: { select: { products: true } } },
        orderBy: { titleEn: 'asc' },
      })
      return ok({
        collections: collections.map((c) => ({
          id: c.id,
          slug: c.slug,
          title: c.titleEn,
          productCount: c._count.products,
          automatic: Boolean(c.ruleField),
        })),
      })
    }
  )

  // ── Orders ──────────────────────────────────────────────────────────────────────────────
  server.registerTool(
    'list_orders',
    {
      title: 'List orders',
      description: 'List orders, newest first, optionally filtered by status and a date range (YYYY-MM-DD).',
      inputSchema: z.object({
        status: z.enum(['pending', 'paid', 'fulfilled', 'cancelled', 'refunded']).optional(),
        from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        page: z.number().int().min(1).default(1),
      }),
    },
    async ({ status, from, to, page }, ctx) => {
      const admin = requireAdmin(ctx.http?.authInfo?.extra)
      const PAGE_SIZE = 25
      const where = {
        storeId: admin.storeId,
        ...(status ? { status } : {}),
        ...(from || to
          ? {
              createdAt: {
                ...(from ? { gte: new Date(`${from}T00:00:00.000Z`) } : {}),
                ...(to ? { lte: new Date(`${to}T23:59:59.999Z`) } : {}),
              },
            }
          : {}),
      }
      const [orders, total] = await Promise.all([
        prisma.order.findMany({ where, include: { items: true }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
        prisma.order.count({ where }),
      ])
      return ok({
        page,
        total,
        orders: orders.map((o) => ({
          id: o.id,
          email: o.email,
          status: o.status,
          total: toDollars(o.total),
          items: o.items.length,
          createdAt: o.createdAt,
        })),
      })
    }
  )

  server.registerTool(
    'get_order',
    { title: 'Get order', description: 'Get one order by id, with line items and shipping address.', inputSchema: z.object({ orderId: z.string().trim().min(1) }) },
    async ({ orderId }, ctx) => {
      const admin = requireAdmin(ctx.http?.authInfo?.extra)
      const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })
      if (!order || order.storeId !== admin.storeId) return fail(`No order found for "${orderId}".`)
      return ok({
        order: {
          ...order,
          subtotal: toDollars(order.subtotal),
          shipping: toDollars(order.shipping),
          tax: toDollars(order.tax),
          total: toDollars(order.total),
          items: order.items.map((i) => ({ ...i, price: toDollars(i.price) })),
        },
      })
    }
  )

  server.registerTool(
    'update_order_status',
    {
      title: 'Update order status',
      description:
        'Set an order to pending, paid, or fulfilled, and/or set its tracking number. Use resolve_order to cancel or refund — those move money and stock.',
      inputSchema: z.object({
        orderId: z.string().trim().min(1),
        status: z.enum(ORDER_STATUSES),
        trackingNumber: z.string().trim().max(120).nullable().optional(),
      }),
    },
    async ({ orderId, status, trackingNumber }, ctx) => {
      const admin = requireAdmin(ctx.http?.authInfo?.extra)
      const existing = await prisma.order.findUnique({ where: { id: orderId } })
      if (!existing || existing.storeId !== admin.storeId) return fail(`No order found for "${orderId}".`)

      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status, ...(trackingNumber !== undefined ? { trackingNumber } : {}) },
      })

      if (order.status !== existing.status) {
        await recordOrderEvent({
          orderId: order.id,
          storeId: admin.storeId,
          type: 'status',
          message: `Status changed from ${existing.status} to ${order.status}`,
          actorEmail: admin.userEmail,
        })
      }
      return ok({ order: { id: order.id, status: order.status, trackingNumber: order.trackingNumber } })
    }
  )

  server.registerTool(
    'fulfil_order',
    {
      title: 'Fulfil order',
      description:
        'Record how many units of each line item have shipped (the running total shipped, not a delta). The order becomes "fulfilled" once every line has shipped in full.',
      inputSchema: z.object({
        orderId: z.string().trim().min(1),
        lines: z.array(z.object({ itemId: z.string().min(1), fulfilledQuantity: z.number().int().min(0) })).min(1),
      }),
    },
    async ({ orderId, lines }, ctx) => {
      const admin = requireAdmin(ctx.http?.authInfo?.extra)
      const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })
      if (!order || order.storeId !== admin.storeId) return fail(`No order found for "${orderId}".`)
      if (['cancelled', 'refunded'].includes(order.status)) return fail(`This order is ${order.status} and can no longer ship.`)

      for (const line of lines) {
        const item = order.items.find((i) => i.id === line.itemId)
        if (!item) return fail(`Item "${line.itemId}" is not part of this order.`)
        if (line.fulfilledQuantity > item.quantity) {
          return fail(`Cannot ship ${line.fulfilledQuantity} of ${item.name} — only ${item.quantity} were ordered.`)
        }
      }

      await prisma.$transaction(
        lines.map((l) => prisma.orderItem.update({ where: { id: l.itemId }, data: { fulfilledQuantity: l.fulfilledQuantity } }))
      )

      const items = await prisma.orderItem.findMany({ where: { orderId } })
      const shipped = items.reduce((sum, i) => sum + i.fulfilledQuantity, 0)
      const ordered = items.reduce((sum, i) => sum + i.quantity, 0)
      const status = shipped >= ordered ? 'fulfilled' : order.status === 'fulfilled' ? 'paid' : order.status
      const updated = await prisma.order.update({ where: { id: orderId }, data: { status } })

      await recordOrderEvent({
        orderId,
        storeId: admin.storeId,
        type: 'fulfilment',
        message: shipped >= ordered ? `Marked as fully shipped (${shipped} of ${ordered} units)` : `Partially shipped — ${shipped} of ${ordered} units`,
        actorEmail: admin.userEmail,
      })

      return ok({ order: { id: updated.id, status: updated.status, shipped, ordered } })
    }
  )

  server.registerTool(
    'resolve_order',
    {
      title: 'Cancel or refund order',
      description:
        'Cancel or refund an order — owner only. Refund actually issues a Stripe refund; both put the items back in stock. Nothing is written if the Stripe refund fails.',
      inputSchema: z.object({ orderId: z.string().trim().min(1), action: z.enum(['cancel', 'refund']) }),
    },
    async ({ orderId, action }, ctx) => {
      const admin = requireAdmin(ctx.http?.authInfo?.extra)
      if (admin.role !== 'owner') return fail('Only the store owner can cancel or refund an order.')

      const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })
      if (!order || order.storeId !== admin.storeId) return fail(`No order found for "${orderId}".`)
      if (['cancelled', 'refunded'].includes(order.status)) return fail(`This order is already ${order.status}.`)

      if (action === 'refund') {
        if (!order.stripePaymentIntentId) return fail('This order has no Stripe payment to refund. Cancel it instead.')
        try {
          await stripe.refunds.create({ payment_intent: order.stripePaymentIntentId })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Stripe refused the refund'
          return fail(`Refund failed — ${message}`)
        }
      }

      const status = action === 'refund' ? 'refunded' : 'cancelled'
      const updated = await prisma.order.update({ where: { id: orderId }, data: { status } })
      await moveInventory(order.items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })), 1)
      await recordOrderEvent({
        orderId,
        storeId: admin.storeId,
        type: status === 'refunded' ? 'refunded' : 'cancelled',
        message:
          status === 'refunded'
            ? `Refunded ${toDollars(order.total)} USD through Stripe and returned the items to stock`
            : 'Order cancelled and the items returned to stock',
        actorEmail: admin.userEmail,
      })

      return ok({ order: { id: updated.id, status: updated.status } })
    }
  )

  // ── Customers ───────────────────────────────────────────────────────────────────────────
  server.registerTool(
    'list_customers',
    { title: 'List customers', description: 'List customers derived from orders, with lifetime value and whether they have a registered account.', inputSchema: z.object({}) },
    async (_input, ctx) => {
      const admin = requireAdmin(ctx.http?.authInfo?.extra)
      const grouped = await prisma.order.groupBy({
        by: ['email'],
        where: { storeId: admin.storeId },
        _sum: { total: true },
        _count: { _all: true },
        _max: { createdAt: true },
        orderBy: { _max: { createdAt: 'desc' } },
      })

      const registeredEmails = new Set<string>()
      try {
        const supabase = createAdminClient()
        let page = 1
        while (true) {
          const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
          if (error) break
          for (const u of data.users) if (u.email) registeredEmails.add(u.email.toLowerCase())
          if (data.users.length < 200) break
          page++
        }
      } catch {
        // best-effort, same as the admin route
      }

      return ok({
        customers: grouped.map((g) => ({
          email: g.email,
          orderCount: g._count._all,
          totalSpent: toDollars(g._sum.total ?? 0),
          lastOrderAt: g._max.createdAt,
          registered: registeredEmails.has(g.email.toLowerCase()),
        })),
      })
    }
  )

  server.registerTool(
    'get_customer',
    { title: 'Get customer', description: 'Get one customer\'s order history and notes by email.', inputSchema: z.object({ email: z.string().trim().email() }) },
    async ({ email }, ctx) => {
      const admin = requireAdmin(ctx.http?.authInfo?.extra)
      const normalized = email.toLowerCase()
      const [orders, profile] = await Promise.all([
        prisma.order.findMany({ where: { storeId: admin.storeId, email: normalized }, orderBy: { createdAt: 'desc' } }),
        prisma.customerProfile.findUnique({ where: { storeId_email: { storeId: admin.storeId, email: normalized } } }),
      ])
      if (orders.length === 0) return fail(`No orders found for "${email}".`)

      return ok({
        email: normalized,
        notes: profile?.notes ?? '',
        tags: profile?.tags ?? [],
        orders: orders.map((o) => ({ id: o.id, status: o.status, total: toDollars(o.total), createdAt: o.createdAt })),
      })
    }
  )

  // ── Discounts (Stripe-backed, no local model) ──────────────────────────────────────────────
  server.registerTool(
    'list_discounts',
    { title: 'List discounts', description: 'List discount codes from Stripe.', inputSchema: z.object({}) },
    async (_input, ctx) => {
      requireAdmin(ctx.http?.authInfo?.extra)
      const promotionCodes = await stripe.promotionCodes.list({ limit: 100, expand: ['data.coupon'] })
      return ok({
        discounts: promotionCodes.data.map((pc) => ({
          id: pc.id,
          code: pc.code,
          active: pc.active,
          percentOff: pc.coupon.percent_off,
          amountOff: pc.coupon.amount_off != null ? toDollars(pc.coupon.amount_off) : null,
          timesRedeemed: pc.times_redeemed,
          maxRedemptions: pc.max_redemptions,
          expiresAt: pc.expires_at ? new Date(pc.expires_at * 1000).toISOString() : null,
          minimumAmount: pc.restrictions?.minimum_amount != null ? toDollars(pc.restrictions.minimum_amount) : null,
          firstTimeOnly: pc.restrictions?.first_time_transaction ?? false,
        })),
      })
    }
  )

  server.registerTool(
    'create_discount',
    {
      title: 'Create discount',
      description: 'Create a discount code in Stripe — owner only. Use either percentOff or amountOff, not both.',
      inputSchema: z
        .object({
          code: z.string().trim().min(3).max(40).regex(/^[A-Z0-9_-]+$/i),
          percentOff: z.number().min(1).max(100).optional(),
          amountOff: z.number().min(0.01).optional(),
          maxRedemptions: z.number().int().min(1).optional(),
          expiresAt: z.string().optional(),
          minimumAmount: z.number().min(0.01).optional(),
          firstTimeOnly: z.boolean().default(false),
        })
        .refine((d) => d.percentOff || d.amountOff, { message: 'Set either percentOff or amountOff' })
        .refine((d) => !(d.percentOff && d.amountOff), { message: 'Use percentOff or amountOff, not both' }),
    },
    async (input, ctx) => {
      const admin = requireAdmin(ctx.http?.authInfo?.extra)
      if (admin.role !== 'owner') return fail('Only the store owner can create a discount code.')

      const coupon = await stripe.coupons.create({
        percent_off: input.percentOff,
        amount_off: input.amountOff != null ? toCents(input.amountOff) : undefined,
        currency: input.amountOff != null ? 'usd' : undefined,
        duration: 'forever',
      })

      try {
        const promotionCode = await stripe.promotionCodes.create({
          coupon: coupon.id,
          code: input.code.toUpperCase(),
          max_redemptions: input.maxRedemptions,
          expires_at: input.expiresAt ? Math.floor(new Date(input.expiresAt).getTime() / 1000) : undefined,
          restrictions: {
            ...(input.minimumAmount ? { minimum_amount: toCents(input.minimumAmount), minimum_amount_currency: 'usd' } : {}),
            ...(input.firstTimeOnly ? { first_time_transaction: true } : {}),
          },
        })
        return ok({ discount: { id: promotionCode.id, code: promotionCode.code } })
      } catch (err) {
        await stripe.coupons.del(coupon.id).catch(() => {})
        const message = err instanceof Error ? err.message : 'Could not create the discount code'
        return fail(message)
      }
    }
  )

  server.registerTool(
    'toggle_discount',
    { title: 'Activate or deactivate discount', description: 'Activate or deactivate a Stripe promotion code — owner only.', inputSchema: z.object({ promotionCodeId: z.string().trim().min(1), active: z.boolean() }) },
    async ({ promotionCodeId, active }, ctx) => {
      const admin = requireAdmin(ctx.http?.authInfo?.extra)
      if (admin.role !== 'owner') return fail('Only the store owner can change a discount code.')
      const promotionCode = await stripe.promotionCodes.update(promotionCodeId, { active })
      return ok({ discount: { id: promotionCode.id, active: promotionCode.active } })
    }
  )

  // ── Analytics ───────────────────────────────────────────────────────────────────────────
  server.registerTool(
    'get_analytics_summary',
    {
      title: 'Get analytics summary',
      description: 'Revenue, order count, and average order value for a period, compared to the equivalent prior period. Excludes cancelled and refunded orders.',
      inputSchema: z.object({ range: z.enum(['7d', '30d', '90d', '12m', 'all']).default('30d') }),
    },
    async ({ range: rangeKey }, ctx) => {
      const admin = requireAdmin(ctx.http?.authInfo?.extra)
      const range = resolveRange(rangeKey)

      const excludedStatuses = ['cancelled', 'refunded']
      const [current, previous] = await Promise.all([
        prisma.order.aggregate({
          where: {
            storeId: admin.storeId,
            status: { notIn: excludedStatuses },
            ...(range.from ? { createdAt: { gte: range.from, lte: range.to } } : {}),
          },
          _sum: { total: true },
          _count: { _all: true },
        }),
        range.previousFrom
          ? prisma.order.aggregate({
              where: {
                storeId: admin.storeId,
                status: { notIn: excludedStatuses },
                createdAt: { gte: range.previousFrom, lte: range.previousTo! },
              },
              _sum: { total: true },
              _count: { _all: true },
            })
          : null,
      ])

      const revenue = current._sum.total ?? 0
      const orderCount = current._count._all
      const previousRevenue = previous?._sum.total ?? 0
      const previousOrderCount = previous?._count._all ?? 0

      return ok({
        range: range.label,
        revenue: toDollars(revenue),
        orderCount,
        averageOrderValue: orderCount > 0 ? toDollars(Math.round(revenue / orderCount)) : 0,
        revenueChangePercent: previous ? percentChange(revenue, previousRevenue) : null,
        orderCountChangePercent: previous ? percentChange(orderCount, previousOrderCount) : null,
      })
    }
  )
}
