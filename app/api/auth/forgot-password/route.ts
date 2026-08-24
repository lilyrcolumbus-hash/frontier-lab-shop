import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { randomBytes } from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'

const schema = z.object({
  email: z.string().trim().email().max(200).transform((v) => v.toLowerCase()),
  locale: z.enum(['en', 'es']).default('en'),
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const { email, locale } = parsed.data

  // Always report success, whether or not the account exists or has a password
  // (Google-only accounts have none) — don't let this endpoint reveal who has an account.
  const user = await prisma.user.findUnique({ where: { email } })
  if (user?.password) {
    await prisma.verificationToken.deleteMany({ where: { identifier: `reset:${email}` } })

    const token = randomBytes(32).toString('hex')
    await prisma.verificationToken.create({
      data: { identifier: `reset:${email}`, token, expires: new Date(Date.now() + 60 * 60 * 1000) },
    })
    const resetUrl = `${req.nextUrl.origin}/reset-password?token=${token}&email=${encodeURIComponent(email)}`
    await sendPasswordResetEmail(email, resetUrl, locale)
  }

  return NextResponse.json({ ok: true })
}
