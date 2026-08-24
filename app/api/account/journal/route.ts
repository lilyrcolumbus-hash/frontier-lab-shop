import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const createEntrySchema = z.object({
  species: z.string().trim().min(1).max(120),
  speciesSlug: z.string().trim().min(1).max(120),
  method: z.string().trim().min(1).max(120),
  substrate: z.string().trim().min(1).max(200),
  startDate: z.coerce.date(),
  notes: z.string().trim().max(5000),
  status: z.enum(['inoculated', 'colonizing', 'pinning', 'fruiting', 'harvested']).default('inoculated'),
  photos: z.array(z.string()).default([]),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const entries = await prisma.growJournalEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ entries })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = createEntrySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid journal entry' }, { status: 400 })
  }

  const entry = await prisma.growJournalEntry.create({
    data: { ...parsed.data, userId: session.user.id },
  })

  return NextResponse.json({ entry })
}
