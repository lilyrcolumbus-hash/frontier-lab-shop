import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'

const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200).transform((v) => v.toLowerCase()),
  password: z.string().min(8).max(200),
  locale: z.enum(['en', 'es']).default('en'),
  subscribeToNewsletter: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = registerSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid registration data' }, { status: 400 })
  }

  const { name, email, password, locale, subscribeToNewsletter } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
  }

  try {
    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name, email, password: hashed, locale },
    })

    if (subscribeToNewsletter) {
      await prisma.newsletterSubscriber.upsert({
        where: { email },
        update: {},
        create: { email, locale },
      })
    }

    const token = randomBytes(32).toString('hex')
    await prisma.verificationToken.create({
      data: { identifier: email, token, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    })
    const verifyUrl = `${req.nextUrl.origin}/api/auth/verify?token=${token}&email=${encodeURIComponent(email)}`
    await sendVerificationEmail(email, verifyUrl, locale)

    return NextResponse.json({ ok: true, email: user.email })
  } catch (err) {
    console.error('Failed to register user', err)
    return NextResponse.json({ error: 'Could not create your account' }, { status: 500 })
  }
}
