import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { createAdminClient } from '@/lib/supabase/admin'

const inviteSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  role: z.enum(['owner', 'staff']),
})

/** Finds a Supabase account by email. Returns null when nobody has signed up with it yet. */
async function findUserByEmail(email: string): Promise<{ id: string; email: string } | null> {
  const supabase = createAdminClient()
  let page = 1
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error) return null
    const match = data.users.find((u) => u.email?.toLowerCase() === email)
    if (match?.email) return { id: match.id, email: match.email }
    if (data.users.length < 200) return null
    page += 1
  }
}

export const GET = withStoreAdmin(async (_req, { store }) => {
  const members = await prisma.storeMember.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: 'asc' },
  })

  // StoreMember only holds a Supabase user id, so the emails are resolved for display.
  const supabase = createAdminClient()
  const emails = new Map<string, string>()
  try {
    let page = 1
    while (true) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
      if (error) break
      for (const u of data.users) if (u.email) emails.set(u.id, u.email)
      if (data.users.length < 200) break
      page += 1
    }
  } catch {
    // Fall through: the list still renders, just without emails.
  }

  return NextResponse.json({
    staff: members.map((m) => ({
      id: m.id,
      userId: m.userId,
      role: m.role,
      email: emails.get(m.userId) ?? 'unknown',
      createdAt: m.createdAt,
    })),
  })
})

export const POST = withStoreAdmin(
  async (req, { store }) => {
    const body = await req.json().catch(() => null)
    const parsed = inviteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Enter a valid email and role.' }, { status: 400 })
    }

    // Access is granted to an account that already exists rather than by sending an invitation
    // email — outbound email is still on Supabase's test sender, so an invite would not arrive.
    const user = await findUserByEmail(parsed.data.email)
    if (!user) {
      return NextResponse.json(
        { error: 'Nobody has signed up with that email yet. Ask them to create an account first.' },
        { status: 404 }
      )
    }

    const existing = await prisma.storeMember.findFirst({ where: { storeId: store.id, userId: user.id } })
    if (existing) {
      return NextResponse.json({ error: 'That person already has access.' }, { status: 409 })
    }

    const member = await prisma.storeMember.create({
      data: { storeId: store.id, userId: user.id, role: parsed.data.role },
    })

    return NextResponse.json({ member: { id: member.id, email: user.email, role: member.role } })
  },
  { requireOwner: true }
)
