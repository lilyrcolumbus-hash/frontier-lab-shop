import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const subscribeSchema = z.object({
  email: z.string().trim().email().max(200),
  locale: z.enum(['en', 'es']).default('en'),
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = subscribeSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: {},
      create: parsed.data,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Failed to save newsletter subscriber', err)
    return NextResponse.json({ error: 'Could not save your email' }, { status: 500 })
  }
}
