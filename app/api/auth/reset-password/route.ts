import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  token: z.string().min(1),
  email: z.string().trim().email().transform((v) => v.toLowerCase()),
  password: z.string().min(8).max(200),
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { token, email, password } = parsed.data
  const identifier = `reset:${email}`

  const record = await prisma.verificationToken.findUnique({ where: { token } })
  if (!record || record.identifier !== identifier || record.expires < new Date()) {
    return NextResponse.json({ error: 'expired' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 12)
  await prisma.user.update({ where: { email }, data: { password: hashed } })
  await prisma.verificationToken.delete({ where: { token } })

  return NextResponse.json({ ok: true })
}
