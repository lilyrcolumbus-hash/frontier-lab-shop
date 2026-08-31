import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'

const roleSchema = z.object({ role: z.enum(['owner', 'staff']) })

/** Refuses any change that would leave the store with no owner — including demoting the last one. */
async function wouldOrphanStore(storeId: string, memberId: string): Promise<boolean> {
  const owners = await prisma.storeMember.findMany({ where: { storeId, role: 'owner' }, select: { id: true } })
  return owners.length === 1 && owners[0].id === memberId
}

export const PATCH = withStoreAdmin<{ params: { id: string } }>(
  async (req, { store }, { params }) => {
    const body = await req.json().catch(() => null)
    const parsed = roleSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })

    const member = await prisma.storeMember.findFirst({ where: { id: params.id, storeId: store.id } })
    if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (parsed.data.role === 'staff' && (await wouldOrphanStore(store.id, member.id))) {
      return NextResponse.json(
        { error: 'This is the only owner. Make someone else an owner first.' },
        { status: 409 }
      )
    }

    const updated = await prisma.storeMember.update({ where: { id: member.id }, data: { role: parsed.data.role } })
    return NextResponse.json({ member: updated })
  },
  { requireOwner: true }
)

export const DELETE = withStoreAdmin<{ params: { id: string } }>(
  async (_req, { store, user }, { params }) => {
    const member = await prisma.storeMember.findFirst({ where: { id: params.id, storeId: store.id } })
    if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (member.userId === user.id) {
      return NextResponse.json({ error: 'You cannot remove your own access.' }, { status: 409 })
    }
    if (await wouldOrphanStore(store.id, member.id)) {
      return NextResponse.json({ error: 'This is the only owner and cannot be removed.' }, { status: 409 })
    }

    await prisma.storeMember.delete({ where: { id: member.id } })
    return NextResponse.json({ ok: true })
  },
  { requireOwner: true }
)
