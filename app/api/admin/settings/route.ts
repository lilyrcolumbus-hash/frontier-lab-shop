import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { isHexColour } from '@/lib/theme'

const settingsSchema = z.object({
  name: z.string().trim().min(1).max(120),
  // Shown to customers on packing slips and order emails; empty means "not set", not "invalid".
  supportEmail: z.union([z.string().trim().email(), z.literal('')]),
  addressLine1: z.string().trim().max(200),
  addressLine2: z.string().trim().max(200),
  city: z.string().trim().max(120),
  state: z.string().trim().max(120),
  postalCode: z.string().trim().max(40),
  country: z.string().trim().max(60),
  shippingRate: z.coerce.number().int().min(0),
  // 0 means the offer is off; any other value is the subtotal at which shipping becomes free.
  freeShippingThreshold: z.coerce.number().int().min(0),
  lowStockThreshold: z.coerce.number().int().min(0),
  // ISO 4217, lower case, as Stripe expects it.
  currency: z.string().trim().toLowerCase().length(3),
  // Stored without a scheme so it can be shown and linked consistently.
  domain: z.string().trim().max(120).regex(/^$|^[a-z0-9.-]+\.[a-z]{2,}$/i, 'Enter a domain like frontierlab.com'),
  ...Object.fromEntries(
    [
      'themeAccent', 'themeAmber', 'themeInk', 'themeInkMuted',
      'themeBg', 'themeSurface', 'themeElevated', 'themeBorder',
    ].map((key) => [
      key,
      z
        .string()
        .trim()
        .refine((v) => v === '' || isHexColour(v), 'Use a hex colour like #3D6E45, or leave it empty')
        .default(''),
    ])
  ),
})

const FIELDS = {
  name: true,
  supportEmail: true,
  addressLine1: true,
  addressLine2: true,
  city: true,
  state: true,
  postalCode: true,
  country: true,
  shippingRate: true,
  freeShippingThreshold: true,
  lowStockThreshold: true,
  currency: true,
  domain: true,
  themeAccent: true,
  themeAmber: true,
  themeInk: true,
  themeInkMuted: true,
  themeBg: true,
  themeSurface: true,
  themeElevated: true,
  themeBorder: true,
} as const

export const GET = withStoreAdmin(async (_req, { store }) => {
  const settings = await prisma.store.findUniqueOrThrow({ where: { id: store.id }, select: FIELDS })
  return NextResponse.json({ settings })
})

export const PATCH = withStoreAdmin(
  async (req, { store }) => {
    const body = await req.json().catch(() => null)
    const parsed = settingsSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid settings', details: parsed.error.flatten() }, { status: 400 })
    }

    const settings = await prisma.store.update({
      where: { id: store.id },
      data: parsed.data,
      select: FIELDS,
    })
    // Storefront pages are cached with the palette already rendered into their head.
    revalidatePath('/', 'layout')
    return NextResponse.json({ settings })
  },
  { requireOwner: true }
)
