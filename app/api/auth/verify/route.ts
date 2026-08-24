import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const email = req.nextUrl.searchParams.get('email')

  if (!token || !email) {
    return NextResponse.redirect(new URL('/account?verify=error', req.url))
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } })

  if (!record || record.identifier !== email || record.expires < new Date()) {
    return NextResponse.redirect(new URL('/account?verify=expired', req.url))
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  })
  await prisma.verificationToken.delete({ where: { token } })

  return NextResponse.redirect(new URL('/account?verify=success', req.url))
}
