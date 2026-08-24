import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (user.emailVerified) {
    return NextResponse.json({ ok: true, alreadyVerified: true })
  }

  await prisma.verificationToken.deleteMany({ where: { identifier: user.email } })

  const token = randomBytes(32).toString('hex')
  await prisma.verificationToken.create({
    data: { identifier: user.email, token, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) },
  })
  const verifyUrl = `${req.nextUrl.origin}/api/auth/verify?token=${token}&email=${encodeURIComponent(user.email)}`
  await sendVerificationEmail(user.email, verifyUrl, user.locale as 'en' | 'es')

  return NextResponse.json({ ok: true })
}
