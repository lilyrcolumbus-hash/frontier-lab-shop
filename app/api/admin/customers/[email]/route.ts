import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'

const profileSchema = z.object({
  notes: z.string().max(5000).default(''),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
})

/**
 * Saves the admin's own notes and tags for a customer.
 *
 * Customers are otherwise derived from orders, so this upserts: the first note written about
 * an email address is also what creates its profile row.
 */
export const PATCH = withStoreAdmin<{ params: { email: string } }>(async (req, { store }, { params }) => {
  const body = await req.json().catch(() => null)
  const parsed = profileSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid customer profile', details: parsed.error.flatten() }, { status: 400 })
  }

  const email = decodeURIComponent(params.email).toLowerCase()

  // Only for an email this store has actually sold to — otherwise the notes table becomes a
  // place to store arbitrary text about arbitrary addresses.
  const hasOrder = await prisma.order.findFirst({ where: { storeId: store.id, email }, select: { id: true } })
  if (!hasOrder) {
    return NextResponse.json({ error: 'No orders exist for that email in this store.' }, { status: 404 })
  }

  // Tags are compared case-insensitively so "VIP" and "vip" do not become two segments.
  const tags = Array.from(new Map(parsed.data.tags.map((t) => [t.toLowerCase(), t])).values())

  const profile = await prisma.customerProfile.upsert({
    where: { storeId_email: { storeId: store.id, email } },
    update: { notes: parsed.data.notes, tags },
    create: { storeId: store.id, email, notes: parsed.data.notes, tags },
  })

  return NextResponse.json({ profile })
})
